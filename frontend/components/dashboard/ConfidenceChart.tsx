'use client';

import Card from '@/components/ui/Card';
import type { ScanRecord } from '@/lib/types';

interface ConfidenceChartProps {
  scans: ScanRecord[];
}

export default function ConfidenceChart({ scans }: ConfidenceChartProps) {
  // Build 10% buckets
  const buckets = Array.from({ length: 10 }, (_, i) => {
    const min = i * 10;
    const max = min + 10;
    const count = scans.filter(s => s.confidence >= min && s.confidence < (i === 9 ? 101 : max)).length;
    return { label: `${min}-${max}%`, count };
  });

  const maxCount = Math.max(...buckets.map(b => b.count), 1);

  return (
    <Card>
      <h3 className="font-semibold text-foreground mb-6">Confidence Distribution</h3>

      {scans.length === 0 ? (
        <p className="text-muted text-sm text-center py-8">No data yet</p>
      ) : (
        <div className="flex items-end gap-2 h-40">
          {buckets.map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted font-mono">{b.count || ''}</span>
              <div
                className="w-full bg-accent/80 rounded-t-sm transition-all"
                style={{ height: `${(b.count / maxCount) * 100}%`, minHeight: b.count > 0 ? 4 : 0 }}
              />
              <span className="text-[9px] text-muted -rotate-45 origin-top-left mt-1 whitespace-nowrap">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
