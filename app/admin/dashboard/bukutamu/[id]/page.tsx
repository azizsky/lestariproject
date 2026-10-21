"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface RsvpItem {
  id: string;
  invitation_id: string;
  nama: string;
  kehadiran: string;
  jumlah_tamu: number;
  ucapan: string;
  created_at?: string;
}

export default function GuestbookDetailPage() {
  const params = useParams();
  const invitationId = params.id as string;

  const [guestList, setGuestList] = useState<RsvpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch data ucapan/RSVP dari D1 Database
  const fetchRsvps = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/bukutamu/${invitationId}`);
      const data = await res.json();
      if (data.success) {
        setGuestList(data.rsvps);
      }
    } catch (err) {
      console.error("Gagal mengambil data buku tamu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invitationId) {
      fetchRsvps();
    }
  }, [invitationId]);

  // Hapus Ucapan/Chat Buruk dari D1
  const handleDeleteGuest = async (id: string) => {
    if (!confirm("Yakin ingin menghapus ucapan/chat ini dari buku tamu?")) return;

    try {
      const res = await fetch(`/api/admin/bukutamu/${invitationId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        setGuestList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.message || "Gagal menghapus ucapan");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus ucapan");
    }
  };

  // Statistik Ringkasan
  const totalHadir = guestList.filter((item) =>
    item.kehadiran?.toLowerCase().includes("hadir")
  ).length;
  
  const totalRagu = guestList.filter((item) =>
    item.kehadiran?.toLowerCase().includes("ragu")
  ).length;

  const totalTidakHadir = guestList.filter(
    (item) =>
      item.kehadiran?.toLowerCase().includes("tidak") ||
      item.kehadiran?.toLowerCase().includes("absen")
  ).length;

  const totalTamuHadir = guestList
    .filter((item) => item.kehadiran?.toLowerCase().includes("hadir"))
    .reduce((acc, curr) => acc + (Number(curr.jumlah_tamu) || 1), 0);

  // Filter & Search
  const filteredGuests = guestList.filter((item) => {
    const matchesSearch = item.nama?.toLowerCase().includes(searchQuery.toLowerCase());
    const statusLower = item.kehadiran?.toLowerCase() || "";
    
    let matchesStatus = true;
    if (filterStatus === "hadir") matchesStatus = statusLower.includes("hadir") && !statusLower.includes("tidak");
    else if (filterStatus === "ragu") matchesStatus = statusLower.includes("ragu");
    else if (filterStatus === "tidak_hadir") matchesStatus = statusLower.includes("tidak") || statusLower.includes("absen");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigasi Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/admin/dashboard/bukutamu"
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
          >
            ← Kembali ke Daftar Undangan
          </Link>
          <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-mono text-emerald-400">
            ID: {invitationId}
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-2">Buku Tamu Undangan</h1>
        <p className="text-gray-400 mb-8 text-sm md:text-base">
          Daftar ucapan, doa, dan moderasi konfirmasi kehadiran dari para tamu.
        </p>

        {/* Card Statistik Ringkasan */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-4 flex flex-col items-center">
            <span className="text-xs text-slate-400 font-medium mb-1">Total Hadir</span>
            <span className="text-2xl font-bold text-emerald-400">{totalHadir}</span>
          </div>
          <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-4 flex flex-col items-center">
            <span className="text-xs text-slate-400 font-medium mb-1">Estimasi Orang</span>
            <span className="text-2xl font-bold text-blue-400">{totalTamuHadir}</span>
          </div>
          <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-4 flex flex-col items-center">
            <span className="text-xs text-slate-400 font-medium mb-1">Masih Ragu</span>
            <span className="text-2xl font-bold text-amber-400">{totalRagu}</span>
          </div>
          <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-4 flex flex-col items-center">
            <span className="text-xs text-slate-400 font-medium mb-1">Tidak Hadir</span>
            <span className="text-2xl font-bold text-rose-400">{totalTidakHadir}</span>
          </div>
        </div>

        {/* Pencarian & Filter Status */}
        <div className="bg-[#0e172a] border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Cari nama tamu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 px-3 py-2 bg-[#070d19] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
          />

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                filterStatus === "all" ? "bg-emerald-600 text-white" : "bg-[#070d19] text-slate-400 border border-slate-800"
              }`}
            >
              Semua ({guestList.length})
            </button>
            <button
              onClick={() => setFilterStatus("hadir")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                filterStatus === "hadir" ? "bg-emerald-600 text-white" : "bg-[#070d19] text-slate-400 border border-slate-800"
              }`}
            >
              Hadir
            </button>
            <button
              onClick={() => setFilterStatus("ragu")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                filterStatus === "ragu" ? "bg-amber-600 text-white" : "bg-[#070d19] text-slate-400 border border-slate-800"
              }`}
            >
              Ragu
            </button>
            <button
              onClick={() => setFilterStatus("tidak_hadir")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                filterStatus === "tidak_hadir" ? "bg-rose-600 text-white" : "bg-[#070d19] text-slate-400 border border-slate-800"
              }`}
            >
              Absen
            </button>
          </div>
        </div>

        {/* List Data Ucapan & Moderasi Hapus */}
        <div className="bg-[#0e172a] border border-slate-800 rounded-2xl p-6">
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <p className="text-xs text-slate-500 text-center py-12">Memuat buku tamu...</p>
            ) : filteredGuests.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-12">Belum ada ucapan untuk undangan ini.</p>
            ) : (
              filteredGuests.map((item) => {
                const isHadir = item.kehadiran?.toLowerCase().includes("hadir") && !item.kehadiran?.toLowerCase().includes("tidak");
                const isRagu = item.kehadiran?.toLowerCase().includes("ragu");

                let badgeStyle = "bg-rose-500/10 border-rose-500/20 text-rose-400";
                if (isHadir) badgeStyle = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
                if (isRagu) badgeStyle = "bg-amber-500/10 border-amber-500/20 text-amber-400";

                return (
                  <div
                    key={item.id}
                    className="p-4 bg-[#070d19] border border-slate-800/80 rounded-xl space-y-2 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-100">{item.nama}</h3>
                          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                            {item.kehadiran} ({item.jumlah_tamu || 1} Tamu)
                          </span>
                        </div>
                        {item.created_at && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {new Date(item.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                          </p>
                        )}
                      </div>

                      {/* Tombol Moderasi Hapus Chat Bad/Spam */}
                      <button
                        onClick={() => handleDeleteGuest(item.id)}
                        className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>

                    {item.ucapan && (
                      <p className="text-xs text-slate-300 italic bg-[#0e172a]/60 p-2.5 rounded-lg border border-slate-800/60 mt-2">
                        "{item.ucapan}"
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}