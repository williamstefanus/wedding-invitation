"use server";

import { createClient } from "@/lib/supabase/server";
import { generateInvitationCode } from "@/lib/utils";

export async function fetchExistingIdentifiers() {
  try {
    const supabase = await createClient();
    
    // Fetch all guest names and phones to prevent duplicates
    const { data, error } = await supabase.from("guests").select("name, phone");
    if (error) throw error;
    
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Failed to fetch identifiers:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function bulkImportGuestsAndInvitations(validRows: any[]) {
  try {
    const supabase = await createClient();

    // 1. Fetch Event Types
    const { data: eventTypes, error: etError } = await supabase.from("event_types").select("id, slug");
    if (etError) throw etError;

    const weddingId = eventTypes.find(et => et.slug === "wedding")?.id;
    const sangjitId = eventTypes.find(et => et.slug === "sangjit")?.id;

    if (!weddingId || !sangjitId) throw new Error("Event types missing from DB.");

    let importedCount = 0;

    // Process rows sequentially to avoid overwhelming the DB and properly handle generating unique codes
    // For MVP, sequentially is fine. If there are 1000 rows, it might take a few seconds.
    for (const row of validRows) {
      // Create guest
      const { data: guest, error: guestError } = await supabase
        .from("guests")
        .insert({
          name: row.name,
          phone: row.phone || null,
          owner: row.owner,
          category: row.category,
          notes: row.notes || null
        })
        .select("id")
        .single();

      if (guestError) {
        console.error("Error creating guest:", guestError);
        continue; // Skip this row if guest creation fails
      }

      // Determine pax numbers
      const weddingPax = parseInt(row.weddingPax) || 0;
      const sangjitPax = parseInt(row.sangjitPax) || 0;

      // Create Invitations
      if (weddingPax > 0) {
        const code = await generateInvitationCode(row.name);
        await supabase.from("invitations").insert({
          guest_id: guest.id,
          event_type_id: weddingId,
          invitation_code: code,
          max_pax: weddingPax
        });
      }

      if (sangjitPax > 0) {
        const code = await generateInvitationCode(row.name); // Will be slightly different due to random suffix
        await supabase.from("invitations").insert({
          guest_id: guest.id,
          event_type_id: sangjitId,
          invitation_code: code,
          max_pax: sangjitPax
        });
      }

      importedCount++;
    }

    return { success: true, count: importedCount };
  } catch (error: any) {
    console.error("Bulk import failed:", error);
    return { success: false, error: error.message };
  }
}

export async function generateExportData(type: string) {
  try {
    const supabase = await createClient();
    
    if (type === "guests") {
      const { data, error } = await supabase.from("guests").select("name, phone, owner, category, notes").order("created_at");
      if (error) throw error;
      const flatData = (data || []).map((d: any) => ({
        "Guest Name": d.name,
        "Phone": d.phone || "",
        "Owner": d.owner,
        "Category": d.category,
        "Notes": d.notes || ""
      }));
      return { success: true, data: flatData };
    }
    
    if (type === "invitations") {
      const { data, error } = await supabase.from("invitations").select(`
        invitation_code, max_pax,
        guest:guests(name, phone, owner, category),
        event_type:event_types(name)
      `);
      if (error) throw error;
      const flatData = data.map((d: any) => ({
        "Guest Name": d.guest?.name,
        "Phone": d.guest?.phone || "",
        "Owner": d.guest?.owner,
        "Category": d.guest?.category,
        "Event": d.event_type?.name,
        "Invitation Code": d.invitation_code,
        "Max Pax": d.max_pax
      }));
      return { success: true, data: flatData };
    }

    if (type === "rsvp") {
      const { data, error } = await supabase.from("rsvps").select(`
        attendance_status, confirmed_pax, wish_message, submitted_at,
        invitation:invitations(
          guest:guests(name, owner, category),
          event_type:event_types(name)
        )
      `);
      if (error) throw error;
      const flatData = data.map((d: any) => ({
        "Guest Name": d.invitation?.guest?.name,
        "Owner": d.invitation?.guest?.owner,
        "Event": d.invitation?.event_type?.name,
        "Status": d.attendance_status === "attending" ? "Attending" : "Declined",
        "Confirmed Pax": d.confirmed_pax,
        "Wishes": d.wish_message || "",
        "Submitted At": d.submitted_at
      }));
      return { success: true, data: flatData };
    }

    if (type === "attendance") {
      // Summary grouping
      const { data, error } = await supabase.from("rsvps").select(`
        attendance_status, confirmed_pax,
        invitation:invitations(
          event_type:event_types(name)
        )
      `);
      if (error) throw error;
      
      const summary: Record<string, any> = {
        "Wedding": { attending: 0, declined: 0, pax: 0 },
        "Sangjit": { attending: 0, declined: 0, pax: 0 }
      };

      data.forEach((d: any) => {
        const event = d.invitation?.event_type?.name;
        if (!event) return;
        if (!summary[event]) summary[event] = { attending: 0, declined: 0, pax: 0 };
        
        if (d.attendance_status === "attending") {
          summary[event].attending++;
          summary[event].pax += d.confirmed_pax;
        } else {
          summary[event].declined++;
        }
      });

      const formattedData = Object.keys(summary).map(event => ({
        "Event Name": event,
        "Total Attending Groups": summary[event].attending,
        "Total Declined Groups": summary[event].declined,
        "Total Confirmed Pax": summary[event].pax
      }));

      return { success: true, data: formattedData };
    }

    if (type === "seating") {
      const { data, error } = await supabase.from("seating_assignments").select(`
        assigned_pax,
        seating_table:seating_tables(table_name, capacity, event_type:event_types(name)),
        invitation:invitations(
          guest:guests(name, owner, category)
        )
      `).order("created_at");
      
      if (error) throw error;
      
      const flatData = data.map((d: any) => ({
        "Event": d.seating_table?.event_type?.name,
        "Table Name": d.seating_table?.table_name,
        "Table Capacity": d.seating_table?.capacity,
        "Guest Name": d.invitation?.guest?.name,
        "Owner": d.invitation?.guest?.owner,
        "Category": d.invitation?.guest?.category,
        "Assigned Pax": d.assigned_pax
      }));
      
      return { success: true, data: flatData };
    }

    return { success: false, error: "Invalid export type." };

  } catch (error: any) {
    console.error("Failed to generate export data:", error);
    return { success: false, error: error.message };
  }
}
