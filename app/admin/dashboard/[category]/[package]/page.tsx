"use client";

import { useEffect, useState, useCallback, useRef, forwardRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toPng } from "html-to-image";
import FormBasicWedding from "@/components/admin/FormBasicWedding";
import FormPremiumWedding from "@/components/admin/FormPremiumWedding";
import FormEnterpriseWedding from "@/components/admin/FormEnterpriseWedding";

// Komponen Struk Invoice Desain Bersih
export const InvoiceReceipt = forwardRef<HTMLDivElement, any>(({ data }, ref) => {
  const today = new Date();

  const formatDateShort = (dateObj: Date) => {
    return dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div
      ref={ref}
      className="w-[580px] bg-white text-slate-800 p-6 font-sans text-xs leading-relaxed border border-slate-200 shadow-2xl block"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", backgroundColor: "#ffffff" }}
    >
      {/* HEADER: Digital Invoice & Status */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-2xl font-black text-blue-600 tracking-tight">Digital Invoice</h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Zpack Printing & Packaging</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-0.5 rounded tracking-wide uppercase">
            UNPAID (MENUNGGU PEMBAYARAN)
          </span>
          <p className="text-[11px] font-mono text-slate-600 font-bold mt-1">
            #ZP-{data.id?.substring(data.id.length - 6) || "8892"}
          </p>
        </div>
      </div>

      {/* INFORMASI PENGIRIM & KLIEN */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-200">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">FROM (PENGIRIM)</p>
          <p className="font-bold text-slate-900 text-xs">Zpack Printing & Packaging</p>
          <p className="text-slate-500 text-[10px] leading-tight">Pangalengan, Kab. Bandung, Jawa Barat</p>
          <p className="text-slate-400 text-[10px] mt-0.5">Website: www.zpack.my.id</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TO (KLIEN)</p>
          <p className="font-bold text-slate-900 text-xs capitalize">{data.namaClient || "Klien Zpack"}</p>
          <p className="text-blue-600 font-mono text-[10px] truncate">zpack.my.id/wedding/{data.slug}</p>
          <p className="text-slate-400 text-[10px] mt-0.5">ID: <span className="font-mono">{data.id}</span></p>
        </div>
      </div>

      {/* TANGGAL ISSUED */}
      <div className="mb-5 pb-4 border-b border-slate-200">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">ISSUED ON (TANGGAL TERBIT)</p>
        <p className="font-semibold text-slate-800 text-[11px]">{formatDateShort(today)}</p>
      </div>

      {/* TABEL ITEM / RINCIAN PAKET (BLOK HITAM) */}
      <div className="mb-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white text-[10px] uppercase tracking-wider">
              <th className="py-2 px-3 w-[45%]">ITEM NAME & DETAILS</th>
              <th className="py-2 px-3 text-center w-[10%]">QTY</th>
              <th className="py-2 px-3 text-right w-[20%]">RATE</th>
              <th className="py-2 px-3 text-right w-[25%]">TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="py-2.5 px-3 align-top">
                <span className="font-bold block text-slate-900 text-xs">
                  Undangan Digital ({data.package?.toUpperCase()})
                </span>
                <div className="text-[10px] text-slate-500 space-y-0.5 mt-0.5">
                  <p>Hari-H Acara: <span className="font-medium text-slate-700">{data.tanggalAcara || "-"}</span></p>
                  <p>Masa Aktif s/d: <span className="font-medium text-emerald-600">{data.expiredDate || "-"}</span></p>
                  <p>Template: <span className="font-mono font-semibold text-purple-600">{data.templateId || "Default"}</span></p>
                </div>
              </td>
              <td className="py-2.5 px-3 text-center font-medium align-top">1</td>
              <td className="py-2.5 px-3 text-right font-medium align-top whitespace-nowrap">
                Rp {data.harga?.toLocaleString("id-ID")}
              </td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-900 align-top whitespace-nowrap">
                Rp {data.harga?.toLocaleString("id-ID")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SUB-TOTAL & TOTAL AMOUNT */}
      <div className="border-t border-slate-200 pt-3 mb-4 space-y-1">
        <div className="flex justify-between text-slate-500 text-[11px]">
          <span>Subtotal</span>
          <span className="font-medium text-slate-800">Rp {data.harga?.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-slate-500 text-[11px]">
          <span>Pajak (0%)</span>
          <span className="font-medium text-slate-800">Rp 0</span>
        </div>
        <div className="flex justify-between text-xs font-black text-slate-900 border-t border-slate-100 pt-1.5">
          <span>Total Tagihan</span>
          <span className="text-blue-600 text-sm">Rp {data.harga?.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* INSTRUKSI PEMBAYARAN */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-[10px] text-slate-600 space-y-0.5 mb-4">
        <p className="font-bold text-slate-800 uppercase tracking-wider text-[9px]">PAYMENT INSTRUCTIONS</p>
        <p>Silakan transfer tagihan ke <span className="font-bold text-slate-800">Bank BCA: 123-456-7890</span> (A/N Zpack Printing).</p>
        <p className="text-slate-500">Kirimkan bukti konfirmasi transfer melalui WhatsApp Admin Zpack.</p>
      </div>

      {/* FOOTER & COPYRIGHT */}
      <div className="text-center text-[9px] text-slate-400 border-t border-slate-100 pt-2 tracking-wider space-y-0.5">
        <p className="font-medium uppercase">Thank you for choosing Zpack — www.zpack.my.id</p>
        <p className="text-[8px] text-slate-300">Copyright © 2026 Zpack Printing & Packaging. All rights reserved.</p>
      </div>
    </div>
  );
});

InvoiceReceipt.displayName = "InvoiceReceipt";

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