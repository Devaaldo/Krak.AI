import React, { useState } from 'react';
import { MessageSquare, Send, AlertCircle, BookOpen } from 'lucide-react';
import { askAdvisor } from '../lib/api';
import { renderMarkdown } from '../lib/markdown';

// Panel tanya-jawab grounded (RAG). Bila `detectionContext` diberikan, konteks
// hasil deteksi ikut dikirim supaya jawaban menyesuaikan temuan.
const AdvisorChat = ({ detectionContext }) => {
  const [messages, setMessages] = useState([]); // {role, content, citations?}
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const suggestions = detectionContext
    ? ['Apa kemungkinan penyebabnya?', 'Seberapa parah ini?', 'Bagaimana cara perbaikannya?']
    : ['Apa saja jenis retak beton?', 'Kapan harus memanggil insinyur?'];

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput('');
    setError(null);
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const data = await askAdvisor(q, detectionContext);
      setMessages((m) => [...m, { role: 'assistant', content: data.answer, citations: data.citations }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.75rem', overflow: 'hidden' }}>
      <div style={{
        padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 500
      }}>
        <MessageSquare size={15} /> Crack Advisor
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
          · jawaban grounded ke knowledge base
        </span>
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Tanya apa pun soal retak yang terdeteksi — penyebab, keparahan, atau cara perbaikan.
          </p>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              background: m.role === 'user' ? '#2563eb' : 'var(--bg-alt)',
              color: m.role === 'user' ? 'white' : 'var(--text-main)',
              borderRadius: '0.75rem', padding: '0.6rem 0.85rem', fontSize: '0.85rem', lineHeight: 1.5
            }}>
              {m.role === 'assistant'
                ? <span dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
                : m.content}
            </div>
            {m.citations && m.citations.length > 0 && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {m.citations.map((c, j) => (
                  <span key={j} title={c.snippet} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                    fontSize: '0.68rem', color: 'var(--text-muted)',
                    background: 'var(--bg-alt)', border: '1px solid var(--border-color)',
                    borderRadius: '999px', padding: '0.1rem 0.5rem'
                  }}>
                    <BookOpen size={11} /> {c.source}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Menjawab…</p>
        )}
        {error && (
          <div style={{ color: '#dc2626', fontSize: '0.8rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {messages.length === 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} disabled={loading} style={{
                fontSize: '0.75rem', color: 'var(--text-main)', cursor: 'pointer',
                background: 'var(--bg-alt)', border: '1px solid var(--border-color)',
                borderRadius: '999px', padding: '0.25rem 0.6rem'
              }}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            placeholder="Tulis pertanyaan…"
            style={{
              flex: 1, padding: '0.55rem 0.75rem', fontSize: '0.85rem',
              border: '1px solid var(--border-color)', borderRadius: '0.5rem',
              background: 'var(--bg-color)', color: 'var(--text-main)'
            }}
          />
          <button className="button-primary" onClick={() => send()} disabled={loading || !input.trim()}
            style={{ padding: '0.55rem 0.8rem' }}>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvisorChat;
