"use client";

import Link from "next/navigation"; // Jika pakai next/router atau next/link, sesuaikan dengan aslinya
import { useRouter } from "next/navigation";
import InstallAppButton from "./installappbutton";
export default function AdminDashboardPage() {
  const router = useRouter();
  
  const categories = [
    {
      id: "wedding",
      title: "Undangan Pernikahan",
      desc: "Untuk akad nikah, resepsi, lamaran, & engagement.",
      icon: "💍",
    },
    {
      id: "syukuran",
      title: "Khitan / Syukuran / Ultah",
      desc: "Untuk walimatul khitan, ulang tahun, & syukuran keluarga.",
      icon: "🎉",
    },
    {
      id: "event",
      title: "Undangan Event",
      desc: "Untuk seminar, konser, reuni, & acara komunitas.",
      icon: "🎟️",
    },
    {
      id: "songs",
      title: "Kelola Lagu / Musik",
      desc: "Tambah atau hapus musik latar R2 Cloudflare untuk undangan.",
      icon: "🎵",
    },
    {
      id: "bukutamu",
      title: "Kelola Buku Tamu",
      desc: "Lihat ucapan, doa, serta konfirmasi kehadiran dari para tamu.",
      icon: "📖",
    },
    {
      id: "kelolatemplate",
      title: "Kelola Template",
      desc: "Pilih dan ubah desain atau tema yang digunakan setiap undangan.",
      icon: "🎨",
    },
    {
      id: "packages",
      title: "Kelola Paket & Harga",
      desc: "Atur daftar paket langganan (Basic, Premium, dll) beserta harganya.",
      icon: "💎",
    },
  ];

 
const handleLogout = async () => {
  try {
    const response = await fetch("/api/admin/logout", {
      method: "POST",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Logout gagal: HTTP ${response.status}`);
    }

    router.replace("/admin/login");
    router.refresh();
  } catch (error) {
    console.error("Logout gagal:", error);
    alert("Logout gagal. Periksa koneksi dan coba lagi.");
  }
};



  return (
    <div className="min-h-screen bg-[#070d19] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Pilih Kategori Acara</h1>
            <p className="text-gray-400 text-sm">
              Pilih kategori jenis acara atau layanan yang ingin kamu kelola
            </p>
          </div>
          <InstallAppButton />
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            🚪 Logout
          </button> 
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            let targetRoute = `/admin/dashboard/${cat.id}`;
            if (cat.id === "songs") {
              targetRoute = "/admin/dashboard/songs";
            } else if (cat.id === "bukutamu") {
              targetRoute = "/admin/dashboard/bukutamu";
            } else if (cat.id === "kelolatemplate") {
              targetRoute = "/admin/dashboard/kelolatemplate";
            } else if (cat.id === "packages") {
              targetRoute = "/admin/dashboard/packages";
            }

            return (
              <a
                key={cat.id}
                href={targetRoute}
                className="bg-[#0e172a] border border-slate-800 rounded-xl p-6 hover:border-emerald-500 transition-all flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h2 className="text-xl font-bold mb-2">{cat.title}</h2>
                <p className="text-sm text-gray-400">{cat.desc}</p>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}