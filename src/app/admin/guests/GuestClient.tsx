"use client";

import { useState, useTransition, useCallback, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { createGuest, updateGuest, deleteGuest, deleteInvitationAction, regenerateLink, updateMaxPax, getGuestById, toggleInvitationSent } from "@/lib/actions/guests";
import type { GuestOwner, GuestCategory } from "@/types";
import { GuestMetrics } from "@/components/admin/guests/GuestMetrics";
import { formatWhatsAppPhone } from "@/lib/utils";

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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    owner: "William" as GuestOwner,
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
    if (eventSlug === "wedding" && config?.wa_template_wedding) return config.wa_template_wedding;
    if (eventSlug === "sangjit" && config?.wa_template_sangjit) return config.wa_template_sangjit;
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

    setCopiedId(inv.id);
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
    setFormData({ name: "", phone: "", owner: "William", category: "Friends", notes: "" });
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
      owner: guestData.owner || "William",
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
    return guest.invitations?.some((inv: any) => {
      const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
      return !!rsvp;
    });
  };

  const hasInvRsvpData = (inv: any) => {
    return !!(Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp) || (inv.seating_assignment?.length > 0);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Guest Management</h1>
          <p className="text-slate-500 mt-1">Total {total} guests found.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Add Guest
        </button>
      </div>

      {allInvitations && allInvitations.length > 0 && (
        <GuestMetrics invitations={filteredOverviewInvitations} />
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => updateUrl({ tab: "all" })}
          className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${currentTab === "all" ? "border-amber-500 text-amber-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
        >
          All Guests
        </button>
        {eventTypes.map(et => (
          <button
            key={et.id}
            onClick={() => updateUrl({ tab: et.slug })}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${currentTab === et.slug ? "border-amber-500 text-amber-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
          >
            {et.name} Invitations
          </button>
        ))}
      </div>

      <GuestFilters 
        currentSearch={currentSearch}
        currentOwner={currentOwner}
        currentCategory={currentCategory}
        currentSort={currentSort}
        updateUrl={updateUrl}
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
        handleToggleSent={handleToggleSent}
        handlePageChange={handlePageChange}
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

    </div>
  );
}
