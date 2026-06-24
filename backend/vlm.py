"""
VLM Fallback / Second Opinion.

Saat confidence CNN di bawah ambang, minta Gemini Vision menilai gambar secara
independen sebagai 'second opinion'. Transparan: hasil selalu menandai sumbernya
(VLM) sehingga pengguna tahu mana hasil CNN dan mana hasil model vision.
"""
import hashlib
import os

from llm import LLMNotConfigured, vision_available, vision_describe

# Cache hasil VLM per-gambar (hemat kuota untuk gambar identik). Dibatasi ukurannya.
_vlm_cache: dict[str, str] = {}
_VLM_CACHE_MAX = 256

# Ambang confidence (%). Di bawah nilai ini, panggil VLM. Default 70%.
LOW_CONFIDENCE_THRESHOLD = float(os.environ.get("VLM_CONFIDENCE_THRESHOLD", "70"))

VLM_PROMPT = (
    "Kamu ahli inspeksi struktur. Lihat gambar permukaan beton/struktur ini. "
    "Jawab singkat (2-4 kalimat): (1) apakah ada retak atau tidak, "
    "(2) jika ada, perkiraan jenis/pola dan tingkat keparahan kasar, "
    "(3) seberapa yakin kamu. Tegaskan ini bukan pengganti inspeksi langsung."
)


def maybe_second_opinion(image_bytes: bytes, confidence: float) -> dict | None:
    """
    Kembalikan second opinion VLM bila confidence rendah & Gemini Vision tersedia,
    selain itu None (mode normal, hanya hasil CNN).

    Return: {"source": "gemini-vision", "text": str, "triggered_below": float}
    """
    if confidence >= LOW_CONFIDENCE_THRESHOLD:
        return None
    if not vision_available():
        return None
    text = _cached_describe(image_bytes)
    if text is None:
        return None
    return {
        "source": "gemini-vision",
        "text": text,
        "triggered_below": LOW_CONFIDENCE_THRESHOLD,
    }


def _cached_describe(image_bytes: bytes) -> str | None:
    key = hashlib.md5(image_bytes).hexdigest()
    if key in _vlm_cache:
        return _vlm_cache[key]
    try:
        text = vision_describe(image_bytes, VLM_PROMPT)
    except LLMNotConfigured:
        return None
    except Exception:
        # Jangan biarkan kegagalan VLM merusak respons deteksi inti.
        return None
    if len(_vlm_cache) < _VLM_CACHE_MAX:
        _vlm_cache[key] = text
    return text
