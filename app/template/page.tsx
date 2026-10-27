'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/common/navbar";

interface TemplateItem {
  id: string;
  nama_template: string;
  deskripsi: string;
  thumbnail_url: string;
}

export default function TemplatePage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        // Sesuaikan endpoint dengan API admin template kamu
        const res = await fetch('/api/admin/kelolatemplate');
        const json = await res.json();
        if (json.success) {
          setTemplates(json.data || json.templates || []);
        } else {
          setError(json.message || 'Gagal memuat data template.');
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan koneksi.');
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  return (
    <div className="w-full min-h-screen bg-zinc-200 dark:bg-slate-950 transition-colors duration-200">
      {/* Navbar Manual */}
      <Navbar />

      <main className="max-w-6xl mx-auto pt-28 pb-16 px-4 sm:px-6">
        
        {/* Header Title dengan Spacing yang Pas */}
        <div className="text-center mb-12">
          <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/60 shadow-xs">
            Koleksi Tema 🎨
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Pilihan Template Undangan Digital
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Jelajahi berbagai pilihan desain tema undangan digital eksklusif dan elegan untuk hari spesial Anda.
          </p>
        </div>

        {/* Loading State dengan Skeleton Card (2 kolom di HP, 3 di Desktop) */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 items-stretch">
            {[1, 2, 4].map((item) => (
              <div 
                key={item} 
                className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-slate-300 dark:border-slate-800 shadow-md animate-pulse flex flex-col justify-between h-[300px] sm:h-[380px]"
              >
                <div>
                  <div className="w-full h-28 sm:h-48 bg-slate-200 dark:bg-slate-800 rounded-xl sm:rounded-2xl mb-3 sm:mb-4"></div>
                  <div className="h-4 sm:h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                  <div className="h-3 sm:h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="h-8 sm:h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Grid Card Templates (2 kolom di HP, 3 di Desktop) */}
        {!loading && !error && templates.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 items-stretch">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-lg border border-slate-300 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  {/* Thumbnail Gambar Template */}
                  <div className="relative w-full h-28 sm:h-52 bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 border border-slate-200 dark:border-slate-700/60">
                    {tpl.thumbnail_url ? (
                      <img 
                        src={tpl.thumbnail_url} 
                        alt={tpl.nama_template}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400 text-[10px] sm:text-xs font-medium">
                        Pratinjau Tidak Tersedia
                      </div>
                    )}
                  </div>

                  {/* Nama Template */}
                  <h3 className="text-sm sm:text-xl font-black text-slate-900 dark:text-white capitalize tracking-tight mb-1 truncate">
                    {tpl.nama_template}
                  </h3>

                  {/* Deskripsi (line-clamp disesuaikan agar rapi di HP) */}
                  <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 sm:mb-6">
                    {tpl.deskripsi}
                  </p>
                </div>

                {/* Tombol Aksi Preview / Pilih Tema */}
                <a
                  href={`/template/preview/${tpl.id}`}
                  className="w-full text-center py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-bold bg-slate-600 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-white transition-all shadow-md cursor-pointer block"
                >
                  Pratinjau ✨
                </a>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}