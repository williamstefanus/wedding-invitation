"use client";

import { X } from "lucide-react";

interface EditCapacityModalProps {
  isCapacityModalOpen: boolean;
  setIsCapacityModalOpen: (isOpen: boolean) => void;
  selectedTable: any;
  newCapacity: number;
  setNewCapacity: (cap: number) => void;
  editTableName?: string;
  setEditTableName?: (name: string) => void;
  handleUpdateCapacity: (e: React.FormEvent) => void;
}

export function EditCapacityModal({
  isCapacityModalOpen,
  setIsCapacityModalOpen,
  selectedTable,
  newCapacity,
  setNewCapacity,
  editTableName = "",
  setEditTableName,
  handleUpdateCapacity
}: EditCapacityModalProps) {
  if (!isCapacityModalOpen || !selectedTable) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 mb-1 inline-block">
              Table #{selectedTable.sort_order || 1}
            </span>
            <h2 className="text-xl font-bold text-slate-800">Edit Table Details</h2>
          </div>
          <button onClick={() => setIsCapacityModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleUpdateCapacity} className="p-6 flex flex-col gap-4">
          {setEditTableName && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Table Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g. VIP Family (Optional)"
                value={editTableName}
                onChange={e => setEditTableName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Seating Capacity (Pax)</label>
            <input 
              required
              type="number" 
              min="1"
              value={newCapacity}
              onChange={e => setNewCapacity(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setIsCapacityModalOpen(false)} className="px-5 py-2.5 text-slate-600 text-sm font-bold border border-slate-200 hover:bg-slate-50 rounded-xl transition">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition shadow-sm">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
