'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  // 1. Deteksi tema perangkat dan tema yang tersimpan
  useEffect(() => {
    const isDarkOS = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || (!savedTheme && isDarkOS)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 2. Sembunyikan navbar saat scroll, lalu tampilkan kembali setelah berhenti
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      if (window.scrollY < 10) {
        setShowNavbar(true);
        clearTimeout(scrollTimer);
        return;
      }

      setShowNavbar(false);
      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        setShowNavbar(true);
      }, 500);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  // 3. Tutup sidebar saat berpindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // 4. Sembunyikan navbar di halaman admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // 5. Toggle Dark/Light Mode
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${
          showNavbar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center">
            {/* Logo Light Mode */}
            <Image
              src="/logo.png"
              alt="LestariProject"
              width={150}
              height={45}
              priority
              className="h-16 w-auto object-contain dark:hidden"
            />

            {/* Logo Dark Mode */}
            <Image
              src="/logo-white.png"
              alt="LestariProject"
              width={150}
              height={45}
              priority
              className="hidden h-16 w-auto object-contain dark:block"
            />
          </Link>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/template"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Template
            </Link>

            <Link
              href="/paket"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Harga & Paket
            </Link>

            <Link
              href="/music"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Musik Latar
            </Link>

            <Link
              href="/ai-assistant"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              AI Assistant 🤖
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Tentang
            </Link>

            <Link
              href="/kontak"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Kontak
            </Link>

            {/* Tombol Dark/Light Desktop (Menggunakan Simbol Garis SVG) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center"
              title="Ganti Tema"
              aria-label="Ganti tema"
            >
              {darkMode ? (
                /* Simbol Outline Matahari */
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <path strokeLinecap="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                /* Simbol Outline Bulan Sabit */
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
          </nav>

          {/* TOMBOL HAMBURGER MOBILE */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(true)}
              className="text-slate-800 dark:text-white focus:outline-none text-2xl p-2 cursor-pointer"
              aria-label="Buka menu"
              aria-expanded={isOpen}
            >
              &#9776;
            </button>
          </div>
        </div>
      </header>

      {/* OVERLAY SIDEBAR MOBILE (Z-index lebih tinggi) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[90] md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR MOBILE (Z-index paling tinggi, background solid absolut 100%) */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl z-[100] p-6 flex flex-col gap-6 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            Menu Zpack
          </span>

          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-700 dark:text-slate-300 text-2xl font-bold cursor-pointer hover:text-red-500"
            aria-label="Tutup menu"
          >
            &times;
          </button>
        </div>

        {/* Daftar Menu Navigasi Sidebar */}
        <div className="flex flex-col gap-4">
          <Link
            href="/template"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Template Undangan
          </Link>

          <Link
            href="/paket"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Harga & Paket
          </Link>

          <Link
            href="/music"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Musik Latar
          </Link>

          <Link
            href="/ai-assistant"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            AI Assistant 🤖
          </Link>

          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Tentang Kami
          </Link>

          <Link
            href="/kontak"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Kontak
          </Link>
        </div>

        {/* Bagian Bawah Sidebar: Tombol Tema (Simbol SVG Outline) */}
        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 font-medium transition cursor-pointer"
          >
            {darkMode ? (
              <>
                <svg className="w-5 h-5 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <path strokeLinecap="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <span>Mode Terang</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
                <span>Mode Gelap</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}