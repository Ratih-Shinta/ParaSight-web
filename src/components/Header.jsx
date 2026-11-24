const STATUS = {
  checking: { dot: 'bg-slate-400', text: 'Memeriksa backend…' },
  ready: { dot: 'bg-emerald-500', text: 'Backend terhubung · model siap' },
  'no-model': { dot: 'bg-amber-500', text: 'Backend terhubung · model belum dimuat' },
  down: { dot: 'bg-rose-500', text: 'Backend tidak terjangkau' },
};

export default function Header({ health }) {
  const s = STATUS[health.state];
  return (
    <header className="glass flex flex-wrap items-center justify-between gap-4 rounded-[2rem] px-6 py-5">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-indigo-500 text-xl font-extrabold text-white">M</div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">ParaSight </h1>
          <p className="text-sm text-slate-500">Deteksi malaria pada citra sel darah dengan penjelasan Grad-CAM</p>
        </div>
      </div>
      <div role="status" className="tile flex items-center gap-2 px-4 py-2 text-sm font-medium">
        <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
        {s.text}
      </div>
    </header>
  );
}
