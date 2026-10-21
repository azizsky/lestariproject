"use client";

import React from "react";
import Countdown from "@/components/features/Countdown";

interface CountdownSectionProps {
  targetDate: string;
  className?: string;
}

export default function CountdownSection({ targetDate, className = "" }: CountdownSectionProps) {
  return (
    <section className={`py-16 max-w-2xl mx-auto px-4 text-center font-sans ${className}`}>
      <p className="text-xs uppercase tracking-widest opacity-75 mb-2">Save The Date</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-6">Hitung Mundur Acara</h2>
      <Countdown targetDate={targetDate} />
    </section>
  );
}