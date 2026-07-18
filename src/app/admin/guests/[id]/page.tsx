import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Phone, Tag, Building } from "lucide-react";
import Link from "next/link";
import { Box, Container, Flex, Heading, Text, Card, Grid } from "@radix-ui/themes";
import { GuestDetailClient } from "./GuestDetailClient";
import { getSettings } from "@/lib/actions/settings";

export const revalidate = 0;

export default async function GuestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const guestId = resolvedParams.id;
  const supabase = await createClient();

  const { data: guest, error } = await supabase
    .from("guests")
    .select(`
      *,
      invitations(
        id,
        invitation_code,
        max_pax,
        is_sent,
        event_type:event_types(name, slug, rsvp_edit_deadline_at),
        rsvp:rsvps(attendance_status, confirmed_pax, wish_message, submitted_at),
        seating_assignment:seating_assignments(assigned_pax, seating_table:seating_tables(table_name))
      )
    `)
    .eq("id", guestId)
    .single();

  if (error || !guest) {
    return notFound();
  }

  // Fetch event types for the edit modal
  const { data: eventTypes } = await supabase.from("event_types").select("id, name, slug");
  const settingsRes = await getSettings();
  const config = settingsRes.success ? settingsRes.data?.config : {};

  return (
    <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-1)", paddingBottom: "80px", paddingTop: "32px" }}>
      <Container size="3" px="4">
        {/* Header */}
        <Box mb="7">
          <Link href="/admin/guests" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--gray-11)", textDecoration: "none", marginBottom: "16px", fontSize: "var(--font-size-2)", fontWeight: 500 }}>
            <ArrowLeft className="w-4 h-4" /> Back to Guests
          </Link>
          <Heading size="8" weight="bold" style={{ letterSpacing: "-0.02em" }}>{guest.name}</Heading>
          <Text color="gray" size="3" mt="1" as="div">Guest Profile and Details</Text>
        </Box>

        <Grid columns={{ initial: "1", md: "3" }} gap="6">
          

          {/* Interactive section (edit, invitations, copy, mark as sent) */}
          <GuestDetailClient 
            guest={guest} 
            eventTypes={eventTypes || []} 
            config={config}
          />

        </Grid>
      </Container>
    </Box>
  );
}
