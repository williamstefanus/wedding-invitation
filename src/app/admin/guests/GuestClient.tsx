"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Edit2, Trash2, Search, Plus, X, ChevronLeft, ChevronRight, Copy, RefreshCw, Check } from "lucide-react";
import { createGuest, updateGuest, deleteGuest, deleteInvitationAction, regenerateLink, updateMaxPax, getGuestById } from "@/lib/actions/guests";
import type { Guest, GuestOwner, GuestCategory } from "@/types";

interface GuestClientProps {
  initialGuests: any[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentSearch: string;
  currentOwner: string;
  currentCategory: string;
  currentTab: string;
  eventTypes: any[];
}

export function GuestClient({
  initialGuests,
  total,
  totalPages,
  currentPage,
  currentSearch,
  currentOwner,
  currentCategory,
  currentTab,
  eventTypes
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
    
    if (updates.search !== undefined || updates.owner !== undefined || updates.category !== undefined || updates.tab !== undefined) {
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

  const handleCopyLink = (inv: any) => {
    const url = `${window.location.origin}/invite/${inv.event_type.slug}/${inv.invitation_code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
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
    // Fetch full guest to ensure we have all invitations, regardless of active tab filter
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
        // If it's the last invitation, delete the whole guest
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            defaultValue={currentSearch}
            onChange={(e) => updateUrl({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={currentOwner} 
            onChange={e => updateUrl({ owner: e.target.value })}
            className="flex-1 md:w-40 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="All">All Owners</option>
            <option value="William">William</option>
            <option value="Aziel">Aziel</option>
          </select>
          <select 
            value={currentCategory} 
            onChange={e => updateUrl({ category: e.target.value })}
            className="flex-1 md:w-40 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="All">All Categories</option>
            <option value="Relatives">Relatives</option>
            <option value="Friends">Friends</option>
            <option value="Church">Church</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Owner & Category</th>
                {currentTab === "all" ? (
                  <>
                    {eventTypes.map(et => (
                      <th key={et.id} className="px-6 py-4 font-medium">{et.name}</th>
                    ))}
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 font-medium">Code</th>
                    <th className="px-6 py-4 font-medium">Pax</th>
                    <th className="px-6 py-4 font-medium">RSVP / Confirmed</th>
                    <th className="px-6 py-4 font-medium">Table</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialGuests.length === 0 ? (
                <tr>
                  <td colSpan={currentTab === "all" ? 4 : 7} className="px-6 py-12 text-center text-slate-500">
                    No records found matching your criteria.
                  </td>
                </tr>
              ) : (
                initialGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <Link href={`/admin/guests/${guest.id}`} className="font-medium text-amber-600 hover:text-amber-700 hover:underline transition block">
                        {guest.name}
                      </Link>
                      {guest.phone && <div className="text-xs text-slate-500 mt-0.5">{guest.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${guest.owner === 'William' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                          {guest.owner}
                        </span>
                        <span className="text-slate-600 text-xs">{guest.category}</span>
                      </div>
                    </td>

                    {currentTab === "all" ? (
                      <>
                        {eventTypes.map(et => {
                          const inv = guest.invitations?.find((i: any) => i.event_type_id === et.id);
                          if (!inv) return <td key={et.id} className="px-6 py-4 text-slate-400">-</td>;
                          
                          let rsvp = null;
                          if (inv.rsvp) {
                            rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
                          }

                          let statusDisplay;
                          if (!rsvp) {
                            statusDisplay = <span className="text-slate-500 font-medium">Pending ({inv.max_pax})</span>;
                          } else if (rsvp.attendance_status === 'attending') {
                            statusDisplay = <span className="text-green-600 font-bold">Attending ({rsvp.confirmed_pax})</span>;
                          } else {
                            statusDisplay = <span className="text-red-500 font-medium">Declined (0)</span>;
                          }

                          return (
                            <td key={et.id} className="px-6 py-4 text-sm">
                              {statusDisplay}
                            </td>
                          );
                        })}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal(guest)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setSelectedGuest(guest); setIsDeleteGuestOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>{(() => {
                        const inv = guest.invitations?.[0]; // Because of !inner, there is only one match
                        if (!inv) return <td colSpan={5}></td>;

                        let rsvp = null;
                        if (inv.rsvp) {
                          rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
                        }

                        return (
                          <>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{inv.invitation_code}</td>
                            <td className="px-6 py-4 font-medium text-slate-700">{inv.max_pax}</td>
                            <td className="px-6 py-4">
                              {rsvp ? (
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${rsvp.attendance_status === 'attending' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {rsvp.attendance_status === 'attending' ? 'Attending' : 'Declined'}
                                  </span>
                                  <span className="text-slate-500 font-medium">({rsvp.confirmed_pax || 0} pax)</span>
                                </div>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">Pending</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {inv.seating_assignment?.[0]?.seating_table?.table_name || "-"}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleCopyLink(inv)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Copy Link">
                                  {copiedId === inv.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <button onClick={() => { setSelectedGuest(guest); setSelectedInv(inv); setEditMaxPax(inv.max_pax); setIsEditPaxOpen(true); }} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition" title="Edit Max Pax">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setSelectedGuest(guest); setSelectedInv(inv); setIsRegenerateOpen(true); }} className="p-2 text-slate-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition" title="Regenerate Link">
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setSelectedGuest(guest); setSelectedInv(inv); setIsDeleteInvOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title={`Delete ${inv.event_type.name} Invitation`}>
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )
                      })()}</>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={currentPage === 1 || isPending} onClick={() => handlePageChange(currentPage - 1)} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button disabled={currentPage === totalPages || isPending} onClick={() => handlePageChange(currentPage + 1)} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl animate-fade-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">{selectedGuest ? 'Edit Guest & Invitations' : 'Add Guest'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">1. Guest Details</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number (Optional)</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                    <select value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value as GuestOwner})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                      <option value="William">William</option>
                      <option value="Aziel">Aziel</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as GuestCategory})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                      <option value="Relatives">Relatives</option>
                      <option value="Friends">Friends</option>
                      <option value="Church">Church</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                    <input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">2. Invitations</h3>
                {eventTypes.map(et => (
                  <div key={et.id} className={`p-4 rounded-xl border ${invitationsForm[et.id]?.is_selected ? 'border-amber-500 bg-amber-50/30' : 'border-slate-200 bg-slate-50'} transition-all flex items-center justify-between`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={invitationsForm[et.id]?.is_selected || false} 
                        onChange={e => setInvitationsForm({...invitationsForm, [et.id]: {...invitationsForm[et.id], is_selected: e.target.checked}})} 
                        className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span className="font-medium text-slate-800">{et.name}</span>
                    </label>
                    {invitationsForm[et.id]?.is_selected && (
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-500">Max Pax:</label>
                        <input 
                          type="number" 
                          min="1" 
                          value={invitationsForm[et.id]?.max_pax || 1} 
                          onChange={e => setInvitationsForm({...invitationsForm, [et.id]: {...invitationsForm[et.id], max_pax: parseInt(e.target.value) || 1}})}
                          className="w-16 px-2 py-1 border border-slate-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <div className="flex justify-end gap-3 mt-2 pt-6 border-t border-slate-100 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Guest Modal */}
      {isDeleteGuestOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Master Guest?</h2>
            <p className="text-slate-500 mb-4 text-sm">Are you sure you want to delete {selectedGuest?.name}? This deletes ALL of their invitations.</p>
            {hasRsvpData(selectedGuest) && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-6 text-left">
                <strong>Warning:</strong> This guest has submitted RSVP data. Deleting them will permanently erase all RSVP and seating records!
              </div>
            )}
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={() => setIsDeleteGuestOpen(false)} className="px-4 py-2 flex-1 text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition">Cancel</button>
              <button onClick={handleDeleteGuest} className="px-4 py-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Invitation Modal */}
      {isDeleteInvOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Invitation?</h2>
            {selectedGuest?.invitations?.length === 1 ? (
               <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-6 text-left">
                 <strong>Crucial Warning:</strong> This is {selectedGuest.name}'s LAST remaining invitation. A guest cannot exist without an invitation. Proceeding will also <strong>delete the master Guest record</strong>.
               </div>
            ) : (
               <>
                 <p className="text-slate-500 mb-4 text-sm">Are you sure you want to delete the {selectedInv?.event_type.name} invitation for {selectedGuest?.name}?</p>
                 {hasInvRsvpData(selectedInv) && (
                   <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-6 text-left">
                     <strong>Warning:</strong> Active RSVP or Seating data found for this event. It will be lost!
                   </div>
                 )}
               </>
            )}
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={() => setIsDeleteInvOpen(false)} className="px-4 py-2 flex-1 text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition">Cancel</button>
              <button onClick={handleDeleteInv} className="px-4 py-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Max Pax Modal */}
      {isEditPaxOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Edit Max Pax</h2>
              <button onClick={() => setIsEditPaxOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditPaxSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Pax allowed</label>
                <input required type="number" min="1" value={editMaxPax} onChange={e => setEditMaxPax(parseInt(e.target.value) || 1)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsEditPaxOpen(false)} className="px-4 py-2 text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Regenerate Link Modal */}
      {isRegenerateOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Regenerate Link?</h2>
            <p className="text-slate-500 mb-6 text-sm">This creates a new code. <strong>The old link will immediately stop working.</strong></p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsRegenerateOpen(false)} className="px-4 py-2 flex-1 text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition">Cancel</button>
              <button onClick={handleRegenerate} className="px-4 py-2 flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition">Regenerate</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
