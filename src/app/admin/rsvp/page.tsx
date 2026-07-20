import { Suspense } from "react";
import { getAdminRsvps } from "@/lib/actions/adminRsvp";
import { getSettings } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/server";
import { RsvpClient } from "./RsvpClient";
import { Box, Flex, Spinner, Text } from "@radix-ui/themes";

export const revalidate = 0;

async function RsvpFetcher({ resolvedParams }: { resolvedParams: any }) {
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const tab = typeof resolvedParams.tab === "string" ? resolvedParams.tab : "wedding";
  const owner = typeof resolvedParams.owner === "string" ? resolvedParams.owner : "All";
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : "All";
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : "All";
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort as "az" | "za" | "default" : "default";
  const limit = 10;

  // Map tab to eventType filter
  const eventType = tab === "all" ? "All" : tab;

  const supabase = await createClient();

  const [
    rsvpsRes,
    eventTypesRes,
    eventSessionsRes,
    allInvitationsRes,
    settingsRes
  ] = await Promise.all([
    getAdminRsvps({ search, eventType, owner, category, status, sort, page, limit }),
    supabase.from("event_types").select("id, name, slug"),
    supabase.from("event_sessions").select("id, name, event_type_id").order("sort_order"),
    supabase.from("invitations").select(`
      id,
      max_pax,
      event_type:event_types!inner(slug, name),
      guest:guests!inner(owner),
      rsvp:rsvps(attendance_status, confirmed_pax)
    `),
    getSettings()
  ]);

  const { data: invitations, total, totalPages } = rsvpsRes;
  const { data: eventTypes } = eventTypesRes;
  const { data: eventSessions } = eventSessionsRes;
  const { data: allInvitations } = allInvitationsRes;
  const config = settingsRes.success ? settingsRes.data?.config : {};

  return (
    <RsvpClient 
      initialInvitations={invitations || []} 
      allInvitations={allInvitations || []}
      eventTypes={eventTypes || []}
      eventSessions={eventSessions || []}
      total={total || 0}
      totalPages={totalPages || 0}
      currentPage={page}
      currentSearch={search}
      currentTab={tab}
      currentOwner={owner}
      currentCategory={category}
      currentStatus={status}
      currentSort={sort}
      config={config}
    />
  );
}

function LoadingSkeleton() {
  return (
    <Flex align="center" justify="center" style={{ height: '50vh' }} direction="column" gap="4">
      <Spinner size="3" />
      <Text color="gray">Loading RSVPs...</Text>
    </Flex>
  );
}

export default async function RsvpPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  return (
    <Box className="min-h-screen pb-20">
      <Suspense fallback={<LoadingSkeleton />}>
        <RsvpFetcher resolvedParams={resolvedParams} />
      </Suspense>
    </Box>
  );
}
