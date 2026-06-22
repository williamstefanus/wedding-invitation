"use client";

import { X } from "lucide-react";

interface ViewRsvpModalProps {
  isViewOpen: boolean;
  setIsViewOpen: (isOpen: boolean) => void;
  selectedInv: any;
  currentRsvp: any;
  isSelectedPending: boolean;
  eventSessions: any[];
}

export function ViewRsvpModal({
  isViewOpen,
  setIsViewOpen,
  selectedInv,
  currentRsvp,
  isSelectedPending,
  eventSessions
}: ViewRsvpModalProps) {
  if (!isViewOpen || !selectedInv) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">RSVP Details</h2>
          <button onClick={() => setIsViewOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-1">{selectedInv.guest.name}</h3>
          <p className="text-sm text-slate-500 mb-6">{selectedInv.event_type.name} Invitation</p>

          {isSelectedPending ? (
            <div className="text-center text-slate-500 py-8 bg-slate-50 rounded-lg border border-slate-100">
              Guest has not submitted an RSVP yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Status</span>
                <span className={`font-medium ${currentRsvp?.attendance_status === 'attending' ? 'text-green-600' : 'text-red-600'}`}>
                  {currentRsvp?.attendance_status === 'attending' ? 'Attending' : 'Declined'}
                </span>
              </div>
              
              {currentRsvp?.attendance_status === 'attending' && (
                <>
                  <div className="flex justify-between pb-3 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Confirmed Pax</span>
                    <span className="font-medium text-slate-800">{currentRsvp.confirmed_pax} of {selectedInv.max_pax}</span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-slate-100 gap-1">
                    <span className="text-slate-500 text-sm">Selected Sessions</span>
                    {currentRsvp.selected_sessions.length > 0 ? (
                      <ul className="list-disc pl-5 text-sm text-slate-800 font-medium">
                        {currentRsvp.selected_sessions.map((ss: any) => {
                          const sObj = eventSessions.find((es: any) => es.id === ss.event_session_id);
                          return <li key={ss.event_session_id}>{sObj?.name || 'Unknown Session'}</li>;
                        })}
                      </ul>
                    ) : (
                      <span className="text-sm text-slate-400">None selected</span>
                    )}
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1 pt-2">
                <span className="text-slate-500 text-sm">Wishes Message</span>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-slate-800 text-sm italic min-h-[80px]">
                  {currentRsvp?.wish_message ? `"${currentRsvp.wish_message}"` : <span className="text-amber-600/50 not-italic">No message provided.</span>}
                </div>
              </div>
              
              <p className="text-xs text-slate-400 text-right mt-2">
                Submitted: {new Date(currentRsvp?.submitted_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
