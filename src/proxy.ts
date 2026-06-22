import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js Proxy — runs on every request to refresh Supabase session cookies.
 * Auth guard logic lives in src/lib/supabase/proxy.ts (commented-out stub).
 */
export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Intercept Admin Routes for Basic Auth
  if (url.pathname.startsWith('/admin')) {
    const basicAuth = request.headers.get('authorization');
    
    const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'wedding2026';

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      if (user === ADMIN_USER && pwd === ADMIN_PASS) {
        return await updateSession(request);
      }
    }

    return new NextResponse('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
      },
    });
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *  - _next/static (static files)
     *  - _next/image  (image optimisation)
     *  - favicon.ico
     *  - public files (svg, png, jpg, …)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
