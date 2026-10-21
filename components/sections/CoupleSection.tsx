"use client";

import React from "react";

interface CoupleSectionProps {
  namaPria: string;
  namaWanita: string;
  ortuaPria?: string;
  ortuaWanita?: string;
  turutMengundang?: string[];
  fotoPria?: string;
  fotoWanita?: string;
  className?: string;
}

export default function CoupleSection({
  namaPria,
  namaWanita,
  ortuaPria,
  ortuaWanita,
  turutMengundang,
  fotoPria,
  fotoWanita,
  className = "",
}: CoupleSectionProps) {
  return (
    <section className={`py-20 max-w-4xl mx-auto px-4 text-center font-sans ${className}`}>
      <p className="text-xs uppercase tracking-widest opacity-75 mb-2">Mempelai</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-12">Pasangan Bahagia</h2>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Pria */}
        <div className="space-y-4 p-6 rounded-2xl border border-white/10 bg-white/5">
          {fotoPria && (
            <img src={fotoPria} alt={namaPria} className="w-36 h-36 rounded-full mx-auto object-cover border-2 border-amber-500/50" />
          )}
          <h3 className="text-2xl font-bold">{namaPria}</h3>
          {ortuaPria && <p className="text-xs opacity-75 leading-relaxed">Putra dari Bapak/Ibu {ortuaPria}</p>}
        </div>

        {/* Wanita */}
        <div className="space-y-4 p-6 rounded-2xl border border-white/10 bg-white/5">
          {fotoWanita && (
            <img src={fotoWanita} alt={namaWanita} className="w-36 h-36 rounded-full mx-auto object-cover border-2 border-amber-500/50" />
          )}
          <h3 className="text-2xl font-bold">{namaWanita}</h3>
          {ortuaWanita && <p className="text-xs opacity-75 leading-relaxed">Putri dari Bapak/Ibu {ortuaWanita}</p>}
        </div>
      </div>

      {/* Turut Mengundang */}
      {turutMengundang && turutMengundang.length > 0 && (
        <div className="mt-12 p-6 rounded-2xl border border-white/10 bg-white/5 max-w-xl mx-auto">
          <h4 className="text-base font-semibold mb-3 opacity-90">Turut Mengundang</h4>
          <ul className="text-xs opacity-75 space-y-1">
            {turutMengundang.map((nama, idx) => (
              <li key={idx}>{nama}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}