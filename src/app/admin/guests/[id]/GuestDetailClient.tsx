"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Copy, Check, CheckCheck, Send, Loader2, Link as LinkIcon, MessageCircle, User, Phone, Tag, Building } from "lucide-react";
import { getGuestById, updateGuest, toggleInvitationSent } from "@/lib/actions/guests";
import { formatWhatsAppPhone } from "@/lib/utils";
import { GuestFormModal } from "@/components/admin/guests/modals/GuestFormModal";
import type { GuestOwner, GuestCategory } from "@/types";
import { Box, Flex, Heading, Text, Button, Card, Grid, Badge } from "@radix-ui/themes";

interface GuestDetailClientProps {
  guest: any;
  eventTypes: any[];
  config?: any;
}

export function GuestDetailClient({ guest, eventTypes, config }: GuestDetailClientProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [currentGuest, setCurrentGuest] = useState(guest);
  useEffect(() => {
    setCurrentGuest(guest);
  }, [guest]);

  // Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: guest.name,
    phone: guest.phone || "",
    owner: guest.owner as GuestOwner,
    category: guest.category as GuestCategory,
    notes: guest.notes || ""
  });
  const [invitationsForm, setInvitationsForm] = useState<any>(() => {
    const init: any = {};
    eventTypes.forEach(et => {
      const existingInv = guest.invitations?.find((i: any) => i.event_type?.slug === et.slug || i.event_type?.name === et.name);
      init[et.id] = {
        is_selected: !!existingInv,
        max_pax: existingInv ? existingInv.max_pax : (et.slug === "wedding" ? 2 : 1)
      };
    });
    return init;
  });
  const [formError, setFormError] = useState("");

  const getWaTemplate = (eventSlug: string) => {
    if (eventSlug === "wedding" && config?.waTemplateWedding) return config.waTemplateWedding;
    if (eventSlug === "sangjit" && config?.waTemplateSangjit) return config.waTemplateSangjit;
    return "Halo {nama}! 🎉 Kami mengundang kamu ke acara kami.\n\nLink undangan: {link}";
  };

  const handleCopyLink = (inv: any) => {
    const url = `${window.location.origin}/invite/${inv.event_type.slug}/${inv.invitation_code}`;
    const template = getWaTemplate(inv.event_type.slug);
    const deadlineStr = inv.event_type?.rsvp_edit_deadline_at
      ? new Date(inv.event_type.rsvp_edit_deadline_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
      : "-";
    const message = template
      .replace(/{nama}/g, currentGuest?.name || guest?.name || "")
      .replace(/{link}/g, url)
      .replace(/{deadline}/g, deadlineStr);
    navigator.clipboard.writeText(message);

    const formattedPhone = formatWhatsAppPhone(currentGuest?.phone || guest?.phone);
    const waUrl = formattedPhone
      ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    setCopiedId(inv.id + "_wa");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyLinkOnly = (inv: any) => {
    const url = `${window.location.origin}/invite/${inv.event_type.slug}/${inv.invitation_code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(inv.id + "_link");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSent = async (inv: any) => {
    setCurrentGuest((prev: any) => ({
      ...prev,
      invitations: prev.invitations?.map((i: any) => i.id === inv.id ? { ...i, is_sent: !inv.is_sent } : i)
    }));
    await toggleInvitationSent(inv.id, !inv.is_sent);
    router.refresh();
  };

  const openEditModal = async () => {
    // Refresh guest data before opening modal
    const { data: freshGuest } = await getGuestById(guest.id);
    const guestData = freshGuest || guest;
    setFormData({
      name: guestData.name,
      phone: guestData.phone || "",
      owner: guestData.owner as GuestOwner,
      category: guestData.category as GuestCategory,
      notes: guestData.notes || ""
    });
    const init: any = {};
    eventTypes.forEach(et => {
      const existingInv = guestData.invitations?.find((i: any) => i.event_type?.slug === et.slug);
      init[et.id] = {
        is_selected: !!existingInv,
        max_pax: existingInv ? existingInv.max_pax : (et.slug === "wedding" ? 2 : 1)
      };
    });
    setInvitationsForm(init);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const invsToSubmit = eventTypes.map(et => ({
      event_type_id: et.id,
      max_pax: invitationsForm[et.id].max_pax,
      is_selected: invitationsForm[et.id].is_selected
    }));

    if (!invsToSubmit.some(i => i.is_selected)) {
      setFormError("A guest must have at least one invitation.");
      return;
    }

    const res = await updateGuest(guest.id, formData, invsToSubmit);
    if (!res.success) {
      setFormError(res.error || "Failed to update guest");
      return;
    }
    setIsModalOpen(false);
    router.refresh();
  };

  return (
    <>
      {/* Guest Info Card */}
      <Box style={{ gridColumn: "span 1" }}>
        <Card size="3" style={{ padding: "24px", backgroundColor: "white" }}>
          <Heading size="5" mb="6">Contact Info</Heading>
          
          <Flex direction="column" gap="4">
            <Box>
              <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }} mb="1">
                <Phone className="w-3 h-3" /> Phone Number
              </Text>
              <Text size="3" weight="medium">{currentGuest.phone || "No phone provided"}</Text>
            </Box>
            <Box>
              <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }} mb="1">
                <Building className="w-3 h-3" /> Side / Owner
              </Text>
              <Text size="3" weight="medium">{currentGuest.owner}</Text>
            </Box>
            <Box>
              <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }} mb="1">
                <Tag className="w-3 h-3" /> Category
              </Text>
              <Text size="3" weight="medium">{currentGuest.category}</Text>
            </Box>
            {currentGuest.notes && (
              <Box>
                <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }} mb="1" as="div">Notes</Text>
                <Box p="3" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)", border: "1px solid var(--gray-4)" }}>
                  <Text size="2" color="gray">{currentGuest.notes}</Text>
                </Box>
              </Box>
            )}

            <Button 
              color="amber" 
              variant="surface" 
              onClick={openEditModal} 
              size="3" 
              style={{ cursor: "pointer", fontWeight: "bold", marginTop: "16px", width: "100%" }}
            >
              <Edit2 className="w-4 h-4" />
              Edit Guest
            </Button>
          </Flex>
        </Card>
      </Box>

      {/* Invitations & RSVPs */}
      <Box style={{ gridColumn: "span 2" }}>
        
        {currentGuest.invitations?.length === 0 ? (
          <Box p="6" style={{ backgroundColor: "var(--gray-1)", border: "1px dashed var(--gray-6)", borderRadius: "var(--radius-4)", textAlign: "center" }}>
            <Text color="gray">This guest has no active invitations.</Text>
          </Box>
        ) : (
          <Flex direction="column" gap="5">
            {currentGuest.invitations?.map((inv: any) => {
              const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
              const assignment = Array.isArray(inv.seating_assignment) ? inv.seating_assignment[0] : inv.seating_assignment;

              const isWedding = inv.event_type.slug === 'wedding';
              const headerTextColor = isWedding ? "var(--amber-11)" : "var(--crimson-11)";
              const headerBgColor = isWedding ? "var(--amber-2)" : "var(--crimson-2)";
              const headerBorderColor = isWedding ? "var(--amber-4)" : "var(--crimson-4)";
              
              return (
                <Card key={inv.id} size="3" style={{ padding: 0, overflow: "hidden", backgroundColor: "white" }}>
                  {/* Card Header */}
                  <Box px="5" py="4" style={{ borderBottom: `1px solid ${headerBorderColor}`, backgroundColor: headerBgColor }}>
                    <Flex justify="between" align="center">
                      <Heading size="4" weight="bold" style={{ color: headerTextColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {inv.event_type.name}
                      </Heading>
                      <Badge size="2" style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", backgroundColor: "white", color: headerTextColor, border: `1px solid ${headerBorderColor}` }}>
                        {inv.invitation_code}
                      </Badge>
                    </Flex>
                  </Box>
                  
                  <Box p="5">
                    <Grid columns="2" gap="5" mb="5">
                      <Box>
                        <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }} mb="1" as="div">Max Pax</Text>
                        <Text size="5" weight="bold" as="div">
                          {inv.max_pax} <Text size="2" color="gray" weight="medium">pax</Text>
                        </Text>
                      </Box>
                      <Box>
                        <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }} mb="1" as="div">RSVP Status</Text>
                        {rsvp ? (
                          <Text size="5" weight="bold" color={rsvp.attendance_status === 'attending' ? 'green' : 'crimson'} as="div">
                            {rsvp.attendance_status === 'attending' ? `Attending (${rsvp.confirmed_pax} pax)` : 'Declined'}
                          </Text>
                        ) : (
                          <Text size="5" weight="bold" color="amber" as="div">Pending</Text>
                        )}
                      </Box>
                    </Grid>

                    {rsvp?.wish_message && (
                      <Box mb="5">
                        <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }} mb="1" as="div">Wish Message</Text>
                        <Box p="4" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)", border: "1px solid var(--gray-4)" }}>
                          <Text size="2" color="gray" style={{ fontStyle: "italic" }}>&ldquo;{rsvp.wish_message}&rdquo;</Text>
                        </Box>
                      </Box>
                    )}

                    <Box mb="5">
                      <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }} mb="1" as="div">Table Assignment</Text>
                      {assignment ? (
                        <Text size="2" weight="bold" as="div" color="blue">
                          {assignment.seating_table.table_name} <Text size="2" weight="medium" style={{ opacity: 0.75 }}>({assignment.assigned_pax} pax)</Text>
                        </Text>
                      ) : (
                        <Text size="2" weight="medium" color="gray" as="div">Not assigned yet.</Text>
                      )}
                    </Box>

                    {/* Action Buttons */}
                    <Flex align="center" gap="3" pt="4" mt="4" style={{ borderTop: "1px solid var(--gray-4)" }}>
                      {/* Copy Link Only */}
                      <Button
                        variant={copiedId === inv.id + "_link" ? "soft" : "outline"}
                        color={copiedId === inv.id + "_link" ? "green" : "gray"}
                        onClick={() => handleCopyLinkOnly(inv)}
                        style={{ cursor: "pointer" }}
                      >
                        {copiedId === inv.id + "_link" ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                        {copiedId === inv.id + "_link" ? "Copied!" : "Copy Link"}
                      </Button>

                      {/* Copy WhatsApp Message */}
                      <Button
                        variant={copiedId === inv.id + "_wa" ? "soft" : "outline"}
                        color={copiedId === inv.id + "_wa" ? "green" : "gray"}
                        onClick={() => handleCopyLink(inv)}
                        style={{ cursor: "pointer" }}
                      >
                        {copiedId === inv.id + "_wa" ? <Check className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                        {copiedId === inv.id + "_wa" ? "Opening WA..." : "Copy & Send WA"}
                      </Button>

                      {/* Mark as Sent */}
                      <Button
                        variant={inv.is_sent ? "soft" : "outline"}
                        color={inv.is_sent ? "green" : "gray"}
                        onClick={() => handleToggleSent(inv)}
                        disabled={togglingId === inv.id}
                        style={{ cursor: "pointer" }}
                      >
                        {togglingId === inv.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : inv.is_sent ? (
                          <CheckCheck className="w-4 h-4" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {inv.is_sent ? "Invitation Sent" : "Mark as Sent"}
                      </Button>
                    </Flex>
                  </Box>
                </Card>
              );
            })}
          </Flex>
        )}
      </Box>

      {/* Edit Modal */}
      <GuestFormModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedGuest={guest}
        formData={formData}
        setFormData={setFormData}
        eventTypes={eventTypes}
        invitationsForm={invitationsForm}
        setInvitationsForm={setInvitationsForm}
        formError={formError}
        handleSave={handleSave}
      />
    </>
  );
}
