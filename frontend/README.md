# Krak.AI — Frontend

Antarmuka web Krak.AI untuk deteksi keretakan permukaan: upload gambar (halaman **Import**) dan deteksi real-time via webcam (halaman **Live**). Dibangun dengan React 19 + Vite, berkomunikasi dengan backend FastAPI lewat REST (`/predict`) dan WebSocket (`/ws`).

## Menjalankan secara lokal

```bash
npm install
npm run dev      # http://localhost:5173
```

Pastikan backend berjalan di `http://localhost:8000` (lihat `../backend`).

## Environment variables

Frontend mencari alamat backend dari env var berikut. Salin `.env.example` jadi `.env`:

| Variable        | Fungsi                                  | Contoh produksi                                  |
|-----------------|------------------------------------------|--------------------------------------------------|
| `VITE_API_URL`  | Backend HTTP (upload gambar `/predict`)  | `https://<user>-<space>.hf.space`                |
| `VITE_WS_URL`   | Backend WebSocket (webcam `/ws`)         | `wss://<user>-<space>.hf.space/ws`               |

> Variabel `VITE_*` ditanam saat **build**. Kalau diubah di hosting (mis. Vercel), wajib **redeploy** agar nilai barunya ikut.

## Build produksi

```bash
npm run build    # output ke dist/
npm run preview  # cek hasil build secara lokal
```

## Deploy

Frontend ini dideploy ke **Vercel** dengan Root Directory `frontend`, plus dua env var di atas. Lihat README utama di root repo untuk panduan deploy lengkap.
