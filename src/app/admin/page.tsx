import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./DashboardClient";

export const revalidate = 0; // Disable caching for the admin dashboard

export default async function AdminPage() {
  const supabase = await createClient();

  // Fetch all invitations and inner join event_types, left join rsvps
  const { data: invitations, error: inviteError } = await supabase
    .from("invitations")
    .select(`
      id,
      max_pax,
      invitation_code,
      event_type:event_types!inner(slug, name),
      rsvp:rsvps(attendance_status, confirmed_pax)
    `);

  // Optionally fetch raw guests count
  const { count: totalGuestsCount, error: guestsError } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true });

  if (inviteError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-slate-600">{inviteError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <DashboardClient 
        invitations={invitations || []} 
        totalGuestsCount={totalGuestsCount || 0} 
      />
    </div>
  );
}
