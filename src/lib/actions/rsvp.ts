"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SubmitRSVPData = {
  invitation_id: string;
  attendance_status: "attending" | "not_attending";
  confirmed_pax: number;
  wish_message?: string;
  selected_session_ids: string[];
  event_slug: string;
  code: string;
};

export async function submitRSVP(data: SubmitRSVPData) {
  try {
    const supabase = await createClient();

    // 1. Verify the invitation and get the deadline
    const { data: invitation, error: invError } = await supabase
      .from("invitations")
      .select("*, event_type:event_types(rsvp_edit_deadline_at)")
      .eq("id", data.invitation_id)
      .single();

    if (invError || !invitation) {
      return { success: false, error: "Invalid invitation." };
    }

    // 2. Check if an RSVP already exists for this invitation (restrict edits after submission)
    const { data: existingRsvp } = await supabase
      .from("rsvps")
      .select("id")
      .eq("invitation_id", data.invitation_id)
      .maybeSingle();

    if (existingRsvp) {
      return {
        success: false,
        error: "You have already submitted your RSVP. Any changes must be confirmed manually by contacting William or Aziel via WhatsApp."
      };
    }

    // 3. Check the deadline (strictly for accepting new RSVPs)
    const deadlineStr = (invitation.event_type as any)?.rsvp_edit_deadline_at;
    if (deadlineStr) {
      const deadline = new Date(deadlineStr).getTime();
      const now = new Date().getTime();
      if (now > deadline) {
        return { success: false, error: "The RSVP deadline has passed. Please contact the couple directly." };
      }
    }

    let rsvpId = null;

    if (rsvpId) {
      // Update existing
      const { error: updateError } = await supabase
        .from("rsvps")
        .update({
          attendance_status: data.attendance_status,
          confirmed_pax: data.confirmed_pax,
          wish_message: data.wish_message || null,
        })
        .eq("id", rsvpId);

      if (updateError) {
        console.error("RSVP Update Error:", updateError);
        return { success: false, error: "Failed to update RSVP." };
      }
    } else {
      // Insert new
      const { data: newRsvp, error: insertError } = await supabase
        .from("rsvps")
        .insert({
          invitation_id: data.invitation_id,
          attendance_status: data.attendance_status,
          confirmed_pax: data.confirmed_pax,
          wish_message: data.wish_message || null,
        })
        .select("id")
        .single();

      if (insertError || !newRsvp) {
        console.error("RSVP Insert Error:", insertError);
        return { success: false, error: "Failed to submit RSVP." };
      }
      rsvpId = newRsvp.id;
    }

    // 4. Update the selected sessions
    // First, delete any existing selected sessions for this RSVP
    await supabase
      .from("rsvp_selected_sessions")
      .delete()
      .eq("rsvp_id", rsvpId);

    // If attending, insert the new selected sessions
    if (data.attendance_status === "attending" && data.selected_session_ids.length > 0) {
      const sessionInserts = data.selected_session_ids.map((sessionId) => ({
        rsvp_id: rsvpId,
        event_session_id: sessionId,
      }));

      const { error: sessionError } = await supabase
        .from("rsvp_selected_sessions")
        .insert(sessionInserts);

      if (sessionError) {
        console.error("RSVP Sessions Error:", sessionError);
        return { success: false, error: "Failed to save event selections." };
      }
    }

    // Revalidate the page so the data reflects the new RSVP state immediately
    revalidatePath(`/invite/${data.event_slug}/${data.code}`);

    return { success: true };
  } catch (error) {
    console.error("Unexpected RSVP error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
