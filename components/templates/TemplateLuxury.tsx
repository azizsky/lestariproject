"use client";

import React, { useState, useRef } from "react";
import { WeddingProps, XtraDataProps } from "../types";

// Import Seksi Dasar
import HeroSection from "../sections/HeroSection";
import GreetingSection from "../sections/GreetingSection";
import QuoteSection from "../sections/QuoteSection";
import CoupleSection from "../sections/CoupleSection";
import LoveStorySection from "../sections/LoveStorySection";
import CountdownSection from "../sections/CountdownSection";
import EventDetailSection from "../sections/EventDetailSection";
import VideoSection from "../sections/VideoSection";
import GallerySection from "../sections/GallerySection";
import LocationMapsSection from "../sections/LocationMapsSection";
import ClosingSection from "../sections/ClosingSection";

// Import Fitur Interaktif
import RSVP from "@/components/features/RSVP";
import WeddingGift from "@/components/features/WeddingGift";

// Base URL R2 Bucket Storage
const ASSETS_BASE_URL = "https://assets.zpack.my.id";

function parseJsonSafe(data: any): any {
  if (typeof data !== "string") return data || {};
  try {
    const parsed = JSON.parse(data);
    if (typeof parsed === "string") return parseJsonSafe(parsed);
    return parsed || {};
  } catch {
    return {};
  }
}

// Ornamen Ukiran Emas Halus Khusus 4 Sudut Layar
const GoldCornerSVG = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`text-[#e6ca65]/60 ${className}`}
  >
    <path
      d="M5 5V35C5 20 20 5 35 5H5ZM5 5C25 5 45 25 45 45M5 5C5 25 25 45 45 45M15 15C30 15 40 25 40 40M15 15C15 30 25 40 40 40M55 5C50 20 35 35 20 40M5 55C20 50 35 35 40 20"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="5" cy="5" r="2" fill="currentColor" />
    <circle cx="45" cy="45" r="1.5" fill="currentColor" />
  </svg>
);

// Ornamen Ukiran Filigree Emas Gelap
const DarkGoldFiligree = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`text-amber-700/60 ${className}`}
  >
    <path
      d="M80 10C80 30 60 50 40 50C20 50 10 35 10 20C10 5 30 5 45 15C60 25 70 45 70 70C70 95 50 115 25 115C10 115 5 105 10 95C15 85 30 85 40 95M80 10C80 30 100 50 120 50C140 50 150 35 150 20C150 5 130 5 115 15C100 25 90 45 90 70C90 95 110 115 135 115C150 115 155 105 150 95C145 85 130 85 120 95M80 10V150M80 150C60 130 30 130 15 145M80 150C100 130 130 130 145 145"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="80" cy="10" r="3" fill="currentColor" />
    <circle cx="80" cy="70" r="2.5" fill="currentColor" />
    <path
      d="M30 30C50 10 110 10 130 30M40 130C60 145 100 145 120 130"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeDasharray="2 3"
    />
  </svg>
);

export default function TemplateLuxury({ invitation, xtraData }: WeddingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Ekstrak xtraData
  const rawExtra = xtraData || (invitation as any)?.xtra_data;
  const extra: XtraDataProps = parseJsonSafe(rawExtra);

  // 2. LOGIKA CEK ENABLER FEATURE (Termasuk enableRsvp dari xtraData)
  const isRsvpEnabled = extra?.enableRsvp !== undefined ? Boolean(extra?.enableRsvp) : true;

  // 3. Mapping Nama Mempelai
  const namaPria =
    (invitation as any)?.nama_panggilan_pria ||
    (invitation as any)?.nama_lengkap_pria ||
    (invitation as any)?.nama_pria ||
    extra?.namaPria ||
    "Pengantin Pria";

  const namaWanita =
    (invitation as any)?.nama_panggilan_wanita ||
    (invitation as any)?.nama_lengkap_wanita ||
    (invitation as any)?.nama_wanita ||
    extra?.namaWanita ||
    "Pengantin Wanita";

  // 4. Mapping Tanggal & Lokasi
  const tanggalAcara =
    (invitation as any)?.tanggal_resepsi ||
    (invitation as any)?.tanggal_akad ||
    "2026-10-22";

  const lokasiMaps = (invitation as any)?.lokasi_maps || extra?.googleMapsUrl;
  const alamatLengkap = (invitation as any)?.lokasi_teks || extra?.alamatLengkap;

  // 5. Mapping Orang Tua & Aset
  const ortuaPria = (invitation as any)?.orang_tua_pria || extra?.ortuaPria;
  const ortuaWanita = (invitation as any)?.orang_tua_wanita || extra?.ortuaWanita;

  const coverFoto = extra?.coverFoto || (invitation as any)?.cover_image;
  const accounts = (extra as any)?.rekeningBank || extra?.rekening || [];
  const qrisImageUrl = (extra as any)?.qrisImageUrl;
  const photos = extra?.galeriFoto || [];

  // 6. RESOLVER MUSIK
  const slug = (invitation as any)?.slug || "default";
  const customMusicUrl = (extra as any)?.customMusicUrl;
  const musicOption = (extra as any)?.musicOption;
  const defaultMusicUrl = (invitation as any)?.music_url;

  let musikUrl = "";

  if (customMusicUrl && customMusicUrl.trim() !== "") {
    if (customMusicUrl.startsWith("http://") || customMusicUrl.startsWith("https://")) {
      musikUrl = customMusicUrl;
    } else {
      const cleanPath = customMusicUrl.startsWith("/") ? customMusicUrl : `/${customMusicUrl}`;
      musikUrl = `${ASSETS_BASE_URL}/${slug}${cleanPath}`;
    }
  } else if (musicOption && musicOption.trim() !== "") {
    if (musicOption.startsWith("http://") || musicOption.startsWith("https://")) {
      musikUrl = musicOption;
    } else {
      const cleanPresetName = musicOption.startsWith("/") ? musicOption.slice(1) : musicOption;
      musikUrl = `${ASSETS_BASE_URL}/preset-music/${cleanPresetName}`;
    }
  } else if (defaultMusicUrl) {
    musikUrl = defaultMusicUrl;
  }

  // 7. HANDLER BUKA UNDANGAN & PLAY MUSIK
  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (audioRef.current && musikUrl) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Autoplay audio dicegah oleh browser:", err));
    }
  };

  // 8. HANDLER TOGGLE MUSIK
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-[#050505] text-amber-50 font-serif selection:bg-amber-500 selection:text-zinc-950 min-h-screen">
      
      {/* NATIVE AUDIO ELEMENT (Hidden) */}
      {musikUrl && (
        <audio ref={audioRef} src={musikUrl} loop preload="auto" />
      )}

      {/* 1. COVER / OPENING TEMA LUXURY GOLD */}
      {!isOpen && (
        <div className="fixed inset-0 z-50 h-[100dvh] w-full flex flex-col items-center justify-between px-6 py-8 bg-[#050505] text-[#f7e7ce] overflow-hidden touch-none select-none">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#b8860b]/15 via-transparent to-transparent pointer-events-none animate-pulse duration-1000" />

          {/* ORNAMEN 4 SUDUT LAYAR */}
          <div className="absolute top-2 left-2 w-16 h-16 sm:w-28 sm:h-28 pointer-events-none opacity-80">
            <GoldCornerSVG className="w-full h-full" />
          </div>
          <div className="absolute top-2 right-2 w-16 h-16 sm:w-28 sm:h-28 pointer-events-none opacity-80 rotate-90">
            <GoldCornerSVG className="w-full h-full" />
          </div>
          <div className="absolute bottom-2 left-2 w-16 h-16 sm:w-28 sm:h-28 pointer-events-none opacity-80 -rotate-90">
            <GoldCornerSVG className="w-full h-full" />
          </div>
          <div className="absolute bottom-2 right-2 w-16 h-16 sm:w-28 sm:h-28 pointer-events-none opacity-80 rotate-180">
            <GoldCornerSVG className="w-full h-full" />
          </div>

          {/* ORNAMEN ATAS */}
          <div className="relative z-10 w-28 sm:w-44 h-auto opacity-75 mt-2">
            <DarkGoldFiligree className="w-full h-full text-[#e6ca65]" />
          </div>

          {/* KONTEN UTAMA COVER */}
          <div className="relative z-10 my-auto text-center max-w-lg space-y-5 px-2">
            <div className="space-y-2">
              <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.45em] text-[#e6ca65]/90 font-medium block">
                The Wedding Celebration Of
              </span>
              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#e6ca65]/70 to-transparent mx-auto" />
            </div>

            {coverFoto && (
              <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-b from-[#e6ca65]/50 via-[#b8860b]/20 to-transparent shadow-2xl shadow-[#b8860b]/20">
                <img
                  src={coverFoto}
                  alt="Mempelai"
                  className="w-full h-full object-cover rounded-full border border-[#e6ca65]/40"
                />
              </div>
            )}

            <div className="space-y-1 py-1">
              <h1 className="text-4xl sm:text-6xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#f7e7ce] via-[#e6ca65] to-[#d4af37] capitalize drop-shadow-[0_2px_12px_rgba(230,202,101,0.25)] leading-relaxed">
                {namaPria}
              </h1>
              
              <div className="flex items-center justify-center gap-3 text-[#e6ca65]/70 my-0.5">
                <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#e6ca65]/60" />
                <span className="text-2xl sm:text-3xl font-serif italic text-[#f7e7ce]/90">&</span>
                <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#e6ca65]/60" />
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#f7e7ce] via-[#e6ca65] to-[#d4af37] capitalize drop-shadow-[0_2px_12px_rgba(230,202,101,0.25)] leading-relaxed">
                {namaWanita}
              </h1>
            </div>

            <p className="text-[11px] sm:text-xs font-sans text-stone-300/80 max-w-xs mx-auto leading-relaxed tracking-wider font-light">
              Kepada Bapak/Ibu/Saudara/i, kami mengundang Anda untuk menghadiri momen bahagia pernikahan kami.
            </p>

            {/* TOMBOL BUKA UNDANGAN */}
            <div className="pt-2">
              <button
                onClick={handleOpenInvitation}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e6ca65] to-[#b8860b] text-zinc-950 font-sans font-semibold text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(230,202,101,0.35)] hover:shadow-[0_0_35px_rgba(230,202,101,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
                <span className="text-sm">✉️</span>
                <span>Buka Undangan</span>
              </button>
            </div>
          </div>

          {/* ORNAMEN BAWAH */}
          <div className="relative z-10 w-28 sm:w-44 h-auto opacity-75 rotate-180 mb-2">
            <DarkGoldFiligree className="w-full h-full text-[#e6ca65]" />
          </div>
        </div>
      )}

      {/* 2. ISI UNDANGAN */}
      {isOpen && (
        <main className="animate-fade-in relative pb-16">
          
          {/* TOMBOL MUTE / UNMUTE MUSIK MELAYANG */}
          {musikUrl && (
            <button
              onClick={toggleMusic}
              className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-[#111111]/90 border border-[#e6ca65]/50 text-[#e6ca65] shadow-lg shadow-black/80 hover:scale-110 active:scale-95 transition-all flex items-center justify-center backdrop-blur-md cursor-pointer"
              title={isPlaying ? "Matikan Musik" : "Putar Musik"}
            >
              {isPlaying ? (
                <span className="text-lg animate-spin" style={{ animationDuration: '4s' }}>🎵</span>
              ) : (
                <span className="text-lg opacity-60">🔇</span>
              )}
            </button>
          )}

          <HeroSection
            namaPria={namaPria}
            namaWanita={namaWanita}
            tanggal={tanggalAcara}
            coverFoto={coverFoto}
            className="border-b border-amber-500/20"
          />

          <GreetingSection className="border-b border-zinc-900" />

          <QuoteSection quote={extra?.quote} className="border-b border-zinc-900" />

          <CoupleSection
            namaPria={(invitation as any)?.nama_lengkap_pria || namaPria}
            namaWanita={(invitation as any)?.nama_lengkap_wanita || namaWanita}
            ortuaPria={ortuaPria}
            ortuaWanita={ortuaWanita}
            turutMengundang={extra?.turutMengundang}
            fotoPria={extra?.fotoPria}
            fotoWanita={extra?.fotoWanita}
            className="border-b border-zinc-900"
          />

          {extra?.loveStory && extra.loveStory.length > 0 && (
            <LoveStorySection stories={extra.loveStory} className="border-b border-zinc-900" />
          )}

          <CountdownSection targetDate={tanggalAcara} className="border-b border-zinc-900" />

          <EventDetailSection
            tanggalAkad={(invitation as any)?.tanggal_akad}
            tanggalResepsi={(invitation as any)?.tanggal_resepsi}
            lokasiAkad={alamatLengkap}
            lokasiResepsi={alamatLengkap}
            className="border-b border-zinc-900"
          />

          {(extra as any)?.videoPrewedUrl && (
            <VideoSection videoUrl={(extra as any).videoPrewedUrl} className="border-b border-zinc-900" />
          )}

          {photos.length > 0 && (
            <GallerySection photos={photos} className="border-b border-zinc-900" />
          )}

          <LocationMapsSection
            googleMapsUrl={lokasiMaps}
            alamatLengkap={alamatLengkap}
            className="border-b border-zinc-900"
          />

          {/* RSVP (TAMPIL ATAU SEMBUNYI BERDASARKAN enableRsvp) */}
          {isRsvpEnabled && (
            <section className="py-20 max-w-xl mx-auto px-4 font-sans border-b border-zinc-900">
              <RSVP activeInvitationId={invitation?.id} />
            </section>
          )}

          {/* AMPLOP DIGITAL */}
          {(accounts.length > 0 || qrisImageUrl) && (
            <section className="py-16 max-w-2xl mx-auto px-4 font-sans border-b border-zinc-900">
              <WeddingGift accounts={accounts} qrisImageUrl={qrisImageUrl} />
            </section>
          )}

          <ClosingSection namaPria={namaPria} namaWanita={namaWanita} />
        </main>
      )}
    </div>
  );
}