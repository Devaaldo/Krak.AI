'use client';

import { useState, useRef } from 'react';
import { predictImage } from '@/lib/api';
import type { PredictResult } from '@/lib/types';
import { useScanHistory } from '@/lib/useScanHistory';
import ResultCard from './ResultCard';
import Button from '@/components/ui/Button';

export default function UploadMode() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { addScan } = useScanHistory();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handlePredict = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const data = await predictImage(file);
      setResult(data);
      addScan({
        label: data.label,
        confidence: data.confidence,
        thumbnailBase64: data.gradcam?.slice(0, 200),
      });
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Upload area */}
      <label className="w-full max-w-md h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
        <svg className="w-8 h-8 text-muted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <span className="text-muted text-sm mb-1">Click to upload image</span>
        <span className="text-muted/60 text-xs">JPG, PNG supported</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </label>

      {/* Preview */}
      {preview && (
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted font-medium">Original</span>
            <img src={preview} className="w-48 h-48 object-cover rounded-xl border border-border" />
          </div>
          {result && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-muted font-medium">Grad-CAM</span>
              <img
                src={`data:image/jpeg;base64,${result.gradcam}`}
                className="w-48 h-48 object-cover rounded-xl border border-border"
              />
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {result && <ResultCard result={result} />}

      {/* Button */}
      {preview && (
        <Button
          onClick={handlePredict}
          disabled={loading}
          size="lg"
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </Button>
      )}
    </div>
  );
}
