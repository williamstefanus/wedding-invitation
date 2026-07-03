"use client";

import { X } from "lucide-react";
import type { GuestCategory, GuestOwner } from "@/types";

interface GuestFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedGuest: any;
  formData: {
    name: string;
    phone: string;
    owner: GuestOwner;
    category: GuestCategory;
    notes: string;
  };
  setFormData: (data: any) => void;
  eventTypes: any[];
  invitationsForm: any;
  setInvitationsForm: (data: any) => void;
  formError: string;
  handleSave: (e: React.FormEvent) => void;
  config?: any;
}

export function GuestFormModal({
  isModalOpen,
  setIsModalOpen,
  selectedGuest,
  formData,
  setFormData,
  eventTypes,
  invitationsForm,
  setInvitationsForm,
  formError,
  handleSave,
  config = {}
}: GuestFormModalProps) {
  const groomName = config.groomFirstName || "John";
  const brideName = config.brideFirstName || "Jane";

  if (!isModalOpen) return null;

  const isVip = !!formData.notes?.toLowerCase().includes("vip");
  const handleVipToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    let currentNotes = formData.notes || "";
    if (checked) {
      if (!currentNotes.toLowerCase().includes("vip")) {
        currentNotes = currentNotes ? `[VIP] ${currentNotes}` : "[VIP]";
      }
    } else {
      currentNotes = currentNotes.replace(/\[?vip\]?/gi, "").replace(/\s+/g, " ").trim();
    }
    setFormData({ ...formData, notes: currentNotes });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl animate-fade-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">{selectedGuest ? 'Edit Guest & Invitations' : 'Add Guest'}</h2>
          <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-6">
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">1. Guest Details</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number (Optional)</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                <select value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value as GuestOwner})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                  <option value="groom">{groomName}</option>
                  <option value="bride">{brideName}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as GuestCategory})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                  <option value="Relatives">Relatives</option>
                  <option value="Friends">Friends</option>
                  <option value="Church">Church</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
              </div>
            </div>
            <div className="pt-1">
              <label className="inline-flex items-center gap-2.5 cursor-pointer bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80 px-3.5 py-2 rounded-xl transition">
                <input
                  type="checkbox"
                  checked={isVip}
                  onChange={handleVipToggle}
                  className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-900">★ Mark as VIP Guest</span>
              </label>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">2. Invitations</h3>
            {eventTypes.map(et => (
              <div key={et.id} className={`p-4 rounded-xl border ${invitationsForm[et.id]?.is_selected ? 'border-amber-500 bg-amber-50/30' : 'border-slate-200 bg-slate-50'} transition-all flex items-center justify-between`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={invitationsForm[et.id]?.is_selected || false} 
                    onChange={e => setInvitationsForm({...invitationsForm, [et.id]: {...invitationsForm[et.id], is_selected: e.target.checked}})} 
                    className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="font-medium text-slate-800">{et.name}</span>
                </label>
                {invitationsForm[et.id]?.is_selected && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-500">Max Pax:</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={invitationsForm[et.id]?.max_pax || 1} 
                      onChange={e => setInvitationsForm({...invitationsForm, [et.id]: {...invitationsForm[et.id], max_pax: parseInt(e.target.value) || 1}})}
                      className="w-16 px-2 py-1 border border-slate-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <div className="flex justify-end gap-3 mt-2 pt-6 border-t border-slate-100 sticky bottom-0 bg-white">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
