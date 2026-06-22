import { getSeatingData, getEligibleGuests } from "@/lib/actions/seating";
import { SeatingClient } from "./SeatingClient";

export const revalidate = 0;

export default async function SeatingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const event = typeof resolvedParams.event === "string" ? resolvedParams.event : "wedding";
  
  // For the eligible guest search modal
  const guestSearch = typeof resolvedParams.guestSearch === "string" ? resolvedParams.guestSearch : "";
  const guestOwner = typeof resolvedParams.guestOwner === "string" ? resolvedParams.guestOwner : "All";
  const guestCategory = typeof resolvedParams.guestCategory === "string" ? resolvedParams.guestCategory : "All";

  // Fetch tables and assignments
  const { data: tables } = await getSeatingData(event);

  // Fetch eligible guests (only if modal search params or just default load)
  // To avoid huge payloads, we can rely on the Client component to refetch or we can just pass initial.
  // Actually Server Actions can be called from Client to search, so we don't strictly need to pass all eligible guests here if we use a client action.
  // But since we want URL-driven search for the modal, we can fetch here.
  const { data: eligibleGuests } = await getEligibleGuests(event, {
    search: guestSearch,
    owner: guestOwner,
    category: guestCategory
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SeatingClient 
        initialTables={tables || []} 
        initialEligibleGuests={eligibleGuests || []}
        currentEvent={event}
        currentSearch={guestSearch}
        currentOwner={guestOwner}
        currentCategory={guestCategory}
      />
    </div>
  );
}
