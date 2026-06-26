import type { Metadata } from "next";
import { getInvitationDetails } from "@/lib/actions/invitation";
import { getSettings } from "@/lib/actions/settings";
import { InviteNotFound } from "@/components/invitation/InviteNotFound";
import { SangjitInvitationClient } from "@/components/invitation/sangjit/SangjitInvitationClient";

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
  const settingsRes = await getSettings();

  if (error || !invitation) {
    return <InviteNotFound />;
  }

  return (
    <SangjitInvitationClient
      invitation={invitation}
      code={code}
      settings={settingsRes.data}
    />
  );
}
