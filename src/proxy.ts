/**
 * Next.js Proxy convention file.
 * Implementation lives inside src/lib/supabase/proxy.ts.
 */
export { proxy } from "@/lib/supabase/proxy";

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
