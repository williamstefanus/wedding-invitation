"use client";

import { useState, useTransition, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Plus, X, Search, Settings, AlertTriangle, Users, LayoutDashboard, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { 
  initializeTables, 
  assignGuestToTable, 
  removeGuestFromTable, 
  updateTableCapacity 
} from "@/lib/actions/seating";

export function SeatingClient({
  initialTables,
  initialEligibleGuests,
  currentEvent,
  currentSearch,
  currentOwner,
  currentCategory
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Selected Table State
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const selectedTable = useMemo(() => initialTables.find((t: any) => t.id === selectedTableId), [initialTables, selectedTableId]);

  // Modals
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);
  
  // Capacity Form
  const [newCapacity, setNewCapacity] = useState(10);

  // Metrics calculation
  const totalTables = initialTables.length;
  let occupiedSeats = 0;
  let totalCapacity = 0;
  let totalAssignedGuests = 0;
  
  initialTables.forEach((table: any) => {
    totalCapacity += table.capacity;
    table.assignments.forEach((a: any) => {
      occupiedSeats += a.assigned_pax;
      totalAssignedGuests += 1;
    });
  });

  const remainingSeats = totalCapacity - occupiedSeats;

  // URL Updates
  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router]);

  // Actions
  const handleInitialize = async () => {
    await initializeTables();
  };

  const handleUpdateCapacity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTable) {
      await updateTableCapacity(selectedTable.id, newCapacity);
      setIsCapacityModalOpen(false);
    }
  };

  const handleRemoveGuest = async (assignmentId: string) => {
    if (confirm("Are you sure you want to remove this guest from the table?")) {
      await removeGuestFromTable(assignmentId);
    }
  };

  const handleAssignGuest = async (invitation: any) => {
    if (!selectedTable) return;

    // Occupancy check
    const currentOccupancy = selectedTable.assignments.reduce((sum: number, a: any) => sum + a.assigned_pax, 0);
    const paxToAdd = invitation.rsvp.confirmed_pax;

    if (currentOccupancy + paxToAdd > selectedTable.capacity) {
      if (!confirm(`Warning: Adding this guest (${paxToAdd} pax) will exceed the table's capacity of ${selectedTable.capacity}. Proceed anyway?`)) {
        return;
      }
    }

    await assignGuestToTable({
      invitation_id: invitation.id,
      seating_table_id: selectedTable.id,
      assigned_pax: paxToAdd
    });

    setIsSearchModalOpen(false);
    updateUrl({ guestSearch: null, guestOwner: null, guestCategory: null });
  };

  return (
    <div className="w-full h-full md:h-[calc(100vh-64px)] flex overflow-hidden font-sans relative bg-slate-100">
      
      {/* Main Floor Plan Area */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${selectedTableId ? 'mr-0 xl:mr-96' : 'mr-0'}`}>
        <div className="p-4 md:p-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Seating Assignment</h1>
              <p className="text-slate-500 mt-1">Design and manage table layouts.</p>
            </div>
            
            <div className="flex bg-slate-200/50 p-1 rounded-xl">
              <button 
                onClick={() => { setSelectedTableId(null); updateUrl({ event: "wedding" }); }}
                className={`px-6 py-2 rounded-lg font-medium text-sm transition ${currentEvent === "wedding" ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Wedding
              </button>
              <button 
                onClick={() => { setSelectedTableId(null); updateUrl({ event: "sangjit" }); }}
                className={`px-6 py-2 rounded-lg font-medium text-sm transition ${currentEvent === "sangjit" ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sangjit
              </button>
            </div>
          </div>

          {/* Metrics */}
          {initialTables.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><LayoutDashboard className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Total Tables</p>
                  <p className="text-2xl font-bold text-slate-800">{totalTables}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Occupied Seats</p>
                  <p className="text-2xl font-bold text-slate-800">{occupiedSeats} <span className="text-sm font-medium text-slate-400">/ {totalCapacity}</span></p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Remaining Seats</p>
                  <p className="text-2xl font-bold text-slate-800">{remainingSeats}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Assigned Groups</p>
                  <p className="text-2xl font-bold text-slate-800">{totalAssignedGuests}</p>
                </div>
              </div>
            </div>
          )}

          {/* Table Grid */}
          {initialTables.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-64">
              <LayoutDashboard className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">No Tables Found</h3>
              <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">There are currently no tables initialized for the {currentEvent} event.</p>
              <button onClick={handleInitialize} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition">
                Initialize Default Tables
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {initialTables.map((table: any) => {
                const currentOccupancy = table.assignments.reduce((sum: number, a: any) => sum + a.assigned_pax, 0);
                const isOverCapacity = currentOccupancy > table.capacity;
                const isFull = currentOccupancy === table.capacity;
                const isSelected = selectedTableId === table.id;

                return (
                  <div 
                    key={table.id}
                    onClick={() => setSelectedTableId(table.id)}
                    className={`
                      relative group cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-200 border-2
                      ${isSelected ? 'border-amber-500 shadow-md ring-4 ring-amber-500/10' : 'border-transparent bg-white shadow-sm hover:shadow-md hover:border-slate-200'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`font-bold text-sm ${isSelected ? 'text-amber-600' : 'text-slate-700'}`}>{table.table_name}</span>
                      {isOverCapacity && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                    
                    {/* Visual Circle Representation */}
                    <div className="w-16 h-16 mx-auto rounded-full border-4 flex items-center justify-center mb-4 transition-colors
                      ${isOverCapacity ? 'border-red-100 bg-red-50 text-red-600' : 
                        isFull ? 'border-green-100 bg-green-50 text-green-600' : 
                        isSelected ? 'border-amber-100 bg-amber-50 text-amber-600' : 'border-slate-100 bg-slate-50 text-slate-600'}"
                    >
                      <span className="font-bold">{currentOccupancy}</span>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs font-medium text-slate-500">
                        Capacity: {table.capacity} pax
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isOverCapacity ? 'bg-red-500' : isFull ? 'bg-green-500' : 'bg-amber-400'}`} 
                        style={{ width: `${Math.min(100, (currentOccupancy / table.capacity) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Table Detail Sidebar */}
      <div 
        className={`fixed top-0 md:top-[64px] right-0 h-full md:h-[calc(100vh-64px)] w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out z-50 xl:z-20 flex flex-col
        ${selectedTableId ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedTable && (
          <>
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{selectedTable.table_name}</h2>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                  Capacity: {selectedTable.capacity} 
                  <button onClick={() => { setNewCapacity(selectedTable.capacity); setIsCapacityModalOpen(true); }} className="text-amber-500 hover:text-amber-600"><Edit2 className="w-3 h-3" /></button>
                </p>
              </div>
              <button onClick={() => setSelectedTableId(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-6">
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700">Assigned Guests</h3>
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                  {selectedTable.assignments.reduce((sum: number, a: any) => sum + a.assigned_pax, 0)} / {selectedTable.capacity}
                </span>
              </div>

              {selectedTable.assignments.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-500">No guests assigned to this table yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {selectedTable.assignments.map((assignment: any) => (
                    <div key={assignment.id} className="bg-white border border-slate-100 shadow-sm p-4 rounded-xl group hover:border-amber-200 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{assignment.invitation.guest.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{assignment.invitation.guest.owner} • {assignment.invitation.guest.category}</p>
                        </div>
                        <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded">
                          {assignment.assigned_pax} pax
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-50 flex justify-end">
                        <button 
                          onClick={() => handleRemoveGuest(assignment.id)}
                          className="text-xs font-medium text-red-500 hover:text-red-700 transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-slate-100 bg-white">
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Plus className="w-5 h-5" /> Add Guest to Table
              </button>
            </div>
          </>
        )}
      </div>

      {/* Capacity Modal */}
      {isCapacityModalOpen && selectedTable && (
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
      )}

      {/* Guest Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-fade-up">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Assign to {selectedTable?.table_name}
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
      )}

    </div>
  );
}
