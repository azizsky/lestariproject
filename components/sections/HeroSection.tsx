"use client";

import React from "react";

interface HeroSectionProps {
  namaPria: string;
  namaWanita: string;
  tanggal: string;
  coverFoto?: string;
  className?: string;
}

export default function HeroSection({
  namaPria,
  namaWanita,
  tanggal,
  coverFoto,
  className = "",
}: HeroSectionProps) {
  return (
    <section className={`relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden ${className}`}>
      {coverFoto && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 scale-105"
          style={{ backgroundImage: `url(${coverFoto})` }}
        />
      )}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-2xl space-y-4">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] opacity-80">
          The Wedding Celebration Of
        </p>

        <h1 className="text-5xl md:text-7xl font-bold tracking-wide my-4 leading-tight">
          {namaPria} <span className="font-light">&</span> {namaWanita}
        </h1>

        <p className="text-sm md:text-base uppercase tracking-widest opacity-90 font-sans">
          {tanggal}
        </p>
      </div>
    </section>
  );
}