import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
const FPS_TARGET = 10; // kirim frame tiap 100ms

const Live = () => {
  const [status, setStatus]     = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected' | 'error'
  const [result, setResult]     = useState(null);
  const [fps, setFps]           = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const wsRef       = useRef(null);
  const streamRef   = useRef(null);
  const intervalRef = useRef(null);
  const fpsCountRef = useRef(0);
  const fpsTimerRef = useRef(null);

  // Hitung FPS setiap detik
  useEffect(() => {
    fpsTimerRef.current = setInterval(() => {
      setFps(fpsCountRef.current);
      fpsCountRef.current = 0;
    }, 1000);
    return () => clearInterval(fpsTimerRef.current);
  }, []);

  const sendFrame = useCallback(() => {
    const ws     = wsRef.current;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || !video || !canvas) return;

    canvas.width  = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 128, 128);

    canvas.toBlob((blob) => {
      if (!blob) return;
      blob.arrayBuffer().then((buf) => {
        ws.send(buf);
        fpsCountRef.current += 1;
      });
    }, 'image/jpeg', 0.8);
  }, []);

  const connect = async () => {
    setStatus('connecting');
    setErrorMsg('');
    setResult(null);

    // Akses kamera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Tidak bisa akses kamera: ' + err.message);
      return;
    }

    // Buka WebSocket
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      intervalRef.current = setInterval(sendFrame, 1000 / FPS_TARGET);
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setResult(data);
      } catch (_) {}
    };

    ws.onerror = () => {
      setStatus('error');
      setErrorMsg('Gagal terhubung ke server. Server mungkin sedang aktif kembali (~30 detik) — coba lagi sebentar.');
      disconnect(false);
    };

    ws.onclose = () => {
      if (status === 'connected') setStatus('disconnected');
    };
  };

  const disconnect = (resetStatus = true) => {
    clearInterval(intervalRef.current);

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) videoRef.current.srcObject = null;

    setFps(0);
    fpsCountRef.current = 0;
    if (resetStatus) { setStatus('disconnected'); setResult(null); }
  };

  // Cleanup saat unmount
  useEffect(() => () => disconnect(false), []);

  const isConnected   = status === 'connected';
  const isConnecting  = status === 'connecting';
  const labelColor    = result?.label === 'Positive' ? '#dc2626' : '#16a34a';
  const labelBg       = result?.label === 'Positive' ? '#fef2f2' : '#f0fdf4';

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Live Detection</h1>
        <p className="dashboard-desc">Stream video feeds for real-time detection of structural anomalies.</p>
      </div>

      {/* Video area */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isConnected && result ? '1fr 1fr' : '1fr',
          gap: '1.5rem',
          alignItems: 'start'
        }}>

          {/* Webcam feed */}
          <div style={{
            borderRadius: '0.75rem', overflow: 'hidden',
            background: '#000', position: 'relative',
            aspectRatio: '4/3'
          }}>
            <video
              ref={videoRef}
              muted
              playsInline
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                display: isConnected ? 'block' : 'none'
              }}
            />
            {/* Canvas tersembunyi untuk capture frame */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Placeholder saat belum connect */}
            {!isConnected && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', gap: '1rem'
              }}>
                <CameraOff size={48} style={{ opacity: 0.4 }} />
                <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>Kamera belum terhubung</p>
              </div>
            )}

            {/* FPS badge saat connected */}
            {isConnected && (
              <div style={{
                position: 'absolute', top: '0.75rem', left: '0.75rem',
                background: 'rgba(0,0,0,0.6)', color: 'white',
                borderRadius: '999px', padding: '0.25rem 0.75rem',
                fontSize: '0.75rem', fontWeight: 600
              }}>
                {fps} FPS
              </div>
            )}
          </div>

          {/* Grad-CAM overlay */}
          {isConnected && result && (
            <div style={{
              borderRadius: '0.75rem', overflow: 'hidden',
              border: '1px solid var(--border-color)'
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
          )}
        </div>

        {/* Error */}
        {status === 'error' && errorMsg && (
          <div style={{
            marginTop: '1rem', padding: '0.75rem 1rem',
            background: '#fef2f2', borderRadius: '0.5rem',
            display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
            color: '#dc2626', fontSize: '0.875rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            {errorMsg}
          </div>
        )}

        {/* Tombol connect/disconnect */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          {!isConnected ? (
            <button
              className="button-primary"
              onClick={connect}
              disabled={isConnecting}
              style={{ opacity: isConnecting ? 0.7 : 1 }}
            >
              <Camera size={16} />
              {isConnecting ? 'Menghubungkan...' : 'Connect Camera'}
            </button>
          ) : (
            <button className="button-outline" onClick={() => disconnect()}>
              <CameraOff size={16} />
              Disconnect
            </button>
          )}
        </div>

        {/* Status cards */}
        <div className="feature-grid" style={{ marginTop: '2rem' }}>
          <div className="feature-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: isConnected ? '#22c55e' : status === 'error' ? '#ef4444' : '#d1d5db'
              }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                {status === 'disconnected' ? 'Disconnected'
                  : status === 'connecting' ? 'Connecting...'
                  : status === 'connected' ? 'Connected'
                  : 'Error'}
              </span>
            </div>
          </div>

          <div className="feature-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Detection Rate</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{fps} FPS</p>
          </div>

          {result && (
            <div className="feature-card" style={{ padding: '1.5rem', background: labelBg, borderColor: `${labelColor}30` }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Hasil Terakhir</h3>
              <p style={{ color: labelColor, fontWeight: 700, fontSize: '1.25rem' }}>{result.label}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {result.confidence}% confidence
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Live;
