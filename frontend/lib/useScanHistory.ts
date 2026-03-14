'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ScanRecord } from './types';

const STORAGE_KEY = 'krakai_scan_history';
const MAX_RECORDS = 100;

function readHistory(): ScanRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeHistory(records: ScanRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)));
}

export function useScanHistory() {
  const [history, setHistory] = useState<ScanRecord[]>([]);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  const addScan = useCallback((record: Omit<ScanRecord, 'id' | 'timestamp'>) => {
    const newRecord: ScanRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setHistory(prev => {
      const updated = [newRecord, ...prev].slice(0, MAX_RECORDS);
      writeHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addScan, clearHistory };
}
