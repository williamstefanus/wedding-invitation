"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Guest, GuestCategory, GuestOwner } from "@/types";
import { generateInvitationCode } from "@/lib/utils";

interface GetGuestsParams {
  search?: string;
  owner?: GuestOwner | "All";
  category?: GuestCategory | "All";
  tab?: string | "all";
  sort?: "az" | "za" | "default";
  page: number;
  limit: number;
}

export async function getGuests({ search, owner, category, tab, sort, page, limit }: GetGuestsParams) {
  try {
    const supabase = await createClient();
    
    let query = supabase.from("guests").select(`
      *,
      invitations${(tab && tab !== "all") ? "!inner" : ""}(
        id,
        invitation_code,
        max_pax,
        is_sent,
        event_type_id,
        event_type:event_types${(tab && tab !== "all") ? "!inner" : ""}(id, slug, name, rsvp_edit_deadline_at),
        rsvp:rsvps(attendance_status, confirmed_pax),
        seating_assignment:seating_assignments(assigned_pax, seating_table:seating_tables(table_name))
      )
    `, { count: "exact" });

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    if (owner && owner !== "All") {
      query = query.eq("owner", owner);
    }

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    if (tab && tab !== "all") {
      query = query.eq("invitations.event_type.slug", tab);
    }

    if (sort === "az") {
      query = query.order("name", { ascending: true });
    } else if (sort === "za") {
      query = query.order("name", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) throw error;

    return { 
      success: true, 
      data: data as any[], 
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    };
  } catch (error: any) {
    console.error("Failed to fetch guests:", error);
    return { success: false, error: error.message, data: [], total: 0, totalPages: 0 };
  }
}

export async function getGuestById(id: string) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase.from("guests").select(`
      *,
      invitations(
        id,
        invitation_code,
        max_pax,
        is_sent,
        event_type_id,
        event_type:event_types(id, slug, name, rsvp_edit_deadline_at),
        rsvp:rsvps(attendance_status, confirmed_pax),
        seating_assignment:seating_assignments(assigned_pax, seating_table:seating_tables(table_name))
      )
    `).eq("id", id).single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to fetch guest:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleInvitationSent(id: string, is_sent: boolean) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("invitations")
      .update({ is_sent } as any)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/guests");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to toggle sent status:", error);
    return { success: false, error: error.message };
  }
}

interface InvitationInput {
  event_type_id: string;
  max_pax: number;
}

export async function createGuest(
  data: Omit<Guest, "id" | "created_at" | "updated_at">,
  invitations: InvitationInput[]
) {
  try {
    const supabase = await createClient();
    
    if (!invitations || invitations.length === 0) {
      throw new Error("A guest must have at least one invitation.");
    }

    const { data: guest, error: guestError } = await supabase.from("guests").insert({
      name: data.name,
      phone: data.phone || null,
      owner: data.owner,
      category: data.category,
      notes: data.notes || null,
    }).select("id").single();

    if (guestError) throw guestError;

    const invData = invitations.map(inv => ({
      guest_id: guest.id,
      event_type_id: inv.event_type_id,
      max_pax: inv.max_pax,
      invitation_code: generateInvitationCode(data.name)
    }));

    const { error: invError } = await supabase.from("invitations").insert(invData);

    if (invError) {
      await supabase.from("guests").delete().eq("id", guest.id);
      throw invError;
    }

    revalidatePath("/admin/guests");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create guest:", error);
    return { success: false, error: error.message };
  }
}

export async function updateGuest(
  id: string, 
  data: Partial<Guest>,
  invitationsToUpdate: { event_type_id: string, max_pax: number, is_selected: boolean }[]
) {
  try {
    const supabase = await createClient();
    
    const selectedInvs = invitationsToUpdate.filter(i => i.is_selected);
    if (selectedInvs.length === 0) {
      throw new Error("A guest must have at least one invitation.");
    }

    const { error: guestError } = await supabase
      .from("guests")
      .update({
        name: data.name,
        phone: data.phone,
        owner: data.owner,
        category: data.category,
        notes: data.notes,
      })
      .eq("id", id);

    if (guestError) throw guestError;

    const { data: existingInvs } = await supabase
      .from("invitations")
      .select("id, event_type_id")
      .eq("guest_id", id);

    const existingMap = new Map(existingInvs?.map(i => [i.event_type_id, i.id]) || []);

    for (const inv of invitationsToUpdate) {
      const existingId = existingMap.get(inv.event_type_id);

      if (inv.is_selected) {
        if (existingId) {
          await supabase.from("invitations").update({ max_pax: inv.max_pax }).eq("id", existingId);
        } else {
          await supabase.from("invitations").insert({
            guest_id: id,
            event_type_id: inv.event_type_id,
            max_pax: inv.max_pax,
            invitation_code: generateInvitationCode(data.name || "Guest")
          });
        }
      } else {
        if (existingId) {
          await supabase.from("invitations").delete().eq("id", existingId);
        }
      }
    }

    revalidatePath("/admin/guests");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update guest:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteGuest(id: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("guests")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/guests");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete guest:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteInvitationAction(id: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("invitations")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/guests");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete invitation:", error);
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

    revalidatePath("/admin/guests");
    return { success: true, newCode };
  } catch (error: any) {
    console.error("Failed to regenerate link:", error);
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

    revalidatePath("/admin/guests");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update max pax:", error);
    return { success: false, error: error.message };
  }
}
