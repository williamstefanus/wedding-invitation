import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Must match the secret in auth.ts
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "wedding-invitation-super-secret-key-2026-fallback-only"
);

/**
 * Next.js Proxy handler — enforces basic auth on admin routes.
 */
export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Protect /admin routes, but allow /admin/login
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    const token = request.cookies.get('admin_auth_token')?.value;

    let valid = false;
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        valid = true;
      } catch (e) {
        valid = false;
      }
    }

    if (!valid) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({ request });
}
