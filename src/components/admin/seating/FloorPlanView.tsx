"use client";

import { useState } from "react";
import { updateTableMapPosition, unassignTableMapPosition } from "@/lib/actions/seating";
import { MapPin, Users, Check, X, ArrowRightLeft, Trash2 } from "lucide-react";

const R = 20;

/**
 * 26 physical map slots matching the exact user specification:
 * Col 1 (left): 6 tables
 * Col 2: 6 tables
 * Col 3: 5 tables
 * Col 4: 4 tables
 * Col 5 (right): 5 tables
 * Total: 26 slots.
 */
const SLOTS: { id: number; cx: number; cy: number }[] = [
  // Col 1 (6 tables)
  { id: 1,  cx: 80,  cy: 55  },
  { id: 2,  cx: 80,  cy: 120 },
  { id: 3,  cx: 80,  cy: 185 },
  { id: 4,  cx: 80,  cy: 250 },
  { id: 5,  cx: 80,  cy: 315 },
  { id: 6,  cx: 80,  cy: 380 },

  // Col 2 (6 tables)
  { id: 7,  cx: 155, cy: 55  },
  { id: 8,  cx: 155, cy: 120 },
  { id: 9,  cx: 155, cy: 185 },
  { id: 10, cx: 155, cy: 250 },
  { id: 11, cx: 155, cy: 315 },
  { id: 12, cx: 155, cy: 380 },

  // Col 3 (5 tables, starting below stage)
  { id: 13, cx: 245, cy: 155 },
  { id: 14, cx: 245, cy: 210 },
  { id: 15, cx: 245, cy: 265 },
  { id: 16, cx: 245, cy: 320 },
  { id: 17, cx: 245, cy: 375 }, // bottom of Col 3

  // Col 4 (4 tables below stage)
  { id: 18, cx: 335, cy: 165 },
  { id: 19, cx: 335, cy: 220 },
  { id: 20, cx: 335, cy: 275 },
  { id: 21, cx: 335, cy: 330 },

  // Col 5 (5 tables below stage near right wall)
  { id: 22, cx: 425, cy: 165 },
  { id: 23, cx: 425, cy: 220 },
  { id: 24, cx: 425, cy: 275 },
  { id: 25, cx: 425, cy: 330 },
  { id: 26, cx: 425, cy: 385 }, // bottom right corner
];

const LEGEND_ITEMS = [
  { fill: "#f8fafc", stroke: "#94a3b8", dash: true,  label: "Empty Slot (Click to assign)" },
  { fill: "white",   stroke: "#cbd5e1", dash: false, label: "Assigned (Empty seats)"       },
  { fill: "#fffbeb", stroke: "#fbbf24", dash: false, label: "Partially filled"             },
  { fill: "#f0fdf4", stroke: "#4ade80", dash: false, label: "Full"                         },
  { fill: "#fef2f2", stroke: "#f87171", dash: false, label: "Over capacity"                },
] as const;

interface FloorPlanViewProps {
  tables: any[];
  selectedTableId: string | null;
  setSelectedTableId: (id: string | null) => void;
  readOnly?: boolean;
}

export function FloorPlanView({ tables, selectedTableId, setSelectedTableId, readOnly = false }: FloorPlanViewProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [activeSlotModal, setActiveSlotModal] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Build slot_id (sort_order 1..26) -> table lookup
  const bySlot = new Map<number, any>();
  tables.forEach(t => {
    if (t.sort_order >= 1 && t.sort_order <= 26) {
      bySlot.set(t.sort_order, t);
    }
  });

  const hoveredSlot  = hoveredId != null ? SLOTS.find(s => s.id === hoveredId) ?? null : null;
  const hoveredTable = hoveredId != null ? bySlot.get(hoveredId) ?? null : null;
  const modalTable   = activeSlotModal != null ? bySlot.get(activeSlotModal) ?? null : null;

  const handleSlotClick = (slotId: number, table: any) => {
    if (!table) {
      if (readOnly) return;
      // Open table assignment modal for this slot
      setActiveSlotModal(slotId);
    } else {
      // Table exists -> toggle selection for sidebar
      setSelectedTableId(selectedTableId === table.id ? null : table.id);
    }
  };

  const handleAssignTableToSlot = async (tableId: string) => {
    if (activeSlotModal == null || readOnly) return;
    setIsUpdating(true);
    await updateTableMapPosition(tableId, activeSlotModal);
    setIsUpdating(false);
    setActiveSlotModal(null);
  };

  const handleRemoveTableFromSlot = async (tableId: string) => {
    if (readOnly) return;
    setIsUpdating(true);
    await unassignTableMapPosition(tableId);
    setIsUpdating(false);
    setActiveSlotModal(null);
  };

  return (
    <div className="w-full select-none">
      {/* ── Top Info Bar ── */}
      <div className="flex items-center justify-between gap-3 mb-3 px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm text-xs font-medium text-slate-600">
        <span className="flex items-center gap-2">
          {readOnly ? (
            <span>💡 <strong className="text-slate-800">Read-Only Floor Map:</strong> Click any assigned table circle to view its seating roster and checked-in guests.</span>
          ) : (
            <span>💡 <strong className="text-slate-800">Interactive Floor Map:</strong> Click an assigned table circle to manage guests or remove it from the map. Click an empty circle (+) to place a table.</span>
          )}
        </span>
      </div>

      {/* ── Legend Bar ── */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-3 px-2 py-2 bg-slate-100/70 rounded-xl border border-slate-200/60 text-xs">
        <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Legend:</span>
        {LEGEND_ITEMS.map(item => (
          <span key={item.label} className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
            <span
              className="w-3.5 h-3.5 rounded-full inline-block flex-shrink-0"
              style={{
                background: item.fill,
                border: `2px ${item.dash ? "dashed" : "solid"} ${item.stroke}`,
              }}
            />
            {item.label}
          </span>
        ))}
      </div>

      {/* ── SVG Map Container ── */}
      <div
        className="relative w-full bg-slate-50 rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
        style={{ aspectRatio: "520 / 460", maxHeight: "68vh" }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 520 460"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="fp-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodOpacity="0.10" />
            </filter>
            <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.4" />
            </pattern>
          </defs>

          {/* Canvas Background */}
          <rect width="520" height="460" fill="#f8fafc" />

          {/* ── Room Perimeter Polygon matching User Red Line Outline ── */}
          {/* Top: y=20. Left: x=35 down to y=425. Bottom-left run to x=195. Step up to y=405. Green Entrance across x=195..245. Bottom-right run x=245..485 at y=405. Right wall up to y=20. */}
          <polygon
            points="35,20 485,20 485,415 245,415 245,430 195,430 195,430 35,430"
            fill="white"
            stroke="#64748b"
            strokeWidth="3"
            strokeLinejoin="round"
            filter="url(#fp-shadow)"
          />


          {/* ── Stage / Pelaminan (Top Right inside ballroom) ── */}
          <rect x="235" y="20" width="250" height="115" rx="2"
            fill="#faf5ff" stroke="#a78bfa" strokeWidth="2" strokeDasharray="6 3" />
          <rect x="235" y="20" width="250" height="115" rx="2" fill="url(#diagonalHatch)" />
          <text x="360" y="70" textAnchor="middle" fontSize="12" fontWeight="800" fill="#6d28d9" letterSpacing="0.5">
            STAGE / PELAMINAN
          </text>
          <text x="360" y="88" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#8b5cf6" opacity="0.75">
            (Dance Floor Area)
          </text>

          {/* ── Table Slots ── */}
          {SLOTS.map(slot => {
            const table      = bySlot.get(slot.id);
            const hasTable   = !!table;
            const isSelected = table?.id === selectedTableId;

            const occupancy = hasTable
              ? table.assignments.reduce((s: number, a: any) => s + a.assigned_pax, 0)
              : 0;
            const capacity   = hasTable ? table.capacity : 10;
            const isFull     = hasTable && occupancy >= capacity;
            const isOver     = hasTable && occupancy > capacity;

            let fill   = "#f8fafc";
            let stroke = "#94a3b8";
            let sw     = 1.5;
            let dash: string | undefined = hasTable ? undefined : "4 3";

            if (hasTable) {
              if (isOver)             { fill = "#fef2f2"; stroke = "#ef4444"; sw = 2.2; }
              else if (isFull)        { fill = "#f0fdf4"; stroke = "#22c55e"; sw = 2.2; }
              else if (occupancy > 0) { fill = "#fffbeb"; stroke = "#f59e0b"; sw = 2.2; }
              else                    { fill = "white";   stroke = "#64748b"; sw = 1.8; }
            }
            if (isSelected) { stroke = "#d97706"; sw = 3.5; }

            const textFill = isOver ? "#dc2626" : isFull ? "#15803d" : isSelected ? "#b45309" : "#334155";
            const label    = hasTable
              ? (table.table_name || "").replace(/^table\s*/i, "T")
              : `+`;

            return (
              <g
                key={slot.id}
                onClick={() => handleSlotClick(slot.id, table)}
                onMouseEnter={() => setHoveredId(slot.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Selection Highlight Ring */}
                {isSelected && (
                  <circle cx={slot.cx} cy={slot.cy} r={R + 7}
                    fill="none" stroke="#f59e0b" strokeWidth="2.5" opacity="0.4" />
                )}

                {/* Hover Ring for empty slots */}
                {!hasTable && hoveredId === slot.id && (
                  <circle cx={slot.cx} cy={slot.cy} r={R + 6}
                    fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
                )}

                {/* Table Circle */}
                <circle cx={slot.cx} cy={slot.cy} r={R}
                  fill={fill} stroke={stroke} strokeWidth={sw}
                  strokeDasharray={dash} filter={hasTable ? "url(#fp-shadow)" : undefined} />

                {/* Table Label */}
                <text x={slot.cx} y={slot.cy - (hasTable ? 3 : 0)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={hasTable ? 9.5 : 14}
                  fontWeight={hasTable ? "800" : "600"}
                  fill={hasTable ? textFill : "#94a3b8"}
                  pointerEvents="none">
                  {label}
                </text>

                {/* Occupancy Sub-label */}
                {hasTable && (
                  <text x={slot.cx} y={slot.cy + 9}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="7" fontWeight="700" fill={textFill} opacity="0.8"
                    pointerEvents="none">
                    {occupancy}/{capacity}
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Hover Tooltip ── */}
          {hoveredSlot && (() => {
            const table   = hoveredTable;
            const toRight = hoveredSlot.cx < 260;
            const tx      = toRight ? hoveredSlot.cx + R + 10 : hoveredSlot.cx - R - 10 - 160;
            const ty      = Math.max(30, Math.min(hoveredSlot.cy - 20, 420 - 75));

            if (!table) {
              return (
                <g pointerEvents="none" filter="url(#fp-shadow)">
                  <rect x={tx} y={ty} width={160} height={46} rx={6} fill="white" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" />
                  <text x={tx + 12} y={ty + 18} fontSize="9.5" fontWeight="800" fill="#334155">Slot #{hoveredSlot.id}</text>
                  <text x={tx + 12} y={ty + 32} fontSize={8} fontWeight="600" fill="#3b82f6">💡 Click to assign a table</text>
                </g>
              );
            }

            const guests = table.assignments.map((a: any) => ({
              name: a.invitation?.guest?.name ?? "Guest",
              pax: a.assigned_pax,
            }));
            const occ   = guests.reduce((s: number, g: any) => s + g.pax, 0);
            const shown = guests.slice(0, 5);
            const tipH  = 46 + shown.length * 14 + (guests.length > 5 ? 14 : 0);

            return (
              <g pointerEvents="none" filter="url(#fp-shadow)">
                <rect x={tx} y={ty} width={160} height={tipH} rx={6} fill="white" stroke="#cbd5e1" strokeWidth={1.5} />
                <text x={tx + 12} y={ty + 18} fontSize="10" fontWeight="800" fill="#0f172a">{table.table_name} (Slot #{hoveredSlot.id})</text>
                <text x={tx + 12} y={ty + 32} fontSize={8} fontWeight="600" fill="#64748b">{occ} / {table.capacity} pax assigned</text>
                <line x1={tx + 12} y1={ty + 38} x2={tx + 148} y2={ty + 38} stroke="#f1f5f9" strokeWidth={1} />
                {shown.map((g: any, i: number) => (
                  <text key={i} x={tx + 12} y={ty + 50 + i * 14} fontSize={7.5} fill="#334155">
                    • {g.name.length > 18 ? g.name.slice(0, 18) + "…" : g.name} ({g.pax})
                  </text>
                ))}
                {guests.length > 5 && (
                  <text x={tx + 12} y={ty + 50 + shown.length * 14} fontSize={7} fontStyle="italic" fill="#94a3b8">
                    +{guests.length - 5} more guests...
                  </text>
                )}
              </g>
            );
          })()}
        </svg>
      </div>

      {/* ── Table Positioning Modal ── */}
      {activeSlotModal != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Map Positioning</span>
                <h3 className="text-lg font-extrabold text-slate-800">Configure Slot #{activeSlotModal}</h3>
              </div>
              <button onClick={() => setActiveSlotModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {modalTable ? (
                <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase">Currently Assigned</span>
                    <p className="text-base font-extrabold text-amber-900">{modalTable.table_name}</p>
                    <p className="text-xs text-amber-600 mt-0.5">{modalTable.assignments.reduce((s: number, a: any) => s + a.assigned_pax, 0)} / {modalTable.capacity} pax assigned</p>
                  </div>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleRemoveTableFromSlot(modalTable.id)}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove from Slot
                  </button>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700 font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-blue-600" />
                  <span>Select which table number should appear at physical position #{activeSlotModal}.</span>
                </div>
              )}

              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Available Tables</h4>
              
              <div className="space-y-2">
                {tables.map((t: any) => {
                  const isCurrentSlot = t.sort_order === activeSlotModal;
                  const isOtherSlot   = t.sort_order >= 1 && t.sort_order <= 26 && !isCurrentSlot;
                  const occ = t.assignments.reduce((s: number, a: any) => s + a.assigned_pax, 0);

                  return (
                    <button
                      key={t.id}
                      disabled={isUpdating || isCurrentSlot}
                      onClick={() => handleAssignTableToSlot(t.id)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                        isCurrentSlot
                          ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400/20 cursor-default"
                          : "bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm">{t.table_name}</span>
                          {isCurrentSlot && <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded text-[10px] font-bold">Here</span>}
                          {isOtherSlot && <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-medium">At Slot #{t.sort_order}</span>}
                        </div>
                        <span className="text-xs text-slate-500">{occ} / {t.capacity} pax assigned</span>
                      </div>

                      {!isCurrentSlot && (
                        <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                          {isOtherSlot ? (
                            <>Swap Here <ArrowRightLeft className="w-3.5 h-3.5" /></>
                          ) : (
                            <>Assign <Check className="w-4 h-4" /></>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setActiveSlotModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
