import { forwardRef } from "react";

export const InvoiceReceipt = forwardRef<HTMLDivElement, any>(({ data }, ref) => {
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 3);

  const formatDateShort = (dateObj: Date) => {
    return dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div
      ref={ref}
      className="w-[550px] bg-white text-slate-800 p-8 font-sans text-xs leading-relaxed border border-slate-200 shadow-xl block"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", backgroundColor: "#ffffff" }}
    >
      {/* HEADER: Digital Invoice */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">Digital Invoice</h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">Zpack Printing & Packaging</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-1 rounded-md tracking-wide uppercase">
            UNPAID
          </span>
          <p className="text-[11px] font-mono text-slate-500 font-bold mt-1.5">
            #ZP-{data.id?.substring(data.id.length - 6) || "8892"}
          </p>
        </div>
      </div>

      {/* INFORMASI PEMBUAT & KLIEN (2 KOLOM SEIMBANG) */}
      <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-100">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">FROM</p>
          <p className="font-bold text-slate-900 text-sm">Zpack Printing</p>
          <p className="text-slate-500 text-[11px]">Layanan Undangan Digital</p>
          <p className="text-slate-400 text-[11px]">www.zpack.my.id</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TO</p>
          <p className="font-bold text-slate-900 text-sm capitalize">{data.namaClient || "Klien Zpack"}</p>
          <p className="text-blue-600 font-mono text-[11px] truncate">zpack.my.id/wedding/{data.slug}</p>
        </div>
      </div>

      {/* TANGGAL ISSUED & DUE DATE */}
      <div className="grid grid-cols-2 gap-6 mb-8 pb-6 border-b border-slate-100">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">ISSUED ON</p>
          <p className="font-semibold text-slate-800 text-[11px]">{formatDateShort(today)}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">DUE DATE</p>
          <p className="font-bold text-rose-600 text-[11px]">{formatDateShort(dueDate)}</p>
        </div>
      </div>

      {/* TABEL ITEM / RINCIAN PAKET */}
      <div className="mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-2 text-left">ITEM NAME</th>
              <th className="pb-2 text-center w-[10%]">QTY</th>
              <th className="pb-2 text-right w-[22%]">RATE</th>
              <th className="pb-2 text-right w-[25%]">TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="py-3 pr-2 align-top">
                <span className="font-bold block text-slate-900 text-xs">
                  Undangan Digital ({data.package?.toUpperCase()})
                </span>
                <div className="text-[10px] text-slate-500 space-y-0.5 mt-1">
                  <p>• Hari-H: <span className="font-medium text-slate-700">{data.tanggalAcara || "-"}</span></p>
                  <p>• Masa Aktif s/d: <span className="font-medium text-emerald-600">{data.expiredDate || "-"}</span></p>
                  <p>• Template: <span className="font-mono text-purple-600">{data.templateId || "Default"}</span></p>
                </div>
              </td>
              <td className="py-3 text-center font-medium align-top">1</td>
              <td className="py-3 text-right font-medium align-top whitespace-nowrap">
                Rp {data.harga?.toLocaleString("id-ID")}
              </td>
              <td className="py-3 text-right font-bold text-slate-900 align-top whitespace-nowrap">
                Rp {data.harga?.toLocaleString("id-ID")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SUB-TOTAL & TOTAL AMOUNT */}
      <div className="border-t border-slate-200 pt-4 mb-6 space-y-2">
        <div className="flex justify-between text-slate-500 text-[11px]">
          <span>Subtotal</span>
          <span className="font-medium text-slate-800">Rp {data.harga?.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-slate-500 text-[11px]">
          <span>Pajak (0%)</span>
          <span className="font-medium text-slate-800">Rp 0</span>
        </div>
        <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-2">
          <span>Total Amount</span>
          <span className="text-blue-600 text-base">Rp {data.harga?.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* INSTRUKSI PEMBAYARAN */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-[10px] text-slate-600 space-y-1 mb-6">
        <p className="font-bold text-slate-800 uppercase tracking-wider text-[9px]">PAYMENT INSTRUCTIONS</p>
        <p>Silakan transfer tagihan ke <span className="font-bold text-slate-800">Bank BCA 123-456-7890</span> (A/N Zpack Printing).</p>
        <p className="text-slate-500">Kirimkan bukti konfirmasi transfer melalui WhatsApp Admin Zpack.</p>
      </div>

      {/* FOOTER */}
      <div className="text-center text-[9px] text-slate-400 border-t border-slate-100 pt-3 tracking-widest uppercase">
        Thank you for choosing Zpack — www.zpack.my.id
      </div>
    </div>
  );
});

InvoiceReceipt.displayName = "InvoiceReceipt";