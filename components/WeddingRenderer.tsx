"use client";

import React from "react";
import { WeddingProps, XtraDataProps } from "./types";

// Import Semua Template
import TemplateLuxury from "./templates/TemplateLuxury";
import TemplateWhiteRose from "./templates/TemplateWhiteRose";
import TemplateFloralGarden from "./templates/TemplateFloralGarden";

// Helper safe-parse untuk menangani string JSON tunggal maupun ganda
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

export default function WeddingRenderer({ invitation, xtraData }: WeddingProps) {
  // 1. Safe parse xtraData dari props atau kolom xtra_data di D1
  const rawExtra = xtraData || (invitation as any)?.xtra_data;
  const parsedXtra: XtraDataProps = parseJsonSafe(rawExtra);

  // 2. Tentukan ID Template (Mengecek dari D1 column `template_id` atau dari JSON `templateId`)
  const templateId =
    (invitation as any)?.template_id ||
    parsedXtra?.templateId ||
    "theme-luxury";

  // 3. Switch Case Renderer berdasarkan templateId
  switch (templateId) {
    case "theme-floral-garden":
    case "floral-garden":
      return <TemplateFloralGarden invitation={invitation} xtraData={parsedXtra} />;

    case "theme-white-rose":
    case "white-rose":
    case "white_rose":
      return <TemplateWhiteRose invitation={invitation} xtraData={parsedXtra} />;

    case "theme-luxury":
    case "luxury":
    case "theme-minimalist": // Mapped sementara ke Luxury jika minimalist belum dibuat
    default:
      return <TemplateLuxury invitation={invitation} xtraData={parsedXtra} />;
  }
}