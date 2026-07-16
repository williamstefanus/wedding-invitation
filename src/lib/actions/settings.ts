"use server";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

const readSettings = cache(async () => {
  try {
    const supabase = await createClient();

    // 1. Fetch Event Types (for deadlines)
    const { data: eventTypes, error: etError } = await supabase
      .from("event_types")
      .select("id, slug, rsvp_edit_deadline_at");
    if (etError) throw etError;

    // 2. Fetch Event Sessions (for venues, dates, maps)
    const { data: sessions, error: sesError } = await supabase
      .from("event_sessions")
      .select("id, slug, event_type_id, date, start_time, end_time, venue_name, address, google_maps_url")
      .order("sort_order");
    if (sesError) throw sesError;

    // 3. Fetch Settings JSON
    const { data: settingsRow, error: setError } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "wedding_config")
      .maybeSingle();

    if (setError) throw setError;

    // Organize data for the frontend
    const weddingType = eventTypes.find(e => e.slug === "wedding");
    const sangjitType = eventTypes.find(e => e.slug === "sangjit");

    const holyMatrimony = sessions.find(s => s.slug === "holy-matrimony");
    const reception = sessions.find(s => s.slug === "reception");
    // Sangjit session doesn't exist yet in seed, we'll find or create it
    const sangjitSession = sessions.find(s => s.event_type_id === sangjitType?.id);

    return {
      success: true,
      data: {
        deadlines: {
          wedding: weddingType?.rsvp_edit_deadline_at || null,
          sangjit: sangjitType?.rsvp_edit_deadline_at || null,
        },
        sessions: {
          holyMatrimony: holyMatrimony || null,
          reception: reception || null,
          sangjit: sangjitSession || null,
        },
        config: settingsRow?.value || {
          groomFirstName: "John",
          groomLastName: "Doe",
          groomTitle: "S.Kom",
          groomParents: "Mr. Hadi Doe & Mrs. Lanny Doe",
          groomOrderTitle: "First son of",
          phoneGroom: "",
          giftBankGroom: "BCA",
          giftAccountGroom: "1234567890",
          giftNameGroom: "John Doe",
          
          brideFirstName: "Jane",
          brideLastName: "Doe",
          brideTitle: "B.A",
          brideParents: "Mr. Yopie Doe & Mrs. Ina Doe",
          brideOrderTitle: "Second daughter of",
          phoneBride: "",
          giftBankBride: "BCA",
          giftAccountBride: "0987654321",
          giftNameBride: "Jane Doe",
          
          woPin: "123456",
          musicUrl: "",
          sangjitMusicUrl: "",
          countdownDate: "2026-10-23T11:00:00",
          sangjitCountdownDate: "",
          galleryImages: [],
          sangjitGalleryImages: [],
          faviconUrl: "",
          waTemplateWedding: "Halo {nama}! 🎉 Kami dengan hormat mengundang kamu ke pernikahan kami.\n\nSilakan konfirmasi kehadiran melalui link berikut:\n{link}\n\nTerima kasih 🙏",
          waTemplateSangjit: "Halo {nama}! 🎉 Kami mengundang kamu ke acara Sangjit kami.\n\nSilakan konfirmasi kehadiran melalui link berikut:\n{link}\n\nTerima kasih 🙏"
        }
      }
    };
  } catch (error: any) {
    console.error("Failed to fetch settings:", error);
    return { success: false, error: error.message };
  }
});

export async function getSettings() {
  return readSettings();
}

export async function saveSettings(payload: any) {
  try {
    const supabase = await createClient();

    // 1. Update Deadlines
    if (payload.deadlines?.wedding) {
      await supabase.from("event_types").update({ rsvp_edit_deadline_at: payload.deadlines.wedding }).eq("slug", "wedding");
    }
    if (payload.deadlines?.sangjit) {
      await supabase.from("event_types").update({ rsvp_edit_deadline_at: payload.deadlines.sangjit }).eq("slug", "sangjit");
    }

    // 2. Update Sessions
    const updateSession = async (slug: string, sessionData: any) => {
      if (!sessionData || !sessionData.id) return;
      await supabase.from("event_sessions").update({
        date: sessionData.date,
        start_time: sessionData.start_time,
        end_time: sessionData.end_time,
        venue_name: sessionData.venue_name,
        address: sessionData.address,
        google_maps_url: sessionData.google_maps_url
      }).eq("id", sessionData.id);
    };

    await updateSession("holy-matrimony", payload.sessions?.holyMatrimony);
    await updateSession("reception", payload.sessions?.reception);
    
    if (payload.sessions?.sangjit?.id) {
      await updateSession("sangjit", payload.sessions.sangjit);
    } else if (payload.sessions?.sangjit) {
      // Need to create it if it doesn't exist
      const { data: sangjitType } = await supabase.from("event_types").select("id").eq("slug", "sangjit").single();
      if (sangjitType) {
        await supabase.from("event_sessions").insert({
          event_type_id: sangjitType.id,
          slug: "sangjit-session",
          name: "Sangjit Ceremony",
          date: payload.sessions.sangjit.date,
          start_time: payload.sessions.sangjit.start_time,
          end_time: payload.sessions.sangjit.end_time,
          venue_name: payload.sessions.sangjit.venue_name,
          address: payload.sessions.sangjit.address,
          google_maps_url: payload.sessions.sangjit.google_maps_url,
          is_rsvp_option: true,
          sort_order: 1
        });
      }
    }

    // 3. Upsert JSON Config
    if (payload.config) {
      const { error: upsertError } = await supabase.from("settings").upsert(
        { key: "wedding_config", value: payload.config },
        { onConflict: "key" }
      );
      if (upsertError) throw upsertError;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save settings:", error);
    return { success: false, error: error.message };
  }
}
