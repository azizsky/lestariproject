"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface InvitationItem {
  id: string;
  slug: string;
  category: string;
  package: string;
  status: string;
  nama_panggilan?: string;
  created_at?: string;
}

export default function GuestbookSelectionPage() {
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/bukutamu");
        const data = await res.json();

        if (data.success) {
          setInvitations(data.invitations);
        }
      } catch (err) {
        console.error("Gagal mengambil daftar undangan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  // Helper untuk formatting kategori & icon
  const getCategoryInfo = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case "wedding":
        return { label: "Undangan Pernikahan", icon: "💍" };
      case "syukuran":
      case "khitan":
        return { label: "Khitan / Syukuran", icon: "🎉" };
      case "event":
        return { label: "Undangan Event", icon: "🎟️" };
      default:
        return { label: "Undangan Digital", icon: "💌" };
    }
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/admin/dashboard"
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
          >
            ← Kembali ke Dashboard
          </Link>
          <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider text-emerald-400 font-semibold">
            BUKU TAMU UNDANGAN
          </span>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">Kelola Buku Tamu</h1>
        <p className="text-gray-400 text-center mb-10 text-sm md:text-base">
          Pilih salah satu undangan di bawah ini untuk melihat ucapan dan konfirmasi kehadiran tamu (Paket Basic disembunyikan).
        </p>

        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            Memuat daftar undangan dari database...
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            Tidak ada undangan non-basic yang aktif saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {invitations.map((inv) => {
              const { label, icon } = getCategoryInfo(inv.category);
              const title = inv.slug
                ? inv.slug.replace(/-/g, " ").toUpperCase()
                : `Undangan ${inv.id}`;

              return (
                <Link
                  key={inv.id}
                  href={`/admin/dashboard/bukutamu/${inv.id}`}
                  className="bg-[#0e172a] border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#070d19] border border-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        {icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                        {inv.package}
                      </span>
                    </div>

                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md">
                      {label}
                    </span>

                    <h2 className="text-lg font-bold text-slate-100 mt-3 mb-1 capitalize group-hover:text-emerald-400 transition-colors">
                      {title}
                    </h2>
                    <p className="text-xs text-slate-400 truncate">
                      🔗 /{inv.slug}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
                    <span>Buka Buku Tamu</span>
                    <span>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}