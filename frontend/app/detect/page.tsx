'use client';

import { useState } from 'react';
import UploadMode from '@/components/detect/UploadMode';
import LiveMode from '@/components/detect/LiveMode';

export default function DetectPage() {
  const [mode, setMode] = useState<'upload' | 'live'>('upload');

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Detect Crack</h1>
        <p className="text-muted text-sm mt-1">
          Upload an image or use your webcam for real-time crack detection
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-surface rounded-lg p-1 border border-border">
          {(['upload', 'live'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-white text-accent shadow-sm border border-border'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {m === 'upload' ? 'Upload Image' : 'Live Camera'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {mode === 'upload' ? <UploadMode /> : <LiveMode />}
    </div>
  );
}
