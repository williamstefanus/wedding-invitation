"use client";

import { useState } from "react";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: any;
  onDelete: (tableId: string) => Promise<{ success: boolean; error?: string }>;
}

export function DeleteTableModal({ isOpen, onClose, table, onDelete }: DeleteTableModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !table) return null;

  const handleDelete = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await onDelete(table.id);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to delete table.");
      } else {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60] animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <Trash2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Delete Table</h2>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600 mb-4">
            Are you sure you want to delete <b className="text-slate-900">{table.table_name}</b>?
          </p>

          {table.assignments && table.assignments.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start gap-2.5 mb-4 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>This table currently has assigned guests. You must remove or reassign them before deleting.</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs mb-4 font-semibold">
              ✕ {errorMsg}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              className="px-5 py-2.5 text-slate-600 text-sm font-bold border border-slate-200 hover:bg-slate-50 rounded-xl transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleDelete}
              disabled={loading || (table.assignments && table.assignments.length > 0)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
