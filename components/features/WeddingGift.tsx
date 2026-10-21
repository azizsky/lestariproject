"use client";

import React, { useState } from "react";

interface BankAccount {
  bank?: string;
  bankName?: string;
  noRek?: string;
  accountNumber?: string;
  number?: string;
  atasNama?: string;
  accountHolder?: string;
  accountName?: string;
}

interface WeddingGiftProps {
  accounts?: BankAccount[];
  qrisImageUrl?: string;
  className?: string;
}

export default function WeddingGift({
  accounts = [],
  qrisImageUrl,
  className = "",
}: WeddingGiftProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if ((!accounts || accounts.length === 0) && !qrisImageUrl) {
    return null;
  }

  return (
    <section className={`text-center font-sans ${className}`}>
      <h2 className="text-2xl font-serif font-bold text-amber-400 mb-6">
        Amplop Digital
      </h2>

      {/* QRIS JIKA ADA */}
      {qrisImageUrl && (
        <div className="mb-8 flex flex-col items-center">
          <p className="text-sm opacity-80 mb-3">Scan QRIS untuk transfer</p>
          <img
            src={qrisImageUrl}
            alt="QRIS Pembayaran"
            className="w-48 h-48 object-contain rounded-lg border border-amber-500/20 bg-white p-2"
          />
        </div>
      )}

      {/* DAFTAR REKENING */}
      <div className="space-y-4 max-w-md mx-auto">
        {accounts.map((acc, idx) => {
          // Ambil nilai dengan memeriksa semua variasi properti
          const namaBank = acc.bank || acc.bankName || "Bank";
          const nomorRekening = acc.noRek || acc.accountNumber || acc.number || "";
          const pemegangRekening = acc.atasNama || acc.accountHolder || acc.accountName || "";

          return (
            <div
              key={idx}
              className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-left flex items-center justify-between gap-4"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                  {namaBank}
                </span>
                <p className="text-lg font-mono font-bold tracking-wide text-zinc-100">
                  {nomorRekening || "-"}
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  a.n. {pemegangRekening || "-"}
                </p>
              </div>

              {nomorRekening && (
                <button
                  onClick={() => handleCopy(nomorRekening, idx)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-zinc-800 text-amber-200 border border-zinc-700 hover:bg-zinc-700 transition-all shrink-0"
                >
                  {copiedIndex === idx ? "Tersalin! ✓" : "Salin No. Rek"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}