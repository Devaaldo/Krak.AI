"""
Test kontrak API (Phase 1 — AI Engineer).

LLM & model di-mock supaya test deterministik, cepat, dan tidak memakai kuota.
Lifespan (warmup + build index) sengaja tidak dijalankan: TestClient dipakai
tanpa context manager `with`, jadi startup event tidak ter-trigger.
"""
import io

from fastapi.testclient import TestClient
from PIL import Image, UnidentifiedImageError

import main
from llm import LLMNotConfigured

client = TestClient(main.app)


def _png_bytes():
    buf = io.BytesIO()
    Image.new("RGB", (64, 64), (120, 120, 120)).save(buf, format="PNG")
    return buf.getvalue()


def test_health():
    r = client.get("/")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert "genai_text" in body and "genai_vision" in body


def test_predict_ok(monkeypatch):
    monkeypatch.setattr(
        main, "predict", lambda b: {"label": "Positive", "confidence": 93.5, "gradcam": b"\xff\xd8\xff"}
    )
    monkeypatch.setattr(main, "maybe_second_opinion", lambda b, c: None)
    r = client.post("/predict", files={"file": ("x.png", _png_bytes(), "image/png")})
    assert r.status_code == 200
    body = r.json()
    assert body["label"] == "Positive"
    assert body["confidence"] == 93.5
    assert isinstance(body["gradcam"], str)
    assert body["second_opinion"] is None


def test_predict_second_opinion(monkeypatch):
    monkeypatch.setattr(
        main, "predict", lambda b: {"label": "Negative", "confidence": 51.0, "gradcam": b"\x00"}
    )
    monkeypatch.setattr(
        main,
        "maybe_second_opinion",
        lambda b, c: {"source": "gemini-vision", "text": "Mungkin ada retak halus.", "triggered_below": 70.0},
    )
    r = client.post("/predict", files={"file": ("x.png", _png_bytes(), "image/png")})
    assert r.status_code == 200
    assert r.json()["second_opinion"]["source"] == "gemini-vision"


def test_predict_invalid_image(monkeypatch):
    def boom(_b):
        raise UnidentifiedImageError("bad")

    monkeypatch.setattr(main, "predict", boom)
    r = client.post("/predict", files={"file": ("x.txt", b"not an image", "text/plain")})
    assert r.status_code == 400


def test_predict_too_large(monkeypatch):
    monkeypatch.setattr(main, "MAX_FILE_SIZE", 10)
    r = client.post("/predict", files={"file": ("x.png", b"0123456789ABC", "image/png")})
    assert r.status_code == 413


def test_advisor_ok(monkeypatch):
    monkeypatch.setattr(
        main,
        "rag_answer",
        lambda q, detection_context=None: {
            "answer": "Jawaban.",
            "citations": [{"source": "02_crack_causes.md", "snippet": "korosi..."}],
        },
    )
    r = client.post("/advisor", json={"question": "Penyebab retak?"})
    assert r.status_code == 200
    body = r.json()
    assert body["answer"] == "Jawaban."
    assert body["citations"][0]["source"].endswith(".md")


def test_advisor_not_configured(monkeypatch):
    def boom(q, detection_context=None):
        raise LLMNotConfigured("no key")

    monkeypatch.setattr(main, "rag_answer", boom)
    r = client.post("/advisor", json={"question": "x"})
    assert r.status_code == 503


def test_report_ok(monkeypatch):
    monkeypatch.setattr(
        main,
        "generate_report",
        lambda label, confidence, metadata=None: {"report_markdown": "# Laporan\nisi"},
    )
    r = client.post("/report", json={"label": "Positive", "confidence": 90})
    assert r.status_code == 200
    assert r.json()["report_markdown"].startswith("# Laporan")


def test_report_not_configured(monkeypatch):
    def boom(label, confidence, metadata=None):
        raise LLMNotConfigured("no key")

    monkeypatch.setattr(main, "generate_report", boom)
    r = client.post("/report", json={"label": "Positive", "confidence": 90})
    assert r.status_code == 503


def test_agent_ok(monkeypatch):
    monkeypatch.setattr(
        main, "run_agent", lambda message, image_bytes=None, history=None: {"answer": "Hasil agent."}
    )
    r = client.post("/agent", data={"message": "Halo", "history": "[]"})
    assert r.status_code == 200
    assert r.json()["answer"] == "Hasil agent."
