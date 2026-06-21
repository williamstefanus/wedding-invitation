import { redirect } from "next/navigation";

/**
 * Root page — redirects immediately to the Admin dashboard.
 * Public invitation pages are accessed via /invite/[eventType]/[code].
 */
export default function RootPage() {
  redirect("/admin");
}
