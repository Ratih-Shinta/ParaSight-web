export default function GuideAndDisclaimer({ disclaimer }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <section className="glass rounded-[2rem] p-6">
        <h2 className="text-lg font-bold">Cara membaca Grad-CAM</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
          <li>Warna hangat (merah, oranye) menandai area yang paling memengaruhi keputusan model; warna dingin berarti pengaruh kecil.</li>
          <li>Pada sel terinfeksi, hasil yang wajar menunjukkan fokus pada bagian dalam sel tempat parasit berada, bukan pada latar atau tepi gambar.</li>
          <li>Jika fokus jatuh pada latar atau artefak pewarnaan, perlakukan prediksi dengan hati-hati.</li>
          <li>Versi ini menganalisis citra sel tunggal (224×224). Pengembangan ke apusan darah multi-sel direncanakan di tahap berikutnya.</li>
        </ul>
      </section>
      <section className="rounded-[2rem] border border-rose-200/80 bg-rose-50/70 p-6 backdrop-blur-lg">
        <h2 className="text-lg font-bold text-rose-800">Bukan diagnosis medis</h2>
        <p className="mt-2 text-sm leading-relaxed text-rose-900/80">
          ParaSight  adalah prototipe alat bantu riset dan edukasi. Hasilnya tidak menggantikan pemeriksaan laboratorium atau diagnosis tenaga medis.
        </p>
        {disclaimer && <p className="mt-3 border-t border-rose-200 pt-3 text-sm italic text-rose-900/80">{disclaimer}</p>}
      </section>
    </div>
  );
}
