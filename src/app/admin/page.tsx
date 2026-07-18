import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/actions/settings";
import { DashboardClient } from "./DashboardClient";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();

  const settingsRes = await getSettings();
  const config = settingsRes.success ? settingsRes.data?.config : {};

  // Fetch invitations with guest owner, confirmed pax, and selected sessions for breakdown
  const { data: invitations } = await supabase
    .from("invitations")
    .select(`
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
    `);

  // Fetch raw guests count
  const { count: totalGuestsCount } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <DashboardClient 
        invitations={invitations || []} 
        totalGuestsCount={totalGuestsCount || 0} 
        config={config || {}}
      />
    </div>
  );
}
