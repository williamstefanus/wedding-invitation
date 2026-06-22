"use client";

import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

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
  return (
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
  );
}
