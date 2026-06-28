"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { getUsherRoster, checkInGuest, updateGuestVipStatus } from "@/lib/actions/usher";
import { getSeatingData } from "@/lib/actions/seating";
import { PinLoginModal } from "@/components/usher/PinLoginModal";
import { UsherGuestCard } from "@/components/usher/UsherGuestCard";
import { FloorPlanView } from "@/components/admin/seating/FloorPlanView";
import { Search, LogOut, RefreshCw, Users, UserCheck, Map, List, X, FileText, MapPin, Check } from "lucide-react";

interface UsherClientProps {
  initialWeddingRoster: any[];
  initialSangjitRoster: any[];
  initialWeddingTables?: any[];
  initialSangjitTables?: any[];
}

export function UsherClient({ 
  initialWeddingRoster, 
  initialSangjitRoster,
  initialWeddingTables = [],
  initialSangjitTables = []
}: UsherClientProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  const [currentEvent, setCurrentEvent] = useState<"wedding" | "sangjit">("wedding");
  const [roster, setRoster] = useState<any[]>(initialWeddingRoster);
  const [weddingTables, setWeddingTables] = useState<any[]>(initialWeddingTables);
  const [sangjitTables, setSangjitTables] = useState<any[]>(initialSangjitTables);

  const [viewMode, setViewMode] = useState<"guests" | "map" | "list">("guests");
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [detailsModalInv, setDetailsModalInv] = useState<any | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "vip" | "checked_in" | "pending">("all");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const auth = localStorage.getItem("wo_authorized") === "true";
    setIsAuthorized(auth);
    setAuthChecked(true);
  }, []);

  const handleEventChange = (event: "wedding" | "sangjit") => {
    setCurrentEvent(event);
    setRoster(event === "wedding" ? initialWeddingRoster : initialSangjitRoster);
    setSearchQuery("");
    setSelectedTableId(null);
  };

  const handleRefresh = () => {
    startTransition(async () => {
      const [rosterRes, tablesRes] = await Promise.all([
        getUsherRoster(currentEvent),
        getSeatingData(currentEvent)
      ]);
      if (rosterRes.success) {
        setRoster(rosterRes.data);
      }
      if (tablesRes.success) {
        if (currentEvent === "wedding") setWeddingTables(tablesRes.data);
        else setSangjitTables(tablesRes.data);
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("wo_authorized");
    setIsAuthorized(false);
  };

  const handleToggleCheckIn = async (invId: string, actualPax: number, isCheckingIn: boolean) => {
    setRoster(prev => prev.map(inv => {
      if (inv.id === invId) {
        return {
          ...inv,
          checked_in_at: isCheckingIn ? new Date().toISOString() : null,
          checked_in_pax: isCheckingIn ? actualPax : null
        };
      }
      return inv;
    }));

    await checkInGuest(invId, actualPax, isCheckingIn);
  };

  const currentTables = currentEvent === "wedding" ? weddingTables : sangjitTables;

  const filteredRoster = useMemo(() => {
    return roster.filter(inv => {
      const guest = inv.guest || {};
      const nameMatch = guest.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const codeMatch = inv.invitation_code?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = !searchQuery || nameMatch || codeMatch;
      if (!matchesSearch) return false;

      const isCheckedIn = !!inv.checked_in_at;
      const isVip = !!guest.notes?.toLowerCase().includes("vip");

      if (filterType === "vip") return isVip;
      if (filterType === "checked_in") return isCheckedIn;
      if (filterType === "pending") return !isCheckedIn;
      return true;
    });
  }, [roster, searchQuery, filterType]);

  const totalExpectedPax = useMemo(() => {
    return roster.reduce((sum, inv) => {
      const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
      if (rsvp?.attendance_status === "attending") return sum + (rsvp.confirmed_pax || 0);
      return sum;
    }, 0);
  }, [roster]);

  const totalCheckedInPax = useMemo(() => {
    return roster.reduce((sum, inv) => {
      if (inv.checked_in_at) return sum + (inv.checked_in_pax || 0);
      return sum;
    }, 0);
  }, [roster]);

  const checkedInCount = useMemo(() => {
    return roster.filter(inv => !!inv.checked_in_at).length;
  }, [roster]);

  const selectedTable = useMemo(() => {
    return currentTables.find(t => t.id === selectedTableId) || null;
  }, [currentTables, selectedTableId]);

  const handleToggleVip = async (inv: any, currentNotes: string | null) => {
    const isCurrentlyVip = !!currentNotes?.toLowerCase().includes("vip");
    let newNotes = currentNotes || "";
    if (!isCurrentlyVip) {
      newNotes = newNotes ? `[VIP] ${newNotes}` : "[VIP]";
    } else {
      newNotes = newNotes.replace(/\[?vip\]?/gi, "").replace(/\s+/g, " ").trim();
    }

    // Optimistic update
    setRoster(prev => prev.map(item => {
      if (item.id === inv.id) {
        return {
          ...item,
          guest: { ...item.guest, notes: newNotes }
        };
      }
      return item;
    }));
    if (detailsModalInv && detailsModalInv.id === inv.id) {
      setDetailsModalInv({
        ...detailsModalInv,
        guest: { ...detailsModalInv.guest, notes: newNotes }
      });
    }

    await updateGuestVipStatus(inv.guest.id, newNotes);
  };

  if (!authChecked) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-medium">Loading portal...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 pb-20">
      {!isAuthorized ? (
        <PinLoginModal isOpen={!isAuthorized} onSuccess={() => setIsAuthorized(true)} />
      ) : (
        <>
          {/* Header Bar */}
          <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-slate-950 text-lg">
                  W
                </div>
                <div>
                  <h1 className="font-bold text-sm tracking-tight leading-none">Reception Portal</h1>
                  <p className="text-[10px] text-amber-400 font-medium mt-0.5">Live Check-In &amp; Seating</p>
                </div>
              </div>

              {/* Event Switcher */}
              <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 w-full max-w-xs md:max-w-md">
                <button
                  type="button"
                  onClick={() => handleEventChange("wedding")}
                  className={`flex-1 px-4 py-1.5 rounded-lg font-bold text-xs transition ${
                    currentEvent === "wedding" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Wedding
                </button>
                <button
                  type="button"
                  onClick={() => handleEventChange("sangjit")}
                  className={`flex-1 px-4 py-1.5 rounded-lg font-bold text-xs transition ${
                    currentEvent === "sangjit" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Sangjit
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleRefresh} 
                  disabled={isPending}
                  className="p-2 md:px-3 md:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                  title="Refresh Roster"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} /> <span className="hidden md:inline">Refresh</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 md:px-3 md:py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/80 border border-rose-800/50 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
                  title="Lock Portal"
                >
                  <LogOut className="w-3.5 h-3.5" /> <span className="hidden md:inline">Lock</span>
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            
            {/* Live Arrival Counter Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">{totalCheckedInPax}</span>
                    <span className="text-sm font-bold text-slate-400">/ {totalExpectedPax} Expected Pax Arrived</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {checkedInCount} invitations currently checked in at reception
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full md:w-64">
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span>Arrival Rate</span>
                  <span>{totalExpectedPax ? Math.round((totalCheckedInPax / totalExpectedPax) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(100, totalExpectedPax ? (totalCheckedInPax / totalExpectedPax) * 100 : 0)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* View Mode & Search Controls Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-6 flex flex-col lg:flex-row items-center gap-4 justify-between">
              {/* View Mode Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => setViewMode("guests")}
                  className={`flex-1 lg:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                    viewMode === "guests" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-amber-600" /> Guest List
                </button>
                {currentEvent === "wedding" && (
                  <button
                    type="button"
                    onClick={() => setViewMode("map")}
                    className={`flex-1 lg:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                      viewMode === "map" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Map className="w-3.5 h-3.5 text-blue-600" /> Table Map
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`flex-1 lg:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                    viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <List className="w-3.5 h-3.5 text-purple-600" /> Table List
                </button>
              </div>

              {viewMode === "guests" && (
                <>
                  <div className="relative w-full lg:max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search guest name or code..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-medium"
                    />
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 no-scrollbar">
                    {[
                      { id: "all", label: "All Guests", count: roster.length },
                      { id: "vip", label: "★ VIP Only", count: roster.filter(i => !!i.guest?.notes?.toLowerCase().includes("vip")).length },
                      { id: "pending", label: "Waiting Check-in", count: roster.filter(i => !i.checked_in_at).length },
                      { id: "checked_in", label: "Checked In", count: roster.filter(i => !!i.checked_in_at).length },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFilterType(tab.id as any)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 border ${
                          filterType === tab.id
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filterType === tab.id ? "bg-slate-800 text-amber-400" : "bg-slate-200 text-slate-600"}`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* View Mode 1: Guest List */}
            {viewMode === "guests" && (
              filteredRoster.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center my-8 max-w-md mx-auto">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-700">No matching guests found</h3>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filter selection.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRoster.map(inv => (
                    <UsherGuestCard
                      key={inv.id}
                      invitation={inv}
                      onToggleCheckIn={handleToggleCheckIn}
                      onOpenDetails={setDetailsModalInv}
                    />
                  ))}
                </div>
              )
            )}

            {/* View Mode 2: Table Map (Read-Only) */}
            {viewMode === "map" && currentEvent === "wedding" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 animate-fadeIn">
                <FloorPlanView
                  tables={currentTables}
                  selectedTableId={selectedTableId}
                  setSelectedTableId={setSelectedTableId}
                  readOnly={true}
                />
              </div>
            )}

            {/* View Mode 3: Table List (Read-Only Grid) */}
            {viewMode === "list" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
                {currentTables.length === 0 ? (
                  <div className="col-span-full bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                    No tables initialized for {currentEvent}.
                  </div>
                ) : (
                  currentTables.map(table => {
                    const occ = (table.assignments || []).reduce((sum: number, a: any) => sum + (a.assigned_pax || 0), 0);
                    return (
                      <div
                        key={table.id}
                        onClick={() => setSelectedTableId(table.id)}
                        className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-400 shadow-sm cursor-pointer transition flex flex-col justify-between gap-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-slate-800">{table.table_name}</h3>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-xs">
                            {occ} / {table.capacity} Pax
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                          <p className="font-semibold text-slate-700 mb-1.5">Assigned Guests ({table.assignments?.length || 0}):</p>
                          {table.assignments?.length ? (
                            <ul className="space-y-1">
                              {table.assignments.slice(0, 4).map((a: any) => (
                                <li key={a.id} className="flex justify-between text-slate-600">
                                  <span className="truncate pr-2">• {a.invitation?.guest?.name || "Guest"}</span>
                                  <span className="font-bold text-slate-400">{a.assigned_pax}p</span>
                                </li>
                              ))}
                              {table.assignments.length > 4 && (
                                <li className="text-[11px] text-amber-600 font-bold">+ {table.assignments.length - 4} more</li>
                              )}
                            </ul>
                          ) : (
                            <p className="italic text-slate-400">Empty table</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Read-Only Table Details Modal (when a table is clicked in Map or List) */}
            {selectedTable && (
              <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
                <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl animate-scaleUp p-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Read-Only Roster</span>
                      <h3 className="text-xl font-black text-slate-900 mt-1">{selectedTable.table_name}</h3>
                    </div>
                    <button onClick={() => setSelectedTableId(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="py-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span>Occupancy</span>
                      <span className="text-slate-900">
                        {(selectedTable.assignments || []).reduce((sum: number, a: any) => sum + (a.assigned_pax || 0), 0)} / {selectedTable.capacity} Pax
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-2">Seated Guests</h4>
                    {!(selectedTable.assignments?.length) ? (
                      <p className="text-sm text-slate-400 italic py-4 text-center">No guests currently assigned to this table.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedTable.assignments.map((a: any) => {
                          const inv = a.invitation || {};
                          const guest = inv.guest || {};
                          const isCheck = !!inv.checked_in_at;
                          return (
                            <div key={a.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-2xs">
                              <div>
                                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                  {guest.name}
                                  {isCheck && <span title="Checked In"><Check className="w-3.5 h-3.5 text-emerald-600" /></span>}
                                </p>
                                <p className="text-[11px] text-slate-400">{guest.owner} • {guest.category}</p>
                              </div>
                              <div className="text-right">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-extrabold text-xs text-slate-700">
                                  {a.assigned_pax} Pax
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedTableId(null)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition"
                    >
                      Close View
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Guest Details & VIP Pop Up */}
            {detailsModalInv && (
              <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
                <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scaleUp p-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Guest Details Pop Up</span>
                      <h3 className="text-xl font-black text-slate-900 mt-0.5">{detailsModalInv.guest?.name}</h3>
                    </div>
                    <button onClick={() => setDetailsModalInv(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="py-5 space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block">Owner</span>
                        <strong className="text-slate-800 font-bold">{detailsModalInv.guest?.owner}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Category</span>
                        <strong className="text-slate-800 font-bold">{detailsModalInv.guest?.category}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Expected Pax</span>
                        <strong className="text-slate-800 font-bold">{detailsModalInv.max_pax} Pax</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Table Assigned</span>
                        <strong className="text-purple-700 font-bold">{detailsModalInv.seating_assignment?.[0]?.seating_table?.table_name || "Unassigned"}</strong>
                      </div>
                    </div>

                    {/* VIP Checkbox Option */}
                    <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!detailsModalInv.guest?.notes?.toLowerCase().includes("vip")}
                          onChange={() => handleToggleVip(detailsModalInv, detailsModalInv.guest?.notes)}
                          className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                        <div>
                          <span className="text-sm font-black text-amber-950 block">★ Mark as VIP Guest</span>
                          <span className="text-[11px] text-amber-800/80 font-medium leading-tight block">
                            Adds VIP tag so the guest appears highlighted on usher screens.
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Notes display */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notes</label>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 min-h-[50px] text-xs font-medium">
                        {detailsModalInv.guest?.notes || <span className="text-slate-400 italic">No notes recorded</span>}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setDetailsModalInv(null)}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </>
      )}

    </div>
  );
}
