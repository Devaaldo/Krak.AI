# Krak.AI -- Real-Time Surface Crack Detection with Wavelet-CNN

A full-stack web application for detecting surface cracks on concrete and structural surfaces using Discrete Wavelet Transform (DWT) preprocessing and a lightweight CNN architecture, with real-time inference via webcam and Grad-CAM visual explanations.

## Overview

Krak.AI combines signal processing and deep learning to automate structural surface inspection. The system applies two-level Haar Wavelet Transform to decompose images into frequency sub-bands, then feeds these into a custom lightweight CNN for binary classification (crack / no crack). Grad-CAM overlays provide interpretable visual feedback, highlighting the exact regions driving each prediction.

## Architecture

```
Input Image --> Grayscale + Resize (128x128)
            --> 2-Level Haar DWT (LL, LH, HL, HH sub-bands)
            --> LightCrackCNN (Conv3 + BN + ReLU + GAP)
            --> Softmax Classification
            --> Grad-CAM Heatmap Overlay
```

### Key Technical Details

- **Preprocessing**: 2D Discrete Wavelet Transform (Haar) extracts 4-channel frequency sub-bands, emphasizing high-frequency edge features of cracks while suppressing noise.
- **Model**: Custom lightweight CNN (LightCrackCNN) with 3 convolutional blocks, batch normalization, and global average pooling. Total parameters ~40K.
- **Explainability**: Grad-CAM visualization on the final convolutional layer provides spatial attribution maps for each prediction.
- **Inference**: Sub-50ms per frame on CPU, enabling real-time detection at 10 FPS via WebSocket streaming.

## Tech Stack

| Layer       | Technology                                  |
|-------------|---------------------------------------------|
| Frontend    | React 19, Vite 8, Framer Motion             |
| Backend     | FastAPI, WebSocket                           |
| ML Pipeline | PyTorch, PyWavelets, OpenCV                  |
| Model       | LightCrackCNN (custom architecture)          |
| Notebook    | Jupyter (training, evaluation, experiments)  |

## Features

- **Image Upload** -- Upload structural images for single-frame crack detection with confidence scores and Grad-CAM overlay.
- **Live Webcam Detection** -- Stream camera feed via WebSocket for continuous real-time crack detection with FPS monitoring.
- **Grad-CAM Visualization** -- Interpretable heatmap overlay showing which regions of the image activated the model's prediction.
- **Responsive UI** -- Modern interface with page transitions, scroll animations, and interactive components.

## Project Structure

```
.
├── backend/
│   ├── main.py              # FastAPI server (REST + WebSocket)
│   ├── model.py             # LightCrackCNN, DWT preprocessing, Grad-CAM
│   └── best_model.pth       # Trained model weights
├── frontend/
│   ├── src/
│   │   ├── pages/           # Home, Live, Import, About, Projects
│   │   ├── components/      # Navbar, Footer, Layout, animation components
│   │   └── App.jsx          # Router configuration
│   └── package.json
├── notebook/
│   └── crack-detection.ipynb # Training and evaluation notebook
├── requirements.txt
└── .gitignore
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r ../requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and communicates with the backend at `http://localhost:8000`.

## API Endpoints

| Method    | Endpoint   | Description                                      |
|-----------|------------|--------------------------------------------------|
| POST      | /predict   | Upload image, returns label + confidence + Grad-CAM |
| WebSocket | /ws        | Stream frames, receive real-time predictions      |
| GET       | /          | Health check                                      |

## Dataset

Training was performed on the [Surface Crack Detection Dataset](https://www.kaggle.com/datasets/arunrk7/surface-crack-detection) from Kaggle, containing 40,000 images of concrete surfaces (20,000 positive, 20,000 negative).

## License

This project is developed for academic and portfolio purposes.
