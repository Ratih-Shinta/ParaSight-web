import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ResultPanel({ item }) {
  const box = useRef(null);
  const id = item?.id;

  useLayoutEffect(() => {
    if (!id || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-swap]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out' });
      gsap.fromTo('[data-marker]', { left: '50%' }, { left: `${item.result.raw_sigmoid * 100}%`, duration: 0.9, ease: 'power3.out' });
    }, box);
    return () => ctx.revert();
  }, [id]);

  if (!item) {
    return (
      <section className="glass grid min-h-[200px] place-items-center rounded-[2rem] p-8 text-center text-slate-500">
        <p>Belum ada hasil. Unggah citra atau pilih sampel, lalu jalankan deteksi.</p>
      </section>
    );
  }

  const { prediction, confidence, raw_sigmoid, threshold = 0.5 } = item.result;
  const bad = prediction === 'Parasitized';
  const pct = Math.min(100, Math.max(0, raw_sigmoid * 100));

  return (
    <section ref={box} className="glass rounded-[2rem] p-6">
      <div data-swap className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-sm text-slate-500">Hasil klasifikasi · {item.name}</p>
          <h2 className="text-2xl font-extrabold">{bad ? 'Terdeteksi parasit' : 'Tidak terinfeksi'}</h2>
        </div>
        <span className={`rounded-full px-5 py-2 text-sm font-bold text-white ${bad ? 'bg-rose-500' : 'bg-emerald-500'}`}>{prediction}</span>
      </div>

      <div data-swap className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Confidence" value={`${Number(confidence).toFixed(1)}%`} />
        <Stat label="Raw sigmoid" value={Number(raw_sigmoid).toFixed(3)} />
        <Stat label="Threshold" value={Number(threshold).toFixed(2)} />
      </div>

      <div data-swap className="tile mt-4 p-5">
        <div className="relative h-3 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400">
          <span className="absolute -top-1 h-5 w-0.5 bg-slate-800" style={{ left: `${threshold * 100}%` }} title="Threshold" />
          <span data-marker className={`absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow ${bad ? 'bg-rose-600' : 'bg-emerald-600'}`} style={{ left: `${pct}%` }} />
        </div>
        <div className="mt-3 flex justify-between text-xs text-slate-500">
          <span>0.0 Parasitized</span>
          <span>Threshold {Number(threshold).toFixed(2)}</span>
          <span>1.0 Uninfected</span>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Nilai sigmoid {Number(raw_sigmoid).toFixed(3)} berada {raw_sigmoid < threshold ? 'di bawah' : 'di atas atau sama dengan'} threshold, sehingga diklasifikasikan <b>{prediction}</b>.
        </p>
      </div>
    </section>
  );
}

const Stat = ({ label, value }) => (
  <div className="tile p-4">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-extrabold">{value}</p>
  </div>
);
