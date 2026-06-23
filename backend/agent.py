"""
Asisten Multimodal (Agent) — LangChain tool-calling agent.

Tools:
- detect_crack            : jalankan CNN pada gambar yang di-upload pengguna.
- retrieve_standards      : ambil konteks pengetahuan teknik dari knowledge base (RAG).
- generate_inspection_report : susun laporan inspeksi dari hasil deteksi.

Agent memutuskan tool mana yang dipanggil berdasarkan pertanyaan pengguna, dan
dapat mengingat percakapan (chat history). Tools di-bind ke gambar per-request
lewat closure supaya agent bisa "melihat" gambar yang sedang dibahas.
"""
from llm import LLMNotConfigured, get_chat_llm, text_llm_available

AGENT_SYSTEM = (
    "Kamu asisten inspeksi retak beton Krak.AI. Kamu punya tools untuk: "
    "mendeteksi retak pada gambar pengguna, mengambil pengetahuan teknik dari "
    "knowledge base, dan menyusun laporan inspeksi. Gunakan tool bila relevan. "
    "Jika pengguna sudah mengunggah gambar dan menanyakan kondisinya, panggil "
    "detect_crack lebih dulu. Jawab ringkas dan jujur bila tidak tahu, serta "
    "ingatkan untuk konsultasi insinyur struktur berlisensi pada keputusan kritis."
)


def _build_tools(image_bytes):
    import model as cnn
    from langchain_core.tools import tool
    from rag import _format_context, retrieve
    from report import generate_report

    @tool
    def detect_crack() -> str:
        """Deteksi retak pada gambar yang sedang dibahas pengguna. Tanpa argumen."""
        if image_bytes is None:
            return "Tidak ada gambar yang diunggah pada percakapan ini."
        res = cnn.predict(image_bytes)
        return f"label={res['label']}, confidence={res['confidence']}%"

    @tool
    def retrieve_standards(query: str) -> str:
        """Ambil pengetahuan retak (jenis, penyebab, keparahan, perbaikan, standar) dari knowledge base sesuai query."""
        docs = retrieve(query, k=4)
        return _format_context(docs)

    @tool
    def generate_inspection_report() -> str:
        """Susun laporan inspeksi Markdown dari hasil deteksi gambar yang diunggah."""
        if image_bytes is None:
            return "Tidak ada gambar untuk dibuatkan laporan."
        res = cnn.predict(image_bytes)
        rep = generate_report(res["label"], res["confidence"])
        return rep["report_markdown"]

    return [detect_crack, retrieve_standards, generate_inspection_report]


def _to_lc_messages(history):
    from langchain_core.messages import AIMessage, HumanMessage

    msgs = []
    for turn in history or []:
        role = turn.get("role")
        content = turn.get("content", "")
        if role == "user":
            msgs.append(HumanMessage(content=content))
        elif role in ("assistant", "ai"):
            msgs.append(AIMessage(content=content))
    return msgs


def run_agent(message: str, image_bytes: bytes | None = None, history=None) -> dict:
    """
    Jalankan agent atas pesan pengguna.

    Return: {"answer": str}
    """
    if not text_llm_available():
        raise LLMNotConfigured("LLM belum dikonfigurasi (set GEMINI_API_KEY).")

    from langchain.agents import AgentExecutor, create_tool_calling_agent
    from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

    tools = _build_tools(image_bytes)
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", AGENT_SYSTEM),
            MessagesPlaceholder("chat_history", optional=True),
            ("human", "{input}"),
            MessagesPlaceholder("agent_scratchpad"),
        ]
    )
    agent = create_tool_calling_agent(get_chat_llm(), tools, prompt)
    executor = AgentExecutor(agent=agent, tools=tools, max_iterations=5, verbose=False)
    result = executor.invoke(
        {"input": message, "chat_history": _to_lc_messages(history)}
    )
    return {"answer": (result.get("output") or "").strip()}
