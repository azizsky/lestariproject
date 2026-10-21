"use client";

import React, { useState } from "react";
import { WeddingProps, XtraDataProps } from "../types";
import { getPackageRules } from "@/lib/packageFeatures";

// Import Seksi Dasar
import CoverOpening from "../sections/CoverOpening";
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
import AudioPlayer from "@/components/features/AudioPlayer";

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

export default function TemplateFloralGarden({ invitation, xtraData }: WeddingProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Ekstrak xtraData
  const rawExtra = xtraData || (invitation as any)?.xtra_data;
  const extra: XtraDataProps = parseJsonSafe(rawExtra);

  // 2. Baca aturan paket dari DB
  const packageType = (invitation as any)?.package || extra?.packageType || "exclusive";
  const rules = getPackageRules(packageType as any);

  // 3. MAPPING NAMA PRIA & WANITA
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

  // 4. MAPPING TANGGAL & LOKASI
  const tanggalAcara =
    (invitation as any)?.tanggal_resepsi ||
    (invitation as any)?.tanggal_akad ||
    "2026-10-22";

  const lokasiMaps = (invitation as any)?.lokasi_maps || extra?.googleMapsUrl;
  const alamatLengkap = (invitation as any)?.lokasi_teks || extra?.alamatLengkap;

  // 5. MAPPING ORANG TUA & ASSETS
  const ortuaPria = (invitation as any)?.orang_tua_pria || extra?.ortuaPria;
  const ortuaWanita = (invitation as any)?.orang_tua_wanita || extra?.ortuaWanita;
  const coverFoto = extra?.coverFoto || (invitation as any)?.cover_image;
  const accounts = (extra as any)?.rekeningBank || extra?.rekening || [];
  const qrisImageUrl = (extra as any)?.qrisImageUrl;
  const photos = extra?.galeriFoto || [];

  // 6. LOGIKA RESOLVER MUSIK
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

  return (
    <div className="bg-emerald-950/5 text-stone-800 font-serif selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* 1. COVER / OPENING */}
      {!isOpen && (
        <CoverOpening
          namaPria={namaPria}
          namaWanita={namaWanita}
          coverFoto={coverFoto}
          onOpen={() => setIsOpen(true)}
          className="bg-stone-900 text-stone-100 font-serif border-b border-emerald-800/40"
        />
      )}

      {/* ISI UNDANGAN */}
      {isOpen && (
        <main className="animate-fade-in bg-[#f4f6f3]">
          
          {/* 2. HERO */}
          <HeroSection
            namaPria={namaPria}
            namaWanita={namaWanita}
            tanggal={tanggalAcara}
            coverFoto={coverFoto}
            className="border-b border-emerald-900/10 bg-gradient-to-b from-stone-200/50 to-[#f4f6f3]"
          />

          {/* 3. SALAM PEMBUKA */}
          <GreetingSection className="border-b border-stone-300/60 text-stone-700" />

          {/* 4. AYAT / KUTIPAN */}
          <QuoteSection 
            quote={extra?.quote} 
            className="border-b border-stone-300/60 bg-emerald-900/5 text-stone-700" 
          />

          {/* 5. PROFIL MEMPELAI */}
          <CoupleSection
            namaPria={(invitation as any)?.nama_lengkap_pria || namaPria}
            namaWanita={(invitation as any)?.nama_lengkap_wanita || namaWanita}
            ortuaPria={ortuaPria}
            ortuaWanita={ortuaWanita}
            turutMengundang={extra?.turutMengundang}
            fotoPria={extra?.fotoPria}
            fotoWanita={extra?.fotoWanita}
            className="border-b border-stone-300/60"
          />

          {/* 6. LOVE STORY */}
          {rules.hasLoveStory && extra?.loveStory && extra.loveStory.length > 0 && (
            <LoveStorySection 
              stories={extra.loveStory} 
              className="border-b border-stone-300/60 bg-emerald-900/5" 
            />
          )}

          {/* 7. SAVE THE DATE + COUNTDOWN */}
          <CountdownSection 
            targetDate={tanggalAcara} 
            className="border-b border-stone-300/60 bg-stone-200/40" 
          />

          {/* 8. DETAIL ACARA */}
          <EventDetailSection
            tanggalAkad={(invitation as any)?.tanggal_akad}
            tanggalResepsi={(invitation as any)?.tanggal_resepsi}
            lokasiAkad={alamatLengkap}
            lokasiResepsi={alamatLengkap}
            className="border-b border-stone-300/60"
          />

          {/* 9. VIDEO PREWEDDING */}
          {rules.hasVideo && (extra as any)?.videoPrewedUrl && (
            <VideoSection 
              videoUrl={(extra as any).videoPrewedUrl} 
              className="border-b border-stone-300/60" 
            />
          )}

          {/* 10. GALERI FOTO */}
          {photos.length > 0 && (
            <GallerySection 
              photos={photos} 
              className="border-b border-stone-300/60 bg-emerald-900/5" 
            />
          )}

          {/* 11. MAPS & LOKASI */}
          <LocationMapsSection
            googleMapsUrl={lokasiMaps}
            alamatLengkap={alamatLengkap}
            className="border-b border-stone-300/60"
          />

          {/* 12. RSVP & UCAPAN TAMU */}
          {rules.hasRSVP && (
            <section className="py-20 max-w-xl mx-auto px-4 font-sans border-b border-stone-300/60">
              <RSVP activeInvitationId={invitation.id} />
            </section>
          )}

          {/* 13. AMPLOP DIGITAL */}
          {rules.hasWeddingGift && (accounts.length > 0 || qrisImageUrl) && (
            <section className="py-16 max-w-2xl mx-auto px-4 font-sans border-b border-stone-300/60 bg-stone-200/50 rounded-2xl my-8">
              <WeddingGift accounts={accounts} qrisImageUrl={qrisImageUrl} />
            </section>
          )}

          {/* 14. PENUTUP */}
          <ClosingSection namaPria={namaPria} namaWanita={namaWanita} />

          {/* BACKGROUND MUSIC */}
          {rules.hasMusic && musikUrl && (
            <AudioPlayer audioUrl={musikUrl} />
          )}
        </main>
      )}
    </div>
  );
}