"use client";

import { X, Edit2, Trash2, Plus } from "lucide-react";

interface SeatingSidebarProps {
  selectedTableId: string | null;
  selectedTable: any;
  setSelectedTableId: (id: string | null) => void;
  setNewCapacity: (cap: number) => void;
  setIsCapacityModalOpen: (isOpen: boolean) => void;
  setIsSearchModalOpen: (isOpen: boolean) => void;
  handleRemoveGuest: (assignmentId: string) => void;
}

export function SeatingSidebar({
  selectedTableId,
  selectedTable,
  setSelectedTableId,
  setNewCapacity,
  setIsCapacityModalOpen,
  setIsSearchModalOpen,
  handleRemoveGuest
}: SeatingSidebarProps) {
  return (
    <div 
      className={`fixed top-0 md:top-[64px] right-0 h-full md:h-[calc(100vh-64px)] w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out z-50 xl:z-20 flex flex-col
      ${selectedTableId ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {selectedTable && (
        <>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{selectedTable.table_name}</h2>
              <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                Capacity: {selectedTable.capacity} 
                <button onClick={() => { setNewCapacity(selectedTable.capacity); setIsCapacityModalOpen(true); }} className="text-amber-500 hover:text-amber-600"><Edit2 className="w-3 h-3" /></button>
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
          <div className="p-6 border-t border-slate-100 bg-white">
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Plus className="w-5 h-5" /> Add Guest to Table
            </button>
          </div>
        </>
      )}
    </div>
  );
}
