import { Suspense } from "react";
import { getGuests } from "@/lib/actions/guests";
import { getSettings } from "@/lib/actions/settings";
import { GuestClient } from "./GuestClient";
import type { GuestOwner, GuestCategory } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { Flex, Spinner, Text, Box } from "@radix-ui/themes";

export const revalidate = 0;

async function GuestFetcher({ resolvedParams }: { resolvedParams: any }) {
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const owner = typeof resolvedParams.owner === "string" ? (resolvedParams.owner as GuestOwner | "All") : "All";
  const category = typeof resolvedParams.category === "string" ? (resolvedParams.category as GuestCategory | "All") : "All";
  const tab = typeof resolvedParams.tab === "string" ? resolvedParams.tab : "all";
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort as "az" | "za" | "default" : "default";
  const limit = 10;

  const supabase = await createClient();

  const [
    guestsRes,
    eventTypesRes,
    invitationsRes,
    settingsRes
  ] = await Promise.all([
    getGuests({ search, owner, category, tab, sort, page, limit }),
    supabase.from("event_types").select("*"),
    supabase.from("invitations").select(`
      id,
      max_pax,
      is_sent,
      event_type:event_types!inner(slug, name),
      guest:guests!inner(owner, category),
      rsvp:rsvps(attendance_status, confirmed_pax)
    `),
    getSettings()
  ]);

  const { data: guests, total, totalPages } = guestsRes;
  const { data: eventTypes } = eventTypesRes;
  const { data: allInvitations } = invitationsRes;
  const config = settingsRes.success ? settingsRes.data?.config : {};

  return (
    <GuestClient 
      initialGuests={guests || []} 
      allInvitations={allInvitations || []}
      total={total || 0}
      totalPages={totalPages || 0}
      currentPage={page}
      currentSearch={search}
      currentOwner={owner}
      currentCategory={category}
      currentTab={tab}
      currentSort={sort}
      eventTypes={eventTypes || []}
      config={config}
    />
  );
}

function LoadingSkeleton() {
  return (
    <Flex align="center" justify="center" style={{ height: '50vh' }} direction="column" gap="4">
      <Spinner size="3" />
      <Text color="gray">Loading guest data...</Text>
    </Flex>
  );
}

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  return (
    <Box className="min-h-screen pb-20">
      <Suspense fallback={<LoadingSkeleton />}>
        <GuestFetcher resolvedParams={resolvedParams} />
      </Suspense>
    </Box>
  );
}
