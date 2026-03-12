import base64
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from model import predict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
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