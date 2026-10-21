"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface TemplateItem {
  id: string;
  nama_template: string;
  deskripsi: string;
  thumbnail_url: string;
}

export default function KelolaTemplatePage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadingR2, setUploadingR2] = useState(false);

  // Form State
  const [formData, setFormData] = useState<TemplateItem>({
    id: "",
    nama_template: "",
    deskripsi: "",
    thumbnail_url: "",
  });

  // Fetch Semua Template dari D1 via API Kelolatemplate
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/kelolatemplate");
      const data = await res.json();
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (err) {
      console.error("Gagal mengambil data template:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Buka Modal Tambah
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setFormData({ id: "", nama_template: "", deskripsi: "", thumbnail_url: "" });
    setIsModalOpen(true);
  };

  // Buka Modal Edit (bisa ganti gambar juga)
  const handleOpenEditModal = (item: TemplateItem) => {
    setIsEditMode(true);
    setFormData(item);
    setIsModalOpen(true);
  };

  // Handler Upload Gambar Thumbnail ke Cloudflare R2
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingR2(true);
      const dataForm = new FormData();
      dataForm.append("file", file);

      const res = await fetch("/api/admin/kelolatemplate", {
        method: "POST",
        body: dataForm,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, thumbnail_url: data.url }));
      } else {
        alert(data.message || "Gagal mengunggah foto ke R2");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengunggah foto");
    } finally {
      setUploadingR2(false);
    }
  };

  // Simpan Data (Tambah / Edit ke D1 Database)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id || !formData.nama_template) {
      alert("ID dan Nama Template wajib diisi!");
      return;
    }

    try {
      const method = isEditMode ? "PUT" : "POST";
      const res = await fetch("/api/admin/kelolatemplate", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchTemplates();
      } else {
        alert(data.message || "Gagal menyimpan data template");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan data");
    }
  };

  // Hapus Template
  const handleDelete = async (id: string) => {
    if (!confirm(`Yakin ingin menghapus template ID: ${id}?`)) return;

    try {
      const res = await fetch("/api/admin/kelolatemplate", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        setTemplates((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.message || "Gagal menghapus template");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Action Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-2"
            >
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Kelola Master Template</h1>
            <p className="text-gray-400 text-sm mt-1">
              Tambah, edit, upload foto thumbnail ke R2, dan kelola template D1.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/25"
          >
            ➕ Tambah Template Baru
          </button>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            Memuat daftar template dari database D1...
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            Belum ada template terdaftar di database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-[#0e172a] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/50 transition-all group shadow-lg"
              >
                <div>
                  {/* Thumbnail Preview */}
                  <div className="w-full h-36 bg-[#070d19] border border-slate-800 rounded-xl mb-4 overflow-hidden flex items-center justify-center text-slate-600">
                    {tpl.thumbnail_url ? (
                      <img
                        src={tpl.thumbnail_url}
                        alt={tpl.nama_template}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-xs">No Thumbnail</span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-800 text-purple-400 border border-slate-700 rounded-md">
                    {tpl.id}
                  </span>

                  <h2 className="text-lg font-bold text-slate-100 mt-3 mb-1">
                    {tpl.nama_template}
                  </h2>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {tpl.deskripsi || "Tidak ada deskripsi."}
                  </p>
                </div>

                {/* Tombol Aksi Edit & Hapus */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditModal(tpl)}
                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tpl.id)}
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

      {/* Modal Form Tambah / Edit + Upload Foto R2 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0e172a] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-100">
              {isEditMode ? "✏️ Edit Template" : "➕ Tambah Template Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  ID Template (Key Unique, misal: theme-luxury)
                </label>
                <input
                  type="text"
                  disabled={isEditMode}
                  placeholder="Contoh: theme-luxury"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-800 rounded-xl text-sm text-white disabled:opacity-50 focus:outline-none focus:border-purple-500 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nama Template
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Floral Garden"
                  value={formData.nama_template}
                  onChange={(e) => setFormData({ ...formData, nama_template: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi singkat..."
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-all resize-none"
                />
              </div>

              {/* Input Pilih File Foto untuk Upload ke R2 */}
              <div>
                <label className="block text-xs font-semibold text-purple-400 mb-1">
                  📁 Ganti / Upload Gambar Thumbnail ke R2
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingR2}
                  className="w-full px-2 py-1.5 bg-[#070d19] border border-slate-800 rounded-xl text-xs text-slate-300 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
                />
                {uploadingR2 && (
                  <p className="text-[11px] text-purple-400 mt-1.5 animate-pulse font-medium">
                    ⏳ Sedang mengunggah gambar ke Cloudflare R2...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  URL Thumbnail
                </label>
                <input
                  type="text"
                  placeholder="https://assets.zpack.my.id/..."
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 transition-all font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploadingR2}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-purple-600/25 disabled:opacity-50"
                >
                  {isEditMode ? "Simpan Perubahan" : "Tambah Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}