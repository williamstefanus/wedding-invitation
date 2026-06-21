import type { Metadata } from "next";
import { Gem } from "lucide-react";

export const metadata: Metadata = {
  title: "Sangjit Invitation",
  description: "You are invited to celebrate our Sangjit ceremony.",
};

interface SangjitInvitePageProps {
  params: Promise<{ code: string }>;
}

export default async function SangjitInvitePage({
  params,
}: SangjitInvitePageProps) {
  const { code } = await params;

  // Phase 3: fetch sangjit invitation from Supabase here
  // const supabase = await createClient();
  // const { data: invitation } = await supabase
  //   .from("invitations")
  //   .select("*, guest(*), events(*), rsvp(*)")
  //   .eq("code", code)
  //   .eq("event_type", "sangjit")
  //   .single();

  const isValid = !!code && code.length > 0;

  if (!isValid) {
    return <InviteNotFound />;
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4 py-16"
      style={{
        background:
          "linear-gradient(135deg, #1a0f1f 0%, #2d1b2e 50%, #1a0f1f 100%)",
      }}
    >
      {/* Decorative */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-60 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-rose-800/10 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-amber-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 text-center animate-fade-in">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 ring-1 ring-rose-400/30">
          <Gem className="h-8 w-8 text-rose-300" />
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-2">
          <p
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "#c5bd88", fontFamily: "var(--font-body)" }}
          >
            Sangjit Ceremony
          </p>
          <h1
            className="text-5xl italic"
            style={{
              fontFamily: "var(--font-display)",
              color: "#faf9f0",
              lineHeight: 1.15,
            }}
          >
            William
            <br />
            <span style={{ color: "#e3b528" }}>&amp;</span>
            <br />
            Aziel
          </h1>
        </div>

        {/* Divider */}
        <div className="divider-gold w-48" />

        {/* Placeholder card */}
        <div className="glass-card rounded-2xl px-8 py-6 max-w-md">
          <p className="text-sm" style={{ color: "#c5bd88" }}>
            Dear Guest,
          </p>
          <p
            className="mt-2 text-base font-medium"
            style={{ color: "#faf9f0" }}
          >
            Your Sangjit invitation is being prepared.
            <br />
            Please check back soon.
          </p>
          <p className="mt-4 text-xs font-mono" style={{ color: "#e3b528" }}>
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
      style={{
        background:
          "linear-gradient(135deg, #1a0f1f 0%, #2d1b2e 50%, #1a0f1f 100%)",
      }}
    >
      <div className="text-center space-y-4 animate-fade-in">
        <Gem className="mx-auto h-12 w-12 text-slate-500" />
        <h1 className="text-2xl font-semibold" style={{ color: "#faf9f0" }}>
          Invitation Not Found
        </h1>
        <p className="text-sm" style={{ color: "#c5bd88" }}>
          This invitation link may be invalid or expired.
          <br />
          Please contact the couple for assistance.
        </p>
      </div>
    </main>
  );
}
