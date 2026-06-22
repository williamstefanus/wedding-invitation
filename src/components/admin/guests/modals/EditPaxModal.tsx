"use client";

import { X } from "lucide-react";

interface EditPaxModalProps {
  isEditPaxOpen: boolean;
  setIsEditPaxOpen: (isOpen: boolean) => void;
  editMaxPax: number;
  setEditMaxPax: (pax: number) => void;
  handleEditPaxSubmit: (e: React.FormEvent) => void;
}

export function EditPaxModal({
  isEditPaxOpen,
  setIsEditPaxOpen,
  editMaxPax,
  setEditMaxPax,
  handleEditPaxSubmit
}: EditPaxModalProps) {
  if (!isEditPaxOpen) return null;

  return (
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
  );
}
