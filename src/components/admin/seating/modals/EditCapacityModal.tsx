"use client";

import { X } from "lucide-react";

interface EditCapacityModalProps {
  isCapacityModalOpen: boolean;
  setIsCapacityModalOpen: (isOpen: boolean) => void;
  selectedTable: any;
  newCapacity: number;
  setNewCapacity: (cap: number) => void;
  handleUpdateCapacity: (e: React.FormEvent) => void;
}

export function EditCapacityModal({
  isCapacityModalOpen,
  setIsCapacityModalOpen,
  selectedTable,
  newCapacity,
  setNewCapacity,
  handleUpdateCapacity
}: EditCapacityModalProps) {
  if (!isCapacityModalOpen || !selectedTable) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Edit Capacity</h2>
          <button onClick={() => setIsCapacityModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleUpdateCapacity} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Max Pax for {selectedTable.table_name}</label>
            <input 
              required
              type="number" 
              min="1"
              value={newCapacity}
              onChange={e => setNewCapacity(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsCapacityModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
