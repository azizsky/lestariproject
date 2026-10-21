"use client";

import React, { useState, useEffect } from "react";

interface RSVPProps {
  activeInvitationId: string | number;
}

interface RsvpItem {
  id?: string | number;
  nama: string;
  kehadiran: "Hadir" | "Ragu-ragu" | "Tidak Hadir";
  jumlahTamu: number;
  ucapan: string;
  created_at?: string;
}

export default function RSVP({ activeInvitationId }: RSVPProps) {
  const [nama, setNama] = useState("");
  const [kehadiran, setKehadiran] = useState<"Hadir" | "Ragu-ragu" | "Tidak Hadir">("Hadir");
  const [jumlahTamu, setJumlahTamu] = useState(1);
  const [ucapan, setUcapan] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rsvpList, setRsvpList] = useState<RsvpItem[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  const storageKey = `zpack_rsvp_sent_${activeInvitationId}`;

  // 1. Cek status di localStorage & Ambil ucapan dari DB
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAlreadySent = localStorage.getItem(storageKey);
      if (isAlreadySent) {
        setSubmitted(true);
      }
    }
    fetchRsvpList();
  }, [activeInvitationId]);

  // Fetch daftar ucapan dari API
  const fetchRsvpList = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(`/api/rsvp?invitation_id=${activeInvitationId}`);
      if (res.ok) {
        const data = await res.json();
        setRsvpList(data.data || []);
      }
    } catch (error) {
      console.error("Gagal mengambil daftar RSVP:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  // 2. Kirim RSVP Baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim() || !ucapan.trim()) {
      alert("Mohon isi nama dan ucapan Anda.");
      return;
    }

    setLoading(true);

    const payload = {
      invitation_id: activeInvitationId,
      nama: nama.trim(),
      kehadiran,
      jumlah_tamu: kehadiran === "Hadir" ? jumlahTamu : 0,
      ucapan: ucapan.trim(),
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        localStorage.setItem(storageKey, "true");
        setSubmitted(true);
        fetchRsvpList();
      } else {
        alert("Gagal mengirim ucapan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 font-sans">
      {/* FORM RSVP */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-xl backdrop-blur-md">
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold block">
            Konfirmasi & Doa
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-amber-100 font-bold mt-1">
            RSVP & Ucapan Selamat
          </h2>
        </div>

        {submitted ? (
          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
            <span className="text-3xl block">✨</span>
            <h3 className="text-amber-300 font-semibold text-lg">
              Terima Kasih!
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Konfirmasi kehadiran dan ucapan doa Anda telah berhasil terkirim.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500/60 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Konfirmasi Kehadiran
                </label>
                <select
                  value={kehadiran}
                  onChange={(e) =>
                    setKehadiran(e.target.value as "Hadir" | "Ragu-ragu" | "Tidak Hadir")
                  }
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/60 transition-colors"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Ragu-ragu">Ragu-ragu</option>
                  <option value="Tidak Hadir">Tidak Hadir</option>
                </select>
              </div>

              {kehadiran === "Hadir" && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Jumlah Tamu
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={jumlahTamu}
                    onChange={(e) => setJumlahTamu(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/60 transition-colors"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Doa & Ucapan Selamat
              </label>
              <textarea
                rows={3}
                value={ucapan}
                onChange={(e) => setUcapan(e.target.value)}
                placeholder="Tuliskan harapan dan doa Anda untuk kedua mempelai..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500/60 transition-colors resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-amber-500/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Mengirim..." : "Kirim Konfirmasi & Ucapan"}
            </button>
          </form>
        )}
      </div>

      {/* BOX PENAMPUNG UCAPAN TAMU (FEED) */}
      <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <h3 className="text-base font-semibold text-amber-200 flex items-center gap-2">
            <span>💬</span> Ucapan & Doa ({rsvpList.length})
          </h3>
          <span className="text-[11px] text-zinc-400">Terbaru</span>
        </div>

        <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {fetchLoading ? (
            <p className="text-center text-xs text-zinc-500 py-6">Memuat ucapan...</p>
          ) : rsvpList.length === 0 ? (
            <p className="text-center text-xs text-zinc-500 py-6">
              Belum ada ucapan. Jadilah yang pertama memberikan doa!
            </p>
          ) : (
            rsvpList.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/60 space-y-1.5 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-amber-100">
                      {item.nama}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        item.kehadiran === "Hadir"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : item.kehadiran === "Ragu-ragu"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {item.kehadiran}
                    </span>
                  </div>

                  {item.created_at && (
                    <span className="text-[10px] text-zinc-500">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-light">
                  "{item.ucapan}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}