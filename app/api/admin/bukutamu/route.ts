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

    // 2. Jika DB terhubung (Production / Wrangler Pages Dev)
    if (db) {
      const query = `
        SELECT id, slug, category, package, status, nama_panggilan, created_at 
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

    // 3. Fallback jika D1 belum terhubung di 'npm run dev' biasa (Lokal Development)
    console.warn("⚠️ Mode Lokal Dev: Binding D1 tidak ditemukan, menampilkan data dummy dari D1 Studio.");
    
    const mockInvitationsFromD1 = [
      {
        id: "1791133021855",
        slug: "elisa-rangga",
        category: "wedding",
        package: "premium",
        status: "active",
        nama_panggilan: "rangga",
      },
      {
        id: "1791133255829",
        slug: "sarah-vivaldi",
        category: "wedding",
        package: "enterprise",
        status: "active",
        nama_panggilan: "Vivaldi",
      },
      {
        id: "1791149990416",
        slug: "latif-nanda",
        category: "wedding",
        package: "enterprise",
        status: "active",
        nama_panggilan: "Latif",
      },
    ];

    return NextResponse.json({
      success: true,
      invitations: mockInvitationsFromD1,
    });
  } catch (error: any) {
    console.error("❌ Error Query D1 Bukutamu:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memuat data D1" },
      { status: 500 }
    );
  }
}