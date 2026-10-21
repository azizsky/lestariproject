"use client";

import React from "react";

interface LoveStoryItem {
  tahun?: string;
  year?: string;
  date?: string;

  judul?: string;
  title?: string;

  deskripsi?: string;
  story?: string;
  cerita?: string;
  description?: string;
}

export default function LoveStorySection({
  stories,
  className = "",
}: {
  stories: LoveStoryItem[];
  className?: string;
}) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className={`py-16 px-4 max-w-2xl mx-auto text-center font-sans ${className}`}>
      {/* HEADER SECTION */}
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold block mb-1">
        Kisah Kami
      </span>
      <h2 className="text-3xl sm:text-4xl font-serif text-amber-100 font-bold mb-10">
        Love Story
      </h2>

      {/* DAFTAR KISAH */}
      <div className="space-y-6">
        {stories.map((item, index) => {
          // Mapping dinamis agar mendukung "tahun", "judul", dan "deskripsi" dari JSON kamu
          const displayTahun = item.tahun || item.year || item.date || "";
          const displayJudul = item.judul || item.title || "";
          const displayDeskripsi =
            item.deskripsi || item.story || item.cerita || item.description || "";

          return (
            <div
              key={index}
              className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-left space-y-2 relative overflow-hidden backdrop-blur-sm shadow-lg"
            >
              {/* BADGE TAHUN */}
              {displayTahun && (
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  {displayTahun}
                </span>
              )}

              {/* JUDUL MOMEN */}
              {displayJudul && (
                <h3 className="text-base font-serif font-bold text-amber-100 pt-1">
                  {displayJudul}
                </h3>
              )}

              {/* ISI CERITA */}
              {displayDeskripsi && (
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                  "{displayDeskripsi}"
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}