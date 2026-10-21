import { NextResponse } from "next/server";
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const MUSIC_PREFIX = "preset-music/";

// Helper S3 Client untuk Localhost
function getS3Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || "zpack";

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });

  return { s3, bucketName };
}

const PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "https://assets.zpack.my.id";

// ----------------------------------------------------
// 1. GET: Ambil Daftar Lagu dari R2 (preset-music/)
// ----------------------------------------------------
export async function GET() {
  try {
    let bucket: any = null;
    try {
      const { env } = getCloudflareContext();
      bucket = (env as any).MY_BUCKET;
    } catch {
      bucket = null;
    }

    // A. Cloudflare Binding (Production)
    if (bucket) {
      const objects = await bucket.list({ prefix: MUSIC_PREFIX });
      const songs = objects.objects
        .filter((obj: any) => obj.key !== MUSIC_PREFIX)
        .map((obj: any) => ({
          key: obj.key,
          filename: obj.key.replace(MUSIC_PREFIX, ""),
          size: obj.size,
          uploadedAt: obj.uploaded,
          url: `${PUBLIC_DOMAIN}/${obj.key}`, // Menggunakan env
        }));

      return NextResponse.json({ success: true, songs });
    }

    // B. S3 Client (Localhost)
    const clientData = getS3Client();
    if (!clientData) {
      return NextResponse.json(
        { success: false, message: "Konfigurasi R2/Env belum lengkap" },
        { status: 500 }
      );
    }

    const { s3, bucketName } = clientData;
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: MUSIC_PREFIX,
    });

    const response = await s3.send(command);
    const songs =
      response.Contents?.filter((item) => item.Key !== MUSIC_PREFIX).map(
        (item) => ({
          key: item.Key || "",
          filename: (item.Key || "").replace(MUSIC_PREFIX, ""),
          size: item.Size || 0,
          uploadedAt: item.LastModified,
          url: `${PUBLIC_DOMAIN}/${item.Key}`, // Menggunakan env
        })
      ) || [];

    return NextResponse.json({ success: true, songs });
  } catch (error: any) {
    console.error("❌ Error Fetch Songs R2:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengambil daftar lagu" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// 2. POST: Upload File Lagu ke R2 (preset-music/)
// ----------------------------------------------------
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const customTitle = formData.get("title") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File lagu tidak ditemukan" },
        { status: 400 }
      );
    }

    // Format nama file agar bersih & masuk ke folder preset-music/ TANPA angka Date.now() di depannya
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
    const key = `${MUSIC_PREFIX}${sanitizedFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let bucket: any = null;
    try {
      const { env } = getCloudflareContext();
      bucket = (env as any).MY_BUCKET;
    } catch {
      bucket = null;
    }

    // A. Upload via Cloudflare Binding
    if (bucket) {
      await bucket.put(key, buffer, {
        httpMetadata: { contentType: file.type || "audio/mpeg" },
        customMetadata: { title: customTitle || file.name },
      });

      return NextResponse.json({
        success: true,
        message: "Lagu berhasil diunggah ke R2",
        song: {
          key,
          filename: key.replace(MUSIC_PREFIX, ""),
          title: customTitle || file.name,
          url: `https://zpack.my.id/${key}`,
        },
      });
    }

    // B. Upload via S3 Client (Localhost)
    const clientData = getS3Client();
    if (!clientData) {
      return NextResponse.json(
        { success: false, message: "Konfigurasi R2/Env belum lengkap" },
        { status: 500 }
      );
    }

    const { s3, bucketName } = clientData;
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type || "audio/mpeg",
        Metadata: { title: customTitle || file.name },
      })
    );

    return NextResponse.json({
      success: true,
      message: "Lagu berhasil diunggah ke R2",
      song: {
        key,
        filename: key.replace(MUSIC_PREFIX, ""),
        title: customTitle || file.name,
        url: `https://zpack.my.id/${key}`,
      },
    });
  } catch (error: any) {
    console.error("❌ Error Upload R2:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengunggah lagu ke R2" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// 3. DELETE: Hapus File Lagu dari R2
// ----------------------------------------------------
export async function DELETE(request: Request) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Key file tidak diberikan" },
        { status: 400 }
      );
    }

    let bucket: any = null;
    try {
      const { env } = getCloudflareContext();
      bucket = (env as any).MY_BUCKET;
    } catch {
      bucket = null;
    }

    // A. Hapus via Cloudflare Binding
    if (bucket) {
      await bucket.delete(key);
      return NextResponse.json({
        success: true,
        message: `File (${key}) berhasil dihapus dari R2`,
      });
    }

    // B. Hapus via S3 Client (Localhost)
    const clientData = getS3Client();
    if (!clientData) {
      return NextResponse.json(
        { success: false, message: "Konfigurasi R2/Env belum lengkap" },
        { status: 500 }
      );
    }

    const { s3, bucketName } = clientData;
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );

    return NextResponse.json({
      success: true,
      message: `File (${key}) berhasil dihapus dari R2`,
    });
  } catch (error: any) {
    console.error("❌ Error Delete R2:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal menghapus file dari R2" },
      { status: 500 }
    );
  }
}