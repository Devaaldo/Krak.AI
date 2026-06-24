"""
RAG Crack Advisor — jawaban grounded ke knowledge base teknik retak beton.

Pipeline: load `knowledge_base/*.md` -> chunk -> embed (all-MiniLM-L6-v2 lokal)
-> index FAISS (di-build sekali, di-cache) -> retrieve -> LLM (Gemini/Groq) jawab
hanya dari konteks + sertakan citations (nama file sumber).

Index & embedding di-build *lazily* saat pertama dipakai supaya import murah dan
endpoint CV inti tetap jalan tanpa dependency GenAI ter-load.
"""
import functools
import glob
import os

from llm import LLMNotConfigured, get_chat_llm, text_llm_available

KB_DIR = os.path.join(os.path.dirname(__file__), "knowledge_base")
EMBED_MODEL = os.environ.get("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

SYSTEM_PROMPT = (
    "Kamu adalah asisten inspeksi retak beton untuk aplikasi Krak.AI. "
    "Jawab HANYA berdasarkan KONTEKS yang diberikan. Jika konteks tidak memuat "
    "jawabannya, katakan terus terang kamu tidak punya cukup informasi — jangan "
    "mengarang. Jawab ringkas, terstruktur, dan dalam bahasa yang sama dengan "
    "pertanyaan pengguna. Untuk hal yang menyangkut keselamatan/struktural, "
    "ingatkan agar berkonsultasi dengan insinyur struktur berlisensi."
)


@functools.lru_cache(maxsize=1)
def _embeddings():
    from langchain_huggingface import HuggingFaceEmbeddings

    return HuggingFaceEmbeddings(model_name=EMBED_MODEL)


@functools.lru_cache(maxsize=1)
def _vectorstore():
    from langchain_community.document_loaders import TextLoader
    from langchain_community.vectorstores import FAISS
    from langchain_text_splitters import RecursiveCharacterTextSplitter

    docs = []
    for path in sorted(glob.glob(os.path.join(KB_DIR, "*.md"))):
        loaded = TextLoader(path, encoding="utf-8").load()
        for d in loaded:
            d.metadata["source"] = os.path.basename(path)
        docs.extend(loaded)
    if not docs:
        raise RuntimeError(f"Knowledge base kosong di {KB_DIR}")

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120)
    chunks = splitter.split_documents(docs)
    return FAISS.from_documents(chunks, _embeddings())


def build_index() -> None:
    """Bangun (warm) index FAISS lebih awal — dipanggil saat startup app."""
    _vectorstore()


def retrieve(question: str, k: int = 4):
    """Ambil chunk paling relevan (dipakai juga oleh test retrieval)."""
    return _vectorstore().as_retriever(search_kwargs={"k": k}).invoke(question)


def _format_context(docs) -> str:
    blocks = []
    for i, d in enumerate(docs, 1):
        src = d.metadata.get("source", "?")
        blocks.append(f"[{i}] (sumber: {src})\n{d.page_content}")
    return "\n\n".join(blocks)


def answer(question: str, detection_context: str | None = None, k: int = 4) -> dict:
    """
    Jawab pertanyaan secara grounded.

    detection_context: ringkasan hasil deteksi (mis. "label=Positive, confidence=92%")
    supaya advisor menjelaskan penyebab/rekomendasi sesuai temuan.

    Return: {"answer": str, "citations": [{"source", "snippet"}]}
    """
    if not text_llm_available():
        raise LLMNotConfigured("LLM belum dikonfigurasi (set GEMINI_API_KEY).")

    query = question
    if detection_context:
        query = f"{question}\n(Konteks deteksi: {detection_context})"

    docs = retrieve(query, k=k)
    context = _format_context(docs)

    from langchain_core.output_parsers import StrOutputParser
    from langchain_core.prompts import ChatPromptTemplate

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", SYSTEM_PROMPT),
            (
                "human",
                "KONTEKS:\n{context}\n\n"
                "KONTEKS DETEKSI (opsional): {detection}\n\n"
                "PERTANYAAN: {question}",
            ),
        ]
    )
    chain = prompt | get_chat_llm() | StrOutputParser()
    text = chain.invoke(
        {
            "context": context,
            "detection": detection_context or "-",
            "question": question,
        }
    )

    citations = []
    seen = set()
    for d in docs:
        src = d.metadata.get("source", "?")
        if src in seen:
            continue
        seen.add(src)
        snippet = d.page_content.strip().replace("\n", " ")
        citations.append({"source": src, "snippet": snippet[:180]})

    return {"answer": text.strip(), "citations": citations}
