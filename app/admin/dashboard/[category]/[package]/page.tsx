"use client";

import { useEffect, useState, useCallback, useRef, forwardRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toPng } from "html-to-image";
import FormBasicWedding from "@/components/admin/FormBasicWedding";
import FormPremiumWedding from "@/components/admin/FormPremiumWedding";
import FormEnterpriseWedding from "@/components/admin/FormEnterpriseWedding";
import InvoiceReceipt from "./InvoiceReceipt";


export default function ManageInvitationsPage() {
  const params = useParams();
  const category = params.category as string;
  const pkg = params.package as string;

  const [listUndangan, setListUndangan] = useState<any[]>([]);
  const [packagesList, setPackagesList] = useState<any[]>([]); // Dynamic Packages D1
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);

  const [activeInvoiceItem, setActiveInvoiceItem] = useState<any | null>(null);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Ambil Data Packages Langsung Dari DB
  const fetchPackages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/packages");
      const data = await res.json();
      if (data.success) {
        setPackagesList(data.data || []);
      }
    } catch (err) {
      console.error("Gagal ambil data packages:", err);
    }
  }, []);

  // Ambil Data Invitations
  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/invitations?category=${category}&package=${pkg}`
      );
      const data = await res.json();
      if (data.success) {
        setListUndangan(data.data || []);
      }
    } catch (err) {
      console.error("Gagal ambil data undangan:", err);
    } finally {
      setLoading(false);
    }
  }, [category, pkg]);

  useEffect(() => {
    fetchPackages();
    fetchInvitations();
  }, [fetchPackages, fetchInvitations]);

  // Fungsi dinamis mengambil harga paket langsung dari tabel 'packages' DB D1
  const getDynamicPackagePrice = (currentPkg: string) => {
    const p = (currentPkg || "").toLowerCase();
    const foundPkg = packagesList.find(
      (item) => item.id?.toLowerCase() === p || item.nama_paket?.toLowerCase().includes(p)
    );
    if (foundPkg && foundPkg.harga) {
      return Number(foundPkg.harga);
    }
    // Fallback harga jika DB belum ter-load
    if (p.includes("premium")) return 89000;
    if (p.includes("exclusive") || p.includes("enterprise")) return 120000;
    return 52000;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus undangan ini?")) return;
    try {
      const res = await fetch(`/api/admin/invitations?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Undangan berhasil dihapus!");
        fetchInvitations();
      }
    } catch (err) {
      alert("Gagal menghapus undangan");
    }
  };

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/wedding/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    alert("🔗 Link undangan berhasil disalin: " + fullUrl);
  };

  const getExpiredDate = (tanggalAcara: string, currentPkg: string) => {
    if (!tanggalAcara) return null;
    const date = new Date(tanggalAcara);
    let monthsToAdd = 1;

    const lowerPkg = (currentPkg || "").toLowerCase();
    if (lowerPkg.includes("premium")) monthsToAdd = 3;
    if (lowerPkg.includes("enterprise") || lowerPkg.includes("exclusive")) monthsToAdd = 6;

    date.setMonth(date.getMonth() + monthsToAdd);
    return date;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const handleDownloadInvoice = async () => {
    if (receiptRef.current) {
      try {
        setDownloading(true);
        const node = receiptRef.current;
        const dataUrl = await toPng(node, {
          cacheBust: true,
          quality: 1,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
          height: node.scrollHeight,
          style: {
            overflow: "visible",
            maxHeight: "none",
          },
        });

        const link = document.createElement("a");
        link.download = `invoice-zpack-${activeInvoiceItem?.slug || "undangan"}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Gagal mendownload invoice:", err);
        alert("Gagal merakit gambar invoice.");
      } finally {
        setDownloading(false);
      }
    }
  };

  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setInitialData({
      slug: item.slug,
      templateId: item.template_id || "theme-minimalist",
      namaPanggilanPria: item.nama_panggilan_pria || "",
      namaPanggilanWanita: item.nama_panggilan_wanita || "",
      namaLengkapPria: item.nama_lengkap_pria || "",
      namaLengkapWanita: item.nama_lengkap_wanita || "",
      orangTuaPria: item.orang_tua_pria || "",
      orangTuaWanita: item.orang_tua_wanita || "",
      turutMengundangPria: item.turut_mengundang_pria || "",
      turutMengundangWanita: item.turut_mengundang_wanita || "",
      tanggalAkad: item.tanggal_akad || "",
      waktuAkad: item.waktu_akad || "",
      tanggalResepsi: item.tanggal_resepsi || "",
      waktuResepsi: item.waktu_resepsi || "",
      lokasiTeks: item.lokasi_teks || "",
      lokasiMaps: item.lokasi_maps || "",
      ...(item.xtra_data || {}),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitForm = async (formData: any) => {
    try {
      const url = "/api/admin/invitations";
      const method = editingId ? "PUT" : "POST";
      const bodyPayload: any = {
        slug: formData.slug.toLowerCase().trim().replace(/\s+/g, "-"),
        category: category,
        package: pkg,
        content: formData,
      };

      if (editingId) {
        bodyPayload.id = editingId;
      }

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (data.success) {
        alert(editingId ? "✅ Undangan berhasil diperbarui!" : "✅ Undangan berhasil ditambahkan!");
        setShowForm(false);
        setEditingId(null);
        setInitialData(null);
        fetchInvitations();
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err: any) {
      alert("⚠️ Error: " + err.message);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setInitialData(null);
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
            <Link href="/admin/dashboard" className="hover:text-white">Dashboard</Link>
            <span>/</span>
            <Link href={`/admin/dashboard/${category}`} className="hover:text-white uppercase">{category}</Link>
            <span>/</span>
            <span className="text-emerald-400 font-bold uppercase">{pkg}</span>
          </div>

          <Link
            href={`/admin/dashboard/${category}`}
            className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-gray-300 transition-all self-end sm:self-auto"
          >
            ← Ganti Paket
          </Link>
        </div>

        {/* Title Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0e172a] border border-slate-800 p-5 sm:p-6 rounded-xl gap-4 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Daftar Undangan Aktif</h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Kelola undangan paket <span className="uppercase text-emerald-400 font-bold">{pkg}</span>.
            </p>
          </div>
          <button
            onClick={() => {
              if (showForm) {
                handleCancelForm();
              } else {
                setEditingId(null);
                setInitialData(null);
                setShowForm(true);
              }
            }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-lg shadow-blue-600/20 text-center"
          >
            {showForm ? "✕ Batal" : "+ Buat Undangan Baru"}
          </button>
        </div>

        {/* FORM SECTION */}
        {showForm && (
          <div className="bg-[#0e172a] border border-slate-800 p-4 sm:p-6 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h2 className="text-base sm:text-lg font-semibold text-emerald-400">
                {editingId ? "✏️ Edit Undangan" : "✨ Buat Undangan Baru"}
              </h2>
              <button onClick={handleCancelForm} className="text-xs text-gray-400 hover:text-white">Tutup ✕</button>
            </div>

            {pkg === "basic" && <FormBasicWedding onSubmit={handleSubmitForm} initialData={initialData} />}
            {pkg === "premium" && <FormPremiumWedding onSubmit={handleSubmitForm} initialData={initialData} />}
            {pkg === "enterprise" && <FormEnterpriseWedding onSubmit={handleSubmitForm} initialData={initialData} />}
          </div>
        )}

        {/* TABEL / DAFTAR UNDANGAN */}
        <div className="bg-[#0e172a] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Memuat data undangan...</div>
          ) : listUndangan.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              Belum ada undangan untuk paket {pkg.toUpperCase()}.
            </div>
          ) : (
            <div>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs text-gray-400 uppercase bg-slate-900/50">
                      <th className="p-4">SLUG / URL</th>
                      <th className="p-4">TANGGAL PEMBUATAN</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4">MASA AKTIF BERAKHIR</th>
                      <th className="p-4 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listUndangan.map((item) => {
                      const tglAcara = item.tanggal_akad || item.tanggal_resepsi || item.created_at;
                      const expiredDate = getExpiredDate(tglAcara, pkg);
                      const isExpired = expiredDate ? new Date() > expiredDate : false;

                      return (
                        <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-all text-sm">
                          <td className="p-4 text-emerald-400 font-mono">
                            <div className="flex items-center gap-2">
                              <span>/wedding/{item.slug}</span>
                              <a
                                href={`/wedding/${item.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-gray-300 px-2 py-0.5 rounded"
                              >
                                Preview ↗
                              </a>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300 text-xs">
                            {formatDate(item.created_at)}
                          </td>
                          <td className="p-4">
                            {isExpired ? (
                              <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase">
                                Expired
                              </span>
                            ) : (
                              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-gray-300 text-xs">
                            {expiredDate ? formatDate(expiredDate.toISOString()) : "-"}
                          </td>
                          <td className="p-4 text-right space-x-1.5">
                            <button
                              onClick={() => setActiveInvoiceItem(item)}
                              className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 px-2.5 py-1 rounded text-xs transition-all font-semibold"
                            >
                              📄 Invoice
                            </button>
                            <button
                              onClick={() => handleCopyLink(item.slug)}
                              className="bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 px-2.5 py-1 rounded text-xs transition-all"
                            >
                              Copy Link
                            </button>
                            <button
                              onClick={() => handleEditClick(item)}
                              className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-2.5 py-1 rounded text-xs transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-2.5 py-1 rounded text-xs transition-all"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* MODAL / POPUP PREVIEW INVOICE DOKUMEN */}
        {activeInvoiceItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0e172a] border border-slate-800 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Preview Dokumen Invoice</h3>
                <button
                  onClick={() => setActiveInvoiceItem(null)}
                  className="text-gray-400 hover:text-white text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Wrapper Preview Latar Putih */}
              <div className="flex justify-center overflow-x-auto overflow-y-auto max-h-[75vh] bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="bg-white rounded-lg p-2 shadow-xl inline-block my-auto">
                  <InvoiceReceipt
                    ref={receiptRef}
                    data={{
                      id: activeInvoiceItem.id,
                      slug: activeInvoiceItem.slug,
                      package: pkg,
                      templateId: activeInvoiceItem.template_id,
                      namaClient:
                        activeInvoiceItem.nama_panggilan_pria && activeInvoiceItem.nama_panggilan_wanita
                          ? `${activeInvoiceItem.nama_panggilan_pria} & ${activeInvoiceItem.nama_panggilan_wanita}`
                          : activeInvoiceItem.slug,
                      tanggalAcara: formatDate(activeInvoiceItem.tanggal_akad || activeInvoiceItem.tanggal_resepsi),
                      expiredDate: formatDate(
                        getExpiredDate(activeInvoiceItem.tanggal_akad || activeInvoiceItem.tanggal_resepsi, pkg)?.toISOString() || ""
                      ),
                      // SEKARANG HARGA DIAMBIL DINAMIS DARI D1 DB 'packages' (52000, 89000, 120000, dll)
                      harga: getDynamicPackagePrice(pkg),
                    }}
                  />
                </div>
              </div>

              {/* Tombol Kontrol Modal */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveInvoiceItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  disabled={downloading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
                >
                  {downloading ? "⏳ Merakit Dokumen..." : "📥 Download Invoice (.PNG)"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}