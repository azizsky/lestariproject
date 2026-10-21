"use client";

import React from "react";

interface EventDetailSectionProps {
  tanggalAkad?: string;
  tanggalResepsi?: string;
  lokasiAkad?: string;
  lokasiResepsi?: string;
  className?: string;
}

export default function EventDetailSection({
  tanggalAkad,
  tanggalResepsi,
  lokasiAkad,
  lokasiResepsi,
  className = "",
}: EventDetailSectionProps) {
  return (
    <section className={`py-20 max-w-4xl mx-auto px-4 font-sans ${className}`}>
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-widest opacity-75 mb-2">Rangkaian Acara</p>
        <h2 className="text-3xl md:text-4xl font-bold">Waktu & Tempat</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {tanggalAkad && (
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center space-y-3">
            <span className="text-3xl">💍</span>
            <h3 className="text-2xl font-bold">Akad Nikah</h3>
            <p className="text-sm opacity-90">{tanggalAkad}</p>
            {lokasiAkad && <p className="text-xs opacity-75 leading-relaxed">{lokasiAkad}</p>}
          </div>
        )}

        {tanggalResepsi && (
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center space-y-3">
            <span className="text-3xl">🥂</span>
            <h3 className="text-2xl font-bold">Resepsi</h3>
            <p className="text-sm opacity-90">{tanggalResepsi}</p>
            {lokasiResepsi && <p className="text-xs opacity-75 leading-relaxed">{lokasiResepsi}</p>}
          </div>
        )}
      </div>
    </section>
  );
}