"""Risk scoring, verdict, confidence, and indicator aggregation logic."""

from __future__ import annotations

from backend.config import RISK_SPAM_THRESHOLD, RISK_SUSPICIOUS_THRESHOLD
from backend.services.text_processing import clamp, unique_preserve_order


def compute_risk_score(
    *,
    spam_probability: float,
    threshold: float,
    header_analysis: dict,
    url_analysis: dict,
    html_analysis: dict,
    attachment_analysis: dict,
    language_analysis: dict,
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
    low_phishing_risk = not language_analysis["has_phishing"] and no_suspicious_urls and no_risky_attachments

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


def determine_verdict(risk_score: float, spam_probability: float) -> str:
    """Final verdict from hybrid signals."""
    if risk_score >= RISK_SPAM_THRESHOLD or (spam_probability >= 0.93 and risk_score >= 63.0):
        return "spam"
    if risk_score >= RISK_SUSPICIOUS_THRESHOLD or (spam_probability >= 0.82 and risk_score >= 38.0):
        return "suspicious"
    return "ham"


def compute_confidence(verdict: str, spam_probability: float, risk_score: float) -> float:
    """Confidence heuristic for UI display."""
    if verdict == "spam":
        confidence = 0.6 * spam_probability + 0.4 * (risk_score / 100.0)
    elif verdict == "ham":
        confidence = 0.6 * (1.0 - spam_probability) + 0.4 * ((100.0 - risk_score) / 100.0)
    else:
        distance = min(abs(risk_score - 55.0) / 15.0, 1.0)
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
    if verdict == "spam":
        indicators.append("Final verdict: spam (high combined risk).")
    elif verdict == "suspicious":
        indicators.append("Final verdict: suspicious (manual review recommended).")
    else:
        indicators.append("Final verdict: ham (low combined risk).")

    return unique_preserve_order(indicators)
