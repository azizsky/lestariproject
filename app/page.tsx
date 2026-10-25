import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center">
        <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border border-indigo-200 dark:border-indigo-800">
          Lestari Project Digital Platform ✨
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
          Buat Undangan Digital Elegan & Modern
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl">
          Platform pembuatan undangan web responsif, dilengkapi musik latar, AI Assistant, dan dukungan Dark Mode otomatis sesuai perangkat tamu.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/template"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition text-center"
          >
            Lihat Template Pilihan
          </Link>
          <Link
            href="/paket"
            className="border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 px-8 py-4 rounded-full font-semibold transition text-center text-slate-800 dark:text-slate-200"
          >
            Cek Harga & Paket
          </Link>
        </div>
      </section>
    </main>
  );
}