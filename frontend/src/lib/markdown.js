// Renderer Markdown minimal & tanpa dependency. Cukup untuk laporan LLM
// (heading, bold, italic, code inline, list, paragraf). Konten di-escape dulu
// supaya aman dipakai dengan dangerouslySetInnerHTML.
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(t) {
  return t
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

export function renderMarkdown(md) {
  const lines = escapeHtml(md || '').split('\n');
  let html = '';
  let inList = false;
  const closeList = () => {
    if (inList) {
      html += '</ul>';
      inList = false;
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      closeList();
      continue;
    }
    if (line.startsWith('### ')) {
      closeList();
      html += `<h4>${inline(line.slice(4))}</h4>`;
    } else if (line.startsWith('## ')) {
      closeList();
      html += `<h3>${inline(line.slice(3))}</h3>`;
    } else if (line.startsWith('# ')) {
      closeList();
      html += `<h2>${inline(line.slice(2))}</h2>`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${inline(line.slice(2))}</li>`;
    } else {
      closeList();
      html += `<p>${inline(line)}</p>`;
    }
  }
  closeList();
  return html;
}
