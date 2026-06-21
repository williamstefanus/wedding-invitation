import { createClient } from "@/lib/supabase/server";
import type { InvitationWithDetails, Settings } from "@/types";

export async function getInvitationDetails(
  code: string,
  eventTypeSlug: string
): Promise<{ invitation: InvitationWithDetails | null; settings: Record<string, any> | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // Fetch the single invitation joined with all relevant nested data
    // !inner is used on event_types to ensure we strictly filter by the provided eventTypeSlug
    const { data: invitation, error: inviteError } = await supabase
      .from("invitations")
      .select(
        `
        *,
        guest:guests(*),
        event_type:event_types!inner(
          *,
          sessions:event_sessions(*),
          gallery:gallery_images(*)
        ),
        rsvp:rsvps(
          *,
          selected_sessions:rsvp_selected_sessions(*)
        ),
        seating_assignment:seating_assignments(
          *,
          seating_table:seating_tables(*)
        )
      `
      )
      .eq("invitation_code", code)
      .eq("event_type.slug", eventTypeSlug)
      .maybeSingle();

    if (inviteError) {
      console.error("Supabase Error fetching invitation:", inviteError);
      return { invitation: null, settings: null, error: "Failed to load invitation" };
    }

    if (!invitation) {
      return { invitation: null, settings: null, error: "Invitation not found" };
    }

    // Fetch global settings
    const { data: settingsData, error: settingsError } = await supabase
      .from("settings")
      .select("*");

    let settingsPayload: Record<string, any> = {};
    if (!settingsError && settingsData) {
      settingsData.forEach((s) => {
        settingsPayload[s.key] = s.value;
      });
    }

    // Type casting to InvitationWithDetails since the Supabase generated types 
    // are wide and nested queries return arrays for 1:N relations, 
    // but the `maybeSingle` and nested structures match our domain types conceptually.
    return {
      invitation: invitation as unknown as InvitationWithDetails,
      settings: settingsPayload,
      error: null,
    };
  } catch (err) {
    console.error("Unexpected error fetching invitation:", err);
    return { invitation: null, settings: null, error: "Unexpected error" };
  }
}
