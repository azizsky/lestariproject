'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from "@/components/common/navbar";

interface SongItem {
  key?: string;
  url?: string;
  filename?: string;
  title?: string;
  size?: number;
}

export default function MusicPage() {
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // 0 sampai 100%

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const res = await fetch('/api/admin/preset-music');
        const json = await res.json();
        if (json.success) {
          setSongs(json.songs || json.data || []);
        } else {
          setError(json.message || 'Gagal memuat daftar lagu.');
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan koneksi.');
      } finally {
        setLoading(false);
      }
    }
    fetchSongs();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update progress bar melingkar seiring durasi audio berjalan
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        const currentProgress = (audio.currentTime / audio.duration) * 100;
        setProgress(currentProgress);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [playingId]);

  const togglePlay = (song: SongItem, identifier: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    if (playingId === identifier) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    let rawUrl = song.url || (song.key ? `https://assets.lestariproject.my.id/${song.key}` : '');
    if (!rawUrl) {
      alert("URL audio tidak valid.");
      return;
    }

    let audioUrl = rawUrl;
    if (audioUrl.startsWith('//')) {
      audioUrl = `https:${audioUrl}`;
    } else if (!audioUrl.startsWith('http://') && !audioUrl.startsWith('https://')) {
      audioUrl = `https://${audioUrl}`;
    }

    audio.src = audioUrl;
    audio.load();
    setProgress(0);

    audio.play()
      .then(() => {
        setPlayingId(identifier);
      })
      .catch((err) => {
        console.error("Gagal memutar audio:", err);
        alert(`Gagal memutar audio:\n${audioUrl}`);
        setPlayingId(null);
      });

    audio.onended = () => {
      setPlayingId(null);
      setProgress(0);
    };
  };

  // Keliling lingkaran SVG (2 * PI * r = 2 * 3.14159 * 44 = 276.46)
  const CIRCUMFERENCE = 276.46;
  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100;

  return (
    <div className="w-full min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-28 pb-16 px-3 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center mb-10">
          <span className="bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-semibold px-3.5 py-1 rounded-full border border-purple-200 dark:border-purple-800/60 shadow-xs">
            Koleksi Musik Latar 🎵
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Pilih Musik Romantis Undangan
          </h1>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Putar turntable piringan hitam di bawah ini untuk pratinjau musik latar undangan digital.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-300 dark:border-slate-800 shadow-md animate-pulse h-64 flex items-center justify-center">
                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 text-red-500 text-sm font-medium">
            Gagal memuat musik: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && songs.length === 0 && (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm">
            Belum ada file musik preset yang diunggah di database R2.
          </div>
        )}

        {/* Grid List Turntable (2 Kolom di HP, 4 Kolom di Laptop) */}
        {!loading && !error && songs.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
            {songs.map((song, index) => {
              const songKey = song.key || song.url || `song-${index}`;
              const isPlaying = playingId === songKey;
              const titleName = song.title || song.filename || songKey.replace("preset-music/", "");

              return (
                <div
                  key={songKey}
                  className={`relative bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 shadow-xl border-2 transition-all duration-500 flex flex-col justify-between ${
                    isPlaying 
                      ? 'border-indigo-600 shadow-[0_0_30px_rgba(79,70,229,0.4)] dark:shadow-[0_0_40px_rgba(79,70,229,0.6)] -translate-y-1' 
                      : 'border-slate-300 dark:border-slate-800'
                  }`}
                >
                  {/* Header Kartu: Judul Lagu */}
                  <div className="flex items-center justify-between mb-2 z-10">
                    <div className="overflow-hidden pr-1">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        Turntable Pro
                      </span>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate" title={titleName}>
                        {titleName.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}
                      </h3>
                    </div>
                    {isPlaying && (
                      <span className="bg-indigo-600 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse shadow-xs shrink-0">
                        Playing 🎶
                      </span>
                    )}
                  </div>

                  {/* ---------------- TURNTABLE BODY ---------------- */}
                  <div className="relative w-full bg-slate-200 dark:bg-slate-800 rounded-2xl p-3 border border-slate-300 dark:border-slate-700 shadow-inner flex flex-col items-center justify-center my-1 z-10 overflow-hidden">
                    
                    {/* Tombol Power di Kiri Atas */}
                    <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-600 shadow-inner flex items-center justify-center z-20">
                      <div className={`w-1 h-1 rounded-full ${isPlaying ? 'bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,1)]' : 'bg-slate-600'}`}></div>
                    </div>

                    {/* Area Utama Piringan Hitam */}
                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center my-1">
                      
                      {/* SVG Progress Ring Biru (Indikator Durasi Waktu Lagu) */}
                      <svg className="absolute inset-0 w-full h-full rotate-90 z-0 pointer-events-none" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-slate-300 dark:text-slate-700/60"
                        />
                        {isPlaying && (
                          <circle
                            cx="50"
                            cy="50"
                            r="44"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3.5"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />
                        )}
                      </svg>

                      {/* Piringan Hitam Vinyl dengan Pantulan Cahaya Putih Ganda di Pinggir */}
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center z-10">
                        <div className={`relative w-full h-full rounded-full bg-slate-950 border-3 border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden ${
                          isPlaying ? 'animate-spin duration-[3000ms]' : ''
                        }`}>
                          {/* Detail Alur Garis Piringan (Grooves) */}
                          <div className="absolute inset-1 rounded-full border border-dashed border-slate-800 opacity-80"></div>
                          <div className="absolute inset-2.5 rounded-full border border-slate-800"></div>
                          <div className="absolute inset-4 rounded-full border border-slate-800/90"></div>
                          <div className="absolute inset-6 rounded-full border border-slate-800"></div>
                          <div className="absolute inset-8 rounded-full border border-slate-800/90"></div>
                          <div className="absolute inset-10 rounded-full border border-slate-800"></div>

                          {/* Kilau Putih Melengkung Utama di Kiri Atas */}
                          <div className="absolute -top-10 -left-10 w-24 h-24 bg-gradient-to-br from-white/40 via-white/10 to-transparent rounded-full rotate-45 pointer-events-none"></div>
                          
                          {/* Kilau Putih Aksara di Sisi Pinggir Kanan Bawah */}
                          <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-tl from-white/30 via-white/5 to-transparent rounded-full rotate-45 pointer-events-none"></div>
                          
                          {/* Label Tengah Vinyl (Gold/Krem Klasik) */}
                          <div className="w-9 h-9 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center shadow-inner z-10">
                            <div className="w-2 h-2 rounded-full bg-slate-950 border border-white"></div>
                          </div>
                        </div>
                      </div>

                      {/* Lengan Pemutar (Tonearm Melengkung Siku) */}
                      <div className="absolute right-0 top-0 z-20 flex flex-col items-center pointer-events-none">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-400 shadow-md flex items-center justify-center relative">
                          <svg 
                            className={`absolute -top-1 -left-10 w-16 h-28 transition-transform duration-700 origin-top-right ${
                              isPlaying ? 'rotate-[-4deg]' : '-rotate-[20deg]'
                            }`}
                            viewBox="0 0 60 100" 
                            fill="none"
                          >
                            <path 
                              d="M 50 5 L 45 45 L 22 75" 
                              stroke="#cbd5e1" 
                              strokeWidth="3.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                            <rect 
                              x="17" 
                              y="72" 
                              width="7" 
                              height="10" 
                              rx="1" 
                              fill="#0f172a" 
                              stroke="#64748b" 
                              strokeWidth="1"
                            />
                          </svg>
                        </div>
                      </div>

                    </div>

                    {/* Baris Bawah: Fader Volume & Indikator Titik Kanan Bawah */}
                    <div className="w-full flex items-center justify-between px-1 mt-1 z-20">
                      <div className="flex items-center gap-1.5 bg-slate-300 dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-400 dark:border-slate-700 shadow-inner">
                        <span className="text-[7px] font-bold text-slate-500">VOL</span>
                        <div className="relative w-10 h-1.5 bg-slate-400 dark:bg-slate-800 rounded-full flex items-center">
                          <div className={`absolute w-2.5 h-2.5 bg-blue-600 rounded-full shadow-sm transition-all duration-500 ${
                            isPlaying ? 'right-1' : 'left-1'
                          }`}></div>
                        </div>
                      </div>

                      {/* 2 Titik Indikator Kanan Bawah */}
                      <div className="flex gap-1.5 items-center">
                        {/* Titik Kiri: Nyala Biru jika Stop (!isPlaying), Mati (Gelap) jika Play */}
                        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          !isPlaying ? 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]' : 'bg-slate-700 dark:bg-slate-900'
                        }`}></div>

                        {/* Titik Kanan: Nyala Indigo jika Play (isPlaying), Mati (Gelap) jika Stop */}
                        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          isPlaying ? 'bg-indigo-600 shadow-[0_0_6px_rgba(79,70,229,0.8)] animate-pulse' : 'bg-slate-700 dark:bg-slate-900'
                        }`}></div>
                      </div>
                    </div>

                  </div>
                  {/* ---------------- END TURNTABLE BODY ---------------- */}

                  {/* Footer Kartu: Tombol Play / Stop */}
                  <div className="mt-2.5 z-10">
                    <button
                      onClick={() => togglePlay(song, songKey)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 ${
                        isPlaying
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                          <span>Hentikan Musik</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span>Putar Musik 🎧</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}