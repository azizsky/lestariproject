
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifyAdminSession,
  ADMIN_SESSION_COOKIE,
} from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  const session = await verifyAdminSession(token);

  if (!session) {
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
