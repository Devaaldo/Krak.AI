"""
Generator Laporan Inspeksi LLM.

Mengubah hasil deteksi CNN (label, confidence, metadata) menjadi laporan inspeksi
terstruktur dalam Markdown, di-grounding ke knowledge base lewat RAG supaya
rekomendasi konsisten dengan basis pengetahuan teknik retak.
"""
from llm import LLMNotConfigured, get_chat_llm, text_llm_available
from rag import retrieve, _format_context

REPORT_SYSTEM_PROMPT = (
    "Kamu insinyur inspeksi yang menulis laporan ringkas dan profesional dalam "
    "Bahasa Indonesia. Gunakan HANYA informasi dari hasil deteksi dan KONTEKS "
    "pengetahuan yang diberikan; jangan mengarang angka. Output berupa Markdown "
    "dengan struktur tepat berikut:\n"
    "# Laporan Inspeksi Retak\n"
    "## Ringkasan\n## Temuan\n## Penilaian Keparahan\n## Rekomendasi\n## Disclaimer\n"
    "Pada Disclaimer, tegaskan bahwa ini hasil bantuan AI untuk triase awal dan "
    "keputusan struktural harus divalidasi insinyur berlisensi."
)


def generate_report(
    label: str,
    confidence: float,
    metadata: dict | None = None,
    k: int = 4,
) -> dict:
    """
    Susun laporan inspeksi dari hasil deteksi.

    Return: {"report_markdown": str}
    """
    if not text_llm_available():
        raise LLMNotConfigured("LLM belum dikonfigurasi (set GEMINI_API_KEY).")

    meta = metadata or {}
    detection_summary = (
        f"label={label}, confidence={confidence}%, "
        + ", ".join(f"{key}={val}" for key, val in meta.items())
    ).rstrip(", ")

    # Grounding: ambil konteks relevan dari KB sesuai temuan.
    query = (
        f"Retak terdeteksi ({label}). Penyebab kemungkinan, penilaian keparahan, "
        "dan rekomendasi perbaikan."
    )
    docs = retrieve(query, k=k)
    context = _format_context(docs)

    from langchain_core.output_parsers import StrOutputParser
    from langchain_core.prompts import ChatPromptTemplate

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", REPORT_SYSTEM_PROMPT),
            (
                "human",
                "HASIL DETEKSI:\n{detection}\n\n"
                "KONTEKS PENGETAHUAN:\n{context}\n\n"
                "Tulis laporan inspeksi sesuai struktur yang diminta.",
            ),
        ]
    )
    chain = prompt | get_chat_llm() | StrOutputParser()
    report_md = chain.invoke({"detection": detection_summary, "context": context})

    return {"report_markdown": report_md.strip()}
