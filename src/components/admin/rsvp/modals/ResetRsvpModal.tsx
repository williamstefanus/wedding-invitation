"use client";

import { Trash2 } from "lucide-react";

interface ResetRsvpModalProps {
  isResetOpen: boolean;
  setIsResetOpen: (isOpen: boolean) => void;
  selectedInv: any;
  handleReset: () => void;
}

export function ResetRsvpModal({
  isResetOpen,
  setIsResetOpen,
  selectedInv,
  handleReset
}: ResetRsvpModalProps) {
  if (!isResetOpen || !selectedInv) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Reset RSVP?</h2>
        <p className="text-slate-500 mb-4 text-sm">This will completely wipe the RSVP record for {selectedInv.guest.name}, returning the invitation to <strong>Pending</strong>.</p>
        
        {selectedInv?.seating_assignment && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-6 text-left">
            <strong>Warning:</strong> This will also wipe their seating assignment.
          </div>
        )}

        <div className="flex justify-center gap-3 mt-6">
          <button onClick={() => setIsResetOpen(false)} className="px-4 py-2 flex-1 text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition">Cancel</button>
          <button onClick={handleReset} className="px-4 py-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition">Yes, Reset</button>
        </div>
      </div>
    </div>
  );
}
