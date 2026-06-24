# Training & Reproducibility

Hyperparameter terpusat di [`config.yaml`](config.yaml). Notebook
[`../notebook/crack-detection.ipynb`](../notebook/crack-detection.ipynb) tetap
menjadi pipeline eksplorasi/training; bagian ini mendokumentasikan cara membuat
hasilnya **reproducible**.

## Seeding (wajib untuk hasil deterministik)

Notebook saat ini hanya men-seed pembagian data (`train_test_split`,
`random_state=42`). Untuk bobot model yang deterministik, tambahkan blok berikut
di sel paling awal (sebelum membuat model / DataLoader):

```python
import random
import numpy as np
import torch

SEED = 42  # samakan dengan config.yaml
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)
torch.use_deterministic_algorithms(True, warn_only=True)

# Untuk DataLoader, set juga generator + worker_init_fn bila num_workers > 0.
```

## Train / serve parity

Preprocessing **harus identik** antara training dan serving:

```
grayscale -> resize 128x128 -> ToTensor -> DWT Haar 2-level -> normalisasi min-max per-subband
```

Implementasi serving ada di [`../backend/model.py`](../backend/model.py)
(`transform`, `apply_dwt`). Kontrak ini diuji otomatis di
[`../backend/tests/test_model.py`](../backend/tests/test_model.py)
(`test_preprocessing_parity_contract`) — jika preprocessing serving berubah dan
tak lagi menghasilkan 4 subband 32x32 ter-normalisasi, test gagal.

## Artefak yang dilacak
- Split kanonik: `notebook/data/splits/{train,val,test}.csv` (hasil seed 42).
- Bobot: `backend/best_model.pth` (identitas di
  [`../backend/MODEL_CARD.md`](../backend/MODEL_CARD.md) &
  [`../backend/model_meta.json`](../backend/model_meta.json)).
