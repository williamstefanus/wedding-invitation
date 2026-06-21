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
