'use client';

import PredictForm from '@/components/predict/PredictForm';

export default function PredictPage() {
  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Predict API</h1>
        <p className="text-muted text-sm mt-1">
          Test the crack detection API directly and view raw responses
        </p>
      </div>
      <PredictForm />
    </div>
  );
}
