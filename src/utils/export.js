import { toDataUrl } from '../services/api.js';

function save(href, filename) {
  const a = document.createElement('a');
  a.href = href; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
}
const base = (name) => name.replace(/\.[^.]+$/, '');

export function downloadGradcam(item) {
  save(toDataUrl(item.result.gradcam_base64), `${base(item.name)}_gradcam.png`);
}

export function exportJson(item) {
  const { gradcam_base64, ...rest } = item.result;
  const payload = { file: item.name, analyzed_at: item.time.toISOString(), ...rest, gradcam_included: false };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  save(url, `${base(item.name)}_result.json`);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
