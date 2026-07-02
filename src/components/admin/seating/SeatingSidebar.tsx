"use client";

import { X, Edit2, Trash2, Plus, MapPin } from "lucide-react";
import { unassignTableMapPosition } from "@/lib/actions/seating";

interface SeatingSidebarProps {
  selectedTableId: string | null;
  selectedTable: any;
  setSelectedTableId: (id: string | null) => void;
  setNewCapacity: (cap: number) => void;
  setEditTableName?: (name: string) => void;
  setIsCapacityModalOpen: (isOpen: boolean) => void;
  setIsSearchModalOpen: (isOpen: boolean) => void;
  handleRemoveGuest: (assignmentId: string) => void;
  handleDeleteTable?: (tableId: string) => void;
}

export function SeatingSidebar({
  selectedTableId,
  selectedTable,
  setSelectedTableId,
  setNewCapacity,
  setEditTableName,
  setIsCapacityModalOpen,
  setIsSearchModalOpen,
  handleRemoveGuest,
  handleDeleteTable
}: SeatingSidebarProps) {
  return (
    <div 
      className={`fixed top-0 md:top-[64px] right-0 h-full md:h-[calc(100vh-64px)] w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out z-50 xl:z-20 flex flex-col
      ${selectedTableId ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {selectedTable && (
        <>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 mb-1.5 inline-block">
                Table #{selectedTable.sort_order || 1}
              </span>
              <h2 className="text-2xl font-bold text-slate-800">{selectedTable.table_name}</h2>
              <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                Capacity: {selectedTable.capacity} 
                <button onClick={() => { setNewCapacity(selectedTable.capacity); if (setEditTableName) setEditTableName(selectedTable.table_name); setIsCapacityModalOpen(true); }} className="text-amber-500 hover:text-amber-600"><Edit2 className="w-3.5 h-3.5" /></button>
              </p>
            </div>
            <button onClick={() => setSelectedTableId(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700">Assigned Guests</h3>
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                {selectedTable.assignments.reduce((sum: number, a: any) => sum + a.assigned_pax, 0)} / {selectedTable.capacity}
              </span>
            </div>

            {selectedTable.assignments.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-500">No guests assigned to this table yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedTable.assignments.map((assignment: any) => (
                  <div key={assignment.id} className="bg-white border border-slate-100 shadow-sm p-4 rounded-xl group hover:border-amber-200 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">{assignment.invitation.guest.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{assignment.invitation.guest.owner} • {assignment.invitation.guest.category}</p>
                      </div>
                      <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded">
                        {assignment.assigned_pax} pax
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-50 flex justify-end">
                      <button 
                        onClick={() => handleRemoveGuest(assignment.id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-slate-100 bg-white space-y-3">
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Plus className="w-5 h-5" /> Add Guest to Table
            </button>
            {selectedTable.sort_order >= 1 && selectedTable.sort_order <= 26 && (
              <button 
                onClick={async () => {
                  if (!confirm(`Remove ${selectedTable.table_name} from the floor plan map? (Guests will remain assigned to the table)`)) return;
                  await unassignTableMapPosition(selectedTable.id);
                  setSelectedTableId(null);
                }}
                className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition text-sm"
              >
                <MapPin className="w-4 h-4" /> Remove from Floor Map
              </button>
            )}
            {handleDeleteTable && (
              <button 
                onClick={() => handleDeleteTable(selectedTable.id)}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition text-sm"
              >
                <Trash2 className="w-4 h-4" /> Delete Table
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
