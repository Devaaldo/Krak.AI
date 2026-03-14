'use client';

import type { PredictResult } from '@/lib/types';

interface ResultCardProps {
  result: PredictResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isCrack = result.label === 'Positive';

  return (
    <div
      className={`px-6 py-4 rounded-xl text-center border ${
        isCrack
          ? 'bg-red-50 border-red-200 text-red-700'
          : 'bg-green-50 border-green-200 text-green-700'
      }`}
    >
      <p className="text-2xl font-bold">
        {isCrack ? 'Crack Detected' : 'No Crack'}
      </p>
      <p className={`mt-1 text-sm ${isCrack ? 'text-red-500' : 'text-green-500'}`}>
        Confidence: {result.confidence}%
      </p>
    </div>
  );
}
