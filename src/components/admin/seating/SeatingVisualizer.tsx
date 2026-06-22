"use client";

import { LayoutDashboard, Users, AlertTriangle } from "lucide-react";

interface SeatingVisualizerProps {
  initialTables: any[];
  currentEvent: string;
  selectedTableId: string | null;
  setSelectedTableId: (id: string | null) => void;
  updateUrl: (updates: Record<string, string | null>) => void;
  handleInitialize: () => void;
  totalTables: number;
  occupiedSeats: number;
  totalCapacity: number;
  remainingSeats: number;
  totalAssignedGuests: number;
}

export function SeatingVisualizer({
  initialTables,
  currentEvent,
  selectedTableId,
  setSelectedTableId,
  updateUrl,
  handleInitialize,
  totalTables,
  occupiedSeats,
  totalCapacity,
  remainingSeats,
  totalAssignedGuests
}: SeatingVisualizerProps) {
  return (
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
                  <div className={`w-16 h-16 mx-auto rounded-full border-4 flex items-center justify-center mb-4 transition-colors
                    ${isOverCapacity ? 'border-red-100 bg-red-50 text-red-600' : 
                      isFull ? 'border-green-100 bg-green-50 text-green-600' : 
                      isSelected ? 'border-amber-100 bg-amber-50 text-amber-600' : 'border-slate-100 bg-slate-50 text-slate-600'}`}
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
  );
}
