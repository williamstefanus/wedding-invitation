import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { getInvitationDetails } from "@/lib/actions/invitation";
import { getSettings } from "@/lib/actions/settings";
import { InviteNotFound } from "@/components/invitation/InviteNotFound";
import { WeddingInvitationClient } from "@/components/invitation/wedding/WeddingInvitationClient";

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
