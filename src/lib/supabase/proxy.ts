import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

/**
 * Refreshes Supabase session cookies in the middleware layer.
 * Must be called in src/middleware.ts to keep sessions alive.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — do NOT remove this line.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ─── Auth guard stub ─────────────────────────────────────────────────────
  // Uncomment and adapt to protect admin routes when auth is enabled:
  //
  // const pathname = request.nextUrl.pathname;
  // if (!user && pathname.startsWith("/admin")) {
  //   const loginUrl = request.nextUrl.clone();
  //   loginUrl.pathname = "/login";
  //   return NextResponse.redirect(loginUrl);
  // }
  // ─────────────────────────────────────────────────────────────────────────

  void user; // suppress unused variable warning until auth is wired up

  return supabaseResponse;
}

import { jwtVerify } from "jose";

// Must match the secret in auth.ts
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "wedding-invitation-super-secret-key-2026-fallback-only"
);

/**
 * Next.js Proxy handler — refreshes Supabase sessions and enforces basic auth on admin routes.
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

  return await updateSession(request);
}
