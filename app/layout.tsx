import "./global.css"; // <-- Pastikan baris ini ada!


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
    /* Tambahkan suppressHydrationWarning di sini agar tidak error saat sinkronisasi tema */
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-100 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        
        {/* Skrip Inline untuk Mencegah Kedip Light Mode saat Refresh */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />

        {/* Konten halaman utama / halaman lain */}
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}