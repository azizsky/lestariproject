"use client";

import React from "react";

interface QuoteSectionProps {
  quote?: string;
  className?: string;
}

export default function QuoteSection({ quote, className = "" }: QuoteSectionProps) {
  const defaultQuote =
    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)";

  return (
    <section className={`py-12 max-w-2xl mx-auto px-6 text-center ${className}`}>
      <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <p className="text-sm md:text-base italic leading-relaxed opacity-90">
          "{quote || defaultQuote}"
        </p>
      </div>
    </section>
  );
}