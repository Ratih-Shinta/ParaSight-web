const BASE = (import.meta.env.VITE_API_BASE_URL || 'https://parasight-api.ethiodeploy.app').replace(/\/$/, '');

export async function getHealth() {
  const r = await fetch(`${BASE}/health`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export async function predict(file, mode = 'single') {
  const fd = new FormData();
  fd.append('file', file);
  let r;
  try {
    r = await fetch(`${BASE}/predict`, { method: 'POST', body: fd });
  } catch {
    throw new Error('Tidak bisa terhubung ke backend. Pastikan server berjalan di ' + BASE + ' dan CORS mengizinkan origin ini.');
  }
  if (!r.ok) {
    let detail = '';
    try {
      const j = await r.json();
      detail = typeof j.detail === 'string' ? j.detail : JSON.stringify(j.detail ?? j);
    } catch {}
    const kind = r.status >= 500 ? 'Terjadi kesalahan di server' : 'Permintaan ditolak';
    throw new Error(`${kind} (${r.status})${detail ? ': ' + detail : ''}`);
  }
  return r.json();
}

export const toDataUrl = (b64) =>
  !b64 ? '' : b64.startsWith('data:') ? b64 : `data:image/png;base64,${b64}`;
