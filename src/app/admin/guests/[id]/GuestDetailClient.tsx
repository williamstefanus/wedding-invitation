"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Copy, Check, CheckCheck, Send, Loader2 } from "lucide-react";
import { getGuestById, updateGuest, toggleInvitationSent } from "@/lib/actions/guests";
import { GuestFormModal } from "@/components/admin/guests/modals/GuestFormModal";
import type { GuestOwner, GuestCategory } from "@/types";

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
    if (eventSlug === "wedding" && config?.wa_template_wedding) return config.wa_template_wedding;
    if (eventSlug === "sangjit" && config?.wa_template_sangjit) return config.wa_template_sangjit;
    return "Halo {nama}! 🎉 Kami mengundang kamu ke acara kami.\n\nLink undangan: {link}";
  };

  const handleCopyLink = (inv: any) => {
    const url = `${window.location.origin}/invite/${inv.event_type.slug}/${inv.invitation_code}`;
    const template = getWaTemplate(inv.event_type.slug);
    const deadlineStr = inv.event_type?.rsvp_edit_deadline_at
      ? new Date(inv.event_type.rsvp_edit_deadline_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
      : "-";
    const message = template
      .replace(/{nama}/g, guest.name)
      .replace(/{link}/g, url)
      .replace(/{deadline}/g, deadlineStr);
    navigator.clipboard.writeText(message);
    setCopiedId(inv.id);
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
      {/* Invitations & RSVPs */}
      <div className="md:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Invitations</h2>
          <button
            onClick={openEditModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition shadow-sm"
          >
            <Edit2 className="w-4 h-4" />
            Edit Guest
          </button>
        </div>
        
        {currentGuest.invitations?.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
            This guest has no active invitations.
          </div>
        ) : (
          currentGuest.invitations?.map((inv: any) => {
            const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
            const assignment = Array.isArray(inv.seating_assignment) ? inv.seating_assignment[0] : inv.seating_assignment;

            return (
              <div key={inv.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Card Header */}
                <div className={`px-6 py-4 border-b flex justify-between items-center
                  ${inv.event_type.slug === 'wedding' ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'}
                `}>
                  <h3 className={`font-bold text-lg 
                    ${inv.event_type.slug === 'wedding' ? 'text-amber-800' : 'text-rose-800'}
                  `}>
                    {inv.event_type.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-sm font-mono font-bold text-slate-600 shadow-sm">
                      {inv.invitation_code}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Max Pax</p>
                      <p className="text-xl font-bold text-slate-700">{inv.max_pax} <span className="text-sm font-medium text-slate-400">pax</span></p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">RSVP Status</p>
                      {rsvp ? (
                        <p className={`text-xl font-bold ${rsvp.attendance_status === 'attending' ? 'text-green-600' : 'text-rose-600'}`}>
                          {rsvp.attendance_status === 'attending' ? `Attending (${rsvp.confirmed_pax} pax)` : 'Declined'}
                        </p>
                      ) : (
                        <p className="text-xl font-bold text-amber-500">Pending</p>
                      )}
                    </div>
                  </div>

                  {rsvp?.wish_message && (
                    <div className="mb-6">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wish Message</p>
                      <p className="text-slate-600 italic bg-slate-50 p-4 rounded-xl border border-slate-100">&ldquo;{rsvp.wish_message}&rdquo;</p>
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Table Assignment</p>
                    {assignment ? (
                      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold border border-blue-100">
                        {assignment.seating_table.table_name}
                        <span className="text-sm font-medium opacity-75">({assignment.assigned_pax} pax)</span>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-slate-500">Not assigned yet.</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    {/* Copy WhatsApp Message */}
                    <button
                      onClick={() => handleCopyLink(inv)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                        copiedId === inv.id
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                      }`}
                    >
                      {copiedId === inv.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedId === inv.id ? "Copied!" : "Copy WA Message"}
                    </button>

                    {/* Mark as Sent */}
                    <button
                      onClick={() => handleToggleSent(inv)}
                      disabled={togglingId === inv.id}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition disabled:opacity-50 ${
                        inv.is_sent
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                      }`}
                    >
                      {togglingId === inv.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : inv.is_sent ? (
                        <CheckCheck className="w-4 h-4" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {inv.is_sent ? "Invitation Sent" : "Mark as Sent"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

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
