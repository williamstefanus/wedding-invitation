"use client";

import { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { bulkResetRsvps, bulkDeleteRsvpInvitations } from "@/lib/actions/adminRsvp";

interface RsvpTableProps {
  initialInvitations: any[];
  totalPages: number;
  currentPage: number;
  isPending: boolean;
  openViewModal: (inv: any) => void;
  openEditModal: (inv: any) => void;
  openResetModal: (inv: any) => void;
  handlePageChange: (newPage: number) => void;
}

export function RsvpTable({
  initialInvitations,
  totalPages,
  currentPage,
  isPending,
  openViewModal,
  openEditModal,
  openResetModal,
  handlePageChange
}: RsvpTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  useEffect(() => {
    setSelectedIds([]);
  }, [currentPage]);

  const currentVisibleIds = initialInvitations.map(inv => inv.id).filter(Boolean);
  const allSelected = currentVisibleIds.length > 0 && currentVisibleIds.every(id => selectedIds.includes(id));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(Array.from(new Set([...selectedIds, ...currentVisibleIds])));
    } else {
      setSelectedIds(selectedIds.filter(id => !currentVisibleIds.includes(id)));
    }
  };

  const handleBulkReset = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to reset RSVPs for ${selectedIds.length} selected invitation(s)? This will clear their RSVP responses and seating assignments.`)) {
      return;
    }
    setIsBulkProcessing(true);
    await bulkResetRsvps(selectedIds);
    setIsBulkProcessing(false);
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected invitation(s)? This cannot be undone.`)) {
      return;
    }
    setIsBulkProcessing(true);
    await bulkDeleteRsvpInvitations(selectedIds);
    setIsBulkProcessing(false);
    setSelectedIds([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* ── Bulk Actions Banner ── */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between animate-fadeIn">
          <span className="text-sm font-bold text-amber-900">
            {selectedIds.length} invitation(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition"
            >
              Clear Selection
            </button>
            <button
              disabled={isBulkProcessing}
              onClick={handleBulkReset}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isBulkProcessing ? "Processing..." : "Reset RSVPs"}
            </button>
            <button
              disabled={isBulkProcessing}
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isBulkProcessing ? "Processing..." : "Delete Invitations"}
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
                <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
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
                const isChecked = selectedIds.includes(inv.id);

                const toggleRow = () => {
                  if (isChecked) setSelectedIds(selectedIds.filter(id => id !== inv.id));
                  else setSelectedIds([...selectedIds, inv.id]);
                };
                
                return (
                  <tr key={inv.id} className={`hover:bg-slate-50/50 transition ${isChecked ? "bg-amber-50/30" : ""}`}>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={toggleRow}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
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
  );
}
