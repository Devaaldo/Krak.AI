# Model Card — LightCrackCNN (Krak.AI)

Ringkasan identitas model deteksi retak yang dipakai backend Krak.AI. Versi
mesin-baca ada di [`model_meta.json`](model_meta.json) dan diekspos lewat `GET /`.

## Ringkasan
- **Nama / versi**: LightCrackCNN v1.0.0
- **Tugas**: klasifikasi biner permukaan beton — `Positive` (retak) / `Negative`.
- **Framework**: PyTorch (CPU-only inference).
- **Ukuran**: ~24.082 parameter (lightweight, ramah CPU/free tier).

## Arsitektur
- Input: 4 kanal subband wavelet (LL2, LH2, HL2, HH2), 32×32.
- conv1(4→16) → conv2(16→32, maxpool) → conv3(64, maxpool) → GAP → FC(64→2).
- Explainability: Grad-CAM pada layer `conv3`.

## Preprocessing (harus identik train ↔ serve)
`grayscale → resize 128×128 → ToTensor → DWT Haar 2-level → normalisasi min-max per-subband`.
Lihat `model.py::transform` & `apply_dwt`. Parity diuji di `tests/test_model.py`.

## Data & training
- **Dataset**: Surface Crack Detection (Kaggle, ~40.000 citra).
- **Split**: 70/15/15 stratified, `seed=42` (artefak split: `notebook/data/splits/*.csv`).
- **Optimizer**: Adam, `lr=1e-3`, `batch_size=32`, `epochs=30`.
- **Metrik**: akurasi test ~98% (lihat notebook & `docs/assets/` untuk confusion matrix).

## Penggunaan & batasan
- Untuk **triase awal**, bukan keputusan rekayasa final.
- Dilatih pada citra permukaan beton; performa di luar domain (logam, kayu,
  pencahayaan ekstrem) tidak dijamin.
- Saat confidence rendah, backend memicu **second opinion VLM** (Gemini Vision).
- Keputusan struktural/keselamatan **wajib** divalidasi insinyur berlisensi.

## Reproducibility
Hyperparameter terpusat di [`training/config.yaml`](../training/config.yaml).
Untuk hasil deterministik, set seed `torch`/`numpy`/`random` (lihat
[`training/README.md`](../training/README.md)).
