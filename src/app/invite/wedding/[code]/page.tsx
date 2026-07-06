import type { Metadata } from "next";
import { cache } from "react";
import { getInvitationDetails } from "@/lib/actions/invitation";
import { getSettings } from "@/lib/actions/settings";
import { InviteNotFound } from "@/components/invitation/InviteNotFound";
import { WeddingInvitationClient } from "@/components/invitation/wedding/WeddingInvitationClient";
import { LanguageProvider } from "@/contexts/LanguageContext";

interface WeddingInvitePageProps {
  params: Promise<{ code: string }>;
}

const getWeddingInvitePageData = cache(async (code: string) => {
  const [invitationRes, settingsRes] = await Promise.all([
    getInvitationDetails(code, "wedding"),
    getSettings(),
  ]);

  return { ...invitationRes, settingsRes };
});

export async function generateMetadata(
  { params }: WeddingInvitePageProps
): Promise<Metadata> {
  const { code } = await params;

  const { invitation, error, settingsRes } = await getWeddingInvitePageData(code);

  const guestName = (invitation && !error && invitation.guest?.name) ? invitation.guest.name : "Our Special Guest";

  const config = (settingsRes.success ? settingsRes.data?.config : {}) as any;
  const groomName = config?.groomFirstName || "John";
  const brideName = config?.brideFirstName || "Jane";

  const title = `Wedding Invitation - ${groomName} & ${brideName}`;
  const description = `Dear ${guestName}, you are joyfully invited to the wedding of ${groomName} & ${brideName} on October 23, 2026. Please open to see the details and RSVP.`;
  const url = `https://wedding-william-aziel.vercel.app/invite/wedding/${code}`;

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

  const { invitation, error, settingsRes } = await getWeddingInvitePageData(code);
  const config = (settingsRes.success ? settingsRes.data?.config : {}) as any;

  if (error || !invitation) {
    return <InviteNotFound config={config} />;
  }

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
