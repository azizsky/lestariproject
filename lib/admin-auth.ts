
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 60 * 60 * 24; // 24 jam

function getSessionSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET belum dikonfigurasi dengan benar.");
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminSession(username: string) {
  const secret = getSessionSecret();

  return await new SignJWT({
    role: "admin",
    username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secret);
}

export async function verifyAdminSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
    });

    if (
      payload.role !== "admin" ||
      typeof payload.username !== "string" ||
      !payload.username
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME;
export const ADMIN_SESSION_MAX_AGE = SESSION_DURATION;
