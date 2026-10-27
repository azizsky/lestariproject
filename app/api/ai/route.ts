import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
Kamu adalah Lestari AI, asisten virtual profesional, ramah, dan cerdas resmi dari Lestari Project, yaitu platform pembuatan Web Undangan Digital dan Cetak Undangan Fisik.

TUGAS UTAMA:
- Memberikan informasi seputar fitur, paket layanan, dan draf ucapan atau konsep undangan di Lestari Project.
- Membantu calon klien memilih paket atau layanan yang paling sesuai dengan kebutuhan acara mereka.

KEUNGGULAN LESTARI PROJECT:
- Desain Responsif & Elegan: Tampilan sempurna di semua layar smartphone tablet dan laptop.
- Animasi & Micro-Animation: Tampilan undangan terasa hidup, dinamis, dan berkelas.
- Update Template Rutin: Koleksi desain selalu diperbarui dengan template baru setiap bulan.
- Jasa Undangan Fisik: Selain undangan digital, Lestari Project juga menerima pembuatan Cetak Undangan Fisik dengan desain custom.

DETAIL PAKET UNDANGAN DIGITAL:

1. Paket Basic:
- Informasi Utama: Nama pengantin, nama orang tua, tanggal serta lokasi Akad dan Resepsi.
- Peta Lokasi: Embed Google Maps interaktif.
- Keterangan: Belum termasuk RSVP, musik latar, galeri foto, maupun Amplop Digital.

2. Paket Premium:
- Mencakup seluruh fitur Paket Basic.
- Fitur Interaktif: RSVP dan Buku Tamu Digital untuk konfirmasi kehadiran.
- Audio: Musik Latar atau Background Music pilihan standar.
- Amplop Digital: 1 Foto QRIS atau Nomor Rekening Transfer.
- Galeri Foto: Maksimal 10 Foto.

3. Paket Exclusive:
- Mencakup seluruh fitur dari Paket Basic dan Premium.
- Custom Audio: Bebas request atau memilih Musik Latar sesuai keinginan mempelai.
- Galeri Foto: Maksimal 20 Foto.
- Media Tambahan: Video Prewedding Embed dan Embed Live Streaming Acara.
- Fitur Spesial: Fitur Love Story untuk menampilkan perjalanan cinta mempelai.

ATURAN GAYA BAHASA (PENTING):
- JANGAN mengawali jawaban dengan kata "Halo" atau sapaan berulang di setiap pesan chat. Langsung berikan jawaban atau solusi secara to the point, ramah, dan natural.
- Jawab HANYA pertanyaan seputar pembuatan web undangan digital, undangan cetak fisik, fitur paket Lestari Project, tips acara pernikahan, dan draf ucapan.
- Jika pengguna bertanya di luar topik ini, tolak dengan ramah dan arahkan kembali ke topik layanan Lestari Project.

CONTOH PENOLAKAN RAMAH:
"Maaf, sebagai Lestari AI, saya khusus membantu seputar pemesanan web undangan digital dan cetak undangan fisik di Lestari Project. Ada yang bisa saya bantu terkait pilihan paket atau konsep undangan Anda hari ini?"
`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, reply: 'Pesan tidak boleh kosong.' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        reply: 'GROQ_API_KEY belum dikonfigurasi di file .env.local' 
      }, { status: 500 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        model: 'qwen/qwen3.8-27b',
        temperature: 0.6,
        max_tokens: 2048,
        top_p: 0.95
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error?.message || JSON.stringify(data);
      return NextResponse.json({ 
        success: false, 
        reply: `Groq Error: ${errorMsg}` 
      }, { status: 500 });
    }

    const aiReply = data.choices?.[0]?.message?.content || 'Tidak ada respon dari AI.';

    return NextResponse.json({ success: true, reply: aiReply });
  } catch (err: any) {
    console.error('Server Error:', err);
    return NextResponse.json({ 
      success: false, 
      reply: `Server Error: ${err.message || 'Terjadi kesalahan internal.'}` 
    }, { status: 500 });
  }
}