import type { Metadata } from "next";
import { Gem } from "lucide-react";
import { getInvitationDetails } from "@/lib/actions/invitation";
import { InviteNotFound } from "@/components/invitation/InviteNotFound";

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

  // Fetch invitation strictly bound to the 'sangjit' event type slug
  const { invitation, error } = await getInvitationDetails(code, "sangjit");

  if (error || !invitation) {
    return <InviteNotFound />;
  }

  // We have a valid invitation now
  const guest = invitation.guest;

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
