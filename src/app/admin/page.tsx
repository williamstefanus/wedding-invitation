import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/actions/settings";
import { DashboardClient } from "./DashboardClient";
import { Box, Flex, Spinner, Text } from "@radix-ui/themes";

export const revalidate = 0;

async function DashboardFetcher() {
  const supabase = await createClient();

  const [
    settingsRes,
    invitationsRes,
    guestsCountRes
  ] = await Promise.all([
    getSettings(),
    supabase.from("invitations").select(`
      id,
      max_pax,
      invitation_code,
      event_type:event_types!inner(slug, name),
      guest:guests!inner(id, name, owner),
      rsvp:rsvps(
        attendance_status, 
        confirmed_pax,
        selected_sessions:rsvp_selected_sessions(
          event_session:event_sessions(name, slug)
        )
      )
    `),
    supabase.from("guests").select("*", { count: "exact", head: true })
  ]);

  const config = settingsRes.success ? settingsRes.data?.config : {};
  const sessions = settingsRes.success ? settingsRes.data?.sessions : {};
  const { data: invitations } = invitationsRes;
  const { count: totalGuestsCount } = guestsCountRes;

  return (
    <DashboardClient 
      invitations={invitations || []} 
      totalGuestsCount={totalGuestsCount || 0} 
      config={config || {}}
      sessions={sessions || {}}
    />
  );
}

function LoadingSkeleton() {
  return (
    <Flex align="center" justify="center" style={{ height: '50vh' }} direction="column" gap="4">
      <Spinner size="3" />
      <Text color="gray">Loading overview data...</Text>
    </Flex>
  );
}

export default async function AdminPage() {
  return (
    <Box className="min-h-screen pb-20">
      <Suspense fallback={<LoadingSkeleton />}>
        <DashboardFetcher />
      </Suspense>
    </Box>
  );
}
