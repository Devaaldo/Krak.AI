// Helper terpusat untuk memanggil backend Krak.AI (CV + GenAI).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function errMsg(res) {
  try {
    const data = await res.json();
    if (res.status === 503) {
      return data.detail || 'Fitur AI belum dikonfigurasi di server (GEMINI_API_KEY).';
    }
    return data.detail || `Server error: ${res.status}`;
  } catch {
    return `Server error: ${res.status}`;
  }
}

export async function predictImage(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_URL}/predict`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(await errMsg(res));
  return res.json();
}

export async function askAdvisor(question, detectionContext) {
  const res = await fetch(`${API_URL}/advisor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, detection_context: detectionContext || null }),
  });
  if (!res.ok) throw new Error(await errMsg(res));
  return res.json();
}

export async function generateReport({ label, confidence, metadata }) {
  const res = await fetch(`${API_URL}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label, confidence, metadata: metadata || null }),
  });
  if (!res.ok) throw new Error(await errMsg(res));
  return res.json();
}

export async function runAgent({ message, file, history }) {
  const form = new FormData();
  form.append('message', message);
  form.append('history', JSON.stringify(history || []));
  if (file) form.append('file', file);
  const res = await fetch(`${API_URL}/agent`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(await errMsg(res));
  return res.json();
}

export { API_URL };
