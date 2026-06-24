"""
Test regresi model + kontrak preprocessing (Phase 2 — ML Engineer).

Memuat best_model.pth sungguhan. Di-skip dengan anggun bila torch/bobot tidak
tersedia (mis. environment minimal). Tidak butuh API key (murni CV).
"""
import io

import pytest


def _img_bytes(color=(120, 120, 120)):
    from PIL import Image

    buf = io.BytesIO()
    Image.new("RGB", (200, 200), color).save(buf, format="PNG")
    return buf.getvalue()


def _model():
    try:
        import model

        return model
    except Exception as exc:  # torch tak terinstall / bobot tak ada
        pytest.skip(f"torch/bobot model tidak tersedia: {exc}")


def test_predict_structure():
    model = _model()
    res = model.predict(_img_bytes())
    assert res["label"] in ("Positive", "Negative")
    assert 0.0 <= res["confidence"] <= 100.0
    assert isinstance(res["gradcam"], (bytes, bytearray)) and len(res["gradcam"]) > 0


def test_preprocessing_parity_contract():
    """Serving harus hasilkan 4 subband 32x32 ter-normalisasi [0,1] — sama dgn training."""
    model = _model()
    from PIL import Image

    img = Image.open(io.BytesIO(_img_bytes())).convert("RGB")
    wavelet = model.apply_dwt(model.transform(img))
    assert tuple(wavelet.shape) == (4, 32, 32)
    assert float(wavelet.min()) >= 0.0
    assert float(wavelet.max()) <= 1.0 + 1e-6


def test_determinism():
    model = _model()
    b = _img_bytes((90, 90, 90))
    r1 = model.predict(b)
    r2 = model.predict(b)
    assert r1["label"] == r2["label"]
    assert abs(r1["confidence"] - r2["confidence"]) < 1e-6
