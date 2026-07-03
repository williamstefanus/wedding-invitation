import { Heart } from "lucide-react";

export function InviteNotFound({ config = {} }: { config?: any }) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: "var(--surface-invite)" }}
    >
      <div className="text-center space-y-4 animate-fade-in max-w-md">
        <Heart className="mx-auto h-12 w-12 text-slate-500" />
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-ivory)" }}
        >
          Invitation Not Found
        </h1>
        <p style={{ color: "var(--text-ivory-muted)" }} className="text-sm">
          We are sorry, this invitation link is invalid or no longer available.
          <br />
          Please check the link again or contact {config.groomFirstName || "John"} / {config.brideFirstName || "Jane"} for assistance.
        </p>
      </div>
    </main>
  );
}
