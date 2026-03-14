'use client';

import { useState, useRef } from 'react';
import { predictImage } from '@/lib/api';
import { API_BASE } from '@/lib/constants';
import type { PredictResult } from '@/lib/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function PredictForm() {
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await predictImage(file);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload + Send */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4">Send Prediction Request</h3>
        <div className="flex items-center gap-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:text-sm file:font-medium file:bg-surface file:text-foreground hover:file:bg-border transition-all"
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-red-600 text-sm font-mono">{error}</p>
        </Card>
      )}

      {/* JSON Response */}
      {result && (
        <Card>
          <h3 className="font-semibold text-foreground mb-4">Response</h3>
          <pre className="bg-surface rounded-lg p-4 text-sm font-mono text-foreground overflow-x-auto">
            {JSON.stringify({ label: result.label, confidence: result.confidence, gradcam: `[base64 string, ${result.gradcam.length} chars]` }, null, 2)}
          </pre>
        </Card>
      )}

      {/* API Docs */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4">API Documentation</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-muted mb-1">Endpoint</p>
            <code className="bg-surface px-3 py-1.5 rounded-lg font-mono text-foreground">
              POST {API_BASE}/predict
            </code>
          </div>
          <div>
            <p className="text-muted mb-1">Request</p>
            <pre className="bg-surface rounded-lg p-3 font-mono text-foreground">
              Content-Type: multipart/form-data{'\n'}Body: file=&lt;image_file&gt;
            </pre>
          </div>
          <div>
            <p className="text-muted mb-1">Response</p>
            <pre className="bg-surface rounded-lg p-3 font-mono text-foreground">
{`{
  "label": "Positive" | "Negative",
  "confidence": 98.5,
  "gradcam": "<base64 encoded JPEG>"
}`}
            </pre>
          </div>
          <div>
            <p className="text-muted mb-1">cURL Example</p>
            <pre className="bg-surface rounded-lg p-3 font-mono text-foreground text-xs overflow-x-auto">
              {`curl -X POST ${API_BASE}/predict -F "file=@image.jpg"`}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
}
