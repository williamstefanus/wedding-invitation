"use client";

import { useState } from "react";
import { updateTableMapPosition, unassignTableMapPosition } from "@/lib/actions/seating";
import { MapPin, Users, Check, X, ArrowRightLeft, Trash2, Info } from "lucide-react";
import { Box, Flex, Text, Callout, Dialog, Button, Badge } from "@radix-ui/themes";

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
  { fill: "var(--gray-2)", stroke: "var(--gray-8)", dash: true,  label: "Empty Slot (Click to assign)" },
  { fill: "var(--color-panel-solid)", stroke: "var(--gray-6)", dash: false, label: "Assigned (Empty seats)"       },
  { fill: "var(--yellow-3)", stroke: "var(--yellow-9)", dash: false, label: "Partially filled"             },
  { fill: "var(--green-3)", stroke: "var(--green-9)", dash: false, label: "Full"                         },
  { fill: "var(--red-3)", stroke: "var(--red-9)", dash: false, label: "Over capacity"                },
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

  // Build slot_id (position_x 1..26) -> table lookup
  const bySlot = new Map<number, any>();
  tables.forEach(t => {
    if (t.position_x != null && t.position_x >= 1 && t.position_x <= 26) {
      bySlot.set(t.position_x, t);
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
    <Box style={{ width: "100%", userSelect: "none" }}>
      {/* ── Top Info Bar ── */}
      <Callout.Root color="gray" variant="surface" mb="3">
        <Callout.Icon>
          <Info className="w-4 h-4" />
        </Callout.Icon>
        <Callout.Text size="2">
          {readOnly ? (
            <><Text weight="bold" color="gray">Read-Only Floor Map:</Text> Click any assigned table circle to view its seating roster and checked-in guests.</>
          ) : (
            <><Text weight="bold" color="gray">Interactive Floor Map:</Text> Click an assigned table circle to manage guests or remove it from the map. Click an empty circle (+) to place a table.</>
          )}
        </Callout.Text>
      </Callout.Root>

      {/* ── Legend Bar ── */}
      <Flex wrap="wrap" align="center" gap="5" mb="3" p="3" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)", border: "1px solid var(--gray-5)" }}>
        <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Legend:</Text>
        {LEGEND_ITEMS.map(item => (
          <Flex key={item.label} align="center" gap="2">
            <Box 
              style={{ 
                width: "14px", height: "14px", borderRadius: "50%",
                backgroundColor: item.fill,
                border: `2px ${item.dash ? "dashed" : "solid"} ${item.stroke}`
              }} 
            />
            <Text size="1" color="gray" weight="medium">{item.label}</Text>
          </Flex>
        ))}
      </Flex>

      {/* ── SVG Map Container ── */}
      <Box
        style={{ 
          position: "relative", width: "100%", backgroundColor: "var(--gray-2)", 
          borderRadius: "var(--radius-4)", border: "1px solid var(--gray-5)", 
          boxShadow: "var(--shadow-1)", overflow: "hidden", 
          aspectRatio: "520 / 460", maxHeight: "68vh" 
        }}
      >
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox="0 0 520 460"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="fp-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodOpacity="0.10" />
            </filter>
            <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="var(--crimson-7)" strokeWidth="1.5" opacity="0.4" />
            </pattern>
          </defs>

          {/* Canvas Background */}
          <rect width="520" height="460" fill="var(--gray-2)" />

          {/* ── Room Perimeter Polygon matching User Red Line Outline ── */}
          <polygon
            points="35,20 485,20 485,415 245,415 245,430 195,430 195,430 35,430"
            fill="var(--color-panel-solid)"
            stroke="var(--gray-8)"
            strokeWidth="3"
            strokeLinejoin="round"
            filter="url(#fp-shadow)"
          />

          {/* ── Stage / Pelaminan (Top Right inside ballroom) ── */}
          <rect x="235" y="20" width="250" height="115" rx="2"
            fill="var(--crimson-2)" stroke="var(--crimson-8)" strokeWidth="2" strokeDasharray="6 3" />
          <rect x="235" y="20" width="250" height="115" rx="2" fill="url(#diagonalHatch)" />
          <text x="360" y="70" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--crimson-11)" letterSpacing="0.5">
            STAGE / PELAMINAN
          </text>
          <text x="360" y="88" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="var(--crimson-9)" opacity="0.75">
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

            let fill   = "var(--gray-2)";
            let stroke = "var(--gray-8)";
            let sw     = 1.5;
            let dash: string | undefined = hasTable ? undefined : "4 3";

            if (hasTable) {
              if (isOver)             { fill = "var(--red-3)"; stroke = "var(--red-9)"; sw = 2.2; }
              else if (isFull)        { fill = "var(--green-3)"; stroke = "var(--green-9)"; sw = 2.2; }
              else if (occupancy > 0) { fill = "var(--yellow-3)"; stroke = "var(--yellow-9)"; sw = 2.2; }
              else                    { fill = "var(--color-panel-solid)"; stroke = "var(--gray-8)"; sw = 1.8; }
            }
            if (isSelected) { stroke = "var(--crimson-9)"; sw = 3.5; }

            const textFill = isOver ? "var(--red-11)" : isFull ? "var(--green-11)" : isSelected ? "var(--crimson-11)" : "var(--gray-12)";
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
                    fill="none" stroke="var(--crimson-9)" strokeWidth="2.5" opacity="0.4" />
                )}

                {/* Hover Ring for empty slots */}
                {!hasTable && hoveredId === slot.id && (
                  <circle cx={slot.cx} cy={slot.cy} r={R + 6}
                    fill="none" stroke="var(--crimson-9)" strokeWidth="2" opacity="0.5" />
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
                  fill={hasTable ? textFill : "var(--gray-9)"}
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
                  <rect x={tx} y={ty} width={160} height={46} rx={6} fill="white" stroke="var(--gray-7)" strokeWidth={1.5} strokeDasharray="3 3" />
                  <text x={tx + 12} y={ty + 18} fontSize="9.5" fontWeight="800" fill="var(--gray-12)">Slot #{hoveredSlot.id}</text>
                  <text x={tx + 12} y={ty + 32} fontSize={8} fontWeight="600" fill="var(--crimson-9)">💡 Click to assign a table</text>
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
                <rect x={tx} y={ty} width={160} height={tipH} rx={6} fill="var(--color-panel-solid)" stroke="var(--gray-7)" strokeWidth={1.5} />
                <text x={tx + 12} y={ty + 18} fontSize="10" fontWeight="800" fill="var(--gray-12)">Table #{table.sort_order || 1}: {table.table_name} (Slot #{hoveredSlot.id})</text>
                <text x={tx + 12} y={ty + 32} fontSize={8} fontWeight="600" fill="var(--gray-10)">{occ} / {table.capacity} pax assigned</text>
                <line x1={tx + 12} y1={ty + 38} x2={tx + 148} y2={ty + 38} stroke="var(--gray-4)" strokeWidth={1} />
                {shown.map((g: any, i: number) => (
                  <text key={i} x={tx + 12} y={ty + 50 + i * 14} fontSize={7.5} fill="var(--gray-11)">
                    • {g.name.length > 18 ? g.name.slice(0, 18) + "…" : g.name} ({g.pax})
                  </text>
                ))}
                {guests.length > 5 && (
                  <text x={tx + 12} y={ty + 50 + shown.length * 14} fontSize={7} fontStyle="italic" fill="var(--gray-9)">
                    +{guests.length - 5} more guests...
                  </text>
                )}
              </g>
            );
          })()}
        </svg>
      </Box>

      {/* ── Table Positioning Modal ── */}
      <Dialog.Root open={activeSlotModal != null} onOpenChange={(open) => !open && setActiveSlotModal(null)}>
        <Dialog.Content size="3" maxWidth="450px" className="animate-fade-up">
          <Box mb="4">
            <Text size="1" weight="bold" color="crimson" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Map Positioning</Text>
            <Dialog.Title mt="1">
              Configure Slot #{activeSlotModal}
            </Dialog.Title>
          </Box>

          <Box style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {modalTable ? (
              <Flex align="center" justify="between" p="3" mb="4" style={{ backgroundColor: "var(--amber-3)", border: "1px solid var(--amber-6)", borderRadius: "var(--radius-3)" }}>
                <Box>
                  <Text size="1" weight="bold" color="amber" style={{ textTransform: "uppercase" }}>Currently Assigned</Text>
                  <Text as="div" size="3" weight="bold" color="amber" mt="1">Table #{modalTable.sort_order || 1}: {modalTable.table_name}</Text>
                  <Text as="div" size="1" color="amber">{modalTable.assignments.reduce((s: number, a: any) => s + a.assigned_pax, 0)} / {modalTable.capacity} pax assigned</Text>
                </Box>
                <Button 
                  disabled={isUpdating}
                  color="red"
                  variant="soft"
                  onClick={() => handleRemoveTableFromSlot(modalTable.id)}
                  style={{ cursor: "pointer" }}
                >
                  <Trash2 className="w-4 h-4" /> Remove from Slot
                </Button>
              </Flex>
            ) : (
              <Callout.Root color="crimson" variant="surface" mb="4">
                <Callout.Icon><MapPin className="w-4 h-4" /></Callout.Icon>
                <Callout.Text size="2">Select which table number should appear at physical position #{activeSlotModal}.</Callout.Text>
              </Callout.Root>
            )}

            <Text size="1" weight="bold" color="gray" mb="2" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Available Tables</Text>
            
            <Flex direction="column" gap="2">
              {tables.map((t: any, idx: number) => {
                const isCurrentSlot = t.position_x === activeSlotModal;
                const isOtherSlot   = t.position_x != null && t.position_x >= 1 && t.position_x <= 26 && !isCurrentSlot;
                const occ = t.assignments.reduce((s: number, a: any) => s + a.assigned_pax, 0);
                const tableNumber = t.sort_order || idx + 1;

                return (
                  <Flex
                    key={t.id}
                    asChild
                  >
                    <button
                      disabled={isUpdating || isCurrentSlot}
                      onClick={() => handleAssignTableToSlot(t.id)}
                      style={{ 
                        width: "100%", padding: "12px", borderRadius: "var(--radius-3)", 
                        border: isCurrentSlot ? "1px solid var(--amber-7)" : "1px solid var(--gray-5)", 
                        backgroundColor: isCurrentSlot ? "var(--amber-3)" : "var(--color-panel-solid)",
                        cursor: isCurrentSlot || isUpdating ? "default" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        textAlign: "left"
                      }}
                      className={!isCurrentSlot ? "hover:bg-slate-50 hover:border-crimson-400 transition" : ""}
                    >
                      <Box>
                        <Flex align="center" gap="2">
                          <Text weight="bold" size="2" style={{ color: "var(--gray-12)" }}>Table #{tableNumber}: {t.table_name}</Text>
                          {isCurrentSlot && <Badge color="amber" variant="solid" size="1">Here</Badge>}
                          {isOtherSlot && <Badge color="gray" variant="soft" size="1">At Slot #{t.position_x}</Badge>}
                        </Flex>
                        <Text size="1" color="gray">{occ} / {t.capacity} pax assigned</Text>
                      </Box>

                      {!isCurrentSlot && (
                        <Flex align="center" gap="1" style={{ color: "var(--crimson-9)" }}>
                          <Text size="1" weight="bold">{isOtherSlot ? "Swap Here" : "Assign"}</Text>
                          {isOtherSlot ? <ArrowRightLeft className="w-3 h-3" /> : <Check className="w-4 h-4" />}
                        </Flex>
                      )}
                    </button>
                  </Flex>
                );
              })}
            </Flex>
          </Box>

          <Flex justify="end" mt="4" gap="3">
            <Dialog.Close>
              <Button variant="soft" color="gray" style={{ cursor: "pointer" }}>
                Close
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
