import { useEffect, useRef, useState } from 'react';

const ACCEPT = ['image/png', 'image/jpeg', 'image/webp'];
const MAX = 5 * 1024 * 1024;
const SAMPLES = [
  { label: 'Sample Parasitized', url: '/samples/parasitized.png', tone: 'from-rose-300 to-rose-500' },
  { label: 'Sample Uninfected', url: '/samples/uninfected.png', tone: 'from-emerald-200 to-emerald-400' },
];

export default function UploadPanel({ onAnalyze, loading, error, setError, disabled }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [drag, setDrag] = useState(false);
  const input = useRef(null);

  useEffect(() => {
    if (!file) return setPreview('');
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const pick = (f) => {
    if (!f) return;
    if (!ACCEPT.includes(f.type)) return setError('Format tidak didukung. Gunakan PNG, JPG, JPEG, atau WEBP.');
    if (f.size > MAX) return setError(`Ukuran file ${(f.size / 1048576).toFixed(1)} MB melebihi batas 5 MB.`);
    setError(''); setFile(f);
  };

  const runSample = async (s) => {
    setError('');
    try {
      const r = await fetch(s.url);
      const blob = await r.blob();
      if (!r.ok || !blob.type.startsWith('image/')) throw new Error();
      const f = new File([blob], s.url.split('/').pop(), { type: blob.type });
      setFile(f);
      onAnalyze(f);
    } catch {
      setError(`File sampel belum tersedia. Letakkan gambar di public${s.url} lalu coba lagi.`);
    }
  };

  return (
    <section className="glass rounded-[2rem] p-6">
      <h2 className="mb-4 text-lg font-bold">Unggah citra sel darah</h2>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); }}
        className={`grid min-h-[210px] place-items-center rounded-3xl border-2 border-dashed p-4 text-center transition ${drag ? 'border-indigo-500 bg-indigo-50/70' : 'border-slate-300/80 bg-white/40'}`}
      >
        {preview ? (
          <div className="flex flex-col items-center gap-2">
            <img src={preview} alt="Pratinjau citra yang dipilih" className="h-36 w-36 rounded-2xl object-cover shadow" />
            <p className="max-w-[16rem] truncate text-sm text-slate-600">{file.name}</p>
            <button className="text-sm font-semibold text-indigo-600 underline" onClick={() => input.current.click()}>Ganti gambar</button>
          </div>
        ) : (
          <div>
            <p className="font-semibold">Seret gambar ke sini, atau <button className="text-indigo-600 underline" onClick={() => input.current.click()}>pilih file</button></p>
            <p className="mt-1 text-xs text-slate-500">PNG, JPG, JPEG, WEBP · maksimal 5 MB</p>
          </div>
        )}
        <input ref={input} type="file" hidden accept=".png,.jpg,.jpeg,.webp" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
      </div>

      <p className="mb-2 mt-5 text-sm font-semibold text-slate-600">Coba dengan sampel</p>
      <div className="grid grid-cols-2 gap-3">
        {SAMPLES.map((s) => (
          <button key={s.url} className="tile flex items-center gap-3 p-3 text-left text-sm font-semibold transition hover:bg-white disabled:opacity-50" disabled={loading || disabled} onClick={() => runSample(s)}>
            <span className={`h-9 w-9 shrink-0 rounded-full bg-gradient-to-br ${s.tone}`} />
            {s.label}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      <button
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 py-3.5 font-bold text-white shadow-lg transition disabled:opacity-50"
        disabled={!file || loading || disabled}
        onClick={() => onAnalyze(file)}
      >
        {loading ? 'Menganalisis…' : 'Run Detection'}
      </button>
      {disabled && <p className="mt-2 text-xs text-slate-500">Backend tidak terjangkau, jalankan FastAPI terlebih dahulu.</p>}
    </section>
  );
}
