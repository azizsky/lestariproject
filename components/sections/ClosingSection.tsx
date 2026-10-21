"use client";

import React from "react";

interface ClosingSectionProps {
  namaPria: string;
  namaWanita: string;
  className?: string;
}

export default function ClosingSection({ namaPria, namaWanita, className = "" }: ClosingSectionProps) {
  return (
    <section className={`py-20 max-w-2xl mx-auto px-4 text-center font-sans ${className}`}>
      <p className="text-sm leading-relaxed mb-8 opacity-80">
        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
      </p>

      <p className="text-xs uppercase tracking-widest opacity-75 mb-2">Kami yang berbahagia</p>
      <h3 className="text-3xl font-bold">
        {namaPria} & {namaWanita}
      </h3>
    </section>
  );
}