import type { Metadata } from "next";
import { cache } from "react";
import { getInvitationDetails } from "@/lib/actions/invitation";
import { getSettings } from "@/lib/actions/settings";
import { InviteNotFound } from "@/components/invitation/InviteNotFound";
import { SangjitInvitationClient } from "@/components/invitation/sangjit/SangjitInvitationClient";
import { LanguageProvider } from "@/contexts/LanguageContext";

interface SangjitInvitePageProps {
  params: Promise<{ code: string }>;
}

const getSangjitInvitePageData = cache(async (code: string) => {
  const [invitationRes, settingsRes] = await Promise.all([
    getInvitationDetails(code, "sangjit"),
    getSettings(),
  ]);

  return { ...invitationRes, settingsRes };
});

export async function generateMetadata(
  { params }: SangjitInvitePageProps
): Promise<Metadata> {
  const { code } = await params;

  const { invitation, error, settingsRes } = await getSangjitInvitePageData(code);

  const guestName = (invitation && !error && invitation.guest?.name) ? invitation.guest.name : "Our Special Guest";

  const config = (settingsRes.success ? settingsRes.data?.config : {}) as any;
  const groomName = config?.groomFirstName || "John";
  const brideName = config?.brideFirstName || "Jane";

  const title = `Sangjit Invitation - ${brideName} & ${groomName}`;
  const description = `Dear ${guestName}, you are joyfully invited to the Sangjit ceremony of ${brideName} & ${groomName} on October 17, 2026. Please open to see the details and RSVP.`;
  const url = `https://wedding-william-aziel.vercel.app/invite/sangjit/${code}`;

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

  const { invitation, error, settingsRes } = await getSangjitInvitePageData(code);
  const config = (settingsRes.success ? settingsRes.data?.config : {}) as any;

  if (error || !invitation) {
    return <InviteNotFound config={config} />;
  }

  return (
    <LanguageProvider>
      <SangjitInvitationClient
        invitation={invitation}
        code={code}
        settings={settingsRes.data}
      />
    </LanguageProvider>
  );
}
