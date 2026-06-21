import type { Metadata } from "next";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Wedding Invitation",
  description: "You are invited to celebrate our wedding.",
};

interface WeddingInvitePageProps {
  params: Promise<{ code: string }>;
}

export default async function WeddingInvitePage({
  params,
}: WeddingInvitePageProps) {
  const { code } = await params;

  // Phase 3: fetch invitation from Supabase here
  // const supabase = await createClient();
  // const { data: invitation } = await supabase
  //   .from("invitations")
  //   .select("*, guest(*), events(*), rsvp(*)")
  //   .eq("code", code)
  //   .eq("event_type", "wedding")
  //   .single();

  // For now, render a shell
  const isValid = !!code && code.length > 0;

  if (!isValid) {
    return <InviteNotFound />;
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4 py-16"
      style={{ background: "var(--surface-invite)" }}
    >
      {/* Decorative rings */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-gold-300/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 text-center animate-fade-in">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/10 ring-1 ring-gold-500/30 animate-pulse-gold">
          <Heart className="h-8 w-8 fill-amber-400 text-amber-400" />
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-2">
          <p
            className="text-xs uppercase tracking-[0.3em] text-ivory-300"
            style={{ color: "var(--text-ivory-muted)", fontFamily: "var(--font-body)" }}
          >
            You are invited to the wedding of
          </p>
          <h1
            className="text-5xl italic"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-ivory)",
              lineHeight: 1.15,
            }}
          >
            William
            <br />
            <span style={{ color: "var(--gold-primary)" }}>&amp;</span>
            <br />
            Aziel
          </h1>
        </div>

        {/* Gold divider */}
        <div className="divider-gold w-48" />

        {/* Coming soon notice */}
        <div
          className="glass-card rounded-2xl px-8 py-6 max-w-md"
        >
          <p
            className="text-sm"
            style={{ color: "var(--text-ivory-muted)" }}
          >
            Dear Guest,
          </p>
          <p
            className="mt-2 text-base font-medium"
            style={{ color: "var(--text-ivory)" }}
          >
            Your invitation is being prepared.
            <br />
            Please check back soon.
          </p>
          <p
            className="mt-4 text-xs font-mono"
            style={{ color: "var(--gold-primary)" }}
          >
            Code: {code}
          </p>
        </div>
      </div>
    </main>
  );
}

function InviteNotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: "var(--surface-invite)" }}
    >
      <div className="text-center space-y-4 animate-fade-in">
        <Heart className="mx-auto h-12 w-12 text-slate-500" />
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-ivory)" }}
        >
          Invitation Not Found
        </h1>
        <p style={{ color: "var(--text-ivory-muted)" }} className="text-sm">
          This invitation link may be invalid or expired.
          <br />
          Please contact the couple for assistance.
        </p>
      </div>
    </main>
  );
}
