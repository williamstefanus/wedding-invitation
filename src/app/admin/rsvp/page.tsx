import { getAdminRsvps } from "@/lib/actions/adminRsvp";
import { getSettings } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/server";
import { RsvpClient } from "./RsvpClient";
import { Box } from "@radix-ui/themes";

export const revalidate = 0;

export default async function RsvpPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const tab = typeof resolvedParams.tab === "string" ? resolvedParams.tab : "all";
  const owner = typeof resolvedParams.owner === "string" ? resolvedParams.owner : "All";
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : "All";
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : "All";
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort as "az" | "za" | "default" : "default";
  const limit = 10;

  // Map tab to eventType filter
  const eventType = tab === "all" ? "All" : tab;

  // Fetch paginated RSVPs
  const { data: invitations, total, totalPages } = await getAdminRsvps({
    search,
    eventType,
    owner,
    category,
    status,
    sort,
    page,
    limit
  });

  const supabase = await createClient();

  // Fetch event types for tabs
  const { data: eventTypes } = await supabase
    .from("event_types")
    .select("id, name, slug");

  // Fetch all event sessions to populate Edit Modal
  const { data: eventSessions } = await supabase
    .from("event_sessions")
    .select("id, name, event_type_id")
    .order("sort_order");

  const { data: allInvitations } = await supabase
    .from("invitations")
    .select(`
      id,
      max_pax,
      event_type:event_types!inner(slug, name),
      guest:guests!inner(owner),
      rsvp:rsvps(attendance_status, confirmed_pax)
    `);

  const settingsRes = await getSettings();
  const config = settingsRes.success ? settingsRes.data?.config : {};

  return (
    <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-1)", paddingBottom: "80px" }}>
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
    </Box>
  );
}
