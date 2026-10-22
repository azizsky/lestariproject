"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface PackageItem {
  id: string;
  nama_paket: string;
  harga: number;
  deskripsi: string;
  fitur: string;
}

export default function KelolaPaketPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const [formData, setFormData] = useState<PackageItem>({
    id: "",
    nama_paket: "",
    harga: 0,
    deskripsi: "",
    fitur: "",
  });

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/packages");
      const data = await res.json();
      if (data.success) {
        setPackages(data.packages);
      }
    } catch (err) {
      console.error("Gagal mengambil data paket:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setFormData({ id: "", nama_paket: "", harga: 0, deskripsi: "", fitur: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: PackageItem) => {
    setIsEditMode(true);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id || !formData.nama_paket) {
      alert("ID dan Nama Paket wajib diisi!");
      return;
    }

    try {
      const method = isEditMode ? "PUT" : "POST";
      const res = await fetch("/api/admin/packages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchPackages();
      } else {
        alert(data.message || "Gagal menyimpan data paket");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Yakin ingin menghapus paket ID: ${id}?`)) return;

    try {
      const res = await fetch("/api/admin/packages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        setPackages((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.message || "Gagal menghapus paket");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-2"
            >
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Kelola Paket & Harga</h1>
            <p className="text-gray-400 text-sm mt-1">
              Atur daftar paket undangan (Basic, Premium, Enterprise) beserta harga dan fiturnya.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/25"
          >
            ➕ Tambah Paket Baru
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            Memuat daftar paket...
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            Belum ada paket terdaftar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-[#0e172a] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-lg group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-800 text-emerald-400 border border-slate-700 rounded-md">
                      {pkg.id}
                    </span>
                    <span className="text-xl font-extrabold text-emerald-400">
                      {formatRupiah(pkg.harga)}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-100 mb-2">
                    {pkg.nama_paket}
                  </h2>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {pkg.deskripsi || "Tidak ada deskripsi."}
                  </p>

                  <div className="bg-[#070d19] border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-slate-400 mb-1">Fitur:</p>
                    <p>{pkg.fitur || "Fitur standar"}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditModal(pkg)}
                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0e172a] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-100">
              {isEditMode ? "✏️ Edit Paket" : "➕ Tambah Paket Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  ID Paket (Key Unique, misal: basic, premium, enterprise)
                </label>
                <input
                  type="text"
                  disabled={isEditMode}
                  placeholder="Contoh: basic"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-800 rounded-xl text-sm text-white disabled:opacity-50 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nama Paket
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Paket Basic"
                  value={formData.nama_paket}
                  onChange={(e) => setFormData({ ...formData, nama_paket: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Harga (Rupiah)
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 50000"
                  value={formData.harga}
                  onChange={(e) => setFormData({ ...formData, harga: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Deskripsi / Masa Aktif
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Masa aktif 1 bulan setelah hari-H"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Daftar Fitur
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Musik latar, Buku tamu dasar, dll"
                  value={formData.fitur}
                  onChange={(e) => setFormData({ ...formData, fitur: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 cursor-pointer"
                >
                  {isEditMode ? "Simpan Perubahan" : "Tambah Paket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}