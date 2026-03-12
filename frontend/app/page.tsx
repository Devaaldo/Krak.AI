'use client'
import { useState } from 'react'
import UploadMode from '@/components/UploadMode'
import LiveMode from '@/components/LiveMode'

export default function Home() {
  const [mode, setMode] = useState<'upload' | 'live'>('upload')

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-2">
          Surface Crack Detection
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Wavelet Transform + Lightweight CNN
        </p>

        <div className="flex justify-center gap-4 mb-10">
          {(['upload', 'live'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                mode === m
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {m === 'upload' ? 'Upload Image' : 'Live Camera'}
            </button>
          ))}
        </div>

        {mode === 'upload' ? <UploadMode /> : <LiveMode />}

      </div>
    </main>
  )
}