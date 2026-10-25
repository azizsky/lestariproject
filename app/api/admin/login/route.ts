
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  createAdminSession,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

async function queryRemoteD1(sql: string, params: unknown[] = []) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error("Konfigurasi Cloudflare D1 belum lengkap.");
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

  if (!res.ok || !json.success) {
    throw new Error("Query Cloudflare D1 gagal.");
  }

  return json.result?.[0]?.results ?? [];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body ?? {};

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password ||
      username.length > 100 ||
      password.length > 1024
    ) {
      return NextResponse.json(
        { success: false, message: "Username atau password tidak valid." },
        { status: 400 }
      );
    }

    const users = await queryRemoteD1(
      "SELECT id, username, password FROM admins WHERE username = ? LIMIT 1",
      [username.trim()]
    );

    const admin = users[0];

    if (
      !admin ||
      typeof admin.password !== "string" ||
      !(await bcrypt.compare(password, admin.password))
    ) {
      return NextResponse.json(
        { success: false, message: "Username atau password salah." },
        { status: 401 }
      );
    }

    const token = await createAdminSession(admin.username);

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil!",
    });

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Login admin gagal:", error);

    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
