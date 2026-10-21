import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function queryRemoteD1(sql: string, params: any[] = []) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error("Konfigurasi Cloudflare D1 belum lengkap di .env.local!");
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
      cache: "no-store",
    }
  );

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.errors?.[0]?.message || "Gagal query D1");
  }

  return json.result?.[0]?.results || [];
}

// POST: Simpan RSVP ke Database D1
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Support kedua format parameter (camelCase / snake_case) agar fleksibel
    const invitationId = body.invitation_id || body.invitationId;
    const nama = body.nama;
    const kehadiran = body.kehadiran || "Hadir";
    const jumlahTamu = body.jumlah_tamu || body.jumlahTamu || 1;
    const ucapan = body.ucapan || body.pesan || "-";

    if (!invitationId || !nama) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap (invitation_id & nama wajib diisi)" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    // Simpan ke D1
    const sql = `
      INSERT INTO rsvps (id, invitation_id, nama, kehadiran, jumlah_tamu, ucapan, created_at)
      VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'))
    `;
    await queryRemoteD1(sql, [id, invitationId, nama, kehadiran, jumlahTamu, ucapan.trim()]);

    return NextResponse.json({
      success: true,
      message: "RSVP berhasil disimpan",
      data: { id, invitationId, nama, kehadiran, jumlahTamu, ucapan },
    });
  } catch (error: any) {
    console.error("❌ [RSVP POST ERROR]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal menyimpan RSVP" },
      { status: 500 }
    );
  }
}

// GET: Ambil daftar ucapan berdasarkan invitation_id
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Support ?invitation_id=... maupun ?invitationId=...
    const invitationId = searchParams.get("invitation_id") || searchParams.get("invitationId");

    if (!invitationId) {
      return NextResponse.json(
        { success: false, message: "invitation_id diperlukan" },
        { status: 400 }
      );
    }

    const sql = `
      SELECT id, nama, kehadiran, jumlah_tamu as jumlahTamu, ucapan, created_at 
      FROM rsvps 
      WHERE invitation_id = ? 
      ORDER BY id DESC LIMIT 50
    `;
    const rsvps = await queryRemoteD1(sql, [invitationId]);

    return NextResponse.json({
      success: true,
      data: rsvps,
    });
  } catch (error: any) {
    console.error("❌ [RSVP GET ERROR]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengambil data ucapan" },
      { status: 500 }
    );
  }
}