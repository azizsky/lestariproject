
"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallAppButton() {
  const [installPrompt, setInstallPrompt] =
    useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  if (!installPrompt) {
    return (
      <p className="text-xs text-gray-400">
        Instalasi tersedia melalui menu browser jika didukung.
      </p>
    );
  }

  
const handleInstall = async () => {
  if (!installPrompt) return;

  await installPrompt.prompt();
  await installPrompt.userChoice;

  // Biarkan browser menentukan kapan prompt instalasi
  // tersedia kembali pada kunjungan berikutnya.
  setInstallPrompt(null);
};


  return (
    <button
      onClick={handleInstall}
      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-all"
    >
      📲 Install Admin App
    </button>
  );
}
