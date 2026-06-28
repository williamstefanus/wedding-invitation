"use client";

import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tableName?: string, capacity?: number) => Promise<void>;
}

export function AddTableModal({ isOpen, onClose, onAdd }: AddTableModalProps) {
  const [tableName, setTableName] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd(tableName.trim() || undefined, capacity);
      setTableName("");
      setCapacity(10);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60] animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Add New Table</h2>
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

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Table Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g. VIP Family (leave blank for auto number)" 
              value={tableName}
              onChange={e => setTableName(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Seating Capacity
            </label>
            <input 
              required
              type="number" 
              min="1"
              max="50"
              value={capacity}
              onChange={e => setCapacity(parseInt(e.target.value) || 1)}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition disabled:bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-2 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              className="px-5 py-2.5 text-slate-600 text-sm font-bold border border-slate-200 hover:bg-slate-50 rounded-xl transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
