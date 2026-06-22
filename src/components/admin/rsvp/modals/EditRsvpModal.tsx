"use client";

import { X } from "lucide-react";

interface EditRsvpModalProps {
  isEditOpen: boolean;
  setIsEditOpen: (isOpen: boolean) => void;
  selectedInv: any;
  editStatus: string;
  setEditStatus: (status: string) => void;
  editPax: number;
  setEditPax: (pax: number) => void;
  editSelectedSessions: string[];
  setEditSelectedSessions: (sessions: string[]) => void;
  eventSessions: any[];
  handleEditSubmit: (e: React.FormEvent) => void;
}

export function EditRsvpModal({
  isEditOpen,
  setIsEditOpen,
  selectedInv,
  editStatus,
  setEditStatus,
  editPax,
  setEditPax,
  editSelectedSessions,
  setEditSelectedSessions,
  eventSessions,
  handleEditSubmit
}: EditRsvpModalProps) {
  if (!isEditOpen || !selectedInv) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Edit RSVP for {selectedInv.guest.name}</h2>
          <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select 
              value={editStatus}
              onChange={(e) => {
                setEditStatus(e.target.value);
                if (e.target.value === 'not_attending') {
                  setEditPax(0);
                  setEditSelectedSessions([]);
                } else if (e.target.value === 'attending' && editPax === 0) {
                  setEditPax(1);
                }
              }}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="pending">Pending</option>
              <option value="attending">Attending</option>
              <option value="not_attending">Declined</option>
            </select>
          </div>

          {editStatus === 'attending' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirmed Pax (Max: {selectedInv.max_pax})</label>
                <input 
                  type="number" 
                  min="1"
                  max={selectedInv.max_pax}
                  value={editPax}
                  onChange={(e) => setEditPax(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Selected Sessions</label>
                <div className="flex flex-col gap-2">
                  {eventSessions
                    .filter((s: any) => s.event_type_id === selectedInv.event_type_id)
                    .map((session: any) => (
                    <label key={session.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={editSelectedSessions.includes(session.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditSelectedSessions([...editSelectedSessions, session.id]);
                          } else {
                            setEditSelectedSessions(editSelectedSessions.filter(id => id !== session.id));
                          }
                        }}
                        className="w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-amber-500"
                      />
                      {session.name}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Warning if changing to not attending when seating exists */}
          {editStatus === 'not_attending' && selectedInv.seating_assignment && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-700">
              <strong>Warning:</strong> Saving this will remove the guest's seating assignment.
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
