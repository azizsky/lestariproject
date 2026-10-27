'use client';
import Navbar from "@/components/common/navbar";
import { useState, useEffect } from 'react';

interface PackageItem {
  id: string;
  nama_paket: string;
  harga: number;
  deskripsi: string;
  fitur: string;
}

export default function PaketPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch('/api/admin/packages');
        const json = await res.json();
        if (json.success) {
          setPackages(json.data || json.packages || []);
        } else {
          setError(json.message || 'Gagal memuat data paket.');
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan koneksi.');
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  // Format angka ke mata uang Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Fungsi helper untuk menentukan tema warna berdasarkan tipe/id paket
  const getPackageTheme = (id: string, index: number) => {
    const key = id.toLowerCase();
    if (key.includes('basic') || index === 0) {
      return {
        badgeColor: 'text-blue-500 dark:text-blue-400',
        borderColor: 'border-blue-500/40 dark:border-blue-500/40',
        ringColor: 'ring-blue-500/20',
        buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
        isFeatured: false,
      };
    } else if (key.includes('premium') || index === 1) {
      return {
        badgeColor: 'text-emerald-500 dark:text-emerald-400',
        borderColor: 'border-emerald-500 dark:border-emerald-400',
        ringColor: 'ring-emerald-500/20',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        isFeatured: true, // Paket populer (Hijau)
      };
    } else {
      // Exclusive atau lainnya
      return {
        badgeColor: 'text-purple-500 dark:text-purple-400',
        borderColor: 'border-purple-500/40 dark:border-purple-500/40',
        ringColor: 'ring-purple-500/20',
        buttonBg: 'bg-purple-600 hover:bg-purple-700 text-white',
        isFeatured: false,
      };
    }
  };

  return (
    <main className="w-full min-h-screen pt-24 pb-16 px-4 sm:px-6 bg-zinc-200 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/60 shadow-xs">
            Daftar Paket 💍
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Pilihan Paket Undangan Digital
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Pilih paket web undangan digital terbaik dari Lestari Project sesuai kebutuhan acara spesial Anda.
          </p>
        </div>

        {/* Loading State dengan Skeleton Card */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse flex flex-col justify-between h-[450px]"
              >
                <div>
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded mx-auto mb-4"></div>
                  <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded mx-auto mb-6"></div>
                  <div className="h-10 w-40 bg-slate-200 dark:bg-slate-800 rounded mx-auto mb-6"></div>
                  <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
                <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 text-red-500 text-sm font-medium">
            Gagal memuat paket: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && packages.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
            Belum ada data paket yang tersedia di database.
          </div>
        )}

        {/* Grid Card Berjajar dengan Aksen Warna (Biru, Hijau, Ungu) */}
        {!loading && !error && packages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {packages.map((pkg, index) => {
              const theme = getPackageTheme(pkg.id, index);

              return (
                <div
                  key={pkg.id}
                  className={`relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-lg border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                    theme.isFeatured
                      ? `${theme.borderColor} ring-4 ${theme.ringColor} shadow-xl`
                      : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {/* Badge Unggulan untuk Paket Premium */}
                  {theme.isFeatured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Paling Populer 🔥
                    </div>
                  )}

                  <div>
                    {/* Header Card dengan Aksen Warna */}
                    <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800">
                      <div className={`text-xs font-extrabold uppercase tracking-widest mb-1 ${theme.badgeColor}`}>
                        {pkg.id}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white capitalize">
                        {pkg.nama_paket}
                      </h3>

                      {/* Harga Besar */}
                      <div className="mt-4">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                          {formatRupiah(pkg.harga)}
                        </span>
                      </div>
                    </div>

                    {/* Deskripsi Singkat */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 my-5 text-center font-medium">
                      {pkg.deskripsi}
                    </p>

                    {/* Daftar Fitur (Checklist) */}
                    <div className="space-y-3 mb-8">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Fasilitas Termasuk:
                      </div>
                      {pkg.fitur
                        ? pkg.fitur.split(',').map((fiturItem, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                              <span className={`font-extrabold text-base leading-none ${theme.badgeColor}`}>✓</span>
                              <span className="leading-snug">{fiturItem.trim()}</span>
                            </div>
                          ))
                        : null}
                    </div>
                  </div>

                  {/* Tombol Aksi Pesan via WhatsApp */}
                  <a
                    href={`https://wa.me/6285694936783?text=Halo%20Lestari%20Project,%20saya%20tertarik%20memesan%20${encodeURIComponent(pkg.nama_paket)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full text-center py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer block ${theme.buttonBg}`}
                  >
                    Pilih Paket Ini
                  </a>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}