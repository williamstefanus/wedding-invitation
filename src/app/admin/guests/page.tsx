import { getGuests } from "@/lib/actions/guests";
import { GuestClient } from "./GuestClient";
import type { GuestOwner, GuestCategory } from "@/types";

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
  const limit = 10;

  const { data: guests, total, totalPages } = await getGuests({
    search,
    owner,
    category,
    page,
    limit
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <GuestClient 
        initialGuests={guests || []} 
        total={total || 0}
        totalPages={totalPages || 0}
        currentPage={page}
        currentSearch={search}
        currentOwner={owner}
        currentCategory={category}
      />
    </div>
  );
}
