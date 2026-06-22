"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Guest, GuestCategory, GuestOwner } from "@/types";

interface GetGuestsParams {
  search?: string;
  owner?: GuestOwner | "All";
  category?: GuestCategory | "All";
  page: number;
  limit: number;
}

export async function getGuests({ search, owner, category, page, limit }: GetGuestsParams) {
  try {
    const supabase = await createClient();
    
    let query = supabase.from("guests").select("*", { count: "exact" });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (owner && owner !== "All") {
      query = query.eq("owner", owner);
    }

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) throw error;

    return { 
      success: true, 
      data: data as Guest[], 
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    };
  } catch (error: any) {
    console.error("Failed to fetch guests:", error);
    return { success: false, error: error.message, data: [], total: 0, totalPages: 0 };
  }
}

export async function createGuest(data: Omit<Guest, "id" | "created_at" | "updated_at">) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from("guests").insert({
      name: data.name,
      phone: data.phone || null,
      owner: data.owner,
      category: data.category,
      notes: data.notes || null,
    });

    if (error) throw error;

    revalidatePath("/admin/guests");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create guest:", error);
    return { success: false, error: error.message };
  }
}

export async function updateGuest(id: string, data: Partial<Guest>) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("guests")
      .update({
        name: data.name,
        phone: data.phone,
        owner: data.owner,
        category: data.category,
        notes: data.notes,
      })
      .eq("id", id);

    if (error) throw error;

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
