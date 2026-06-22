"use server";

import { createClient } from "@/lib/supabase/server";

export async function globalSearch(query: string) {
  if (!query || query.trim().length === 0) {
    return { success: true, data: [] };
  }

  try {
    const supabase = await createClient();
    
    const cleanQuery = `%${query.trim()}%`;
    const safeQuery = `"${cleanQuery}"`;

    // Query 1: Find guests by name or phone
    const { data: guests, error: guestsError } = await supabase
      .from("guests")
      .select("id")
      .or(`name.ilike.${safeQuery},phone.ilike.${safeQuery}`);

    if (guestsError) {
      console.error("Guests fetch error:", guestsError);
      throw guestsError;
    }

    const guestIds = guests.map(g => g.id);

    // Query 2: Find invitations by code OR guest_id in guestIds
    let invitationQuery = supabase
      .from("invitations")
      .select(`
        id,
        invitation_code,
        max_pax,
        guest_id,
        guest:guests!inner(id, name, phone, owner, category),
        event_type:event_types!inner(slug, name),
        rsvp:rsvps(attendance_status, confirmed_pax),
        seating_assignment:seating_assignments(seating_table:seating_tables(table_name))
      `);

    if (guestIds.length > 0) {
      // safely quote the guestIds just in case, though UUIDs don't strictly need it unless they contain commas (they don't).
      const safeGuestIds = guestIds.map(id => `"${id}"`).join(',');
      invitationQuery = invitationQuery.or(`invitation_code.ilike.${safeQuery},guest_id.in.(${safeGuestIds})`);
    } else {
      invitationQuery = invitationQuery.ilike("invitation_code", cleanQuery);
    }

    const { data: results, error: searchError } = await invitationQuery.limit(20);

    if (searchError) throw searchError;

    // Formatting for frontend consumption
    const formattedData = results.map((res: any) => {
      // Supabase sometimes returns 1:1 relationships as arrays in the JS client
      const rsvp = Array.isArray(res.rsvp) ? res.rsvp[0] : res.rsvp;
      const assignment = Array.isArray(res.seating_assignment) ? res.seating_assignment[0] : res.seating_assignment;

      return {
        guest_id: res.guest.id,
        name: res.guest.name,
        phone: res.guest.phone,
        owner: res.guest.owner,
        category: res.guest.category,
        event_name: res.event_type.name,
        event_slug: res.event_type.slug,
        invitation_code: res.invitation_code,
        max_pax: res.max_pax,
        status: rsvp ? rsvp.attendance_status : "pending",
        confirmed_pax: rsvp ? rsvp.confirmed_pax : 0,
        table: assignment?.seating_table?.table_name || null
      };
    });

    return { success: true, data: formattedData };
  } catch (error: any) {
    console.error("Global search failed:", error);
    return { success: false, error: error.message, data: [] };
  }
}
