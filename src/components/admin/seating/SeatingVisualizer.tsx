"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Users, AlertTriangle, Plus, LayoutGrid, Map } from "lucide-react";
import { FloorPlanView } from "@/components/admin/seating/FloorPlanView";

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
  allPax?: number;
  handleAddTable?: () => void;
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
  totalAssignedGuests,
  allPax = 0,
  handleAddTable
}: SeatingVisualizerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Persist view preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem("seating_view_mode") as "grid" | "map";
      if (stored === "grid" || stored === "map") setViewMode(stored);
    } catch {}
  }, []);

  const handleViewChange = (mode: "grid" | "map") => {
    setViewMode(mode);
    try { localStorage.setItem("seating_view_mode", mode); } catch {}
  };

  // Map view is only available for the wedding event
  const canShowMap = currentEvent === "wedding";

  // Auto-switch to grid if switching to sangjit while in map mode
  useEffect(() => {
    if (!canShowMap && viewMode === "map") setViewMode("grid");
  }, [canShowMap, viewMode]);

  return (
    <div className={`flex-1 overflow-y-auto transition-all duration-300 ${selectedTableId ? "mr-0 xl:mr-96" : "mr-0"}`}>
      <div className="p-4 md:p-8">

        {/* ─── Header ─── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Seating Assignment</h1>
            <p className="text-slate-500 mt-1">Design and manage table layouts.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Event switcher */}
            <div className="flex bg-slate-200/50 p-1 rounded-xl">
              <button
                onClick={() => { setSelectedTableId(null); updateUrl({ event: "wedding" }); }}
                className={`px-6 py-2 rounded-lg font-medium text-sm transition ${currentEvent === "wedding" ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
              >
                Wedding
              </button>
              <button
                onClick={() => { setSelectedTableId(null); updateUrl({ event: "sangjit" }); }}
                className={`px-6 py-2 rounded-lg font-medium text-sm transition ${currentEvent === "sangjit" ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
              >
                Sangjit
              </button>
            </div>

            {/* View toggle (wedding only) */}
            {canShowMap && initialTables.length > 0 && (
              <div className="flex bg-slate-200/50 p-1 rounded-xl">
                <button
                  onClick={() => handleViewChange("grid")}
                  title="Grid View"
                  className={`px-3 py-2 rounded-lg text-sm transition flex items-center gap-1.5 font-medium ${viewMode === "grid" ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <LayoutGrid className="w-4 h-4" /> Grid
                </button>
                <button
                  onClick={() => handleViewChange("map")}
                  title="Floor Plan View"
                  className={`px-3 py-2 rounded-lg text-sm transition flex items-center gap-1.5 font-medium ${viewMode === "map" ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Map className="w-4 h-4" /> Floor Plan
                </button>
              </div>
            )}

            {/* Add Table (grid mode only) */}
            {handleAddTable && viewMode === "grid" && (
              <button
                onClick={handleAddTable}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition active:scale-95"
              >
                <Plus className="w-4 h-4" /> Add Table
              </button>
            )}
          </div>
        </div>

        {/* ─── Metrics ─── */}
        {initialTables.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Users className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase">Assigned Pax</p>
                <p className="text-2xl font-bold text-slate-800">{occupiedSeats} <span className="text-sm font-medium text-slate-400">/ {allPax}</span></p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Users className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase">Remaining Seats</p>
                <p className="text-2xl font-bold text-slate-800">{remainingSeats}</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Content: Empty state / Map / Grid ─── */}
        {initialTables.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-64">
            <LayoutDashboard className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No Tables Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">
              There are currently no tables initialized for the {currentEvent} event.
            </p>
            <button
              onClick={handleInitialize}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition"
            >
              Initialize Default Tables
            </button>
          </div>
        ) : viewMode === "map" && canShowMap ? (
          /* ─── Floor Plan View ─── */
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-4">
              <Map className="w-3.5 h-3.5" />
              <span>Royal Dynasty Lt.3 — Click a table to select it, then use the sidebar to assign guests.</span>
            </div>
            <FloorPlanView
              tables={initialTables}
              selectedTableId={selectedTableId}
              setSelectedTableId={setSelectedTableId}
            />
          </div>
        ) : (
          /* ─── Grid View ─── */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {initialTables.map((table: any, idx: number) => {
              const currentOccupancy = table.assignments.reduce((sum: number, a: any) => sum + a.assigned_pax, 0);
              const isOverCapacity = currentOccupancy > table.capacity;
              const isFull = currentOccupancy === table.capacity;
              const isSelected = selectedTableId === table.id;
              const tableNumber = table.sort_order || idx + 1;
              const isDefaultName = new RegExp(`^Table\\s*${tableNumber}$`, "i").test(table.table_name || "");

              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  className={`
                    relative group cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-200 border-2 flex flex-col justify-between
                    ${isSelected ? "border-amber-500 shadow-md ring-4 ring-amber-500/10" : "border-transparent bg-white shadow-sm hover:shadow-md hover:border-slate-200"}
                  `}
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 mb-1 inline-block">
                        Table #{tableNumber}
                      </span>
                      {!isDefaultName && table.table_name && (
                        <span className={`font-bold text-sm block leading-snug mt-0.5 ${isSelected ? "text-amber-600" : "text-slate-800"}`}>
                          {table.table_name}
                        </span>
                      )}
                    </div>
                    {isOverCapacity && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                  </div>

                  <div className={`w-16 h-16 mx-auto rounded-full border-4 flex items-center justify-center mb-4 transition-colors
                    ${isOverCapacity ? "border-red-100 bg-red-50 text-red-600" :
                      isFull ? "border-green-100 bg-green-50 text-green-600" :
                      isSelected ? "border-amber-100 bg-amber-50 text-amber-600" : "border-slate-100 bg-slate-50 text-slate-600"}`}
                  >
                    <span className="font-bold">{currentOccupancy}</span>
                  </div>

                  <div className="text-center">
                    <div className="text-xs font-medium text-slate-500">Capacity: {table.capacity} pax</div>
                  </div>

                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isOverCapacity ? "bg-red-500" : isFull ? "bg-green-500" : "bg-amber-400"}`}
                      style={{ width: `${Math.min(100, (currentOccupancy / table.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {handleAddTable && (
              <div
                onClick={handleAddTable}
                className="border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition min-h-[140px] group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 group-hover:bg-amber-100 flex items-center justify-center text-slate-500 group-hover:text-amber-600 transition mb-2">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-600 group-hover:text-amber-700">Add Table</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
