import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Fungsi pembantu untuk eksekusi Query D1 via HTTP REST API jika D1 binding lokal tidak aktif
async function queryD1ViaApi(sql: string, params: any[] = []) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID; // ID database zpack-db
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    return null;
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
    }
  );

  const data = await res.json();
  if (data.success && data.result?.[0]) {
    return data.result[0].results || [];
  }
  return null;
}

// 1. GET: Ambil ucapan khusus invitation_id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invitationId } = await params;

    let db: any = null;
    try {
      const { env } = getCloudflareContext();
      db = (env as any)?.DB || (env as any)?.zpack_db;
    } catch {
      db = null;
    }

    // Jika D1 Context ada
    if (db) {
      const query = `
        SELECT id, invitation_id, nama, kehadiran, jumlah_tamu, ucapan, created_at 
        FROM rsvps 
        WHERE invitation_id = ? 
        ORDER BY id DESC
      `;
      const { results } = await db.prepare(query).bind(invitationId).all();
      return NextResponse.json({ success: true, rsvps: results || [] });
    }

    // Coba via HTTP REST API Cloudflare D1
    const apiResults = await queryD1ViaApi(
      "SELECT id, invitation_id, nama, kehadiran, jumlah_tamu, ucapan, created_at FROM rsvps WHERE invitation_id = ? ORDER BY id DESC",
      [invitationId]
    );

    if (apiResults !== null) {
      return NextResponse.json({ success: true, rsvps: apiResults });
    }

    // Fallback Mock Data jika API token / D1 belum dikonfigurasi
    const mockData = [
      {
        id: "316e18aa-e66c-4d9b-a771-fe6be6b33a65",
        invitation_id: "1791149990416",
        nama: "aziz",
        kehadiran: "Hadir",
        jumlah_tamu: 1,
        ucapan: "selamat",
        created_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      rsvps: mockData.filter((item) => item.invitation_id === invitationId),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 2. DELETE: Hapus ucapan dari D1 Database
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const rsvpId = body.id;

    if (!rsvpId) {
      return NextResponse.json(
        { success: false, message: "ID ucapan wajib disertakan" },
        { status: 400 }
      );
    }

    let db: any = null;
    try {
      const { env } = getCloudflareContext();
      db = (env as any)?.DB || (env as any)?.zpack_db;
    } catch {
      db = null;
    }

    // Jika D1 Binding aktif (Production / Wrangler)
    if (db) {
      await db.prepare("DELETE FROM rsvps WHERE id = ?").bind(rsvpId).run();
      console.log("✅ Berhasil hapus via Cloudflare Binding D1");
      return NextResponse.json({
        success: true,
        message: "Ucapan berhasil dihapus dari database D1",
      });
    }

    // Eksekusi DELETE via Cloudflare D1 REST API
    const apiResult = await queryD1ViaApi("DELETE FROM rsvps WHERE id = ?", [
      rsvpId,
    ]);

    if (apiResult !== null) {
      console.log("✅ Berhasil hapus via Cloudflare REST API");
      return NextResponse.json({
        success: true,
        message: "Ucapan berhasil dihapus dari D1 via API",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Gagal menghapus: Binding D1 atau API Token belum dikonfigurasi di .env",
    });
  } catch (error: any) {
    console.error("❌ Error Delete RSVP D1:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}