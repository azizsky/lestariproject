"use client";

import React from "react";

interface GreetingSectionProps {
  greetingText?: string;
  className?: string;
}

export default function GreetingSection({
  greetingText = "Assalamu’alaikum Warahmatullahi Wabarakatuh",
  className = "",
}: GreetingSectionProps) {
  return (
    <section className={`py-16 max-w-2xl mx-auto px-6 text-center font-sans ${className}`}>
      <p className="text-lg font-serif mb-3 opacity-90">{greetingText}</p>
      <p className="text-sm md:text-base leading-relaxed opacity-80">
        Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami.
      </p>
    </section>
  );
}