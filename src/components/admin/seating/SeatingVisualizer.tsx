"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Users, AlertTriangle, Plus, LayoutGrid, Map } from "lucide-react";
import { FloorPlanView } from "@/components/admin/seating/FloorPlanView";
import { Box, Flex, Text, Heading, Button, Grid, Card, Badge, SegmentedControl } from "@radix-ui/themes";

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
    <Box className={`flex-1 overflow-y-auto transition-all duration-300 ${selectedTableId ? "mr-0 xl:mr-96" : "mr-0"}`}>
      <Box p={{ initial: "4", md: "8" }}>

        {/* ─── Header ─── */}
        <Flex direction={{ initial: "column", md: "row" }} justify="between" align={{ initial: "start", md: "center" }} mb="6" gap="4">
          <Box>
            <Heading size="7" weight="bold" style={{ letterSpacing: "-0.025em" }}>Seating Assignment</Heading>
            <Text as="p" size="3" color="gray" mt="1">Design and manage table layouts.</Text>
          </Box>

          <Flex align="center" gap="3" wrap="wrap">
            {/* Event switcher */}
            <SegmentedControl.Root value={currentEvent} onValueChange={(val) => { setSelectedTableId(null); updateUrl({ event: val }); }}>
              <SegmentedControl.Item value="wedding">Wedding</SegmentedControl.Item>
              <SegmentedControl.Item value="sangjit">Sangjit</SegmentedControl.Item>
            </SegmentedControl.Root>

            {/* View toggle (wedding only) */}
            {canShowMap && initialTables.length > 0 && (
              <SegmentedControl.Root value={viewMode} onValueChange={(val: any) => handleViewChange(val)}>
                <SegmentedControl.Item value="grid"><Flex align="center" gap="1"><LayoutGrid className="w-3 h-3"/> Grid</Flex></SegmentedControl.Item>
                <SegmentedControl.Item value="map"><Flex align="center" gap="1"><Map className="w-3 h-3"/> Map</Flex></SegmentedControl.Item>
              </SegmentedControl.Root>
            )}

            {/* Add Table (grid mode only) */}
            {handleAddTable && viewMode === "grid" && (
              <Button onClick={handleAddTable} color="crimson" variant="solid" style={{ cursor: "pointer" }}>
                <Plus className="w-4 h-4" /> Add Table
              </Button>
            )}
          </Flex>
        </Flex>

        {/* ─── Metrics ─── */}
        {initialTables.length > 0 && (
          <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap="4" mb="6">
            <Card size="2">
              <Flex align="center" gap="4">
                <Box p="2" style={{ backgroundColor: "var(--crimson-3)", color: "var(--crimson-10)", borderRadius: "var(--radius-3)", flexShrink: 0 }}>
                  <LayoutDashboard className="w-5 h-5" />
                </Box>
                <Box>
                  <Text as="div" size="1" weight="medium" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Tables</Text>
                  <Text as="div" size="6" weight="bold">{totalTables}</Text>
                </Box>
              </Flex>
            </Card>
            <Card size="2">
              <Flex align="center" gap="4">
                <Box p="2" style={{ backgroundColor: "var(--crimson-3)", color: "var(--crimson-10)", borderRadius: "var(--radius-3)", flexShrink: 0 }}>
                  <Users className="w-5 h-5" />
                </Box>
                <Box>
                  <Text as="div" size="1" weight="medium" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Occupied Seats</Text>
                  <Text as="div" size="6" weight="bold">{occupiedSeats} <Text size="2" color="gray" weight="medium">/ {totalCapacity}</Text></Text>
                </Box>
              </Flex>
            </Card>
            <Card size="2">
              <Flex align="center" gap="4">
                <Box p="2" style={{ backgroundColor: "var(--crimson-3)", color: "var(--crimson-10)", borderRadius: "var(--radius-3)", flexShrink: 0 }}>
                  <Users className="w-5 h-5" />
                </Box>
                <Box>
                  <Text size="1" weight="bold" color="crimson" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }} mb="1" as="div">Assigned Pax</Text>
                  <Text as="div" size="6" weight="bold">{occupiedSeats} <Text size="2" color="gray" weight="medium">/ {allPax}</Text></Text>
                </Box>
              </Flex>
            </Card>
            <Card size="2">
              <Flex align="center" gap="4">
                <Box p="2" style={{ backgroundColor: "var(--crimson-3)", color: "var(--crimson-10)", borderRadius: "var(--radius-3)", flexShrink: 0 }}>
                  <Users className="w-5 h-5" />
                </Box>
                <Box>
                  <Text as="div" size="1" weight="medium" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Remaining Seats</Text>
                  <Text as="div" size="6" weight="bold">{remainingSeats}</Text>
                </Box>
              </Flex>
            </Card>
          </Grid>
        )}

        {/* ─── Content: Empty state / Map / Grid ─── */}
        {initialTables.length === 0 ? (
          <Box p="9" style={{ textAlign: "center", border: "1px dashed var(--gray-5)", borderRadius: "var(--radius-4)", backgroundColor: "white", minHeight: "250px" }} className="flex flex-col items-center justify-center">
            <LayoutDashboard className="w-12 h-12 mb-4" style={{ color: "var(--gray-8)" }} />
            <Heading size="5" mb="2">No Tables Found</Heading>
            <Text as="p" size="2" color="gray" mb="5" style={{ maxWidth: "400px" }}>
              There are currently no tables initialized for the {currentEvent} event.
            </Text>
            <Button size="3" color="crimson" onClick={handleInitialize} style={{ cursor: "pointer" }}>
              Initialize Default Tables
            </Button>
          </Box>
        ) : viewMode === "map" && canShowMap ? (
          /* ─── Floor Plan View ─── */
          <Box>
            <Flex align="center" gap="2" mb="4">
              <Map className="w-3.5 h-3.5" style={{ color: "var(--gray-10)" }} />
              <Text size="2" weight="medium" color="gray">Royal Dynasty Lt.3 — Click a table to select it, then use the sidebar to assign guests.</Text>
            </Flex>
            <FloorPlanView
              tables={initialTables}
              selectedTableId={selectedTableId}
              setSelectedTableId={setSelectedTableId}
            />
          </Box>
        ) : (
          /* ─── Grid View ─── */
          <Grid columns={{ initial: "2", sm: "3", md: "4", lg: "5", xl: "6" }} gap="4">
            {initialTables.map((table: any, idx: number) => {
              const currentOccupancy = table.assignments.reduce((sum: number, a: any) => sum + a.assigned_pax, 0);
              const isOverCapacity = currentOccupancy > table.capacity;
              const isFull = currentOccupancy === table.capacity;
              const isSelected = selectedTableId === table.id;
              const tableNumber = table.sort_order || idx + 1;
              const isDefaultName = new RegExp(`^Table\\s*${tableNumber}$`, "i").test(table.table_name || "");

              return (
                <Card 
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  style={{ 
                    cursor: "pointer", 
                    borderColor: isSelected ? "var(--amber-9)" : undefined,
                    boxShadow: isSelected ? "0 0 0 1px var(--amber-9)" : undefined,
                  }}
                  className="group transition-all hover:shadow-2"
                >
                  <Flex justify="between" align="start" mb="3" gap="2">
                    <Box>
                      <Badge color="amber" variant="soft" size="1" mb="1">
                        Table #{tableNumber}
                      </Badge>
                      {!isDefaultName && table.table_name && (
                        <Text as="div" size="2" weight="bold" style={{ color: isSelected ? "var(--amber-11)" : "var(--gray-12)", lineHeight: 1.2 }}>
                          {table.table_name}
                        </Text>
                      )}
                    </Box>
                    {isOverCapacity && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                  </Flex>

                  <Flex align="center" justify="center" mb="4">
                    <Flex 
                      align="center" 
                      justify="center" 
                      style={{ 
                        width: "64px", 
                        height: "64px", 
                        borderRadius: "50%", 
                        border: "4px solid",
                        borderColor: isOverCapacity ? "var(--red-5)" : isFull ? "var(--green-5)" : isSelected ? "var(--amber-5)" : "var(--gray-4)",
                        backgroundColor: isOverCapacity ? "var(--red-2)" : isFull ? "var(--green-2)" : isSelected ? "var(--amber-2)" : "var(--gray-2)",
                        color: isOverCapacity ? "var(--red-11)" : isFull ? "var(--green-11)" : isSelected ? "var(--amber-11)" : "var(--gray-11)",
                      }}
                    >
                      <Text size="5" weight="bold">{currentOccupancy}</Text>
                    </Flex>
                  </Flex>

                  <Box style={{ textAlign: "center" }}>
                    <Text size="1" weight="medium" color="gray">Capacity: {table.capacity} pax</Text>
                  </Box>

                  <Box mt="3" style={{ height: "6px", backgroundColor: "var(--gray-3)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                    <Box 
                      style={{ 
                        height: "100%", 
                        borderRadius: "var(--radius-full)", 
                        backgroundColor: isOverCapacity ? "var(--red-9)" : isFull ? "var(--green-9)" : "var(--amber-9)",
                        width: `${Math.min(100, (currentOccupancy / table.capacity) * 100)}%` 
                      }} 
                    />
                  </Box>
                </Card>
              );
            })}

            {handleAddTable && (
              <button
                onClick={handleAddTable}
                style={{ 
                  border: "2px dashed var(--gray-5)", 
                  borderRadius: "var(--radius-4)", 
                  backgroundColor: "var(--gray-2)", 
                  minHeight: "140px",
                  cursor: "pointer",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                className="transition group hover:border-[var(--crimson-7)] hover:bg-[var(--crimson-2)]"
              >
                <div 
                  style={{ 
                    width: "40px", height: "40px", borderRadius: "50%", 
                    backgroundColor: "var(--gray-4)",
                    display: "flex", alignItems: "center", justifyContent: "center" 
                  }}
                  className="group-hover:bg-[var(--crimson-4)] group-hover:text-[var(--crimson-11)] transition mb-2 text-slate-500"
                >
                  <Plus className="w-5 h-5" />
                </div>
                <Text size="1" weight="bold" color="gray" className="group-hover:text-[var(--crimson-11)]">Add Table</Text>
              </button>
            )}
          </Grid>
        )}

      </Box>
    </Box>
  );
}
