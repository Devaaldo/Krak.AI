import React, { useState, useRef } from 'react';
import { UploadCloud, FileVideo, X, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const ImportPage = () => {
  const [mode, setMode] = useState('image'); // 'image' | 'video'
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_URL}/predict`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const labelColor = result?.label === 'Positive' ? '#dc2626' : '#16a34a';
  const labelBg   = result?.label === 'Positive' ? '#fef2f2' : '#f0fdf4';

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Import Data</h1>
        <p className="dashboard-desc">Run batch analysis on high-resolution image and video datasets.</p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          className={mode === 'image' ? 'button-primary' : 'button-outline'}
          onClick={() => { setMode('image'); handleReset(); }}
        >
          <UploadCloud size={16} /> Image
        </button>
        <button
          className={mode === 'video' ? 'button-primary' : 'button-outline'}
          onClick={() => { setMode('video'); handleReset(); }}
        >
          <FileVideo size={16} /> Video
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {mode === 'video' ? (
          <div className="upload-area" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <FileVideo size={48} className="upload-icon" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Video Detection</h3>
            <p style={{ color: 'var(--text-muted)' }}>Coming soon</p>
          </div>
        ) : !file ? (
          /* Drop zone */
          <div
            className="upload-area"
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <UploadCloud size={48} className="upload-icon" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Drag & drop gambar
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>atau klik untuk pilih file</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPG, PNG, BMP — maks 20MB</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          /* Preview + Result */
          <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>

            {/* Preview kolom kiri */}
            <div>
              <div style={{
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                background: 'var(--bg-alt)'
              }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={preview}
                    alt="preview"
                    style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
                  />
                  <button
                    onClick={handleReset}
                    style={{
                      position: 'absolute', top: '0.75rem', right: '0.75rem',
                      background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
                      width: '28px', height: '28px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div style={{ padding: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{file.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <button
                className="button-primary"
                onClick={handleAnalyze}
                disabled={loading}
                style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Menganalisis...' : 'Analisis Gambar'}
              </button>

              {error && (
                <div style={{
                  marginTop: '1rem', padding: '0.75rem 1rem',
                  background: '#fef2f2', borderRadius: '0.5rem',
                  display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                  color: '#dc2626', fontSize: '0.875rem'
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                  {error}
                </div>
              )}
            </div>

            {/* Hasil kolom kanan */}
            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Label + Confidence */}
                <div style={{
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  background: labelBg,
                  border: `1px solid ${labelColor}30`
                }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Hasil Deteksi
                  </p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 700, color: labelColor }}>
                    {result.label}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Confidence: <strong style={{ color: 'var(--text-main)' }}>{result.confidence}%</strong>
                  </p>

                  {/* Progress bar confidence */}
                  <div style={{
                    marginTop: '0.75rem', height: '6px',
                    background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${result.confidence}%`,
                      height: '100%',
                      background: labelColor,
                      borderRadius: '999px',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>

                {/* Grad-CAM */}
                <div style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.75rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.875rem', fontWeight: 500
                  }}>
                    Grad-CAM Overlay
                  </div>
                  <img
                    src={`data:image/jpeg;base64,${result.gradcam}`}
                    alt="Grad-CAM"
                    style={{ width: '100%', display: 'block' }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportPage;
