import { getGuests } from "@/lib/actions/guests";
import { getSettings } from "@/lib/actions/settings";
import { GuestClient } from "./GuestClient";
import type { GuestOwner, GuestCategory } from "@/types";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const owner = typeof resolvedParams.owner === "string" ? (resolvedParams.owner as GuestOwner | "All") : "All";
  const category = typeof resolvedParams.category === "string" ? (resolvedParams.category as GuestCategory | "All") : "All";
  const tab = typeof resolvedParams.tab === "string" ? resolvedParams.tab : "all";
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort as "az" | "za" | "default" : "default";
  const limit = 10;

  const { data: guests, total, totalPages } = await getGuests({
    search,
    owner,
    category,
    tab,
    sort,
    page,
    limit
  });

  const supabase = await createClient();
  const { data: eventTypes } = await supabase.from("event_types").select("*");
  
  const { data: allInvitations } = await supabase
    .from("invitations")
    .select(`
      id,
      max_pax,
      is_sent,
      event_type:event_types!inner(slug, name),
      guest:guests!inner(owner, category),
      rsvp:rsvps(attendance_status, confirmed_pax)
    `);

  const settingsRes = await getSettings();
  const config = settingsRes.success ? settingsRes.data?.config : {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
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
    </div>
  );
}
