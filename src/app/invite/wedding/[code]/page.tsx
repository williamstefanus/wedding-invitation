import type { Metadata, ResolvingMetadata } from "next";
import { Heart } from "lucide-react";
import { getInvitationDetails } from "@/lib/actions/invitation";
import { getSettings } from "@/lib/actions/settings";
import { InviteNotFound } from "@/components/invitation/InviteNotFound";
import { WeddingInvitationClient } from "@/components/invitation/wedding/WeddingInvitationClient";

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
  const guestName = (invitation && !error) ? invitation.guest.name : "Our Special Guest";

  // 3. Dynamic Text Generation
  const title = "Wedding Invitation - William & Aziel";
  const description = `Dear ${guestName}, you are joyfully invited to the wedding of William & Aziel on October 23, 2026. Please open to see the details and RSVP.`;
  const url = `https://wedding-william-aziel.vercel.app/invite/wedding/${code}`;

  // 4. Metadata Specification
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "William & Aziel Wedding",
      images: [
        {
          url: "/assets/og-image.jpg",
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

  if (error || !invitation) {
    return <InviteNotFound />;
  }

  // We have a valid invitation now
  const guest = invitation.guest;

  return (
    <WeddingInvitationClient 
      invitation={invitation} 
      code={code} 
      settings={settingsRes.data} 
    />
  );
}
