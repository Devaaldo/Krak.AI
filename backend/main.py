import base64
import os
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from model import predict

app = FastAPI()

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


# Upload mode
@app.post("/predict")
async def predict_image(file: UploadFile):
    result = predict(await file.read())
    return {
        "label":      result["label"],
        "confidence": result["confidence"],
        "gradcam":    base64.b64encode(result["gradcam"]).decode()
    }


# Live webcam mode
@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            # Terima frame dari frontend sebagai bytes
            frame_bytes = await ws.receive_bytes()
            result      = predict(frame_bytes)
            await ws.send_json({
                "label":      result["label"],
                "confidence": result["confidence"],
                "gradcam":    base64.b64encode(result["gradcam"]).decode()
            })
    except WebSocketDisconnect:
        pass


# Health check
@app.get("/")
def root():
    return {"status": "ok"}