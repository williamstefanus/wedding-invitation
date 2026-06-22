"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Initialization Action
export async function initializeTables() {
  try {
    const supabase = await createClient();

    // Get Event Types
    const { data: eventTypes, error: etError } = await supabase.from("event_types").select("id, slug");
    if (etError) throw etError;

    const weddingId = eventTypes.find(et => et.slug === "wedding")?.id;
    const sangjitId = eventTypes.find(et => et.slug === "sangjit")?.id;

    if (!weddingId || !sangjitId) throw new Error("Event types not found");

    // Check if tables already exist
    const { count } = await supabase.from("seating_tables").select("*", { count: "exact", head: true });
    if (count && count > 0) return { success: true, message: "Tables already initialized." };

    const inserts = [];

    // Wedding: 23 tables
    for (let i = 1; i <= 23; i++) {
      inserts.push({
        event_type_id: weddingId,
        table_name: `Table ${i}`,
        capacity: 10,
        sort_order: i
      });
    }

    // Sangjit: 40 tables
    for (let i = 1; i <= 40; i++) {
      inserts.push({
        event_type_id: sangjitId,
        table_name: `Table ${i}`,
        capacity: 10,
        sort_order: i
      });
    }

    const { error: insertError } = await supabase.from("seating_tables").insert(inserts);
    if (insertError) throw insertError;

    revalidatePath("/admin/seating");
    return { success: true, message: "Tables initialized successfully." };
  } catch (error: any) {
    console.error("Failed to initialize tables:", error);
    return { success: false, error: error.message };
  }
}

// Fetch seating data
export async function getSeatingData(eventTypeSlug: string) {
  try {
    const supabase = await createClient();

    // Fetch tables for the selected event type, including their assignments
    const { data, error } = await supabase
      .from("seating_tables")
      .select(`
        *,
        event_type:event_types!inner(slug),
        assignments:seating_assignments(
          id,
          assigned_pax,
          invitation:invitations(
            id,
            max_pax,
            guest:guests(name, owner, category)
          )
        )
      `)
      .eq("event_type.slug", eventTypeSlug)
      .order("sort_order");

    if (error) throw error;

    return { success: true, data: data as any[] };
  } catch (error: any) {
    console.error("Failed to fetch seating data:", error);
    return { success: false, error: error.message, data: [] };
  }
}

// Get Eligible Guests
export async function getEligibleGuests(eventTypeSlug: string, searchParams: { search?: string, owner?: string, category?: string }) {
  try {
    const supabase = await createClient();

    // Eligible guest: 
    // 1. Has invitation for this event type
    // 2. RSVP attendance_status = 'attending'
    // 3. Not currently assigned to a seating table for this event type

    let query = supabase.from("invitations").select(`
      id,
      guest_id,
      max_pax,
      event_type:event_types!inner(slug),
      guest:guests!inner(name, owner, category),
      rsvp:rsvps!inner(attendance_status, confirmed_pax),
      seating_assignment:seating_assignments(id)
    `);

    query = query.eq("event_type.slug", eventTypeSlug);
    query = query.eq("rsvp.attendance_status", "attending");

    if (searchParams.search) {
      query = query.ilike("guest.name", `%${searchParams.search}%`);
    }
    if (searchParams.owner && searchParams.owner !== "All") {
      query = query.eq("guest.owner", searchParams.owner);
    }
    if (searchParams.category && searchParams.category !== "All") {
      query = query.eq("guest.category", searchParams.category);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Filter out those who already have a seating assignment
    const eligibleData = (data as any[]).filter(inv => !inv.seating_assignment || inv.seating_assignment.length === 0);

    return { success: true, data: eligibleData };
  } catch (error: any) {
    console.error("Failed to fetch eligible guests:", error);
    return { success: false, error: error.message, data: [] };
  }
}

// Assign Guest
export async function assignGuestToTable({
  invitation_id,
  seating_table_id,
  assigned_pax
}: {
  invitation_id: string;
  seating_table_id: string;
  assigned_pax: number;
}) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from("seating_assignments").insert({
      invitation_id,
      seating_table_id,
      assigned_pax
    });

    if (error) throw error;

    revalidatePath("/admin/seating");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to assign guest:", error);
    return { success: false, error: error.message };
  }
}

// Remove Guest
export async function removeGuestFromTable(assignment_id: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from("seating_assignments").delete().eq("id", assignment_id);

    if (error) throw error;

    revalidatePath("/admin/seating");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to remove guest:", error);
    return { success: false, error: error.message };
  }
}

// Update Capacity
export async function updateTableCapacity(table_id: string, new_capacity: number) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from("seating_tables").update({ capacity: new_capacity }).eq("id", table_id);

    if (error) throw error;

    revalidatePath("/admin/seating");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update capacity:", error);
    return { success: false, error: error.message };
  }
}
