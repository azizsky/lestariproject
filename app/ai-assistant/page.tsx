'use client';

import Navbar from "@/components/common/navbar";
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'lestari_ai_chat_history';
const TIME_LIMIT_HOURS = 2; // Batas waktu kedaluwarsa riwayat chat (2 jam)

export default function AiAssistantPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Ref untuk auto-scroll ke pesan terbaru
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Ambil data dari localStorage saat halaman pertama kali dimuat dengan batasan 2 jam
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const now = new Date().getTime();
        const elapsedHours = (now - parsed.timestamp) / (1000 * 60 * 60);

        if (elapsedHours < TIME_LIMIT_HOURS && parsed.messages?.length > 0) {
          setMessages(parsed.messages);
          return;
        }
      }
    } catch (e) {
      console.error('Gagal memuat riwayat chat:', e);
    }

    // Default jika belum ada atau sudah lebih dari 2 jam
    setMessages([
      {
        role: 'assistant',
        content: 'Halo! Saya Lestari AI dari Lestari Project. Ada yang bisa saya bantu seputar paket undangan digital, update template bulanan, atau cetak undangan fisik?',
      },
    ]);
  }, []);

  // 2. Simpan pesan ke localStorage setiap kali ada perubahan riwayat chat
  useEffect(() => {
    if (messages.length > 1) {
      try {
        const dataToSave = {
          timestamp: new Date().getTime(),
          messages: messages,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (e) {
        console.error('Gagal menyimpan riwayat chat:', e);
      }
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Pembersih markdown
  const cleanMarkdownText = (text: string) => {
    return text
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s?/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await response.json();

      if (data.reply) {
        const cleanedReply = cleanMarkdownText(data.reply);
        setMessages([...updatedMessages, { role: 'assistant', content: cleanedReply }]);
      } else {
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: 'Gagal mendapatkan balasan dari server API.' },
        ]);
      }
    } catch (error: any) {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: `Error koneksi: ${error.message || 'Gagal terhubung'}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-zinc-200 dark:bg-slate-950 transition-colors duration-200 flex flex-col">
      <Navbar />

      {/* Kontainer utama menggunakan h-[100dvh] agar menyesuaikan tinggi layar HP secara akurat saat keyboard muncul */}
      <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col pt-20 pb-4 px-3 sm:px-4 h-[100dvh] overflow-hidden">
        
        {/* Chat Box Container */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-md flex flex-col overflow-hidden">
          
          {/* Area Pesan Chat */}
          <div className="flex-1 p-3 sm:p-5 overflow-y-auto flex flex-col gap-3 sm:gap-4 scroll-smooth bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[78%] px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs font-medium'
                      : 'bg-blue-600 dark:bg-slate-700 text-white dark:text-slate-100 rounded-bl-xs border border-slate-300 dark:border-slate-700/80 shadow-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Indicator Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 px-4 py-2.5 rounded-2xl text-xs sm:text-sm animate-pulse flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></div>
                  <span>Lestari AI sedang mengetik...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Sticky yang aman dari tertutup keyboard HP */}
          <form 
            onSubmit={handleSubmit} 
            className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 flex gap-2 shrink-0 sticky bottom-0 z-10"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya paket Basic, Premium, Exclusive, atau template..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition disabled:opacity-50 cursor-pointer shrink-0 shadow-xs"
            >
              Kirim
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}