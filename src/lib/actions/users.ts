"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "./auth";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function getAdminUsers() {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const supabase = await createClient();
    const { data: settingsRow } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "wedding_config")
      .maybeSingle();

    const config = settingsRow?.value ? (typeof settingsRow.value === "string" ? JSON.parse(settingsRow.value) : settingsRow.value) : {};
    
    // Auto-create initial admin if none exists
    let adminUsers = config.adminUsers || [];
    if (adminUsers.length === 0) {
      const defaultPassword = config.adminPassword || "admin";
      const defaultHash = await bcrypt.hash(defaultPassword, 10);
      adminUsers = [{
        id: crypto.randomUUID(),
        username: "admin",
        passwordHash: defaultHash,
        role: "superadmin"
      }];
    }
    
    // Omit passwordHash for security
    const safeUsers = adminUsers.map((u: any) => ({
      id: u.id,
      username: u.username,
      role: u.role
    }));
    
    return { success: true, data: safeUsers, sessionRole: session.role };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addAdminUser(data: { username: string; passwordRaw: string; role: string }) {
  const session = await getAdminSession();
  if (!session || session.role !== "superadmin") return { success: false, error: "Unauthorized. Superadmin only." };

  try {
    const supabase = await createClient();
    const { data: settingsRow } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "wedding_config")
      .maybeSingle();

    const config = settingsRow?.value ? (typeof settingsRow.value === "string" ? JSON.parse(settingsRow.value) : settingsRow.value) : {};
    let adminUsers = config.adminUsers || [];
    
    // Initialization check
    if (adminUsers.length === 0) {
      const defaultHash = await bcrypt.hash(config.adminPassword || "admin", 10);
      adminUsers = [{
        id: crypto.randomUUID(),
        username: "admin",
        passwordHash: defaultHash,
        role: "superadmin"
      }];
    }
    
    if (adminUsers.find((u: any) => u.username.toLowerCase() === data.username.toLowerCase())) {
      return { success: false, error: "Username already exists." };
    }

    const passwordHash = await bcrypt.hash(data.passwordRaw, 10);
    const newUser = {
      id: crypto.randomUUID(),
      username: data.username.toLowerCase(),
      passwordHash,
      role: data.role
    };

    adminUsers.push(newUser);
    config.adminUsers = adminUsers;

    const { error } = await supabase
      .from("settings")
      .update({ value: config })
      .eq("key", "wedding_config");

    if (error) throw error;

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAdminUser(id: string) {
  const session = await getAdminSession();
  if (!session || session.role !== "superadmin") return { success: false, error: "Unauthorized. Superadmin only." };

  if (session.id === id) {
    return { success: false, error: "You cannot delete yourself." };
  }

  try {
    const supabase = await createClient();
    const { data: settingsRow } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "wedding_config")
      .maybeSingle();

    const config = settingsRow?.value ? (typeof settingsRow.value === "string" ? JSON.parse(settingsRow.value) : settingsRow.value) : {};
    let adminUsers = config.adminUsers || [];
    
    adminUsers = adminUsers.filter((u: any) => u.id !== id);
    config.adminUsers = adminUsers;

    const { error } = await supabase
      .from("settings")
      .update({ value: config })
      .eq("key", "wedding_config");

    if (error) throw error;

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
