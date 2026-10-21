"use client";

import React from "react";

interface VideoSectionProps {
  videoUrl: string;
  className?: string;
}

export default function VideoSection({ videoUrl, className = "" }: VideoSectionProps) {
  if (!videoUrl) return null;

  return (
    <section className={`py-20 max-w-4xl mx-auto px-4 font-sans ${className}`}>
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest opacity-75 mb-2">Video Teaser</p>
        <h2 className="text-3xl md:text-4xl font-bold">Momen Bahagia</h2>
      </div>

      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <iframe
          src={videoUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}