import React, { useState, useRef } from 'react';
import { Bot, Send, ImagePlus, X, AlertCircle, BookOpen } from 'lucide-react';
import { runAgent } from '../lib/api';
import { renderMarkdown } from '../lib/markdown';

// Asisten multimodal (agent): upload gambar (opsional) + tanya bebas.
// Backend menjalankan LangChain agent yang bisa memanggil tool deteksi,
// retrieval pengetahuan, dan penyusun laporan.
const Assistant = () => {
  const [messages, setMessages] = useState([]); // {role, content, image?}
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const pickFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const send = async () => {
    const msg = input.trim();
    if ((!msg && !file) || loading) return;

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const sentFile = file;
    const sentPreview = preview;
    setMessages((m) => [...m, { role: 'user', content: msg || '(menganalisis gambar)', image: sentPreview }]);
    setInput('');
    clearFile();
    setError(null);
    setLoading(true);
    try {
      const data = await runAgent({
        message: msg || 'Tolong analisis gambar ini dan jelaskan kondisinya.',
        file: sentFile,
        history,
      });
      setMessages((m) => [...m, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">AI Assistant</h1>
        <p className="dashboard-desc">
          Asisten multimodal — unggah gambar struktur lalu tanya bebas. Agent akan
          mendeteksi retak, mengambil pengetahuan teknik, dan menyusun jawaban.
        </p>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{
          border: '1px solid var(--border-color)', borderRadius: '0.75rem',
          minHeight: '320px', display: 'flex', flexDirection: 'column'
        }}>
          {/* Pesan */}
          <div style={{ flex: 1, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', margin: 'auto 0' }}>
                <Bot size={32} style={{ opacity: 0.4 }} />
                <p style={{ marginTop: '0.5rem' }}>Mulai dengan mengunggah gambar atau bertanya.</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '0.4rem'
              }}>
                {m.image && (
                  <img src={m.image} alt="upload" style={{
                    width: '160px', borderRadius: '0.5rem', alignSelf: 'flex-end',
                    border: '1px solid var(--border-color)'
                  }} />
                )}
                <div style={{
                  background: m.role === 'user' ? '#2563eb' : 'var(--bg-alt)',
                  color: m.role === 'user' ? 'white' : 'var(--text-main)',
                  borderRadius: '0.75rem', padding: '0.65rem 0.9rem', fontSize: '0.875rem', lineHeight: 1.55
                }}>
                  {m.role === 'assistant'
                    ? <span dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
                    : m.content}
                </div>
              </div>
            ))}

            {loading && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Agent sedang bekerja…</p>}
            {error && (
              <div style={{ color: '#dc2626', fontSize: '0.85rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <AlertCircle size={15} /> {error}
              </div>
            )}
          </div>

          {/* Komposer */}
          <div style={{ borderTop: '1px solid var(--border-color)', padding: '0.85rem' }}>
            {preview && (
              <div style={{ position: 'relative', width: '64px', marginBottom: '0.6rem' }}>
                <img src={preview} alt="preview" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                <button onClick={clearFile} style={{
                  position: 'absolute', top: '-6px', right: '-6px', background: '#111827', color: 'white',
                  border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <X size={12} />
                </button>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="button-outline" onClick={() => fileRef.current?.click()}
                style={{ padding: '0.55rem 0.65rem' }} title="Lampirkan gambar">
                <ImagePlus size={16} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => pickFile(e.target.files[0])} />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                placeholder="Tanya soal retak, minta laporan, dll…"
                style={{
                  flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.875rem',
                  border: '1px solid var(--border-color)', borderRadius: '0.5rem',
                  background: 'var(--bg-color)', color: 'var(--text-main)'
                }}
              />
              <button className="button-primary" onClick={send} disabled={loading || (!input.trim() && !file)}
                style={{ padding: '0.6rem 0.8rem' }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center',
          color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.9rem' }}>
          <BookOpen size={13} /> Jawaban grounded ke knowledge base & model deteksi. Bukan pengganti inspeksi insinyur.
        </p>
      </div>
    </div>
  );
};

export default Assistant;
