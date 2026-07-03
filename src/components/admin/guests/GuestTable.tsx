"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit2, Trash2, Check, Copy, RefreshCw, ChevronLeft, ChevronRight, Send, CheckCheck } from "lucide-react";
import { bulkDeleteGuests, bulkDeleteInvitations } from "@/lib/actions/guests";

interface GuestTableProps {
  initialGuests: any[];
  currentTab: string;
  eventTypes: any[];
  totalPages: number;
  currentPage: number;
  isPending: boolean;
  copiedId: string | null;
  openEditModal: (guest: any) => void;
  setSelectedGuest: (guest: any) => void;
  setIsDeleteGuestOpen: (isOpen: boolean) => void;
  setSelectedInv: (inv: any) => void;
  setEditMaxPax: (pax: number) => void;
  setIsEditPaxOpen: (isOpen: boolean) => void;
  setIsRegenerateOpen: (isOpen: boolean) => void;
  setIsDeleteInvOpen: (isOpen: boolean) => void;
  handleCopyLink: (inv: any, guestName?: string, guestPhone?: string) => void;
  handleToggleSent: (invId: string, currentStatus: boolean, ownerName: string) => void;
  handlePageChange: (newPage: number) => void;
  config?: any;
}

export function GuestTable({
  initialGuests,
  currentTab,
  eventTypes,
  totalPages,
  currentPage,
  isPending,
  copiedId,
  openEditModal,
  setSelectedGuest,
  setIsDeleteGuestOpen,
  setSelectedInv,
  setEditMaxPax,
  setIsEditPaxOpen,
  setIsRegenerateOpen,
  setIsDeleteInvOpen,
  handleCopyLink,
  handleToggleSent,
  handlePageChange,
  config = {}
}: GuestTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const groomName = config.groomFirstName || "John";
  const brideName = config.brideFirstName || "Jane";

  useEffect(() => {
    setSelectedIds([]);
  }, [currentTab, currentPage]);

  // Compute visible row IDs for select-all
  const currentVisibleIds = initialGuests.map(g => {
    if (currentTab === "all") return g.id;
    return g.invitations?.[0]?.id || g.id;
  }).filter(Boolean);

  const allSelected = currentVisibleIds.length > 0 && currentVisibleIds.every(id => selectedIds.includes(id));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(Array.from(new Set([...selectedIds, ...currentVisibleIds])));
    } else {
      setSelectedIds(selectedIds.filter(id => !currentVisibleIds.includes(id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const label = currentTab === "all" ? "guest(s)" : "invitation(s)";
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected ${label}? This cannot be undone.`)) {
      return;
    }
    setIsBulkDeleting(true);
    if (currentTab === "all") {
      await bulkDeleteGuests(selectedIds);
    } else {
      await bulkDeleteInvitations(selectedIds);
    }
    setIsBulkDeleting(false);
    setSelectedIds([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* ── Bulk Actions Banner ── */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between animate-fadeIn">
          <span className="text-sm font-bold text-amber-900">
            {selectedIds.length} {currentTab === "all" ? "guest(s)" : "invitation(s)"} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition"
            >
              Clear Selection
            </button>
            <button
              disabled={isBulkDeleting}
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isBulkDeleting ? "Deleting..." : "Delete Selected"}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium text-center w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  title="Select All"
                />
              </th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Owner &amp; Category</th>
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
                  <th className="px-6 py-4 font-medium text-center">Sent</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialGuests.length === 0 ? (
              <tr>
                <td colSpan={currentTab === "all" ? 5 : 9} className="px-6 py-12 text-center text-slate-500">
                  No records found matching your criteria.
                </td>
              </tr>
            ) : (
              initialGuests.map((guest) => {
                const rowId = currentTab === "all" ? guest.id : (guest.invitations?.[0]?.id || guest.id);
                const isChecked = selectedIds.includes(rowId);

                const toggleRow = () => {
                  if (isChecked) setSelectedIds(selectedIds.filter(id => id !== rowId));
                  else setSelectedIds([...selectedIds, rowId]);
                };

                return (
                  <tr key={guest.id} className={`hover:bg-slate-50/50 transition ${isChecked ? "bg-amber-50/30" : ""}`}>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={toggleRow}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/guests/${guest.id}`} className="font-medium text-amber-600 hover:text-amber-700 hover:underline transition block">
                        {guest.name}
                      </Link>
                      {guest.phone && <div className="text-xs text-slate-500 mt-0.5">{guest.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${guest.owner === "groom" ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                          {guest.owner === "groom" ? groomName : brideName}
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
                        const inv = guest.invitations?.[0];
                        if (!inv) return <td colSpan={6}></td>;

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
                            {/* Mark as Sent */}
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleToggleSent(inv.id, !!inv.is_sent, guest.name)}
                                title={inv.is_sent ? "Mark as unsent" : "Mark as sent"}
                                className={`p-2 rounded-lg transition-colors border ${inv.is_sent ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"}`}
                              >
                                {inv.is_sent ? <CheckCheck className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleCopyLink(inv, guest.name, guest.phone)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Copy & Send WhatsApp Message">
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
  );
}
