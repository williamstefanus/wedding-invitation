"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Secret for JWT - in production this should be a secure env var, 
// falling back to a strong local one if not provided.
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "wedding-invitation-super-secret-key-2026-fallback-only"
);

export async function verifyAdminLogin(username: string, password: string) {
  try {
    const supabase = await createClient();
    const { data: settingsRow } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "wedding_config")
      .maybeSingle();

    const config = settingsRow?.value ? (typeof settingsRow.value === "string" ? JSON.parse(settingsRow.value) : settingsRow.value) : {};
    
    // Initialize default admin if no users exist
    let adminUsers = config.adminUsers || [];
    
    if (adminUsers.length === 0) {
      // Legacy fallback or initial seed
      const defaultPassword = config.adminPassword || "admin";
      const defaultHash = await bcrypt.hash(defaultPassword, 10);
      adminUsers = [{
        id: crypto.randomUUID(),
        username: "admin",
        passwordHash: defaultHash,
        role: "superadmin"
      }];
      
      // We don't save the seeded user back to DB here to avoid blocking login,
      // it will be saved next time they update settings. Or we can just use it in-memory.
    }

    const user = adminUsers.find((u: any) => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
      return { success: false, error: "Invalid username or password." };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (isValid) {
      // Create JWT containing username and role
      const token = await new SignJWT({ 
        id: user.id, 
        username: user.username, 
        role: user.role 
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(JWT_SECRET);

      const cookieStore = await cookies();
      cookieStore.set("admin_auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
      
      return { success: true };
    }
    
    return { success: false, error: "Invalid username or password." };
  } catch (error: any) {
    console.error("verifyAdminLogin error:", error);
    return { success: false, error: error.message };
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth_token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { id: string; username: string; role: string };
  } catch (e) {
    return null;
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth_token");
}
