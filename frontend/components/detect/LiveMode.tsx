'use client';

import { useEffect, useRef, useState } from 'react';
import { WS_BASE } from '@/lib/constants';
import type { PredictResult } from '@/lib/types';
import { useScanHistory } from '@/lib/useScanHistory';
import ResultCard from './ResultCard';
import Button from '@/components/ui/Button';

export default function LiveMode() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [result, setResult] = useState<PredictResult | null>(null);
  const [active, setActive] = useState(false);
  const { addScan } = useScanHistory();

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;

    wsRef.current = new WebSocket(`${WS_BASE}/ws`);

    wsRef.current.onmessage = (e) => {
      const data: PredictResult = JSON.parse(e.data);
      setResult(data);
      addScan({
        label: data.label,
        confidence: data.confidence,
      });
    };

    intervalRef.current = setInterval(() => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video || wsRef.current?.readyState !== WebSocket.OPEN) return;

      canvas.getContext('2d')!.drawImage(video, 0, 0, 128, 128);
      canvas.toBlob((blob) => {
        if (blob) wsRef.current!.send(blob);
      }, 'image/jpeg');
    }, 500);

    setActive(true);
  };

  const stopCamera = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    wsRef.current?.close();
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setResult(null);
    setActive(false);
  };

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-6">
        {/* Webcam feed */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted font-medium">Camera</span>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-64 h-64 object-cover rounded-xl bg-surface border border-border"
          />
        </div>

        {/* Grad-CAM overlay */}
        {result && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted font-medium">Grad-CAM</span>
            <img
              src={`data:image/jpeg;base64,${result.gradcam}`}
              className="w-64 h-64 object-cover rounded-xl border border-border"
            />
          </div>
        )}
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} width={128} height={128} className="hidden" />

      {/* Result */}
      {result && <ResultCard result={result} />}

      {/* Toggle button */}
      <Button
        onClick={active ? stopCamera : startCamera}
        variant={active ? 'danger' : 'primary'}
        size="lg"
      >
        {active ? 'Stop Camera' : 'Start Camera'}
      </Button>
    </div>
  );
}
