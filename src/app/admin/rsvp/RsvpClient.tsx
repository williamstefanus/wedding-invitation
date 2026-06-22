"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Eye, Edit2, Trash2, Search, Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import { adminUpdateRsvp, resetRsvp, getAllRsvpsForExport } from "@/lib/actions/adminRsvp";
import { exportToExcel } from "@/lib/utils/exportExcel";

export function RsvpClient({
  initialInvitations,
  eventTypes,
  eventSessions,
  total,
  totalPages,
  currentPage,
  currentSearch,
  currentEventType,
  currentOwner,
  currentCategory,
  currentStatus
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState<any>(null);

  // Edit Form State
  const [editStatus, setEditStatus] = useState("pending");
  const [editPax, setEditPax] = useState(0);
  const [editSelectedSessions, setEditSelectedSessions] = useState<string[]>([]);

  let currentRsvp = null;
  if (selectedInv?.rsvp) {
    if (Array.isArray(selectedInv.rsvp)) {
      if (selectedInv.rsvp.length > 0) currentRsvp = selectedInv.rsvp[0];
    } else {
      currentRsvp = selectedInv.rsvp;
    }
  }
  const isSelectedPending = !currentRsvp;

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
    
    // Changing filters resets pagination
    if (Object.keys(updates).some(k => k !== "page")) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateUrl({ page: newPage.toString() });
  };

  // Export
  const handleExport = async () => {
    // Fetch all records for the current filters
    const res = await getAllRsvpsForExport({
      search: currentSearch,
      eventType: currentEventType,
      owner: currentOwner,
      category: currentCategory,
      status: currentStatus
    });

    if (res.success && res.data) {
      exportToExcel(res.data, `RSVP_Export_${new Date().toISOString().split('T')[0]}`);
    } else {
      alert("Failed to export data.");
    }
  };

  // Modal Handlers
  const openViewModal = (inv: any) => {
    setSelectedInv(inv);
    setIsViewOpen(true);
  };

  const openEditModal = (inv: any) => {
    setSelectedInv(inv);
    let rsvp = null;
    if (inv.rsvp) {
      if (Array.isArray(inv.rsvp)) {
        if (inv.rsvp.length > 0) rsvp = inv.rsvp[0];
      } else {
        rsvp = inv.rsvp;
      }
    }
    const isPend = !rsvp;
    
    setEditStatus(isPend ? "pending" : rsvp.attendance_status);
    setEditPax(isPend ? 0 : rsvp.confirmed_pax);
    setEditSelectedSessions(isPend ? [] : rsvp.selected_sessions.map((s: any) => s.event_session_id));
    
    setIsEditOpen(true);
  };

  const openResetModal = (inv: any) => {
    setSelectedInv(inv);
    setIsResetOpen(true);
  };

  // Submission Handlers
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInv) {
      if (editStatus === "pending") {
        // Equivalent to reset if they change it back to pending
        await resetRsvp(selectedInv.id);
      } else {
        await adminUpdateRsvp({
          invitation_id: selectedInv.id,
          attendance_status: editStatus as "attending" | "not_attending",
          confirmed_pax: editPax,
          selected_session_ids: editSelectedSessions
        });
      }
      setIsEditOpen(false);
    }
  };

  const handleReset = async () => {
    if (selectedInv) {
      await resetRsvp(selectedInv.id);
      setIsResetOpen(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">RSVP Management</h1>
          <p className="text-slate-500 mt-1">Monitor, edit, and export guest submissions.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search guest..." 
            defaultValue={currentSearch}
            onChange={(e) => updateUrl({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
        
        <select 
          value={currentEventType} 
          onChange={(e) => updateUrl({ eventType: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="All">All Event Types</option>
          {eventTypes.map((et: any) => (
            <option key={et.id} value={et.slug}>{et.name}</option>
          ))}
        </select>

        <select 
          value={currentOwner} 
          onChange={(e) => updateUrl({ owner: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="All">All Owners</option>
          <option value="William">William</option>
          <option value="Aziel">Aziel</option>
        </select>

        <select 
          value={currentCategory} 
          onChange={(e) => updateUrl({ category: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="All">All Categories</option>
          <option value="Relatives">Relatives</option>
          <option value="Friends">Friends</option>
          <option value="Church">Church</option>
        </select>

        <select 
          value={currentStatus} 
          onChange={(e) => updateUrl({ status: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="attending">Attending</option>
          <option value="not_attending">Declined</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Guest Name</th>
                <th className="px-6 py-4 font-medium">Event</th>
                <th className="px-6 py-4 font-medium">Owner / Cat</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Pax</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
                <th className="px-6 py-4 font-medium">Table</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialInvitations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    No RSVP records found.
                  </td>
                </tr>
              ) : (
                initialInvitations.map((inv: any) => {
                  let rsvp = null;
                  if (Array.isArray(inv.rsvp)) {
                    if (inv.rsvp.length > 0) rsvp = inv.rsvp[0];
                  } else if (inv.rsvp) {
                    rsvp = inv.rsvp;
                  }
                  const isPend = !rsvp;
                  
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-medium text-slate-800">{inv.guest.name}</td>
                      <td className="px-6 py-4 text-slate-600">{inv.event_type.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-800">{inv.guest.owner}</span>
                          <span className="text-xs text-slate-500">{inv.guest.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isPend ? (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">Pending</span>
                        ) : rsvp.attendance_status === 'attending' ? (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">Attending</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">Declined</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {isPend ? "-" : `${rsvp.confirmed_pax} / ${inv.max_pax}`}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {isPend ? "-" : new Date(rsvp.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {inv.seating_assignment?.seating_table?.table_name || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openViewModal(inv)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditModal(inv)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition" title="Edit RSVP">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => openResetModal(inv)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Reset RSVP">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* View Details Modal */}
      {isViewOpen && selectedInv && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">RSVP Details</h2>
              <button onClick={() => setIsViewOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-1">{selectedInv.guest.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{selectedInv.event_type.name} Invitation</p>

              {isSelectedPending ? (
                <div className="text-center text-slate-500 py-8 bg-slate-50 rounded-lg border border-slate-100">
                  Guest has not submitted an RSVP yet.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between pb-3 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Status</span>
                    <span className={`font-medium ${currentRsvp?.attendance_status === 'attending' ? 'text-green-600' : 'text-red-600'}`}>
                      {currentRsvp?.attendance_status === 'attending' ? 'Attending' : 'Declined'}
                    </span>
                  </div>
                  
                  {currentRsvp?.attendance_status === 'attending' && (
                    <>
                      <div className="flex justify-between pb-3 border-b border-slate-100">
                        <span className="text-slate-500 text-sm">Confirmed Pax</span>
                        <span className="font-medium text-slate-800">{currentRsvp.confirmed_pax} of {selectedInv.max_pax}</span>
                      </div>
                      <div className="flex flex-col pb-3 border-b border-slate-100 gap-1">
                        <span className="text-slate-500 text-sm">Selected Sessions</span>
                        {currentRsvp.selected_sessions.length > 0 ? (
                          <ul className="list-disc pl-5 text-sm text-slate-800 font-medium">
                            {currentRsvp.selected_sessions.map((ss: any) => {
                              const sObj = eventSessions.find((es: any) => es.id === ss.event_session_id);
                              return <li key={ss.event_session_id}>{sObj?.name || 'Unknown Session'}</li>;
                            })}
                          </ul>
                        ) : (
                          <span className="text-sm text-slate-400">None selected</span>
                        )}
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-1 pt-2">
                    <span className="text-slate-500 text-sm">Wishes Message</span>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-slate-800 text-sm italic min-h-[80px]">
                      {currentRsvp?.wish_message ? `"${currentRsvp.wish_message}"` : <span className="text-amber-600/50 not-italic">No message provided.</span>}
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 text-right mt-2">
                    Submitted: {new Date(currentRsvp?.submitted_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && selectedInv && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Edit RSVP for {selectedInv.guest.name}</h2>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  value={editStatus}
                  onChange={(e) => {
                    setEditStatus(e.target.value);
                    if (e.target.value === 'not_attending') {
                      setEditPax(0);
                      setEditSelectedSessions([]);
                    } else if (e.target.value === 'attending' && editPax === 0) {
                      setEditPax(1);
                    }
                  }}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="pending">Pending</option>
                  <option value="attending">Attending</option>
                  <option value="not_attending">Declined</option>
                </select>
              </div>

              {editStatus === 'attending' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirmed Pax (Max: {selectedInv.max_pax})</label>
                    <input 
                      type="number" 
                      min="1"
                      max={selectedInv.max_pax}
                      value={editPax}
                      onChange={(e) => setEditPax(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Selected Sessions</label>
                    <div className="flex flex-col gap-2">
                      {eventSessions
                        .filter((s: any) => s.event_type_id === selectedInv.event_type_id)
                        .map((session: any) => (
                        <label key={session.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={editSelectedSessions.includes(session.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditSelectedSessions([...editSelectedSessions, session.id]);
                              } else {
                                setEditSelectedSessions(editSelectedSessions.filter(id => id !== session.id));
                              }
                            }}
                            className="w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-amber-500"
                          />
                          {session.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Warning if changing to not attending when seating exists */}
              {editStatus === 'not_attending' && selectedInv.seating_assignment && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-700">
                  <strong>Warning:</strong> Saving this will remove the guest's seating assignment.
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Modal */}
      {isResetOpen && selectedInv && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Reset RSVP?</h2>
            <p className="text-slate-500 mb-4 text-sm">This will completely wipe the RSVP record for {selectedInv.guest.name}, returning the invitation to <strong>Pending</strong>.</p>
            
            {selectedInv?.seating_assignment && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-6 text-left">
                <strong>Warning:</strong> This will also wipe their seating assignment.
              </div>
            )}

            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => setIsResetOpen(false)} className="px-4 py-2 flex-1 text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition">Cancel</button>
              <button onClick={handleReset} className="px-4 py-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition">Yes, Reset</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
