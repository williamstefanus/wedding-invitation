"use client";

import { Trash2 } from "lucide-react";

interface DeleteInvitationModalProps {
  isDeleteInvOpen: boolean;
  setIsDeleteInvOpen: (isOpen: boolean) => void;
  selectedGuest: any;
  selectedInv: any;
  handleDeleteInv: () => void;
  hasInvRsvpData: (inv: any) => boolean;
}

export function DeleteInvitationModal({
  isDeleteInvOpen,
  setIsDeleteInvOpen,
  selectedGuest,
  selectedInv,
  handleDeleteInv,
  hasInvRsvpData
}: DeleteInvitationModalProps) {
  if (!isDeleteInvOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up p-6 text-center" style={{ backgroundColor: "var(--color-panel-solid)" }}>
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Invitation?</h2>
        {selectedGuest?.invitations?.length === 1 ? (
           <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-6 text-left">
             <strong>Crucial Warning:</strong> This is {selectedGuest.name}'s LAST remaining invitation. A guest cannot exist without an invitation. Proceeding will also <strong>delete the master Guest record</strong>.
           </div>
        ) : (
           <>
             <p className="text-slate-500 mb-4 text-sm">Are you sure you want to delete the {selectedInv?.event_type.name} invitation for {selectedGuest?.name}?</p>
             {hasInvRsvpData(selectedInv) && (
               <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-6 text-left">
                 <strong>Warning:</strong> Active RSVP or Seating data found for this event. It will be lost!
               </div>
             )}
           </>
        )}
        <div className="flex justify-center gap-3 mt-4">
          <button onClick={() => setIsDeleteInvOpen(false)} className="px-4 py-2 flex-1 text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition">Cancel</button>
          <button onClick={handleDeleteInv} className="px-4 py-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}
