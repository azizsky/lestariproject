"use client";

import React from "react";

interface CoverOpeningProps {
  namaPria: string;
  namaWanita: string;
  coverFoto?: string;
  onOpen: () => void;
  className?: string;
}

export default function CoverOpening({
  namaPria,
  namaWanita,
  coverFoto,
  onOpen,
  className = "",
}: CoverOpeningProps) {
  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center text-center p-6 ${className}`}>
      {coverFoto && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-all duration-700"
          style={{ backgroundImage: `url(${coverFoto})` }}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-lg w-full p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-md bg-black/40 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.3em] opacity-80 mb-3">
          The Wedding Of
        </p>

        <h1 className="text-4xl md:text-5xl font-bold tracking-wide my-6 leading-tight">
          {namaPria} <span className="font-light">&</span> {namaWanita}
        </h1>

        <p className="text-xs opacity-75 mb-8 leading-relaxed font-sans">
          Kepada Bapak/Ibu/Saudara/i, kami mengundang Anda untuk menghadiri momen bahagia pernikahan kami.
        </p>

        <button
          onClick={onOpen}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-sans font-semibold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          ✉️ Buka Undangan
        </button>
      </div>
    </div>
  );
}