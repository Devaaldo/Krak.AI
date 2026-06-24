"""
Central LLM client factory untuk layer GenAI Krak.AI.

- Chat/teks : Google Gemini (default) via LangChain; opsional Groq (Gemma/Llama).
- Vision    : Google Gemini multimodal (untuk VLM fallback / second opinion).

Semua client di-init *lazily* dan TIDAK pernah meng-crash saat import walau API
key belum di-set — supaya endpoint CV inti (/predict, /ws) tetap jalan tanpa key.
Fitur GenAI yang dipanggil tanpa key akan mengangkat LLMNotConfigured, yang
diterjemahkan jadi HTTP 503 oleh layer API.
"""
import functools
import os

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

# Provider untuk fitur berbasis-teks (RAG, laporan, agent). Vision SELALU Gemini.
LLM_PROVIDER = os.environ.get("LLM_PROVIDER", "gemini").lower()  # "gemini" | "groq"
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "gemma2-9b-it")


class LLMNotConfigured(RuntimeError):
    """Diangkat saat fitur GenAI dipanggil tapi API key belum di-set."""


def text_llm_available() -> bool:
    """Apakah LLM teks (provider terpilih) siap dipakai."""
    if LLM_PROVIDER == "groq":
        return bool(GROQ_API_KEY)
    return bool(GEMINI_API_KEY)


def vision_available() -> bool:
    """Vision selalu lewat Gemini (Groq tidak punya vision)."""
    return bool(GEMINI_API_KEY)


_cache_enabled = False


def _ensure_llm_cache():
    """Aktifkan cache LLM in-memory (hemat kuota free tier untuk input identik)."""
    global _cache_enabled
    if _cache_enabled:
        return
    try:
        from langchain_community.cache import InMemoryCache
        from langchain_core.globals import set_llm_cache

        set_llm_cache(InMemoryCache())
    except Exception:  # pragma: no cover - cache opsional
        pass
    _cache_enabled = True


@functools.lru_cache(maxsize=1)
def get_chat_llm():
    """LangChain chat model untuk RAG, generator laporan, dan agent."""
    _ensure_llm_cache()
    if LLM_PROVIDER == "groq":
        if not GROQ_API_KEY:
            raise LLMNotConfigured("GROQ_API_KEY belum di-set.")
        from langchain_groq import ChatGroq  # opsional; lihat requirements.txt

        return ChatGroq(model=GROQ_MODEL, temperature=0.2, api_key=GROQ_API_KEY)

    if not GEMINI_API_KEY:
        raise LLMNotConfigured("GEMINI_API_KEY belum di-set.")
    from langchain_google_genai import ChatGoogleGenerativeAI

    return ChatGoogleGenerativeAI(
        model=GEMINI_MODEL, temperature=0.2, google_api_key=GEMINI_API_KEY
    )


@functools.lru_cache(maxsize=1)
def _gemini_vision_model():
    if not GEMINI_API_KEY:
        raise LLMNotConfigured("GEMINI_API_KEY belum di-set.")
    import google.generativeai as genai

    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel(GEMINI_MODEL)


def vision_describe(image_bytes: bytes, prompt: str, mime_type: str = "image/jpeg") -> str:
    """Second opinion VLM: minta Gemini Vision mendeskripsikan/menilai gambar."""
    model = _gemini_vision_model()
    resp = model.generate_content(
        [prompt, {"mime_type": mime_type, "data": image_bytes}]
    )
    return (getattr(resp, "text", "") or "").strip()
