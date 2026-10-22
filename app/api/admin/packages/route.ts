import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Helper Query D1 / REST API Fallback
async function executeD1(sql: string, params: any[] = []) {
  let db: any = null;
  try {
    const { env } = getCloudflareContext();
    db = (env as any)?.DB || (env as any)?.zpack_db;
  } catch {
    db = null;
  }

  if (db) {
    if (sql.trim().toUpperCase().startsWith("SELECT")) {
      const { results } = await db.prepare(sql).bind(...params).all();
      return results || [];
    } else {
      await db.prepare(sql).bind(...params).run();
      return true;
    }
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (accountId && databaseId && apiToken) {
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
      return data.result[0].results || true;
    }
  }
  return null;
}

// GET: Ambil Semua Paket
export async function GET() {
  try {
    const sql = "SELECT id, nama_paket, harga, deskripsi, fitur FROM packages ORDER BY harga ASC";
    const data = await executeD1(sql);

    const mockPackages = [
      {
        id: "basic",
        nama_paket: "Paket Basic",
        harga: 50000,
        deskripsi: "Masa aktif 1 bulan setelah hari-H.",
        fitur: "Musik latar, Buku tamu dasar, Masa aktif 1 bulan",
      },
      {
        id: "premium",
        nama_paket: "Paket Premium",
        harga: 100000,
        deskripsi: "Masa aktif 3 bulan setelah hari-H.",
        fitur: "Musik latar R2, RSVP lengkap, Custom domain, Masa aktif 3 bulan",
      },
    ];

    return NextResponse.json({
      success: true,
      packages: data && Array.isArray(data) && data.length > 0 ? data : mockPackages,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Tambah Paket Baru
export async function POST(request: Request) {
  try {
    const { id, nama_paket, harga, deskripsi, fitur } = await request.json();

    if (!id || !nama_paket || harga === undefined) {
      return NextResponse.json({ success: false, message: "ID, Nama Paket, dan Harga wajib diisi" }, { status: 400 });
    }

    const sql = "INSERT INTO packages (id, nama_paket, harga, deskripsi, fitur) VALUES (?, ?, ?, ?, ?)";
    await executeD1(sql, [id, nama_paket, Number(harga), deskripsi || "", fitur || ""]);

    return NextResponse.json({ success: true, message: "Paket berhasil ditambahkan" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Edit Paket
export async function PUT(request: Request) {
  try {
    const { id, nama_paket, harga, deskripsi, fitur } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "ID Paket wajib diisi" }, { status: 400 });
    }

    const sql = "UPDATE packages SET nama_paket = ?, harga = ?, deskripsi = ?, fitur = ? WHERE id = ?";
    await executeD1(sql, [nama_paket, Number(harga), deskripsi || "", fitur || "", id]);

    return NextResponse.json({ success: true, message: "Paket berhasil diperbarui" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Hapus Paket
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "ID Paket wajib diisi" }, { status: 400 });
    }

    const sql = "DELETE FROM packages WHERE id = ?";
    await executeD1(sql, [id]);

    return NextResponse.json({ success: true, message: "Paket berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}