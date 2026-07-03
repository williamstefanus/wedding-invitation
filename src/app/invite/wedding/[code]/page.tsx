import type { Metadata, ResolvingMetadata } from "next";
import { Heart } from "lucide-react";
import { getInvitationDetails } from "@/lib/actions/invitation";
import { getSettings } from "@/lib/actions/settings";
import { InviteNotFound } from "@/components/invitation/InviteNotFound";
import { WeddingInvitationClient } from "@/components/invitation/wedding/WeddingInvitationClient";
import { LanguageProvider } from "@/contexts/LanguageContext";

interface WeddingInvitePageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata(
  { params }: WeddingInvitePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { code } = await params;

  // 1. Server-Side Fetching (No client side execution)
  const { invitation, error } = await getInvitationDetails(code, "wedding");

  // 2. Graceful Fallbacks
  const guestName = (invitation && !error && invitation.guest?.name) ? invitation.guest.name : "Our Special Guest";

  // Fetch config for dynamic names
  const settingsRes = await getSettings();
  const config = (settingsRes.success ? settingsRes.data?.config : {}) as any;
  const groomName = config?.groom_first_name || "William";
  const brideName = config?.bride_first_name || "Aziel";

  // 3. Dynamic Text Generation
  const title = `Wedding Invitation - ${groomName} & ${brideName}`;
  const description = `Dear ${guestName}, you are joyfully invited to the wedding of ${groomName} & ${brideName} on October 23, 2026. Please open to see the details and RSVP.`;
  const url = `https://wedding-william-aziel.vercel.app/invite/wedding/${code}`;

  // 4. Metadata Specification
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: `${groomName} & ${brideName} Wedding`,
      images: [
        {
          url: "/og-image.jpg",
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

export default async function WeddingInvitePage({
  params,
}: WeddingInvitePageProps) {
  const { code } = await params;

  // Fetch invitation strictly bound to the 'wedding' event type slug
  const { invitation, error } = await getInvitationDetails(code, "wedding");
  const settingsRes = await getSettings();
  const config = (settingsRes.success ? settingsRes.data?.config : {}) as any;

  if (error || !invitation) {
    return <InviteNotFound config={config} />;
  }

  // We have a valid invitation now
  const guest = invitation.guest;

  return (
    <LanguageProvider>
      <WeddingInvitationClient 
        invitation={invitation} 
        code={code} 
        settings={settingsRes.data} 
      />
    </LanguageProvider>
  );
}
