import { Suspense } from "react";
import { getSeatingData, getEligibleGuests } from "@/lib/actions/seating";
import { createClient } from "@/lib/supabase/server";
import { SeatingClient } from "./SeatingClient";
import { Box, Flex, Spinner, Text } from "@radix-ui/themes";

export const revalidate = 0;

async function SeatingFetcher({ resolvedParams }: { resolvedParams: any }) {
  const event = typeof resolvedParams.event === "string" ? resolvedParams.event : "wedding";
  
  // For the eligible guest search modal
  const guestSearch = typeof resolvedParams.guestSearch === "string" ? resolvedParams.guestSearch : "";
  const guestOwner = typeof resolvedParams.guestOwner === "string" ? resolvedParams.guestOwner : "All";
  const guestCategory = typeof resolvedParams.guestCategory === "string" ? resolvedParams.guestCategory : "All";

  const supabase = await createClient();

  const [
    tablesRes,
    eligibleGuestsRes,
    invitationsRes
  ] = await Promise.all([
    getSeatingData(event),
    getEligibleGuests(event, { search: guestSearch, owner: guestOwner, category: guestCategory }),
    supabase.from("invitations").select(`
      max_pax,
      event_type:event_types!inner(slug),
      rsvp:rsvps(attendance_status, confirmed_pax)
    `).eq("event_type.slug", event)
  ]);

  const { data: tables } = tablesRes;
  const { data: eligibleGuests } = eligibleGuestsRes;
  const { data: eventInvitations } = invitationsRes;

  const totalAttendingPax = (eventInvitations || []).reduce((sum: number, inv: any) => {
    const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
    if (rsvp?.attendance_status === "attending") {
      return sum + (rsvp.confirmed_pax || 0);
    }
    return sum;
  }, 0);
  const totalInvitedPax = (eventInvitations || []).reduce((sum: number, inv: any) => sum + (inv.max_pax || 0), 0);
  const allPax = totalAttendingPax > 0 ? totalAttendingPax : totalInvitedPax;

  return (
    <SeatingClient 
      initialTables={tables || []} 
      initialEligibleGuests={eligibleGuests || []}
      allPax={allPax}
      currentEvent={event}
      currentSearch={guestSearch}
      currentOwner={guestOwner}
      currentCategory={guestCategory}
    />
  );
}

function LoadingSkeleton() {
  return (
    <Flex align="center" justify="center" style={{ height: '50vh' }} direction="column" gap="4">
      <Spinner size="3" />
      <Text color="gray">Loading seating data...</Text>
    </Flex>
  );
}

export default async function SeatingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  return (
    <Box className="min-h-screen pb-20">
      <Suspense fallback={<LoadingSkeleton />}>
        <SeatingFetcher resolvedParams={resolvedParams} />
      </Suspense>
    </Box>
  );
}
