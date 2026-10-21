import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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

// 1. GET: Ambil Semua Template
export async function GET() {
  try {
    const sql = "SELECT id, nama_template, deskripsi, thumbnail_url FROM templates ORDER BY id ASC";
    const data = await executeD1(sql);

    const mockTemplates = [
      {
        id: "theme-luxury",
        nama_template: "Luxury Gold",
        deskripsi: "Tema mewah dengan sentuhan warna emas dan klasik.",
        thumbnail_url: "https://assets.zpack.my.id/thumnail-template/luxury.jpg",
      },
      {
        id: "theme-white-rose",
        nama_template: "White Rose Elegant",
        deskripsi: "Tema romantis dan anggun dengan nuansa mawar putih.",
        thumbnail_url: "https://assets.zpack.my.id/thumnail-template/white-rose.jpg",
      },
    ];

    return NextResponse.json({
      success: true,
      templates: data && Array.isArray(data) ? data : mockTemplates,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 2. POST: Upload Gambar ke R2 (Skenario A & B) ATAU Simpan Template ke D1
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // A. Handle Upload File ke R2 via FormData
    if (contentType.includes("multipart/form-data")) {
      try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
          return NextResponse.json({ success: false, message: "File gambar tidak ditemukan" }, { status: 400 });
        }

        const fileExtension = file.name.split(".").pop() || "jpg";
        // Simpan langsung ke dalam folder thumnail-template/ di R2
        const fileName = `thumnail-template/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // ----------------------------------------------------
        // SKENARIO A: Cloudflare Pages / Workers Binding
        // ----------------------------------------------------
        let bucket: any = null;
        try {
          const { env } = getCloudflareContext();
          bucket = (env as any).MY_BUCKET || (env as any).R2 || (env as any).BUCKET;
        } catch (e) {
          bucket = null;
        }

        if (bucket) {
          console.log(`📤 [Cloudflare Binding] Uploading ke R2: ${fileName}`);
          await bucket.put(fileName, fileBuffer, {
            httpMetadata: { contentType: file.type },
          });

          return NextResponse.json({
            success: true,
            url: `https://assets.zpack.my.id/${fileName}`,
            message: "Upload gambar berhasil via R2 Binding",
          });
        }

        // ----------------------------------------------------
        // SKENARIO B: Localhost / S3 Client R2 API
        // ----------------------------------------------------
        const accountId = process.env.R2_ACCOUNT_ID;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        const bucketName = process.env.R2_BUCKET_NAME;

        if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
          return NextResponse.json(
            { success: false, message: "Konfigurasi R2 environment (S3) belum lengkap di .env" },
            { status: 500 }
          );
        }

        const s3 = new S3Client({
          region: "auto",
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          },
        });

        console.log(`📤 [S3 Client] Uploading ke R2 Bucket [${bucketName}], Key: ${fileName}`);

        await s3.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: file.type,
          })
        );

        return NextResponse.json({
          success: true,
          url: `https://assets.zpack.my.id/${fileName}`,
          message: "Upload gambar berhasil via S3 Client",
        });
      } catch (uploadErr: any) {
        console.error("❌ Error R2 Upload:", uploadErr);
        return NextResponse.json({ success: false, message: "Gagal mengunggah file ke R2: " + uploadErr.message }, { status: 500 });
      }
    }

    // B. Handle Simpan Data Template Baru ke D1 Database
    const body = await request.json();
    const { id, nama_template, deskripsi, thumbnail_url } = body;

    if (!id || !nama_template) {
      return NextResponse.json({ success: false, message: "ID dan Nama Template wajib diisi" }, { status: 400 });
    }

    const sql = "INSERT INTO templates (id, nama_template, deskripsi, thumbnail_url) VALUES (?, ?, ?, ?)";
    await executeD1(sql, [id, nama_template, deskripsi || "", thumbnail_url || ""]);

    return NextResponse.json({ success: true, message: "Template berhasil ditambahkan" });
  } catch (error: any) {
    console.error("❌ Error POST Template:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 3. PUT: Edit Template
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, nama_template, deskripsi, thumbnail_url } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID Template wajib diisi" }, { status: 400 });
    }

    const sql = "UPDATE templates SET nama_template = ?, deskripsi = ?, thumbnail_url = ? WHERE id = ?";
    await executeD1(sql, [nama_template, deskripsi || "", thumbnail_url || "", id]);

    return NextResponse.json({ success: true, message: "Template berhasil diperbarui" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 4. DELETE: Hapus Template
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID Template wajib diisi" }, { status: 400 });
    }

    const sql = "DELETE FROM templates WHERE id = ?";
    await executeD1(sql, [id]);

    return NextResponse.json({ success: true, message: "Template berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}