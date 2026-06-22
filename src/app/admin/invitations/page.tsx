import { getInvitations } from "@/lib/actions/invitations";
import { createClient } from "@/lib/supabase/server";
import { InvitationClient } from "./InvitationClient";

export const revalidate = 0;

export default async function InvitationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const eventType = typeof resolvedParams.eventType === "string" ? resolvedParams.eventType : "All";
  const limit = 10;

  // Fetch paginated invitations
  const { data: invitations, total, totalPages } = await getInvitations({
    search,
    eventType,
    page,
    limit
  });

  // Fetch full list of guests for the ComboBox (in a real world scenario with 10k+ guests, this would be an API endpoint)
  const supabase = await createClient();
  const { data: guests } = await supabase
    .from("guests")
    .select("id, name, owner, category")
    .order("name");

  // Fetch event types for dropdown
  const { data: eventTypes } = await supabase
    .from("event_types")
    .select("id, name, slug");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <InvitationClient 
        initialInvitations={invitations || []} 
        guests={guests || []}
        eventTypes={eventTypes || []}
        total={total || 0}
        totalPages={totalPages || 0}
        currentPage={page}
        currentSearch={search}
        currentEventType={eventType}
      />
    </div>
  );
}
