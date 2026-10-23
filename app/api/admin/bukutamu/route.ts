import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  try {
    let db: any = null;

    // 1. Ambil DB Binding dari Cloudflare Context
    try {
      const { env } = getCloudflareContext();
      db = (env as any)?.DB || (env as any)?.zpack_db || (env as any)?.DB_BINDING;
    } catch {
      db = null;
    }

    // 2. Jika DB terhubung
    if (db) {
      const query = `
        SELECT id, slug, category, package, status, nama_panggilan_pria, created_at 
        FROM invitations 
        WHERE LOWER(package) NOT LIKE '%basic%' AND status = 'active'
        ORDER BY id DESC
      `;
      const { results } = await db.prepare(query).all();

      return NextResponse.json({
        success: true,
        invitations: results || [],
      });
    }

    // 3. Jika D1 tidak terhubung (misal di local dev tanpa wrangler binding), kembalikan kosong
    console.warn("⚠️ Mode Lokal Dev: Binding D1 tidak ditemukan.");
    return NextResponse.json({
      success: true,
      invitations: [],
    });

  } catch (error: any) {
    console.error("❌ Error Query D1 Bukutamu:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memuat data D1" },
      { status: 500 }
    );
  }
}