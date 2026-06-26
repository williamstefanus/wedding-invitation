"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminRsvps({
  search,
  eventType,
  owner,
  category,
  status,
  sort,
  page = 1,
  limit = 10
}: {
  search?: string;
  eventType?: string | "All";
  owner?: string | "All";
  category?: string | "All";
  status?: string | "All";
  sort?: "az" | "za" | "default";
  page?: number;
  limit?: number;
}) {
  try {
    const supabase = await createClient();

    // Query invitations and left join rsvps. This allows us to see "Pending" RSVPs.
    let query = supabase.from("invitations").select(`
      *,
      guest:guests!inner(*),
      event_type:event_types!inner(*),
      rsvp:rsvps(
        id, 
        attendance_status, 
        confirmed_pax, 
        wish_message, 
        submitted_at,
        selected_sessions:rsvp_selected_sessions(event_session_id)
      ),
      seating_assignment:seating_assignments(id, assigned_pax, seating_table:seating_tables(table_name))
    `, { count: "exact" });

    // Apply filters
    if (search) {
      query = query.ilike("guest.name", `%${search}%`);
    }

    if (eventType && eventType !== "All") {
      query = query.eq("event_type.slug", eventType);
    }

    if (owner && owner !== "All") {
      query = query.eq("guest.owner", owner);
    }

    if (category && category !== "All") {
      query = query.eq("guest.category", category);
    }

    // Status filtering is tricky with left join. We'll handle it below if possible, 
    // or we might need to filter manually if Supabase doesn't support complex filtering on left joined non-existent rows.
    // Actually, Supabase doesn't natively support filtering by a left joined table being null easily through the nested syntax without `!inner`.
    // Wait, we can do it! To filter for "Pending", we need `rsvps` to be empty.
    // Since Supabase's JS client doesn't easily allow filtering on `rsvps IS NULL` when rsvps is a 1-to-0..1 relation via standard `.eq()`, 
    // we might have to fetch and filter in memory if it's small, OR we can fetch without status filter and apply the status filter in code.
    // For MVP, if status filter is applied, let's fetch all and filter in memory. (Not ideal for 10,000+ but fine for 1000).
    
    // So let's fetch all (up to 10000) if status filter is applied, and then paginate manually. 
    // If no status filter, we can use DB pagination.
    const isStatusFiltered = status && status !== "All";

    if (!isStatusFiltered) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      if (sort === "az") {
        query = query.order("guest(name)", { ascending: true }).range(from, to);
      } else if (sort === "za") {
        query = query.order("guest(name)", { ascending: false }).range(from, to);
      } else {
        query = query.order("created_at", { ascending: false }).range(from, to);
      }
    }

    const { data, count, error } = await query;
    if (error) throw error;

    let processedData = data as any[];

    if (isStatusFiltered) {
      processedData = processedData.filter(inv => {
        let currentStatus = "pending";
        if (inv.rsvp) {
          if (Array.isArray(inv.rsvp) && inv.rsvp.length > 0) {
            currentStatus = inv.rsvp[0].attendance_status;
          } else if (!Array.isArray(inv.rsvp)) {
            currentStatus = inv.rsvp.attendance_status;
          }
        }
        return currentStatus === status;
      });
      // Manual pagination
      const totalFiltered = processedData.length;
      const from = (page - 1) * limit;
      processedData = processedData.slice(from, from + limit);
      
      return {
        success: true,
        data: processedData,
        total: totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit)
      };
    }

    return { 
      success: true, 
      data: processedData, 
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    };
  } catch (error: any) {
    console.error("Failed to fetch RSVPs:", error);
    return { success: false, error: error.message, data: [], total: 0, totalPages: 0 };
  }
}

export async function getAllRsvpsForExport(filters: any) {
  try {
    const supabase = await createClient();
    
    // Fetch all records ignoring pagination
    let query = supabase.from("invitations").select(`
      *,
      guest:guests!inner(*),
      event_type:event_types!inner(*),
      rsvp:rsvps(
        id, 
        attendance_status, 
        confirmed_pax, 
        wish_message, 
        submitted_at
      ),
      seating_assignment:seating_assignments(assigned_pax, seating_table:seating_tables(table_name))
    `);

    if (filters.search) query = query.ilike("guest.name", `%${filters.search}%`);
    if (filters.eventType && filters.eventType !== "All") query = query.eq("event_type.slug", filters.eventType);
    if (filters.owner && filters.owner !== "All") query = query.eq("guest.owner", filters.owner);
    if (filters.category && filters.category !== "All") query = query.eq("guest.category", filters.category);

    const { data, error } = await query;
    if (error) throw error;

    let processedData = data as any[];

    if (filters.status && filters.status !== "All") {
      processedData = processedData.filter(inv => {
        let currentStatus = "pending";
        if (inv.rsvp) {
          if (Array.isArray(inv.rsvp) && inv.rsvp.length > 0) {
            currentStatus = inv.rsvp[0].attendance_status;
          } else if (!Array.isArray(inv.rsvp)) {
            currentStatus = inv.rsvp.attendance_status;
          }
        }
        return currentStatus === filters.status;
      });
    }

    return { success: true, data: processedData };
  } catch (error: any) {
    console.error("Failed to fetch RSVPs for export:", error);
    return { success: false, error: error.message };
  }
}

export async function adminUpdateRsvp({
  invitation_id,
  attendance_status,
  confirmed_pax,
  selected_session_ids
}: {
  invitation_id: string;
  attendance_status: "attending" | "not_attending";
  confirmed_pax: number;
  selected_session_ids: string[];
}) {
  try {
    const supabase = await createClient();

    // Upsert the RSVP
    const { data: rsvp, error: rsvpError } = await supabase
      .from("rsvps")
      .upsert({
        invitation_id,
        attendance_status,
        confirmed_pax: attendance_status === "attending" ? confirmed_pax : 0,
        updated_at: new Date().toISOString()
      }, { onConflict: "invitation_id" })
      .select("id")
      .single();

    if (rsvpError) throw rsvpError;

    // Clear old sessions
    await supabase.from("rsvp_selected_sessions").delete().eq("rsvp_id", rsvp.id);

    // Insert new sessions
    if (attendance_status === "attending" && selected_session_ids.length > 0) {
      const sessionInserts = selected_session_ids.map(id => ({
        rsvp_id: rsvp.id,
        event_session_id: id
      }));
      const { error: sessionError } = await supabase.from("rsvp_selected_sessions").insert(sessionInserts);
      if (sessionError) throw sessionError;
    }

    // Seating Conflict Handling
    if (attendance_status === "not_attending") {
      await supabase.from("seating_assignments").delete().eq("invitation_id", invitation_id);
    }

    revalidatePath("/admin/rsvp");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update RSVP:", error);
    return { success: false, error: error.message };
  }
}

export async function resetRsvp(invitation_id: string) {
  try {
    const supabase = await createClient();

    // Delete the RSVP. This automatically deletes rsvp_selected_sessions due to ON DELETE CASCADE
    const { error: rsvpError } = await supabase
      .from("rsvps")
      .delete()
      .eq("invitation_id", invitation_id);
    
    if (rsvpError) throw rsvpError;

    // Also clear seating assignment as they are no longer confirmed
    const { error: seatingError } = await supabase
      .from("seating_assignments")
      .delete()
      .eq("invitation_id", invitation_id);
    
    if (seatingError) throw seatingError;

    revalidatePath("/admin/rsvp");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to reset RSVP:", error);
    return { success: false, error: error.message };
  }
}
