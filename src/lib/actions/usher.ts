"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function verifyWoPin(pin: string) {
  try {
    const supabase = await createClient();
    const { data: settingsRow } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "wedding_config")
      .maybeSingle();

    const config = settingsRow?.value ? (typeof settingsRow.value === "string" ? JSON.parse(settingsRow.value) : settingsRow.value) : {};
    const validPin = config.woPin || "123456"; // default PIN if not set in admin

    if (pin.trim() === validPin) {
      return { success: true };
    }
    return { success: false, error: "Invalid PIN code. Please try again." };
  } catch (error: any) {
    console.error("verifyWoPin error:", error);
    return { success: false, error: error.message };
  }
}

export async function getUsherRoster(eventSlug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("invitations")
      .select(`
        id,
        invitation_code,
        max_pax,
        checked_in_at,
        checked_in_pax,
        event_type:event_types!inner(slug),
        guest:guests!inner(name, owner, category, notes),
        rsvp:rsvps(attendance_status, confirmed_pax),
        seating_assignment:seating_assignments(
          assigned_pax,
          seating_table:seating_tables(table_name)
        )
      `)
      .eq("event_type.slug", eventSlug)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("getUsherRoster error:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function checkInGuest(invitationId: string, actualPax: number, isCheckingIn: boolean) {
  try {
    const supabase = await createClient();
    const updates = isCheckingIn
      ? {
          checked_in_at: new Date().toISOString(),
          checked_in_pax: actualPax
        }
      : {
          checked_in_at: null,
          checked_in_pax: null
        };

    const { error } = await supabase
      .from("invitations")
      .update(updates)
      .eq("id", invitationId);

    if (error) throw error;

    revalidatePath("/usher");
    return { success: true };
  } catch (error: any) {
    console.error("checkInGuest error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateGuestVipStatus(guestId: string, notes: string | null) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("guests").update({ notes }).eq("id", guestId);
    if (error) throw error;
    revalidatePath("/usher");
    return { success: true };
  } catch (error: any) {
    console.error("updateGuestVipStatus error:", error);
    return { success: false, error: error.message };
  }
}

