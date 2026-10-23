"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface SongItem {
  key: string;
  filename: string;
  url: string;
}

export default function SongsManagementPage() {
  const [songList, setSongList] = useState<SongItem[]>([]);
  const [songTitle, setSongTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Menyimpan referensi semua elemen audio agar bisa dikontrol (pause otomatis)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  // Helper untuk memastikan URL audio selalu memiliki protokol https:// yang valid
  const formatAudioUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Jika tidak ada protokol, paksa tambahkan domain R2 assets
    return `https://${url.replace(/^\/+/, "")}`;
  };

  // 1. Fetch Daftar Lagu dari R2
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/songs");
      const data = await res.json();
      if (data.success) {
        // Pastikan setiap URL lagu diformat dengan benar
        const formattedSongs = data.songs.map((song: SongItem) => ({
          ...song,
          url: formatAudioUrl(song.url),
        }));
        setSongList(formattedSongs);
      }
    } catch (err) {
      console.error("Gagal memuat lagu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // 2. Fungsi agar hanya 1 audio yang berputar dalam satu waktu
  const handlePlayAudio = (playingKey: string) => {
    Object.keys(audioRefs.current).forEach((key) => {
      const audioEl = audioRefs.current[key];
      if (audioEl && key !== playingKey) {
        audioEl.pause(); // Jeda audio lain yang sedang menyala
      }
    });
  };

  // 3. Handler saat User Memilih File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      setSongTitle(cleanName);

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  // 4. Upload Lagu Baru ke R2
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (songTitle) formData.append("title", songTitle);

      const res = await fetch("/api/admin/songs", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSongTitle("");
        setSelectedFile(null);
        setPreviewUrl(null);
        await fetchSongs();
      } else {
        alert(data.message || "Gagal mengunggah file");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat upload file");
    } finally {
      setUploading(false);
    }
  };

  // 5. Hapus Lagu dari R2
  const handleDeleteSong = async (key: string) => {
    if (!confirm("Yakin ingin menghapus lagu ini dari R2?")) return;

    try {
      const res = await fetch("/api/admin/songs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();
      if (data.success) {
        setSongList((prev) => prev.filter((song) => song.key !== key));
      } else {
        alert(data.message || "Gagal menghapus file");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus lagu");
    }
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/admin/dashboard"
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
          >
            ← Kembali ke Dashboard
          </Link>
          <span className="text-xs bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full uppercase tracking-wider text-blue-400 font-semibold">
            Cloudflare R2 (preset-music/)
          </span>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">Kelola Musik & Lagu</h1>
        <p className="text-gray-400 text-center mb-10 text-sm md:text-base">
          Tambah atau hapus koleksi lagu latar belakang di folder preset-music/ bucket zpack
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-col-reverse">
          
          {/* Form Upload */}
          <div className="order-1 md:order-none md:col-span-5 bg-[#0e172a] border border-slate-800 rounded-2xl p-6 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>➕</span> Tambah Lagu Baru
            </h2>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Judul Lagu
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Perfect - Instrumental"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070d19] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  File Audio (.mp3)
                </label>
                <input
                  type="file"
                  accept="audio/mp3,audio/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
              </div>

              {previewUrl && (
                <div className="p-3 bg-[#070d19] border border-blue-500/30 rounded-xl space-y-1.5">
                  <p className="text-xs text-blue-400 font-medium flex items-center gap-1.5">
                    <span>🎧</span> Preview Sebelum Upload
                  </p>
                  <audio
                    src={previewUrl}
                    controls
                    className="w-full h-8 rounded-lg outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                {uploading ? "Mengunggah ke R2..." : "Upload Lagu"}
              </button>
            </form>
          </div>

          {/* Daftar Lagu */}
          <div className="order-2 md:order-none md:col-span-7 bg-[#0e172a] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🎵</span> Daftar Lagu Tersedia
            </h2>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <p className="text-xs text-slate-500 text-center py-8">
                  Memuat daftar lagu dari R2...
                </p>
              ) : songList.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">
                  Belum ada lagu tersimpan di folder preset-music/.
                </p>
              ) : (
                songList.map((song) => {
                  const displayName = song.filename.replace(/^\d+-/, "");
                  const validUrl = formatAudioUrl(song.url);

                  return (
                    <div
                      key={song.key}
                      className="p-3 bg-[#070d19] border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="truncate pr-2">
                          <p className="text-sm font-semibold text-slate-200 truncate">
                            {displayName}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteSong(song.key)}
                          className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>

                      <audio
                        ref={(el) => {
                          audioRefs.current[song.key] = el;
                        }}
                        onPlay={() => handlePlayAudio(song.key)}
                        src={validUrl}
                        controls
                        className="w-full h-8 rounded-lg outline-none"
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}