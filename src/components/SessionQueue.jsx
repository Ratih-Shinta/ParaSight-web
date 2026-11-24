export default function SessionQueue({ items, activeId, onSelect }) {
  return (
    <section className="glass rounded-[2rem] p-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-bold">Antrean sesi</h2>
        <span className="text-sm text-slate-500">{items.length} dianalisis</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Hasil analisis selama sesi ini akan muncul di sini. Data hilang saat halaman ditutup.</p>
      ) : (
        <ul className="max-h-80 space-y-2 overflow-y-auto">
          {items.map((i) => {
            const bad = i.result.prediction === 'Parasitized';
            return (
              <li key={i.id}>
                <button onClick={() => onSelect(i.id)} aria-current={i.id === activeId} className={`tile box-border flex w-full items-center gap-3 border-2 p-3 text-left ${
                    i.id === activeId
                      ? 'border-indigo-400'
                      : 'border-transparent'
                  }`}>
                  <img src={i.previewUrl} alt="" className="h-11 w-11 rounded-full object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{i.name}</span>
                    <span className="text-xs text-slate-500">{i.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${bad ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {i.result.prediction} ({Number(i.result.confidence).toFixed(1)}%)
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
