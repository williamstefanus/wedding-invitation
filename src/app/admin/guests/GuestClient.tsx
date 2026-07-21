"use client";

import { useState, useTransition, useCallback, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { createGuest, updateGuest, deleteGuest, deleteInvitationAction, regenerateLink, updateMaxPax, getGuestById, toggleInvitationSent } from "@/lib/actions/guests";
import type { GuestOwner, GuestCategory } from "@/types";
import { GuestMetrics } from "@/components/admin/guests/GuestMetrics";
import { formatWhatsAppPhone } from "@/lib/utils";
import { Box, Flex, Heading, Text, Button as RadixButton } from "@radix-ui/themes";

// Import Extracted Components
import { GuestFilters } from "@/components/admin/guests/GuestFilters";
import { GuestTable } from "@/components/admin/guests/GuestTable";
import { GuestFormModal } from "@/components/admin/guests/modals/GuestFormModal";
import { DeleteGuestModal } from "@/components/admin/guests/modals/DeleteGuestModal";
import { DeleteInvitationModal } from "@/components/admin/guests/modals/DeleteInvitationModal";
import { EditPaxModal } from "@/components/admin/guests/modals/EditPaxModal";
import { RegenerateLinkModal } from "@/components/admin/guests/modals/RegenerateLinkModal";

interface GuestClientProps {
  initialGuests: any[];
  allInvitations?: any[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentSearch: string;
  currentOwner: string;
  currentCategory: string;
  currentTab: string;
  currentSort: string;
  eventTypes: any[];
  config?: any;
}

export function GuestClient({
  initialGuests,
  allInvitations = [],
  total,
  totalPages,
  currentPage,
  currentSearch,
  currentOwner,
  currentCategory,
  currentTab,
  currentSort,
  eventTypes,
  config
}: GuestClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteGuestOpen, setIsDeleteGuestOpen] = useState(false);
  const [isDeleteInvOpen, setIsDeleteInvOpen] = useState(false);
  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);
  const [isEditPaxOpen, setIsEditPaxOpen] = useState(false);

  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [selectedInv, setSelectedInv] = useState<any>(null);

  const [guests, setGuests] = useState(initialGuests);
  useEffect(() => {
    setGuests(initialGuests);
  }, [initialGuests]);

  const filteredOverviewInvitations = useMemo(() => {
    if (!allInvitations) return [];
    if (currentTab === "all") return allInvitations;
    return allInvitations.filter(inv => inv.event_type?.slug === currentTab);
  }, [allInvitations, currentTab]);

  // Form State
  const groomName = config?.groomFirstName || "William";

  const [formData, setFormData] = useState<any>({
    name: "",
    phone: "",
    owner: "groom" as GuestOwner,
    category: "Friends" as GuestCategory,
    notes: ""
  });

  const [invitationsForm, setInvitationsForm] = useState<any>({});
  const [formError, setFormError] = useState("");
  const [editMaxPax, setEditMaxPax] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // URL Updates
  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    if (updates.search !== undefined || updates.owner !== undefined || updates.category !== undefined || updates.tab !== undefined || updates.sort !== undefined) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Read WA template from config prop (database) or fall back to a default
  const getWaTemplate = (eventSlug: string) => {
    if (eventSlug === "wedding" && config?.waTemplateWedding) return config.waTemplateWedding;
    if (eventSlug === "sangjit" && config?.waTemplateSangjit) return config.waTemplateSangjit;
    return "Halo {nama}! 🎉 Kami mengundang kamu ke acara kami.\n\nLink undangan: {link}";
  };

  const handleCopyLink = (inv: any, guestName?: string, guestPhone?: string) => {
    const url = `${window.location.origin}/invite/${inv.event_type.slug}/${inv.invitation_code}`;
    const name = guestName || inv.guest?.name || "";
    const phone = guestPhone || inv.guest?.phone || "";
    const template = getWaTemplate(inv.event_type.slug);
    const deadlineStr = inv.event_type?.rsvp_edit_deadline_at
      ? new Date(inv.event_type.rsvp_edit_deadline_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
      : "-";
    const message = template
      .replace(/{nama}/g, name)
      .replace(/{link}/g, url)
      .replace(/{deadline}/g, deadlineStr);
    navigator.clipboard.writeText(message);

    const formattedPhone = formatWhatsAppPhone(phone);
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

  const handleToggleSent = async (invId: string, currentSentStatus: boolean) => {
    setGuests(prevGuests => prevGuests.map(g => ({
      ...g,
      invitations: g.invitations?.map((inv: any) => 
        inv.id === invId ? { ...inv, is_sent: !currentSentStatus } : inv
      )
    })));

    startTransition(async () => {
      await toggleInvitationSent(invId, !currentSentStatus);
    });
  };

  const openAddModal = () => {
    setSelectedGuest(null);
    setFormData({ name: "", phone: "", owner: "groom", category: "Friends", notes: "" });
    setFormError("");
    
    const initInvs: any = {};
    eventTypes.forEach(et => {
      initInvs[et.id] = {
        is_selected: false,
        max_pax: et.slug === "wedding" ? 2 : 1
      };
    });
    setInvitationsForm(initInvs);
    setIsModalOpen(true);
  };

  const openEditModal = async (guest: any) => {
    const { data: fullGuest } = await getGuestById(guest.id);
    const guestData = fullGuest || guest;

    setSelectedGuest(guestData);
    setFormData({
      name: guestData.name,
      phone: guestData.phone || "",
      owner: guestData.owner || "John",
      category: guestData.category || "Friends",
      notes: guestData.notes || ""
    });
    setFormError("");

    const initInvs: any = {};
    eventTypes.forEach(et => {
      const existingInv = guestData.invitations?.find((i: any) => i.event_type_id === et.id);
      initInvs[et.id] = {
        is_selected: !!existingInv,
        max_pax: existingInv ? existingInv.max_pax : (et.slug === "wedding" ? 2 : 1)
      };
    });
    setInvitationsForm(initInvs);
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

    if (selectedGuest) {
      const res = await updateGuest(selectedGuest.id, formData, invsToSubmit);
      if (!res.success) {
        setFormError(res.error || "Failed to update guest");
        return;
      }
    } else {
      const res = await createGuest(formData, invsToSubmit.filter(i => i.is_selected));
      if (!res.success) {
        setFormError(res.error || "Failed to create guest");
        return;
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteGuest = async () => {
    if (selectedGuest) {
      await deleteGuest(selectedGuest.id);
      setIsDeleteGuestOpen(false);
    }
  };

  const handleDeleteInv = async () => {
    if (selectedInv) {
      if (selectedGuest?.invitations?.length === 1) {
        await deleteGuest(selectedGuest.id);
      } else {
        await deleteInvitationAction(selectedInv.id);
      }
      setIsDeleteInvOpen(false);
    }
  };

  const handleRegenerate = async () => {
    if (selectedInv && selectedGuest) {
      await regenerateLink(selectedInv.id, selectedGuest.name);
      setIsRegenerateOpen(false);
    }
  };

  const handleEditPaxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInv) {
      await updateMaxPax(selectedInv.id, editMaxPax);
      setIsEditPaxOpen(false);
    }
  };

  const hasRsvpData = (guest: any) => {
    if (!guest) return false;
    return guest.invitations?.some((inv: any) => {
      const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
      return !!rsvp;
    });
  };

  const hasInvRsvpData = (inv: any) => {
    if (!inv) return false;
    return !!(Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp) || (inv.seating_assignment?.length > 0);
  };

  return (
    <Box className="knotice-app" p={{ initial: "4", md: "7" }}>
      <Flex direction="column" gap="4" style={{ maxWidth: 1180, margin: "0 auto" }}>
        
        <Flex direction={{ initial: "column", md: "row" }} justify="between" align={{ initial: "start", md: "end" }} gap="4">
          <Box>
            <Heading size="8">Guest Management</Heading>
          </Box>
          <RadixButton 
            onClick={openAddModal}
            color="red"
            size="3"
            style={{ fontWeight: 600, cursor: "pointer" }}
          >
            <Plus width={18} height={18} />
            Add Guest
          </RadixButton>
        </Flex>

        {allInvitations && allInvitations.length > 0 && (
          <GuestMetrics invitations={filteredOverviewInvitations} config={config} />
        )}

        {/* Tabs */}
        <Flex gap="4" style={{ borderBottom: "1px solid var(--gray-5)", overflowX: "auto" }}>
          <button
            onClick={() => updateUrl({ tab: "all" })}
            style={{
              padding: "12px 16px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              background: "none",
              border: "none",
              borderBottom: currentTab === "all" ? "2px solid var(--red-9)" : "2px solid transparent",
              color: currentTab === "all" ? "var(--red-11)" : "var(--gray-11)",
              whiteSpace: "nowrap"
            }}
          >
            All Guests
          </button>
          {eventTypes.map(et => (
            <button
              key={et.id}
              onClick={() => updateUrl({ tab: et.slug })}
              style={{
                padding: "12px 16px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                background: "none",
                border: "none",
                borderBottom: currentTab === et.slug ? "2px solid var(--red-9)" : "2px solid transparent",
                color: currentTab === et.slug ? "var(--red-11)" : "var(--gray-11)",
                whiteSpace: "nowrap"
              }}
            >
              {et.name} Invitations
            </button>
          ))}
        </Flex>

      <GuestFilters 
        currentSearch={currentSearch}
        currentOwner={currentOwner}
        currentCategory={currentCategory}
        currentSort={currentSort}
        updateUrl={updateUrl}
        config={config}
      />

      <GuestTable 
        initialGuests={guests}
        currentTab={currentTab}
        eventTypes={eventTypes}
        totalPages={totalPages}
        currentPage={currentPage}
        isPending={isPending}
        copiedId={copiedId}
        openEditModal={openEditModal}
        setSelectedGuest={setSelectedGuest}
        setIsDeleteGuestOpen={setIsDeleteGuestOpen}
        setSelectedInv={setSelectedInv}
        setEditMaxPax={setEditMaxPax}
        setIsEditPaxOpen={setIsEditPaxOpen}
        setIsRegenerateOpen={setIsRegenerateOpen}
        setIsDeleteInvOpen={setIsDeleteInvOpen}
        handleCopyLink={handleCopyLink}
        handleCopyLinkOnly={handleCopyLinkOnly}
        handleToggleSent={handleToggleSent}
        handlePageChange={handlePageChange}
        config={config}
      />

      <GuestFormModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedGuest={selectedGuest}
        formData={formData}
        setFormData={setFormData}
        eventTypes={eventTypes}
        invitationsForm={invitationsForm}
        setInvitationsForm={setInvitationsForm}
        formError={formError}
        handleSave={handleSave}
        config={config}
      />

      <DeleteGuestModal 
        isDeleteGuestOpen={isDeleteGuestOpen}
        setIsDeleteGuestOpen={setIsDeleteGuestOpen}
        selectedGuest={selectedGuest}
        handleDeleteGuest={handleDeleteGuest}
        hasRsvpData={hasRsvpData}
      />

      <DeleteInvitationModal 
        isDeleteInvOpen={isDeleteInvOpen}
        setIsDeleteInvOpen={setIsDeleteInvOpen}
        selectedGuest={selectedGuest}
        selectedInv={selectedInv}
        handleDeleteInv={handleDeleteInv}
        hasInvRsvpData={hasInvRsvpData}
      />

      <EditPaxModal 
        isEditPaxOpen={isEditPaxOpen}
        setIsEditPaxOpen={setIsEditPaxOpen}
        editMaxPax={editMaxPax}
        setEditMaxPax={setEditMaxPax}
        handleEditPaxSubmit={handleEditPaxSubmit}
      />

      <RegenerateLinkModal 
        isRegenerateOpen={isRegenerateOpen}
        setIsRegenerateOpen={setIsRegenerateOpen}
        handleRegenerate={handleRegenerate}
      />

      </Flex>
    </Box>
  );
}
