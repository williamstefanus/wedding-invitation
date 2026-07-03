import type { Metadata, ResolvingMetadata } from "next";
import { getInvitationDetails } from "@/lib/actions/invitation";
import { getSettings } from "@/lib/actions/settings";
import { InviteNotFound } from "@/components/invitation/InviteNotFound";
import { SangjitInvitationClient } from "@/components/invitation/sangjit/SangjitInvitationClient";

interface SangjitInvitePageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata(
  { params }: SangjitInvitePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { code } = await params;

  // 1. Server-Side Fetching (No client side execution)
  const { invitation, error } = await getInvitationDetails(code, "sangjit");

  // 2. Graceful Fallbacks
  const guestName = (invitation && !error && invitation.guest?.name) ? invitation.guest.name : "Our Special Guest";

  // Fetch config for dynamic names
  const settingsRes = await getSettings();
  const config = (settingsRes.success ? settingsRes.data?.config : {}) as any;
  const groomName = config?.groomFirstName || "John";
  const brideName = config?.brideFirstName || "Jane";

  // 3. Dynamic Text Generation
  const title = `Sangjit Invitation - ${brideName} & ${groomName}`;
  const description = `Dear ${guestName}, you are joyfully invited to the Sangjit ceremony of ${brideName} & ${groomName} on October 17, 2026. Please open to see the details and RSVP.`;
  const url = `https://wedding-william-aziel.vercel.app/invite/sangjit/${code}`;

  // 4. Metadata Specification
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: `${brideName} & ${groomName} Sangjit`,
      images: [
        {
          url: "/images/sangjit-thumbnail.png",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function SangjitInvitePage({
  params,
}: SangjitInvitePageProps) {
  const { code } = await params;

  // Fetch invitation strictly bound to the 'sangjit' event type slug
  const { invitation, error } = await getInvitationDetails(code, "sangjit");
  const settingsRes = await getSettings();
  const config = (settingsRes.success ? settingsRes.data?.config : {}) as any;

  if (error || !invitation) {
    return <InviteNotFound config={config} />;
  }

  return (
    <SangjitInvitationClient
      invitation={invitation}
      code={code}
      settings={settingsRes.data}
    />
  );
}
