"use client";

import { useState, useTransition, useCallback, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Copy, RefreshCw, Trash2, Edit2, Search, Plus, X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { createInvitation, updateMaxPax, regenerateLink, deleteInvitation } from "@/lib/actions/invitations";

export function InvitationClient({
  initialInvitations,
  guests,
  eventTypes,
  total,
  totalPages,
  currentPage,
  currentSearch,
  currentEventType
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditPaxOpen, setIsEditPaxOpen] = useState(false);
  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedInv, setSelectedInv] = useState<any>(null);
  
  // Add Form State
  const [addGuestId, setAddGuestId] = useState("");
  const [addGuestSearch, setAddGuestSearch] = useState("");
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [addEventTypeId, setAddEventTypeId] = useState("");
  const [addMaxPax, setAddMaxPax] = useState(1);
  const [addError, setAddError] = useState("");

  // Edit Pax Form State
  const [editMaxPax, setEditMaxPax] = useState(1);

  // Link copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Ref for closing combobox when clicking outside
  const comboboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsGuestDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered guests for Combobox
  const filteredGuests = guests.filter((g: any) => 
    g.name.toLowerCase().includes(addGuestSearch.toLowerCase())
  );

  const selectedGuestName = guests.find((g: any) => g.id === addGuestId)?.name || "";

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
    
    if (updates.search !== undefined || updates.eventType !== undefined) {
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

  // Actions
  const handleCopyLink = (inv: any) => {
    // Generate the full URL. Assuming base URL is window.location.origin
    const url = `${window.location.origin}/invite/${inv.event_type.slug}/${inv.invitation_code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    if (!addGuestId || !addEventTypeId) {
      setAddError("Please select a guest and an event type.");
      return;
    }

    const res = await createInvitation({
      guest_id: addGuestId,
      event_type_id: addEventTypeId,
      max_pax: addMaxPax,
      guest_name: guests.find((g: any) => g.id === addGuestId)?.name || ""
    });

    if (res.success) {
      setIsAddModalOpen(false);
    } else {
      setAddError(res.error || "Failed to create invitation");
    }
  };

  const handleEditPaxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInv) {
      await updateMaxPax(selectedInv.id, editMaxPax);
      setIsEditPaxOpen(false);
    }
  };

  const handleRegenerate = async () => {
    if (selectedInv) {
      await regenerateLink(selectedInv.id, selectedInv.guest.name);
      setIsRegenerateOpen(false);
    }
  };

  const handleDelete = async () => {
    if (selectedInv) {
      await deleteInvitation(selectedInv.id);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Invitation Management</h1>
          <p className="text-slate-500 mt-1">Assign invitations and generate links.</p>
        </div>
        <button 
          onClick={() => {
            setAddGuestId("");
            setAddGuestSearch("");
            setAddEventTypeId("");
            setAddMaxPax(1);
            setAddError("");
            setIsAddModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Assign Invitation
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by guest name..." 
            defaultValue={currentSearch}
            onChange={(e) => updateUrl({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={currentEventType} 
            onChange={(e) => updateUrl({ eventType: e.target.value })}
            className="flex-1 md:w-48 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="All">All Event Types</option>
            {eventTypes.map((et: any) => (
              <option key={et.id} value={et.slug}>{et.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Guest Name</th>
                <th className="px-6 py-4 font-medium">Event Type</th>
                <th className="px-6 py-4 font-medium">Invitation Code</th>
                <th className="px-6 py-4 font-medium">Max Pax</th>
                <th className="px-6 py-4 font-medium">RSVP / Confirmed</th>
                <th className="px-6 py-4 font-medium">Table</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialInvitations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No invitations found.
                  </td>
                </tr>
              ) : (
                initialInvitations.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{inv.guest.name}</td>
                    <td className="px-6 py-4 text-slate-600">{inv.event_type.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{inv.invitation_code}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{inv.max_pax}</td>
                    <td className="px-6 py-4">
                      {(() => {
                        let rsvp = null;
                        if (inv.rsvp) {
                          if (Array.isArray(inv.rsvp) && inv.rsvp.length > 0) rsvp = inv.rsvp[0];
                          else if (!Array.isArray(inv.rsvp)) rsvp = inv.rsvp;
                        }
                        
                        if (rsvp) {
                          return (
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${rsvp.attendance_status === 'attending' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {rsvp.attendance_status === 'attending' ? 'Attending' : 'Declined'}
                              </span>
                              <span className="text-slate-500 font-medium">({rsvp.confirmed_pax || 0} pax)</span>
                            </div>
                          );
                        } else {
                          return (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">Pending</span>
                          );
                        }
                      })()}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {inv.seating_assignment?.[0]?.seating_table?.table_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleCopyLink(inv)} 
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition group relative"
                          title="Copy Link"
                        >
                          {copiedId === inv.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedInv(inv);
                            setEditMaxPax(inv.max_pax);
                            setIsEditPaxOpen(true);
                          }} 
                          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition"
                          title="Edit Max Pax"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedInv(inv);
                            setIsRegenerateOpen(true);
                          }} 
                          className="p-2 text-slate-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition"
                          title="Regenerate Link"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedInv(inv);
                            setIsDeleteOpen(true);
                          }} 
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Invitation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-visible shadow-xl animate-fade-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Assign Invitation</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 flex flex-col gap-4 overflow-visible">
              
              {/* Searchable Combobox for Guests */}
              <div className="relative" ref={comboboxRef}>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Guest</label>
                <input
                  type="text"
                  placeholder="Search guest name..."
                  value={isGuestDropdownOpen ? addGuestSearch : selectedGuestName || addGuestSearch}
                  onFocus={() => {
                    setIsGuestDropdownOpen(true);
                    setAddGuestSearch(""); // Reset search when opening
                  }}
                  onChange={(e) => {
                    setAddGuestSearch(e.target.value);
                    setIsGuestDropdownOpen(true);
                  }}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                {isGuestDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg">
                    {filteredGuests.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-500">No guests found</div>
                    ) : (
                      filteredGuests.map((g: any) => (
                        <div 
                          key={g.id} 
                          className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                          onClick={() => {
                            setAddGuestId(g.id);
                            setAddGuestSearch(g.name);
                            setIsGuestDropdownOpen(false);
                          }}
                        >
                          <span className="font-medium">{g.name}</span>
                          <span className="text-slate-400 ml-2">({g.category})</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
                <select 
                  required
                  value={addEventTypeId}
                  onChange={e => setAddEventTypeId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="" disabled>Select event type</option>
                  {eventTypes.map((et: any) => (
                    <option key={et.id} value={et.id}>{et.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Pax</label>
                <input 
                  required
                  type="number" 
                  min="1"
                  value={addMaxPax}
                  onChange={e => setAddMaxPax(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {addError && <p className="text-red-500 text-sm mt-2">{addError}</p>}

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition">Assign</button>
              </div>
            </form>
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
                <input 
                  required
                  type="number" 
                  min="1"
                  value={editMaxPax}
                  onChange={e => setEditMaxPax(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
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
            <p className="text-slate-500 mb-6 text-sm">This will create a new invitation code. <strong>The old link will immediately stop working.</strong> Are you sure?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsRegenerateOpen(false)} className="px-4 py-2 flex-1 text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition">Cancel</button>
              <button onClick={handleRegenerate} className="px-4 py-2 flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition">Yes, Regenerate</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Invitation?</h2>
            <p className="text-slate-500 mb-4 text-sm">Are you sure you want to delete the {selectedInv?.event_type.name} invitation for {selectedInv?.guest.name}?</p>
            
            {(() => {
              let hasRsvp = false;
              if (selectedInv?.rsvp) {
                if (Array.isArray(selectedInv.rsvp) && selectedInv.rsvp.length > 0) hasRsvp = true;
                else if (!Array.isArray(selectedInv.rsvp)) hasRsvp = true;
              }
              const hasSeating = selectedInv?.seating_assignment?.length > 0;
              
              if (hasRsvp || hasSeating) {
                return (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-6 text-left">
                    <strong>Warning:</strong> This invitation has active RSVP or Seating data. Deleting it will permanently remove those records as well!
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex justify-center gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 flex-1 text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
