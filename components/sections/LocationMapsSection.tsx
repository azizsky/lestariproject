"use client";

import React from "react";

interface LocationMapsSectionProps {
  googleMapsUrl?: string;
  alamatLengkap?: string;
  className?: string;
}

export default function LocationMapsSection({
  googleMapsUrl,
  alamatLengkap,
  className = "",
}: LocationMapsSectionProps) {
  // Jika googleMapsUrl mengandung 'embed', gunakan langsung sebagai src iframe
  const isEmbedUrl = googleMapsUrl?.includes("/maps/embed");
  
  // Jika bukan URL embed (misal link share biasa), buat URL embed fallback menggunakan alamat
  const iframeSrc = isEmbedUrl
    ? googleMapsUrl
    : alamatLengkap
    ? `https://www.google.com/maps?q=${encodeURIComponent(alamatLengkap)}&output=embed`
    : "";

  return (
    <section className={`py-16 max-w-3xl mx-auto px-4 text-center ${className}`}>
      <span className="text-xs uppercase tracking-widest text-amber-400 opacity-80">
        Petunjuk Lokasi
      </span>
      <h2 className="text-3xl font-serif mt-2 mb-4">Peta Lokasi</h2>

      {alamatLengkap && (
        <p className="text-sm opacity-80 mb-6 max-w-lg mx-auto leading-relaxed">
          {alamatLengkap}
        </p>
      )}

      {/* RENDER IFRAME PETA IFRAME */}
      {iframeSrc && (
        <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden border border-amber-500/20 mb-8 shadow-lg">
          <iframe
            title="Peta Lokasi Acara"
            src={iframeSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      )}

      {/* TOMBOL BUKA GOOGLE MAPS */}
      {googleMapsUrl && (
        <a
          href={googleMapsUrl.replace("/maps/embed", "/maps")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-amber-500/40 text-amber-200 text-sm hover:bg-amber-500/10 transition-all"
        >
          📍 Buka di Google Maps
        </a>
      )}
    </section>
  );
}
