'use client';

import Card from '@/components/ui/Card';
import type { ScanRecord } from '@/lib/types';

interface ScanSummaryProps {
  scans: ScanRecord[];
}

export default function ScanSummary({ scans }: ScanSummaryProps) {
  const total = scans.length;
  const cracks = scans.filter(s => s.label === 'Positive').length;
  const clean = total - cracks;
  const crackPct = total > 0 ? Math.round((cracks / total) * 100) : 0;
  const cleanPct = total > 0 ? 100 - crackPct : 0;

  return (
    <Card>
      <h3 className="font-semibold text-foreground mb-6">Distribution</h3>

      {total === 0 ? (
        <p className="text-muted text-sm text-center py-8">No data yet</p>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {/* CSS donut */}
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(#DC2626 0% ${crackPct}%, #16A34A ${crackPct}% 100%)`,
            }}
          >
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{total}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-danger" />
              <span className="text-muted">Crack ({cracks} - {crackPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success" />
              <span className="text-muted">Clean ({clean} - {cleanPct}%)</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
