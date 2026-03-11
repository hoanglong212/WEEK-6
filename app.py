"""FastAPI backend for hybrid multi-signal email threat analysis."""

from __future__ import annotations

from contextlib import asynccontextmanager
from email import policy
from email.parser import BytesParser
from email.utils import parseaddr
from html import unescape
import ipaddress
from pathlib import Path
import re
from typing import Any
from urllib.parse import urlparse

import joblib
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


MODEL_PATH = Path("spam_model.joblib")
DEFAULT_THRESHOLD = 0.5
MAX_UPLOAD_BYTES = 20 * 1024 * 1024  # 20 MB

SAFE_MAX_THRESHOLD = 30.0
THREAT_MIN_THRESHOLD = 60.0

URL_REGEX = re.compile(r"http[s]?://\S+|www\.\S+", flags=re.IGNORECASE)
EMAIL_REGEX = re.compile(r"\b[\w\.-]+@[\w\.-]+\.\w+\b", flags=re.IGNORECASE)
HTML_TAG_REGEX = re.compile(r"<[^>]+>")
HTML_COMMENT_REGEX = re.compile(r"<!--.*?-->", flags=re.IGNORECASE | re.DOTALL)
HTML_STYLE_REGEX = re.compile(r"<style\b[^>]*>.*?</style>", flags=re.IGNORECASE | re.DOTALL)
HTML_SCRIPT_REGEX = re.compile(r"<script\b[^>]*>.*?</script>", flags=re.IGNORECASE | re.DOTALL)
HTML_BREAK_TAG_REGEX = re.compile(
    r"<\s*(?:br|p|/p|div|/div|li|/li|tr|/tr|h[1-6]|/h[1-6]|table|/table|ul|/ul|ol|/ol|hr)\b[^>]*>",
    flags=re.IGNORECASE,
)
HTML_ATTR_URL_REGEX = re.compile(
    r"""(?is)\b(?:href|src)\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'<>`]+))"""
)
HTML_MARKUP_REGEX = re.compile(r"<\s*/?\s*[a-zA-Z][^>]*>")
NON_ALNUM_REGEX = re.compile(r"[^a-z0-9\s]+")
MULTISPACE_REGEX = re.compile(r"\s+")
SUBJECT_REGEX = re.compile(r"(?im)^subject:\s*(.*)$")
INVISIBLE_CHAR_REGEX = re.compile(r"[\u200B-\u200F\u202A-\u202E\u2060\u2066-\u2069\uFEFF]")
CONTROL_CHAR_REGEX = re.compile(r"[\x00-\x1F\x7F]")

TRAILING_URL_PUNCTUATION = ")]}.,;:'\"!?`"
LEADING_URL_PUNCTUATION = "([{<'\""
SUSPICIOUS_TLDS = {"zip", "top", "xyz", "click", "work", "gq", "tk", "cf", "ml", "ga", "ru"}

TRACKING_HINTS = ("utm_", "redirect", "trk", "track", "click", "ref=", "fbclid", "gclid", "mc_eid")
IGNORED_EMBEDDED_URL_PREFIXES = ("javascript:", "mailto:", "tel:", "cid:", "data:", "#")
ASSET_FILE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".webp",
    ".bmp",
    ".ico",
    ".avif",
    ".tif",
    ".tiff",
    ".apng",
    ".heic",
    ".heif",
}
LOW_PRIORITY_ASSET_HOST_SUFFIXES = {
    "braze-images.com",
    "cdn.braze.eu",
    "fonts.gstatic.com",
    "fonts.googleapis.com",
    "gravatar.com",
}
LOW_PRIORITY_SOCIAL_HOST_SUFFIXES = {
    "facebook.com",
    "instagram.com",
    "linkedin.com",
    "x.com",
    "twitter.com",
    "youtube.com",
    "tiktok.com",
    "pinterest.com",
}
LOW_PRIORITY_APP_BADGE_HOST_SUFFIXES = {"apps.apple.com", "play.google.com"}
ASSET_PATH_HINTS = (
    "/image",
    "/images/",
    "/img/",
    "/assets/",
    "/static/",
    "/media/",
    "/logo",
    "/icon",
    "/banner",
    "/badge",
    "/pixel",
    "/tracking",
    "/thumbnail",
    "/thumb",
)

PHISHING_KEYWORDS = {
    "urgent",
    "verify",
    "account",
    "password",
    "bank",
    "suspended",
    "login",
    "confirm",
    "security",
    "recovery",
}
MARKETING_KEYWORDS = {
    "register",
    "event",
    "ticket",
    "sale",
    "offer",
    "subscribe",
    "newsletter",
    "limited",
    "shop",
    "discount",
}
MARKETING_SIGNALS = (
    "unsubscribe",
    "newsletter",
    "promotion",
    "special offer",
    "limited time",
    "view in browser",
    "opt out",
    "manage preferences",
    "coupon",
    "sale",
    "deal",
)

RISKY_EXECUTABLE_EXTENSIONS = {".exe", ".js", ".scr", ".bat", ".cmd", ".ps1", ".vbs"}
RISKY_COMPRESSED_EXTENSIONS = {".zip", ".rar", ".7z"}
RISKY_MACRO_EXTENSIONS = {".docm", ".xlsm"}

TRUSTED_OFFICIAL_DOMAINS = {
    "microsoft.com",
    "google.com",
    "apple.com",
    "amazon.com",
    "paypal.com",
    "outlook.com",
    "gmail.com",
    "railway.com",
    "upwork.com",
    "github.com",
    "roblox.com",
}

TRANSACTIONAL_SYSTEM_KEYWORDS = {
    "build",
    "failed",
    "deployment",
    "notification",
    "alert",
    "receipt",
    "invoice",
    "statement",
    "policy",
    "privacy",
    "agreement",
    "password",
    "reset",
    "verification",
    "code",
    "login",
    "recovery",
    "account",
    "activity",
    "billing",
    "support",
    "project",
    "environment",
}
TRANSACTIONAL_SYSTEM_PHRASES = (
    "password reset",
    "verification code",
    "login alert",
    "account activity",
    "security update",
    "policy update",
    "build failed",
    "deployment failed",
)


class AnalyzeTextRequest(BaseModel):
    """Request body for manual subject/body analysis."""

    subject: str = ""
    body: str = ""


def clamp(value: float, low: float, high: float) -> float:
    """Clamp value to [low, high]."""
    return max(low, min(high, value))


def unique_preserve_order(items: list[str]) -> list[str]:
    """Deduplicate a list while preserving order."""
    seen: set[str] = set()
    output: list[str] = []
    for item in items:
        if not item:
            continue
        if item in seen:
            continue
        seen.add(item)
        output.append(item)
    return output


def remove_html_boilerplate(html_text: str) -> str:
    """Remove non-visible HTML blocks that pollute previews."""
    cleaned = HTML_COMMENT_REGEX.sub(" ", html_text)
    cleaned = HTML_STYLE_REGEX.sub(" ", cleaned)
    cleaned = HTML_SCRIPT_REGEX.sub(" ", cleaned)
    return cleaned


def normalize_visible_text(text: str) -> str:
    """Normalize decoded visible text to a readable single-space flow."""
    cleaned = INVISIBLE_CHAR_REGEX.sub("", text)
    cleaned = CONTROL_CHAR_REGEX.sub(" ", cleaned)
    cleaned = cleaned.replace("\r", " ").replace("\n", " ")
    cleaned = MULTISPACE_REGEX.sub(" ", cleaned).strip()
    return cleaned


def strip_html(html_text: str) -> str:
    """Remove HTML boilerplate/tags and keep visible readable text."""
    cleaned_html = remove_html_boilerplate(html_text)
    cleaned_html = HTML_BREAK_TAG_REGEX.sub(" ", cleaned_html)
    text = unescape(HTML_TAG_REGEX.sub(" ", cleaned_html))
    return normalize_visible_text(text)


def fallback_subject_body(text: str) -> tuple[str, str]:
    """Fallback extraction for malformed emails."""
    subject_match = SUBJECT_REGEX.search(text)
    subject = subject_match.group(1).strip() if subject_match else ""
    parts = re.split(r"\r?\n\r?\n", text, maxsplit=1)
    body = parts[1] if len(parts) > 1 else text
    return subject, body


def fallback_headers(text: str) -> tuple[str, str, str]:
    """Fallback header extraction for malformed emails."""
    from_match = re.search(r"(?im)^from:\s*(.*)$", text)
    reply_to_match = re.search(r"(?im)^reply-to:\s*(.*)$", text)
    return_path_match = re.search(r"(?im)^return-path:\s*(.*)$", text)
    return (
        from_match.group(1).strip() if from_match else "",
        reply_to_match.group(1).strip() if reply_to_match else "",
        return_path_match.group(1).strip() if return_path_match else "",
    )


def decode_part_content(part: Any) -> str:
    """Safely decode email part content to text."""
    try:
        content = part.get_content()
        if isinstance(content, str):
            return content
        if isinstance(content, bytes):
            return content.decode(part.get_content_charset() or "utf-8", errors="ignore")
    except Exception:
        pass

    payload = part.get_payload(decode=True) or b""
    charset = part.get_content_charset() or "utf-8"
    try:
        return payload.decode(charset, errors="ignore")
    except Exception:
        return payload.decode("utf-8", errors="ignore")


def parse_email_payload(raw_bytes: bytes) -> dict[str, Any]:
    """Parse raw email and extract text + metadata for multi-signal analysis."""
    decoded_text = raw_bytes.decode("utf-8", errors="ignore")

    try:
        msg = BytesParser(policy=policy.default).parsebytes(raw_bytes)

        subject = str(msg.get("Subject", "") or "")
        sender = str(msg.get("From", "") or "")
        reply_to = str(msg.get("Reply-To", "") or "")
        return_path = str(msg.get("Return-Path", "") or "")

        has_html = False
        body_chunks: list[str] = []
        html_urls: list[str] = []
        attachment_names: list[str] = []
        attachment_extensions: list[str] = []

        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_maintype() == "multipart":
                    continue

                filename = part.get_filename()
                disposition = part.get_content_disposition()
                content_type = part.get_content_type()

                if filename or disposition == "attachment":
                    name = filename or "unnamed_attachment"
                    attachment_names.append(name)
                    ext = Path(name).suffix.lower()
                    if ext:
                        attachment_extensions.append(ext)
                    continue

                if content_type == "text/html":
                    has_html = True
                if not content_type.startswith("text/"):
                    continue

                content = decode_part_content(part)
                if content_type == "text/html":
                    html_urls.extend(extract_urls_from_html(content))
                    content = strip_html(content)
                if content:
                    body_chunks.append(content)
        else:
            content_type = msg.get_content_type()
            if content_type == "text/html":
                has_html = True

            if content_type.startswith("text/") or content_type == "message/rfc822":
                content = decode_part_content(msg)
                if content_type == "text/html":
                    html_urls.extend(extract_urls_from_html(content))
                    content = strip_html(content)
                if content:
                    body_chunks.append(content)

        body = "\n".join(chunk for chunk in body_chunks if chunk).strip()
        if not body:
            _, body = fallback_subject_body(decoded_text)
            if has_html:
                body = strip_html(body)

        return {
            "subject": subject,
            "body": body,
            "sender": sender,
            "reply_to": reply_to,
            "return_path": return_path,
            "has_html": has_html,
            "html_urls": unique_preserve_order(html_urls),
            "attachment_names": attachment_names,
            "attachment_extensions": unique_preserve_order(attachment_extensions),
        }
    except Exception:
        subject, body = fallback_subject_body(decoded_text)
        sender, reply_to, return_path = fallback_headers(decoded_text)
        has_html = bool(re.search(r"<html|<body|<table|<div|<a\s+href|<p\b", decoded_text, flags=re.IGNORECASE))
        html_urls = extract_urls_from_html(decoded_text) if has_html else []
        if has_html:
            body = strip_html(body)
        return {
            "subject": subject,
            "body": body,
            "sender": sender,
            "reply_to": reply_to,
            "return_path": return_path,
            "has_html": has_html,
            "html_urls": unique_preserve_order(html_urls),
            "attachment_names": [],
            "attachment_extensions": [],
        }


def clean_text(text: str) -> str:
    """Normalize text exactly as in training preprocessing."""
    text = unescape(text).lower()
    text = URL_REGEX.sub(" urltoken ", text)
    text = EMAIL_REGEX.sub(" emailtoken ", text)
    text = NON_ALNUM_REGEX.sub(" ", text)
    text = MULTISPACE_REGEX.sub(" ", text).strip()
    return text


def clean_preview_text(text: str, max_length: int = 400) -> str:
    """Generate readable preview text for the frontend."""
    if HTML_MARKUP_REGEX.search(text):
        cleaned = strip_html(text)
    else:
        cleaned = normalize_visible_text(unescape(text))
    return cleaned[:max_length]


def extract_domain_from_header(header_value: str) -> str:
    """Extract sender domain from a header value."""
    if not header_value:
        return ""

    _, addr = parseaddr(header_value)
    candidate = (addr or header_value).strip()
    candidate = candidate.strip("<>\"' ")

    if "@" not in candidate:
        match = re.search(r"[\w\.-]+@([\w\.-]+\.\w+)", candidate)
        return match.group(1).lower() if match else ""

    domain = candidate.split("@")[-1].lower().strip(" >,;\"'")
    if domain.startswith("www."):
        domain = domain[4:]
    return domain if "." in domain else ""


def is_academic_domain(domain: str) -> bool:
    """Heuristic for academic domains."""
    return domain.endswith(".edu") or domain.endswith(".edu.vn") or ".ac." in domain


def domain_matches_suffix(domain: str, suffix: str) -> bool:
    """Check if domain matches suffix exactly or as subdomain."""
    return domain == suffix or domain.endswith(f".{suffix}")


def domain_matches_any_suffix(domain: str, suffixes: set[str]) -> bool:
    """Check domain against any suffix in a set."""
    return any(domain_matches_suffix(domain, suffix) for suffix in suffixes)


def domains_related(domain_a: str, domain_b: str) -> bool:
    """Check if two domains are equivalent or subdomains of each other."""
    if not domain_a or not domain_b:
        return False
    return domain_matches_suffix(domain_a, domain_b) or domain_matches_suffix(domain_b, domain_a)


def is_official_looking_domain(domain: str) -> bool:
    """Heuristic for trusted/official looking domains."""
    if domain.endswith(".gov") or domain.endswith(".mil") or domain.endswith(".gov.vn"):
        return True
    if domain_matches_any_suffix(domain, TRUSTED_OFFICIAL_DOMAINS):
        return True
    return False


def analyze_headers(sender: str, reply_to: str, return_path: str) -> dict[str, Any]:
    """Analyze sender/reply headers and return flags + normalized domains."""
    from_domain = extract_domain_from_header(sender)
    reply_domain = extract_domain_from_header(reply_to)
    return_domain = extract_domain_from_header(return_path)
    header_context_present = bool((sender or "").strip() or (reply_to or "").strip() or (return_path or "").strip())

    flags: list[str] = []
    if header_context_present and not from_domain:
        flags.append("Missing sender domain.")

    reply_mismatch = bool(from_domain and reply_domain and not domains_related(reply_domain, from_domain))
    return_path_mismatch = bool(from_domain and return_domain and not domains_related(return_domain, from_domain))

    if reply_mismatch:
        flags.append("Reply-To domain differs from sender domain.")

    if return_path_mismatch:
        flags.append("Return-Path domain differs from sender domain.")

    academic = bool(from_domain and is_academic_domain(from_domain))
    official = bool(from_domain and is_official_looking_domain(from_domain))

    if official:
        flags.append("Trusted sender domain pattern detected.")
    if academic:
        flags.append("Academic domain detected.")

    return {
        "from_domain": from_domain,
        "reply_domain": reply_domain,
        "return_domain": return_domain,
        "header_flags": unique_preserve_order(flags),
        "is_academic": academic,
        "is_official": official,
        "reply_mismatch": reply_mismatch,
        "return_path_mismatch": return_path_mismatch,
        "missing_sender_domain": not bool(from_domain),
        "header_context_present": header_context_present,
    }


def normalize_url_candidate(url: str) -> str:
    """Trim common surrounding punctuation from URL candidates."""
    return url.strip().lstrip(LEADING_URL_PUNCTUATION).rstrip(TRAILING_URL_PUNCTUATION)


def parse_url_like(url: str):
    """Parse URL while tolerating bare www links."""
    target = url if re.match(r"^https?://", url, flags=re.IGNORECASE) else f"http://{url}"
    return urlparse(target)


def is_meaningful_url(url: str) -> bool:
    """Filter out malformed URL values."""
    if not url:
        return False
    parsed = parse_url_like(url)
    host = (parsed.hostname or "").lower()
    if not host or "." not in host:
        return False
    return True


def url_path_extension(path: str) -> str:
    """Extract lowercase file extension from URL path."""
    return Path(path).suffix.lower() if path else ""


def is_asset_url(url: str) -> bool:
    """Heuristic low-priority URL detector for email template/image links."""
    parsed = parse_url_like(url)
    host = (parsed.hostname or "").lower()
    path = (parsed.path or "").lower()
    query = (parsed.query or "").lower()

    if not host:
        return False

    if domain_matches_any_suffix(host, LOW_PRIORITY_ASSET_HOST_SUFFIXES):
        return True
    if domain_matches_any_suffix(host, LOW_PRIORITY_SOCIAL_HOST_SUFFIXES):
        return True
    if domain_matches_any_suffix(host, LOW_PRIORITY_APP_BADGE_HOST_SUFFIXES):
        return True

    ext = url_path_extension(path)
    if ext in ASSET_FILE_EXTENSIONS:
        return True

    if host.startswith(("img.", "image.", "images.", "static.", "cdn.")) and (
        ext in ASSET_FILE_EXTENSIONS or any(hint in path for hint in ASSET_PATH_HINTS)
    ):
        return True

    if any(hint in path for hint in ASSET_PATH_HINTS):
        return True

    if "pixel" in query or ("open" in query and ("width=" in query or "height=" in query)):
        return True

    return False


def normalize_and_filter_url(url: str) -> str:
    """Normalize URL candidate, handle protocol-relative links, and filter non-actionable targets."""
    candidate = normalize_url_candidate(unescape((url or "").strip()))
    if not candidate:
        return ""

    if candidate.startswith("//"):
        candidate = f"https:{candidate}"

    lowered = candidate.lower()
    if lowered.startswith(IGNORED_EMBEDDED_URL_PREFIXES):
        return ""

    return candidate if is_meaningful_url(candidate) else ""


def merge_url_candidates(*candidate_groups: list[str]) -> list[str]:
    """Merge URL candidates, keeping meaningful unique values in stable order."""
    output: list[str] = []
    seen: set[str] = set()

    for group in candidate_groups:
        for raw in group:
            normalized = normalize_and_filter_url(raw)
            if not normalized:
                continue
            key = normalized.lower().rstrip("/")
            if key in seen:
                continue
            seen.add(key)
            output.append(normalized)

    return output


def extract_urls_from_html(html_text: str) -> list[str]:
    """Extract meaningful links from href/src attributes in HTML."""
    if not html_text:
        return []

    cleaned_html = remove_html_boilerplate(html_text)
    candidates: list[str] = []
    for match in HTML_ATTR_URL_REGEX.finditer(cleaned_html):
        value = next((group for group in match.groups() if group), "")
        if value:
            candidates.append(value)

    return merge_url_candidates(candidates)


def is_tracking_url(url: str) -> bool:
    """Detect common redirect/tracking URL patterns."""
    lowered = url.lower()
    if any(hint in lowered for hint in TRACKING_HINTS):
        return True
    parsed = parse_url_like(url)
    return any(segment in parsed.path.lower() for segment in ("/redirect", "/out", "/click"))


def is_ip_hostname(hostname: str) -> bool:
    """Check whether hostname is a raw IP address."""
    if not hostname:
        return False
    host = hostname.strip("[]")
    try:
        ipaddress.ip_address(host)
        return True
    except ValueError:
        return False


def is_suspicious_url(url: str) -> bool:
    """Heuristic URL risk checks."""
    parsed = parse_url_like(url)
    host = (parsed.hostname or "").lower()
    if not host:
        return False

    tld = host.split(".")[-1] if "." in host else ""
    structural_oddity = host.count(".") >= 4 and not domain_matches_any_suffix(host, TRUSTED_OFFICIAL_DOMAINS)
    checks = [
        is_ip_hostname(host),
        host.count("-") >= 4,
        len(host) >= 45,
        tld in SUSPICIOUS_TLDS,
        bool(re.search(r"[a-z]{3,}\d{4,}", host)),
        structural_oddity,
    ]
    return any(checks)


def extract_urls(text: str) -> list[str]:
    """Extract normalized, meaningful URLs from original text."""
    return merge_url_candidates(URL_REGEX.findall(text))


def classify_urls(urls: list[str]) -> dict[str, list[str]]:
    """Split URL list into primary/tracking/asset buckets."""
    primary_urls: list[str] = []
    tracking_urls: list[str] = []
    asset_urls: list[str] = []

    for url in urls:
        tracking = is_tracking_url(url)
        asset = is_asset_url(url)

        if tracking:
            tracking_urls.append(url)
        elif asset:
            asset_urls.append(url)
        else:
            primary_urls.append(url)

    return {
        "primary_urls": unique_preserve_order(primary_urls),
        "tracking_urls": unique_preserve_order(tracking_urls),
        "asset_urls": unique_preserve_order(asset_urls),
    }


def analyze_urls(original_text: str, extra_urls: list[str] | None = None) -> dict[str, Any]:
    """Run URL extraction + URL-level risk checks."""
    all_urls = merge_url_candidates(extract_urls(original_text), extra_urls or [])
    suspicious_urls = unique_preserve_order([url for url in all_urls if is_suspicious_url(url)])
    categorized = classify_urls(all_urls)
    tracking_urls = categorized["tracking_urls"]
    asset_urls = categorized["asset_urls"]
    primary_urls = categorized["primary_urls"]
    tracking_detected = bool(tracking_urls)

    extracted_urls = merge_url_candidates(primary_urls, tracking_urls, suspicious_urls)

    url_flags: list[str] = []
    if extracted_urls:
        url_flags.append("Contains URLs.")
    if len(extracted_urls) >= 4:
        url_flags.append("Multiple external links detected.")
    if tracking_detected:
        url_flags.append("Tracked redirect links detected.")
        if not suspicious_urls:
            url_flags.append("Tracking links detected, but no strongly suspicious URL structure found.")
    if suspicious_urls:
        url_flags.append("Potentially suspicious URL patterns detected.")
    if asset_urls:
        url_flags.append("Low-priority asset links detected (hidden from extracted URLs).")

    return {
        "extracted_urls": extracted_urls,
        "primary_urls": primary_urls,
        "tracking_urls": tracking_urls,
        "asset_urls": asset_urls,
        "suspicious_urls": suspicious_urls,
        "url_count": len(extracted_urls),
        "raw_url_count": len(all_urls),
        "tracking_detected": tracking_detected,
        "url_flags": unique_preserve_order(url_flags),
    }


def analyze_attachments(attachment_names: list[str], attachment_extensions: list[str]) -> dict[str, Any]:
    """Analyze attachment metadata only (no execution)."""
    normalized_extensions = unique_preserve_order([ext.lower() for ext in attachment_extensions if ext])
    flags: list[str] = []

    ext_set = set(normalized_extensions)
    has_exec = bool(ext_set & RISKY_EXECUTABLE_EXTENSIONS)
    has_compressed = bool(ext_set & RISKY_COMPRESSED_EXTENSIONS)
    has_macro = bool(ext_set & RISKY_MACRO_EXTENSIONS)

    if has_exec:
        flags.append("Executable attachment type detected.")
    if has_compressed:
        flags.append("Compressed attachment detected.")
    if has_macro:
        flags.append("Macro-enabled Office attachment detected.")

    return {
        "attachment_count": len(attachment_names),
        "attachment_names": attachment_names,
        "attachment_extensions": normalized_extensions,
        "attachment_flags": unique_preserve_order(flags),
        "has_risky_exec": has_exec,
        "has_compressed": has_compressed,
        "has_macro": has_macro,
    }


def analyze_language(cleaned_text: str) -> dict[str, Any]:
    """Run lightweight phishing/marketing keyword analysis."""
    tokens = set(cleaned_text.split())
    phishing_hits = sorted([keyword for keyword in PHISHING_KEYWORDS if keyword in tokens])
    marketing_hits = sorted([keyword for keyword in MARKETING_KEYWORDS if keyword in tokens])
    transactional_keyword_hits = sorted([keyword for keyword in TRANSACTIONAL_SYSTEM_KEYWORDS if keyword in tokens])
    transactional_phrase_hits = sorted([phrase for phrase in TRANSACTIONAL_SYSTEM_PHRASES if phrase in cleaned_text])
    transactional_hits = unique_preserve_order(transactional_phrase_hits + transactional_keyword_hits)
    has_transactional = bool(transactional_phrase_hits) or len(transactional_keyword_hits) >= 2

    flags: list[str] = []
    if phishing_hits:
        flags.append("Phishing-like language detected.")
    else:
        flags.append("No strong phishing keywords detected.")
    if marketing_hits:
        flags.append("Marketing/promotional language detected.")
    if has_transactional:
        flags.append("Transactional/system notification pattern detected.")

    return {
        "phishing_hits": phishing_hits,
        "marketing_hits": marketing_hits,
        "transactional_hits": transactional_hits,
        "has_phishing": bool(phishing_hits),
        "has_marketing": bool(marketing_hits),
        "has_transactional": has_transactional,
        "language_flags": unique_preserve_order(flags),
    }


def analyze_html_signals(
    has_html: bool,
    url_count: int,
    has_phishing: bool,
    has_marketing: bool,
    cleaned_text: str,
) -> dict[str, Any]:
    """Analyze HTML-specific content patterns."""
    html_flags: list[str] = []
    newsletter_like = False

    if has_html:
        html_flags.append("HTML email detected.")

    if has_html and url_count >= 2 and has_marketing and not has_phishing:
        newsletter_like = True
        html_flags.append("Marketing/newsletter-style email detected.")
    elif has_html and not has_phishing and any(signal in cleaned_text for signal in MARKETING_SIGNALS):
        newsletter_like = True
        html_flags.append("Marketing/newsletter-style email detected.")

    return {
        "html_flags": unique_preserve_order(html_flags),
        "newsletter_like": newsletter_like,
    }


def compute_risk_score(
    *,
    spam_probability: float,
    threshold: float,
    header_analysis: dict[str, Any],
    url_analysis: dict[str, Any],
    html_analysis: dict[str, Any],
    attachment_analysis: dict[str, Any],
    language_analysis: dict[str, Any],
) -> float:
    """Compute transparent rule-based risk score in range [0, 100]."""
    score = 0.0

    score += spam_probability * 36.0
    if spam_probability >= max(threshold, 0.65):
        score += 6.0

    if header_analysis["reply_mismatch"]:
        score += 15.0
    if header_analysis["return_path_mismatch"]:
        score += 5.0
    if header_analysis["header_context_present"] and header_analysis["missing_sender_domain"]:
        score += 8.0

    suspicious_url_count = len(url_analysis["suspicious_urls"])
    if suspicious_url_count:
        score += 9.0 + min(9.0, suspicious_url_count * 2.5)
    if url_analysis["url_count"] >= 4:
        score += 2.0
    if url_analysis["url_count"] >= 8:
        score += 2.0
    if url_analysis["tracking_detected"]:
        score += 2.0

    if language_analysis["has_phishing"]:
        score += 12.0

    if attachment_analysis["has_risky_exec"]:
        score += 15.0
    if attachment_analysis["has_compressed"]:
        score += 6.0
    if attachment_analysis["has_macro"]:
        score += 12.0

    if html_analysis["html_flags"] and language_analysis["has_phishing"]:
        score += 2.0

    no_suspicious_urls = suspicious_url_count == 0
    no_risky_attachments = not (
        attachment_analysis["has_risky_exec"]
        or attachment_analysis["has_macro"]
        or attachment_analysis["has_compressed"]
    )
    low_phishing_risk = (
        not language_analysis["has_phishing"] and no_suspicious_urls and no_risky_attachments
    )

    if header_analysis["is_academic"]:
        score -= 10.0 if low_phishing_risk else 6.0
    if header_analysis["is_official"]:
        score -= 7.0 if low_phishing_risk else 4.0

    if html_analysis["newsletter_like"] and low_phishing_risk:
        score -= 8.0
    elif html_analysis["newsletter_like"] and not language_analysis["has_phishing"]:
        score -= 4.0

    if language_analysis["has_transactional"] and low_phishing_risk:
        score -= 8.0
    elif language_analysis["has_transactional"] and not language_analysis["has_phishing"]:
        score -= 3.0

    if language_analysis["has_marketing"] and not language_analysis["has_phishing"] and no_suspicious_urls:
        score -= 3.0

    return clamp(score, 0.0, 100.0)


def determine_verdict(risk_score: float, _spam_probability: float) -> str:
    """Final verdict from hybrid risk score."""
    if risk_score < SAFE_MAX_THRESHOLD:
        return "SAFE"
    if risk_score < THREAT_MIN_THRESHOLD:
        return "SUSPICIOUS"
    return "THREAT"


def compute_confidence(verdict: str, spam_probability: float, risk_score: float) -> float:
    """Confidence heuristic for UI display."""
    if verdict == "THREAT":
        confidence = 0.65 * (risk_score / 100.0) + 0.35 * spam_probability
    elif verdict == "SAFE":
        confidence = 0.65 * ((100.0 - risk_score) / 100.0) + 0.35 * (1.0 - spam_probability)
    else:
        distance = min(abs(risk_score - 45.0) / 15.0, 1.0)
        confidence = 0.55 + 0.2 * distance
    return clamp(confidence, 0.0, 1.0)


def build_indicators(
    *,
    spam_probability: float,
    threshold: float,
    risk_score: float,
    verdict: str,
    header_flags: list[str],
    url_flags: list[str],
    html_flags: list[str],
    attachment_flags: list[str],
    language_flags: list[str],
    newsletter_like: bool,
    has_phishing: bool,
    has_suspicious_urls: bool,
    has_risky_attachments: bool,
    trusted_or_academic_sender: bool,
) -> list[str]:
    """Merge all signal flags into one readable indicator list."""
    indicators: list[str] = []
    indicators.extend(header_flags)
    indicators.extend(url_flags)
    indicators.extend(html_flags)
    indicators.extend(attachment_flags)
    indicators.extend(language_flags)

    if newsletter_like and not has_phishing and not has_suspicious_urls and not has_risky_attachments:
        indicators.append("Newsletter/promotional pattern detected with low phishing risk.")
    if trusted_or_academic_sender and not has_phishing:
        indicators.append("Trusted sender domain pattern detected.")

    if spam_probability >= threshold:
        indicators.append(
            f"Model spam probability ({spam_probability:.2f}) is above model threshold ({threshold:.2f})."
        )
    else:
        indicators.append(
            f"Model spam probability ({spam_probability:.2f}) is below model threshold ({threshold:.2f})."
        )

    indicators.append(f"Hybrid risk score: {risk_score:.1f}/100.")
    if verdict == "THREAT":
        indicators.append("Final verdict: THREAT (high combined risk).")
    elif verdict == "SUSPICIOUS":
        indicators.append("Final verdict: SUSPICIOUS (manual review recommended).")
    else:
        indicators.append("Final verdict: SAFE (low combined risk).")

    return unique_preserve_order(indicators)


def analyze_content(
    *,
    filename: str,
    subject: str,
    body: str,
    sender: str,
    reply_to: str,
    return_path: str,
    has_html: bool,
    html_urls: list[str] | None,
    attachment_names: list[str],
    attachment_extensions: list[str],
) -> dict[str, Any]:
    """Run model inference + multi-signal static analysis and build response payload."""
    combined_text = f"{subject}\n{body}"  # Keep identical with training pipeline.
    cleaned_text = clean_text(combined_text)
    if not cleaned_text:
        raise HTTPException(status_code=400, detail="No usable text could be extracted from email.")

    vectorizer = app.state.vectorizer
    classifier = app.state.classifier
    threshold = float(app.state.threshold)

    if not hasattr(classifier, "predict_proba"):
        raise HTTPException(status_code=500, detail="Loaded classifier does not support predict_proba.")

    features = vectorizer.transform([cleaned_text])
    spam_probability = float(classifier.predict_proba(features)[0][1])

    header_analysis = analyze_headers(sender, reply_to, return_path)
    supplemental_urls = html_urls or []
    if has_html and not supplemental_urls:
        supplemental_urls = extract_urls_from_html(combined_text)
    url_analysis = analyze_urls(combined_text, extra_urls=supplemental_urls)
    language_analysis = analyze_language(cleaned_text)
    html_analysis = analyze_html_signals(
        has_html=has_html,
        url_count=url_analysis["url_count"],
        has_phishing=language_analysis["has_phishing"],
        has_marketing=language_analysis["has_marketing"],
        cleaned_text=cleaned_text,
    )
    attachment_analysis = analyze_attachments(attachment_names, attachment_extensions)

    risk_score = compute_risk_score(
        spam_probability=spam_probability,
        threshold=threshold,
        header_analysis=header_analysis,
        url_analysis=url_analysis,
        html_analysis=html_analysis,
        attachment_analysis=attachment_analysis,
        language_analysis=language_analysis,
    )
    verdict = determine_verdict(risk_score, spam_probability)
    confidence = compute_confidence(verdict, spam_probability, risk_score)

    indicators = build_indicators(
        spam_probability=spam_probability,
        threshold=threshold,
        risk_score=risk_score,
        verdict=verdict,
        header_flags=header_analysis["header_flags"],
        url_flags=url_analysis["url_flags"],
        html_flags=html_analysis["html_flags"],
        attachment_flags=attachment_analysis["attachment_flags"],
        language_flags=language_analysis["language_flags"],
        newsletter_like=html_analysis["newsletter_like"],
        has_phishing=language_analysis["has_phishing"],
        has_suspicious_urls=bool(url_analysis["suspicious_urls"]),
        has_risky_attachments=bool(
            attachment_analysis["has_risky_exec"]
            or attachment_analysis["has_macro"]
            or attachment_analysis["has_compressed"]
        ),
        trusted_or_academic_sender=bool(header_analysis["is_official"] or header_analysis["is_academic"]),
    )

    preview = clean_preview_text(combined_text, max_length=400)

    return {
        "filename": filename,
        "subject": subject or "(no subject)",
        "sender": sender,
        "reply_to": reply_to,
        "return_path": return_path,
        "verdict": verdict,
        "confidence": round(confidence, 6),
        "threshold": round(threshold, 6),
        "spam_probability": round(spam_probability, 6),
        "risk_score": round(risk_score, 2),
        "has_html": has_html,
        "url_count": url_analysis["url_count"],
        "extracted_urls": url_analysis["extracted_urls"],
        "tracking_urls": url_analysis["tracking_urls"],
        "asset_urls": url_analysis["asset_urls"],
        "suspicious_urls": url_analysis["suspicious_urls"],
        "attachment_count": attachment_analysis["attachment_count"],
        "attachment_names": attachment_analysis["attachment_names"],
        "attachment_extensions": attachment_analysis["attachment_extensions"],
        "header_flags": header_analysis["header_flags"],
        "url_flags": url_analysis["url_flags"],
        "html_flags": html_analysis["html_flags"],
        "attachment_flags": attachment_analysis["attachment_flags"],
        "language_flags": language_analysis["language_flags"],
        "indicators": indicators,
        "preview": preview,
    }


def load_model_artifact() -> dict[str, Any]:
    """Load and validate the serialized model artifact."""
    if not MODEL_PATH.is_file():
        raise RuntimeError(f"Model file not found: {MODEL_PATH.resolve()}")

    artifact = joblib.load(MODEL_PATH)
    required_keys = {"vectorizer", "classifier", "label_map"}
    missing_keys = required_keys.difference(artifact.keys())
    if missing_keys:
        missing = ", ".join(sorted(missing_keys))
        raise RuntimeError(f"Invalid model artifact. Missing keys: {missing}")

    return artifact


@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    """Load model once at startup and store in app state."""
    artifact = load_model_artifact()
    app_instance.state.vectorizer = artifact["vectorizer"]
    app_instance.state.classifier = artifact["classifier"]
    app_instance.state.label_map = artifact.get("label_map", {0: "ham", 1: "spam"})
    app_instance.state.threshold = float(artifact.get("threshold", DEFAULT_THRESHOLD))
    yield


app = FastAPI(
    title="Email Threat Analyzer API",
    description="Hybrid static + ML analysis for raw .eml and pasted email text.",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    """Simple health route."""
    return {"status": "ok", "message": "Email threat analyzer API is running."}


@app.post("/analyze-email")
async def analyze_email(file: UploadFile = File(...)) -> dict[str, Any]:
    """Analyze an uploaded .eml-like file."""
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="Uploaded file must have a filename.")

        raw_bytes = await file.read(MAX_UPLOAD_BYTES + 1)
        if not raw_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        if len(raw_bytes) > MAX_UPLOAD_BYTES:
            raise HTTPException(
                status_code=413,
                detail="Uploaded file is too large. Maximum allowed size is 20 MB.",
            )

        parsed = parse_email_payload(raw_bytes)
        return analyze_content(
            filename=file.filename,
            subject=parsed["subject"],
            body=parsed["body"],
            sender=parsed["sender"],
            reply_to=parsed["reply_to"],
            return_path=parsed["return_path"],
            has_html=parsed["has_html"],
            html_urls=parsed["html_urls"],
            attachment_names=parsed["attachment_names"],
            attachment_extensions=parsed["attachment_extensions"],
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Internal server error: {exc}") from exc


@app.post("/analyze-text")
async def analyze_text(payload: AnalyzeTextRequest) -> dict[str, Any]:
    """Analyze manually pasted subject/body text using the same ML pipeline."""
    try:
        subject = payload.subject or ""
        body = payload.body or ""
        if not subject.strip() and not body.strip():
            raise HTTPException(status_code=400, detail="Provide at least one of: subject or body.")

        combined_text = f"{subject}\n{body}"
        has_html = bool(re.search(r"<html|<body|<table|<div|<a\s+href|<p\b", combined_text, flags=re.IGNORECASE))

        return analyze_content(
            filename="manual-input",
            subject=subject,
            body=body,
            sender="",
            reply_to="",
            return_path="",
            has_html=has_html,
            html_urls=extract_urls_from_html(combined_text) if has_html else [],
            attachment_names=[],
            attachment_extensions=[],
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Internal server error: {exc}") from exc


# Run:
# uvicorn app:app --reload
