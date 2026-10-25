import "./global.css"; // <-- Pastikan baris ini ada!
import Navbar from "@/components/common/navbar";

export const metadata = {
  title: "Lestari Project Digital Invitation",
  description: "Platform Undangan Digital Modern & Elegan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        {/* Navbar Global (Otomatis muncul di semua halaman, kecuali jika URL diawali /admin) */}
        <Navbar />

        {/* Konten halaman utama / halaman lain */}
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}