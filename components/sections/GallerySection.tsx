"use client";

import React from "react";

interface GallerySectionProps {
  photos: string[];
  className?: string;
}

export default function GallerySection({ photos, className = "" }: GallerySectionProps) {
  if (!photos || photos.length === 0) return null;

  return (
    <section className={`py-20 max-w-5xl mx-auto px-4 font-sans ${className}`}>
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-widest opacity-75 mb-2">Galeri</p>
        <h2 className="text-3xl md:text-4xl font-bold">Kenangan Manis</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((foto, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-white/10">
            <img
              src={foto}
              alt={`Galeri ${index + 1}`}
              className="w-full h-56 md:h-64 object-cover hover:scale-105 transition duration-500"
            />
          </div>
        ))}
      </div>
    </section>
  );
}