import base64
import json
import logging
import os
import time
from contextlib import asynccontextmanager
from io import BytesIO

from dotenv import load_dotenv
from fastapi import (
    FastAPI,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

load_dotenv()

from agent import run_agent  # noqa: E402
from llm import LLMNotConfigured, text_llm_available, vision_available  # noqa: E402
from model import predict  # noqa: E402
from rag import answer as rag_answer  # noqa: E402
from rag import build_index  # noqa: E402
from report import generate_report  # noqa: E402
from vlm import maybe_second_opinion  # noqa: E402

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("krak-ai")


def _dummy_png_bytes() -> bytes:
    buf = BytesIO()
    Image.new("RGB", (128, 128), (127, 127, 127)).save(buf, format="PNG")
    return buf.getvalue()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Warmup CNN supaya request pertama tidak lambat.
    try:
        predict(_dummy_png_bytes())
        logger.info("Model warmup selesai.")
    except Exception as exc:  # pragma: no cover - best effort
        logger.warning("Warmup model gagal: %s", exc)
    # Build index RAG (opsional; butuh deps GenAI + unduh model embedding).
    try:
        build_index()
        logger.info("FAISS index knowledge base siap.")
    except Exception as exc:  # pragma: no cover - best effort
        logger.warning("Build index RAG dilewati: %s", exc)
    yield


app = FastAPI(
    title="Krak.AI API",
    description="Deteksi retak (CV) + layer GenAI: advisor (RAG), laporan, VLM, agent.",
    version="1.0.0",
    lifespan=lifespan,
)

# "http://localhost:5173,https://krak-ai.vercel.app" via env var FRONTEND_ORIGINS
origins = ["http://localhost:5173"]
extra_origins = os.environ.get("FRONTEND_ORIGINS", "")
if extra_origins:
    origins.extend(o.strip() for o in extra_origins.split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting (lindungi endpoint publik & jaga kuota free tier LLM).
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB (selaras dgn batas yang ditampilkan frontend)

# Metadata model (mesin-baca) untuk diekspos di "/".
try:
    with open(os.path.join(os.path.dirname(__file__), "model_meta.json"), encoding="utf-8") as _f:
        MODEL_META = json.load(_f)
except Exception:  # pragma: no cover - metadata opsional
    MODEL_META = None


# --------------------------- Schemas (Pydantic) ---------------------------
class SecondOpinion(BaseModel):
    source: str
    text: str
    triggered_below: float


class PredictResponse(BaseModel):
    label: str
    confidence: float
    gradcam: str
    second_opinion: SecondOpinion | None = None


class Citation(BaseModel):
    source: str
    snippet: str


class AdvisorRequest(BaseModel):
    question: str
    detection_context: str | None = None


class AdvisorResponse(BaseModel):
    answer: str
    citations: list[Citation]


class ReportRequest(BaseModel):
    label: str
    confidence: float
    metadata: dict | None = None


class ReportResponse(BaseModel):
    report_markdown: str


class AgentResponse(BaseModel):
    answer: str


class HealthResponse(BaseModel):
    status: str
    genai_text: bool
    genai_vision: bool
    model: dict | None = None


# --------------------------- CV: Upload mode ---------------------------
@app.post("/predict", response_model=PredictResponse)
@limiter.limit("30/minute")
async def predict_image(request: Request, file: UploadFile):
    t0 = time.perf_counter()
    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Ukuran file melebihi batas 20 MB.")
    try:
        result = predict(image_bytes)
    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="File yang dikirim bukan gambar yang valid atau rusak.",
        )

    # VLM fallback: second opinion saat confidence rendah.
    second = maybe_second_opinion(image_bytes, result["confidence"])

    logger.info(
        "predict label=%s confidence=%.2f vlm=%s latency_ms=%d",
        result["label"],
        result["confidence"],
        bool(second),
        (time.perf_counter() - t0) * 1000,
    )
    return PredictResponse(
        label=result["label"],
        confidence=result["confidence"],
        gradcam=base64.b64encode(result["gradcam"]).decode(),
        second_opinion=SecondOpinion(**second) if second else None,
    )


# --------------------------- CV: Live webcam mode ---------------------------
@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            # Terima frame dari frontend sebagai bytes
            frame_bytes = await ws.receive_bytes()
            try:
                result = predict(frame_bytes)
            except (UnidentifiedImageError, OSError):
                # Frame korup / bukan gambar valid: beri tahu klien, jangan
                # putus koneksi supaya streaming bisa lanjut.
                await ws.send_json({"error": "Frame tidak valid atau rusak."})
                continue
            await ws.send_json(
                {
                    "label": result["label"],
                    "confidence": result["confidence"],
                    "gradcam": base64.b64encode(result["gradcam"]).decode(),
                }
            )
    except WebSocketDisconnect:
        pass


# --------------------------- GenAI: Advisor (RAG) ---------------------------
@app.post("/advisor", response_model=AdvisorResponse)
@limiter.limit("15/minute")
def advisor(request: Request, req: AdvisorRequest):
    try:
        result = rag_answer(req.question, detection_context=req.detection_context)
    except LLMNotConfigured as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    return AdvisorResponse(**result)


# --------------------------- GenAI: Inspection report ---------------------------
@app.post("/report", response_model=ReportResponse)
@limiter.limit("10/minute")
def report(request: Request, req: ReportRequest):
    try:
        result = generate_report(req.label, req.confidence, metadata=req.metadata)
    except LLMNotConfigured as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    return ReportResponse(**result)


# --------------------------- GenAI: Multimodal agent ---------------------------
@app.post("/agent", response_model=AgentResponse)
@limiter.limit("10/minute")
async def agent_endpoint(
    request: Request,
    message: str = Form(...),
    history: str = Form("[]"),
    file: UploadFile | None = File(None),
):
    image_bytes = None
    if file is not None:
        image_bytes = await file.read()
        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="Ukuran file melebihi batas 20 MB.")
    try:
        hist = json.loads(history)
    except (ValueError, TypeError):
        hist = []
    try:
        result = run_agent(message, image_bytes=image_bytes, history=hist)
    except LLMNotConfigured as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    return AgentResponse(**result)


# --------------------------- Health check ---------------------------
@app.get("/", response_model=HealthResponse)
def root():
    return HealthResponse(
        status="ok",
        genai_text=text_llm_available(),
        genai_vision=vision_available(),
        model=MODEL_META,
    )
