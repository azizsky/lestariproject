"use client";

import React, { useState, useEffect, useRef } from "react";

interface AudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
}

export default function AudioPlayer({ audioUrl, autoPlay = true }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl && autoPlay) {
      // Coba putar otomatis
      const playPromise = audioRef.current?.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.log("Autoplay diblokir browser, menunggu interaksi user:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [audioUrl, autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!audioUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />
      
      {/* Tombol Melayang (Floating Button) Musik */}
      <button
        onClick={togglePlay}
        aria-label="Toggle Audio"
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-amber-500/80 text-zinc-950 shadow-lg backdrop-blur-sm border border-amber-300 hover:scale-110 transition-transform flex items-center justify-center"
      >
        {isPlaying ? (
          // Ikon Music / Playing (Spinning)
          <span className="animate-spin text-lg">🎵</span>
        ) : (
          // Ikon Mute / Paused
          <span className="text-lg">🔇</span>
        )}
      </button>
    </>
  );
}