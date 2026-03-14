'use client';

import Card from '@/components/ui/Card';
import type { ScanRecord } from '@/lib/types';

interface RecentScansProps {
  scans: ScanRecord[];
}

export default function RecentScans({ scans }: RecentScansProps) {
  if (scans.length === 0) {
    return (
      <Card>
        <h3 className="font-semibold text-foreground mb-4">Recent Scans</h3>
        <p className="text-muted text-sm text-center py-8">No scans yet. Go to Detect Crack to start.</p>
      </Card>
    );
  }

  return (
    <Card padding={false}>
      <div className="px-6 pt-6 pb-3">
        <h3 className="font-semibold text-foreground">Recent Scans</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-border text-left text-muted">
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-6 py-3 font-medium">Result</th>
              <th className="px-6 py-3 font-medium text-right">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {scans.slice(0, 20).map((scan) => {
              const isCrack = scan.label === 'Positive';
              return (
                <tr key={scan.id} className="border-t border-border hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-3 text-muted">
                    {new Date(scan.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isCrack ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isCrack ? 'bg-red-500' : 'bg-green-500'}`} />
                      {isCrack ? 'Crack' : 'Clean'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-foreground">
                    {scan.confidence}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
