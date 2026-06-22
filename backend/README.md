---
title: Krak.AI Backend
colorFrom: blue
colorTo: red
sdk: docker
app_port: 7860
pinned: false
---

# Krak.AI Backend

FastAPI inference server for [Krak.AI](https://github.com/Devaaldo/Krak.AI) — surface crack detection using a Wavelet-CNN (`LightCrackCNN`).

## Endpoints

| Method    | Endpoint   | Description                                         |
|-----------|------------|------------------------------------------------------|
| POST      | /predict   | Upload image, returns label + confidence + Grad-CAM |
| WebSocket | /ws        | Stream frames, receive real-time predictions         |
| GET       | /          | Health check                                         |

## Environment variables

- `FRONTEND_ORIGINS` — comma-separated list of extra allowed CORS origins (e.g. the deployed frontend URL).