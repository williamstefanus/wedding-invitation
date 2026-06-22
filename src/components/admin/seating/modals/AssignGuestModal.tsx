"use client";

import { X, Search, ChevronRight } from "lucide-react";

interface AssignGuestModalProps {
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (isOpen: boolean) => void;
  selectedTable: any;
  currentSearch: string;
  currentOwner: string;
  currentCategory: string;
  updateUrl: (updates: Record<string, string | null>) => void;
  initialEligibleGuests: any[];
  handleAssignGuest: (invitation: any) => void;
}

export function AssignGuestModal({
  isSearchModalOpen,
  setIsSearchModalOpen,
  selectedTable,
  currentSearch,
  currentOwner,
  currentCategory,
  updateUrl,
  initialEligibleGuests,
  handleAssignGuest
}: AssignGuestModalProps) {
  if (!isSearchModalOpen || !selectedTable) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-fade-up">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Assign to {selectedTable.table_name}
          </h2>
          <button onClick={() => { setIsSearchModalOpen(false); updateUrl({ guestSearch: null, guestOwner: null, guestCategory: null }); }} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 bg-white">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search attending guests..." 
              defaultValue={currentSearch}
              onChange={(e) => updateUrl({ guestSearch: e.target.value })}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>
          <select 
            value={currentOwner} 
            onChange={(e) => updateUrl({ guestOwner: e.target.value })}
            className="w-full sm:w-32 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Owners</option>
            <option value="William">William</option>
            <option value="Aziel">Aziel</option>
          </select>
          <select 
            value={currentCategory} 
            onChange={(e) => updateUrl({ guestCategory: e.target.value })}
            className="w-full sm:w-36 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Categories</option>
            <option value="Relatives">Relatives</option>
            <option value="Friends">Friends</option>
            <option value="Church">Church</option>
          </select>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4">
          {initialEligibleGuests.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-slate-700 font-medium">No eligible guests found.</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">Only guests who have RSVP'd as "Attending" and are not yet assigned to a table will appear here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {initialEligibleGuests.map((inv: any) => (
                <div key={inv.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center hover:border-amber-300 hover:shadow-sm transition group">
                  <div>
                    <h4 className="font-bold text-slate-800">{inv.guest.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{inv.guest.owner} • {inv.guest.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                      {inv.rsvp.confirmed_pax} pax
                    </span>
                    <button 
                      onClick={() => handleAssignGuest(inv)}
                      className="p-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 rounded-lg transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
