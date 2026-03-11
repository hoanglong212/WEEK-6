"""FastAPI application entrypoint for the hybrid email threat analyzer."""

from __future__ import annotations

from contextlib import asynccontextmanager
import logging
import re
from typing import Any

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from config import (
    ALLOW_STARTUP_WITHOUT_MODEL,
    CORS_ALLOW_CREDENTIALS,
    CORS_ALLOW_ORIGINS,
    DEFAULT_THRESHOLD,
    MAX_UPLOAD_BYTES,
)
from schemas import AnalyzeTextRequest
from services.email_parser import parse_email_payload
from services.model_service import analyze_content, load_model_artifact

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    """Load model once at startup and store it in app state."""
    app_instance.state.vectorizer = None
    app_instance.state.classifier = None
    app_instance.state.label_map = {0: "ham", 1: "spam"}
    app_instance.state.threshold = float(DEFAULT_THRESHOLD)
    app_instance.state.model_ready = False
    app_instance.state.model_error = None
    app_instance.state.model_path = None

    try:
        artifact = load_model_artifact()
        app_instance.state.vectorizer = artifact["vectorizer"]
        app_instance.state.classifier = artifact["classifier"]
        app_instance.state.label_map = artifact.get("label_map", {0: "ham", 1: "spam"})
        app_instance.state.threshold = float(artifact.get("threshold", DEFAULT_THRESHOLD))
        app_instance.state.model_ready = True
        app_instance.state.model_path = artifact.get("model_path")
        logger.info("Model loaded successfully from: %s", app_instance.state.model_path)
    except Exception as exc:  # pragma: no cover - startup failure path
        app_instance.state.model_error = str(exc)
        logger.exception("Model loading failed during startup.")
        if not ALLOW_STARTUP_WITHOUT_MODEL:
            raise RuntimeError(
                "Startup aborted because model could not be loaded. "
                "Set ALLOW_STARTUP_WITHOUT_MODEL=true to start API without model."
            ) from exc
        logger.warning("Starting API without model. Analyze endpoints will return 503.")

    yield


app = FastAPI(
    title="Email Threat Analyzer API",
    description="Hybrid static + ML analysis for raw .eml and pasted email text.",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)


def ensure_model_ready() -> None:
    """Guard analysis endpoints when model failed to load."""
    if getattr(app.state, "model_ready", False):
        return
    detail = "Model is unavailable."
    model_error = getattr(app.state, "model_error", None)
    if model_error:
        detail = f"{detail} Startup error: {model_error}"
    raise HTTPException(status_code=503, detail=detail)


@app.get("/")
def root() -> dict[str, Any]:
    """Simple health route."""
    model_ready = bool(getattr(app.state, "model_ready", False))
    status = "ok" if model_ready else "degraded"
    return {
        "status": status,
        "message": "Email threat analyzer API is running.",
        "model_ready": model_ready,
    }


@app.post("/analyze-email")
async def analyze_email(file: UploadFile = File(...)) -> dict[str, Any]:
    """Analyze an uploaded .eml-like file."""
    try:
        ensure_model_ready()
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
            attachment_names=parsed["attachment_names"],
            attachment_extensions=parsed["attachment_extensions"],
            vectorizer=app.state.vectorizer,
            classifier=app.state.classifier,
            threshold=float(app.state.threshold),
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Internal server error: {exc}") from exc


@app.post("/analyze-text")
async def analyze_text(payload: AnalyzeTextRequest) -> dict[str, Any]:
    """Analyze manually pasted subject/body text using the same ML pipeline."""
    try:
        ensure_model_ready()
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
            attachment_names=[],
            attachment_extensions=[],
            vectorizer=app.state.vectorizer,
            classifier=app.state.classifier,
            threshold=float(app.state.threshold),
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Internal server error: {exc}") from exc


# Run:
# uvicorn app:app --reload
