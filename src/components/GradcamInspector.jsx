import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { toDataUrl } from '../services/api.js';
import { downloadGradcam, exportJson } from '../utils/export.js';

const MODES = [['overlay', 'Overlay'], ['side', 'Side-by-Side'], ['original', 'Original Only']];

export default function GradcamInspector({ item }) {
  const [mode, setMode] = useState('overlay');
  const [opacity, setOpacity] = useState(70);
  const stage = useRef(null);

  useEffect(() => {
    if (!item || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => gsap.fromTo('[data-img]', { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.4, clearProps: 'opacity,transform' }), stage);
    return () => ctx.revert();
  }, [item?.id, mode]);

  if (!item) {
    return (
      <section className="glass rounded-[2rem] p-6">
        <h2 className="text-lg font-bold">Grad-CAM Inspector</h2>
        <p className="mt-2 text-sm text-slate-500">Peta aktivasi akan tampil di sini setelah ada hasil analisis.</p>
      </section>
    );
  }
  const cam = toDataUrl(item.result.gradcam_base64);
  const Img = ({ src, alt, style }) => <img data-img src={src} alt={alt} style={style} className="h-full w-full rounded-2xl object-contain" />;

  return (
    <section className="glass rounded-[2rem] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Grad-CAM Inspector</h2>
        <div role="tablist" className="tile flex p-1 text-sm font-semibold">
          {MODES.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={mode === k} onClick={() => setMode(k)} className={`rounded-xl px-3 py-1.5 ${mode === k ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div ref={stage} className="tile mt-4 p-4">
        {mode === 'side' ? (
          <div className="grid grid-cols-2 gap-3">
            <figure><div className="aspect-square"><Img src={item.previewUrl} alt="Citra asli" /></div><figcaption className="mt-1 text-center text-xs text-slate-500">Asli</figcaption></figure>
            <figure><div className="aspect-square"><Img src={cam} alt="Grad-CAM" /></div><figcaption className="mt-1 text-center text-xs text-slate-500">Grad-CAM</figcaption></figure>
          </div>
        ) : (
          <div className="relative mx-auto aspect-square max-w-sm">
            <Img src={item.previewUrl} alt="Citra asli" />
            {mode === 'overlay' && <img src={cam} alt="Lapisan Grad-CAM" className="absolute inset-0 h-full w-full rounded-2xl object-contain" style={{ opacity: opacity / 100 }} />}
          </div>
        )}
      </div>

      <label className={`mt-4 block ${mode === 'overlay' ? '' : 'opacity-40'}`}>
        <span className="flex justify-between text-sm font-semibold"><span>Opacity Grad-CAM</span><span>{opacity}%</span></span>
        <input type="range" min="0" max="100" value={opacity} disabled={mode !== 'overlay'} onChange={(e) => setOpacity(+e.target.value)} className="mt-1 w-full" />
      </label>

      <div className="mt-4 flex flex-wrap gap-3">
        <button className="btn" onClick={() => downloadGradcam(item)}>Download Grad-CAM (PNG)</button>
        <button className="btn" onClick={() => exportJson(item)}>Export JSON</button>
      </div>
    </section>
  );
}
