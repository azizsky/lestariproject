"use client";

import React, { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: string; // Format ISO string atau 'YYYY-MM-DD'
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hari: 0,
    jam: 0,
    menit: 0,
    detik: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
          jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
          menit: Math.floor((difference / 1000 / 60) % 60),
          detik: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-4 text-center my-6">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl min-w-[70px]">
          <div className="text-2xl font-bold text-amber-400">{value}</div>
          <div className="text-xs uppercase tracking-wider text-zinc-400 mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}