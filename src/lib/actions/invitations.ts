"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateInvitationCode } from "@/lib/utils";

export async function getInvitations({ 
  search, 
  eventType, 
  page = 1, 
  limit = 10 
}: { 
  search?: string;
  eventType?: string | "All";
  page?: number;
  limit?: number;
}) {
  try {
    const supabase = await createClient();
    
    // We need to fetch invitations and join with guests and event_types
    let query = supabase.from("invitations").select(`
      *,
      guest:guests!inner(*),
      event_type:event_types!inner(*),
      rsvp:rsvps(attendance_status, confirmed_pax),
      seating_assignment:seating_assignments(assigned_pax, seating_table:seating_tables(table_name))
    `, { count: "exact" });

    if (search) {
      query = query.ilike("guest.name", `%${search}%`);
    }

    if (eventType && eventType !== "All") {
      query = query.eq("event_type.slug", eventType);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) throw error;

    return { 
      success: true, 
      data: data as any[], 
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    };
  } catch (error: any) {
    console.error("Failed to fetch invitations:", error);
    return { success: false, error: error.message, data: [], total: 0, totalPages: 0 };
  }
}

export async function createInvitation({ 
  guest_id, 
  event_type_id, 
  max_pax,
  guest_name 
}: { 
  guest_id: string; 
  event_type_id: string; 
  max_pax: number;
  guest_name: string;
}) {
  try {
    const supabase = await createClient();
    
    // Check for duplicates
    const { data: existing } = await supabase
      .from("invitations")
      .select("id")
      .eq("guest_id", guest_id)
      .eq("event_type_id", event_type_id)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "This guest already has an invitation for this event." };
    }

    const invitation_code = generateInvitationCode(guest_name);

    const { error } = await supabase.from("invitations").insert({
      guest_id,
      event_type_id,
      max_pax,
      invitation_code
    });

    if (error) {
      if (error.code === '23505') { // unique violation code
        // Rare chance of collision, theoretically we should loop and regenerate, but 
        // 4 random chars is large enough for a small wedding list.
        return { success: false, error: "Collision occurred, please try again." };
      }
      throw error;
    }

    revalidatePath("/admin/invitations");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create invitation:", error);
    return { success: false, error: error.message };
  }
}

export async function updateMaxPax(id: string, max_pax: number) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("invitations")
      .update({ max_pax })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/invitations");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update max pax:", error);
    return { success: false, error: error.message };
  }
}

export async function regenerateLink(id: string, guest_name: string) {
  try {
    const supabase = await createClient();
    const newCode = generateInvitationCode(guest_name);

    const { error } = await supabase
      .from("invitations")
      .update({ invitation_code: newCode })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/invitations");
    return { success: true, newCode };
  } catch (error: any) {
    console.error("Failed to regenerate link:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteInvitation(id: string) {
  try {
    const supabase = await createClient();
    
    // Note: RSVP and seating data will be deleted automatically due to ON DELETE CASCADE
    // defined in Supabase schema. The UI should warn the user.
    const { error } = await supabase
      .from("invitations")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/invitations");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete invitation:", error);
    return { success: false, error: error.message };
  }
}
