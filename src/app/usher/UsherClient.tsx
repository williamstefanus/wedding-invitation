"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { getUsherRoster, checkInGuest, updateGuestVipStatus } from "@/lib/actions/usher";
import { getSeatingData } from "@/lib/actions/seating";
import { PinLoginModal } from "@/components/usher/PinLoginModal";
import { UsherGuestCard } from "@/components/usher/UsherGuestCard";
import { FloorPlanView } from "@/components/admin/seating/FloorPlanView";
import { Search, LogOut, RefreshCw, Users, UserCheck, Map, List, X, FileText, MapPin, Check } from "lucide-react";
import { Box, Flex, Text, Heading, Button, Card, Grid, SegmentedControl, TextField, Checkbox, Dialog, ScrollArea, Progress, Container, IconButton, Badge, TextArea, Spinner } from "@radix-ui/themes";

interface UsherClientProps {
  initialWeddingRoster: any[];
  initialSangjitRoster: any[];
  initialWeddingTables?: any[];
  initialSangjitTables?: any[];
  config?: any;
}

export function UsherClient({ 
  initialWeddingRoster, 
  initialSangjitRoster,
  initialWeddingTables = [],
  initialSangjitTables = [],
  config = {}
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
  const [filterType, setFilterType] = useState<"all" | "vip" | "checked_in" | "pending" | "groom" | "bride">("all");
  const [isPending, startTransition] = useTransition();

  const [editingNotes, setEditingNotes] = useState<string>("");
  const [isVip, setIsVip] = useState<boolean>(false);

  const handleOpenDetails = (inv: any | null) => {
    // Save notes automatically when modal closes
    if (inv === null && detailsModalInv) {
      const g = Array.isArray(detailsModalInv.guest) ? detailsModalInv.guest[0] : detailsModalInv.guest;
      const originalNotes = g?.notes || "";
      const newNotesString = (isVip ? `[VIP] ${editingNotes}` : editingNotes).trim();

      if (newNotesString !== originalNotes) {
        const guestId = g?.id;
        
        // Optimistic update
        setRoster(prev => prev.map(item => {
          if (item.id === detailsModalInv.id) {
            const itemGuest = Array.isArray(item.guest) ? item.guest[0] : item.guest;
            return {
              ...item,
              guest: { ...itemGuest, notes: newNotesString }
            };
          }
          return item;
        }));

        // Background save
        if (guestId) {
          updateGuestVipStatus(guestId, newNotesString).catch(err => console.error("Failed to save notes", err));
        }
      }
    }

    setDetailsModalInv(inv);
    if (inv) {
      const g = Array.isArray(inv.guest) ? inv.guest[0] : inv.guest;
      const notes = g?.notes || "";
      setIsVip(!!notes.toLowerCase().includes("vip"));
      setEditingNotes(notes.replace(/\[?vip\]?/gi, "").trim());
    } else {
      setEditingNotes("");
      setIsVip(false);
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("wo_authorized") === "true";
    setIsAuthorized(auth);
    setAuthChecked(true);
  }, []);

  const handleEventChange = (value: string) => {
    const event = value as "wedding" | "sangjit";
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
      const guest = Array.isArray(inv.guest) ? inv.guest[0] : (inv.guest || {});
      const nameMatch = guest.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const codeMatch = inv.invitation_code?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = !searchQuery || nameMatch || codeMatch;
      if (!matchesSearch) return false;

      const isCheckedIn = !!inv.checked_in_at;
      const isVip = !!guest.notes?.toLowerCase().includes("vip");

      if (filterType === "vip") return isVip;
      if (filterType === "checked_in") return isCheckedIn;
      if (filterType === "pending") return !isCheckedIn;
      if (filterType === "groom") return guest?.owner?.toLowerCase() === "groom" || guest?.owner?.toLowerCase() === "william";
      if (filterType === "bride") return guest?.owner?.toLowerCase() === "bride" || guest?.owner?.toLowerCase() === "aziel";
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



  if (!authChecked) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
        <Text weight="medium" color="gray">Loading portal...</Text>
      </Flex>
    );
  }

  const arrivalProgress = totalExpectedPax ? Math.min(100, Math.round((totalCheckedInPax / totalExpectedPax) * 100)) : 0;

  return (
    <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)", paddingBottom: "80px" }}>
      {!isAuthorized ? (
        <PinLoginModal isOpen={!isAuthorized} onSuccess={() => setIsAuthorized(true)} />
      ) : (
        <>
          {/* Header Bar */}
          <Box style={{ position: "sticky", top: 0, zIndex: 40, backgroundColor: "white", borderBottom: "1px solid var(--gray-5)", boxShadow: "var(--shadow-2)" }}>
            <Container size="4">
              <Flex align="center" justify="between" px="4" py="3" wrap="wrap" gap="3">
                <Flex align="center" gap="3">
                  <img src="/images/logo_icon.png" alt="Logo" style={{ width: 36, height: 36, objectFit: "contain" }} />
                  <Box>
                    <Heading size="3" weight="bold">Reception Portal</Heading>
                    <Text size="1" color="amber" weight="medium">Live Check-In & Seating</Text>
                  </Box>
                </Flex>

                {/* Event Switcher */}
                <Box style={{ flex: "1 1 200px", maxWidth: "400px" }}>
                  <SegmentedControl.Root size="2" value={currentEvent} onValueChange={handleEventChange} style={{ width: "100%" }}>
                    <SegmentedControl.Item value="wedding">Wedding</SegmentedControl.Item>
                    <SegmentedControl.Item value="sangjit">Sangjit</SegmentedControl.Item>
                  </SegmentedControl.Root>
                </Box>

                {/* Action buttons */}
                <Flex align="center" gap="2">
                  <Button variant="soft" color="gray" onClick={handleRefresh} disabled={isPending}>
                    <RefreshCw width={14} height={14} className={isPending ? "animate-spin" : ""} />
                    <Text className="hidden md:inline">Refresh</Text>
                  </Button>
                  <Button variant="soft" color="crimson" onClick={handleLogout}>
                    <LogOut width={14} height={14} />
                    <Text className="hidden md:inline">Lock</Text>
                  </Button>
                </Flex>
              </Flex>
            </Container>
          </Box>

          <Container size="4" p="4" mt="4">
            
            {/* Live Arrival Counter Bar */}
            <Card size="3" mb="5">
              <Flex direction={{ initial: "column", md: "row" }} align={{ initial: "start", md: "center" }} justify="between" gap="5">
                <Flex align="center" gap="4">
                  <Flex align="center" justify="center" style={{ width: 56, height: 56, backgroundColor: "var(--emerald-3)", color: "var(--emerald-11)", borderRadius: "var(--radius-4)" }}>
                    <UserCheck width={28} height={28} />
                  </Flex>
                  <Box>
                    <Flex align="baseline" gap="2">
                      <Heading size="8">{totalCheckedInPax}</Heading>
                      <Text size="3" weight="bold" color="gray">/ {totalExpectedPax} Expected Pax Arrived</Text>
                    </Flex>
                    <Text size="2" color="gray" weight="medium">
                      {checkedInCount} invitations currently checked in at reception
                    </Text>
                  </Box>
                </Flex>

                {/* Progress Bar */}
                <Box style={{ width: "100%", maxWidth: "260px" }}>
                  <Flex justify="between" mb="2">
                    <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Arrival Progress</Text>
                    <Text size="1" weight="bold" color="gray">{arrivalProgress}%</Text>
                  </Flex>
                  <Progress value={arrivalProgress} color="green" size="3" />
                </Box>
              </Flex>
            </Card>

            {/* View Mode Switcher */}
            <Box mb="4">
              <SegmentedControl.Root size="2" value={viewMode} onValueChange={(val: any) => setViewMode(val)} style={{ width: "100%", maxWidth: "400px" }}>
                <SegmentedControl.Item value="guests">
                  <Flex align="center" gap="2"><Users width={14} height={14} style={{ color: "var(--amber-11)" }} /> Guest List</Flex>
                </SegmentedControl.Item>
                {currentEvent === "wedding" && (
                  <SegmentedControl.Item value="map">
                    <Flex align="center" gap="2"><Map width={14} height={14} style={{ color: "var(--blue-11)" }} /> Table Map</Flex>
                  </SegmentedControl.Item>
                )}
                <SegmentedControl.Item value="list">
                  <Flex align="center" gap="2"><List width={14} height={14} style={{ color: "var(--purple-11)" }} /> Table List</Flex>
                </SegmentedControl.Item>
              </SegmentedControl.Root>
            </Box>

            {/* Search Controls Bar */}
            {viewMode === "guests" && (
              <Card size="2" mb="5">
                <Flex direction={{ initial: "column", md: "row" }} align={{ initial: "stretch", md: "center" }} gap="4" style={{ flex: 1, width: "100%" }}>
                    <Box style={{ flex: 1, maxWidth: "400px" }}>
                      <TextField.Root 
                        placeholder="Search guest name or code..."
                        size="3"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      >
                        <TextField.Slot>
                          <Search width={16} height={16} />
                        </TextField.Slot>
                      </TextField.Root>
                    </Box>

                    {/* Filter Tabs */}
                    <Flex align="center" gap="2" style={{ overflowX: "auto", paddingBottom: "4px" }}>
                      {[
                        { id: "all", label: "All Guests", count: roster.length },
                        { id: "groom", label: `${config.groomFirstName || "Groom"}'s`, count: roster.filter(i => {
                            const g = Array.isArray(i.guest) ? i.guest[0] : i.guest;
                            return g?.owner?.toLowerCase() === "groom" || g?.owner?.toLowerCase() === "william";
                          }).length },
                        { id: "bride", label: `${config.brideFirstName || "Bride"}'s`, count: roster.filter(i => {
                            const g = Array.isArray(i.guest) ? i.guest[0] : i.guest;
                            return g?.owner?.toLowerCase() === "bride" || g?.owner?.toLowerCase() === "aziel";
                          }).length },
                        { id: "vip", label: "★ VIP Only", count: roster.filter(i => {
                            const g = Array.isArray(i.guest) ? i.guest[0] : i.guest;
                            return !!g?.notes?.toLowerCase().includes("vip");
                          }).length },
                        { id: "pending", label: "Waiting Check-in", count: roster.filter(i => !i.checked_in_at).length },
                        { id: "checked_in", label: "Checked In", count: roster.filter(i => !!i.checked_in_at).length },
                      ].map(tab => (
                        <Button
                          key={tab.id}
                          variant={filterType === tab.id ? "solid" : "surface"}
                          color={filterType === tab.id ? "gray" : "gray"}
                          size="2"
                          onClick={() => setFilterType(tab.id as any)}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {tab.label}
                          <Badge color={filterType === tab.id ? "amber" : "gray"} variant="solid" size="1">
                            {tab.count}
                          </Badge>
                        </Button>
                      ))}
                    </Flex>
                  </Flex>
              </Card>
            )}

            {/* View Mode 1: Guest List */}
            {viewMode === "guests" && (
              filteredRoster.length === 0 ? (
                <Card size="4" style={{ textAlign: "center", borderStyle: "dashed" }}>
                  <Flex direction="column" align="center" py="6">
                    <Users width={48} height={48} style={{ color: "var(--gray-6)", marginBottom: "16px" }} />
                    <Heading size="4">No matching guests found</Heading>
                    <Text size="2" color="gray" mt="1">Try adjusting your search terms or filter selection.</Text>
                  </Flex>
                </Card>
              ) : (
                <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="4">
                  {filteredRoster.map(inv => (
                    <UsherGuestCard
                      key={inv.id}
                      invitation={inv}
                      onToggleCheckIn={handleToggleCheckIn}
                      onOpenDetails={handleOpenDetails}
                      config={config}
                    />
                  ))}
                </Grid>
              )
            )}

            {/* View Mode 2: Table Map (Read-Only) */}
            {viewMode === "map" && currentEvent === "wedding" && (
              <Card size="4">
                <FloorPlanView
                  tables={currentTables}
                  selectedTableId={selectedTableId}
                  setSelectedTableId={setSelectedTableId}
                  readOnly={true}
                />
              </Card>
            )}

            {/* View Mode 3: Table List (Read-Only Grid) */}
            {viewMode === "list" && (
              <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="4">
                {currentTables.length === 0 ? (
                  <Card size="4" style={{ textAlign: "center", borderStyle: "dashed", gridColumn: "1 / -1" }}>
                    <Text color="gray">No tables initialized for {currentEvent}.</Text>
                  </Card>
                ) : (
                  currentTables.map(table => {
                    const occ = (table.assignments || []).reduce((sum: number, a: any) => sum + (a.assigned_pax || 0), 0);
                    return (
                      <Card
                        key={table.id}
                        size="2"
                        style={{ cursor: "pointer", transition: "border-color 0.2s" }}
                        onClick={() => setSelectedTableId(table.id)}
                        className="hover:border-amber-400"
                      >
                        <Flex align="center" justify="between" mb="4">
                          <Heading size="4">{table.table_name}</Heading>
                          <Badge color="gray" variant="surface" size="2">
                            {occ} / {table.capacity} Pax
                          </Badge>
                        </Flex>
                        <Box mt="3" style={{ borderTop: "1px solid var(--gray-4)", paddingTop: "12px" }}>
                          <Text size="2" weight="bold" color="gray" mb="2" as="div">Assigned Guests ({table.assignments?.length || 0})</Text>
                          {table.assignments?.length ? (
                            <Flex direction="column" gap="2">
                              {table.assignments.slice(0, 4).map((a: any) => (
                                <Flex key={a.id} justify="between" align="center">
                                  <Text size="2" color="gray" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>
                                    • {a.invitation?.guest?.name || "Guest"}
                                  </Text>
                                  <Text size="2" weight="bold" color="gray" style={{ flexShrink: 0 }}>{a.assigned_pax}p</Text>
                                </Flex>
                              ))}
                              {table.assignments.length > 4 && (
                                <Text size="1" weight="bold" color="amber">+ {table.assignments.length - 4} more</Text>
                              )}
                            </Flex>
                          ) : (
                            <Text size="2" color="gray" style={{ fontStyle: "italic" }}>Empty table</Text>
                          )}
                        </Box>
                      </Card>
                    );
                  })
                )}
              </Grid>
            )}

            {/* Read-Only Table Details Modal (when a table is clicked in Map or List) */}
            <Dialog.Root open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTableId(null)}>
              <Dialog.Content style={{ maxWidth: 450 }}>
                {selectedTable && (
                  <>
                    <Flex align="start" justify="between" mb="4">
                      <Box>
                        <Badge color="amber" variant="soft" size="1">Read-Only Roster</Badge>
                        <Dialog.Title mt="2">{selectedTable.table_name}</Dialog.Title>
                      </Box>
                      <Dialog.Close>
                        <IconButton variant="ghost" color="gray">
                          <X width={20} height={20} />
                        </IconButton>
                      </Dialog.Close>
                    </Flex>

                    <Flex align="center" justify="between" p="3" mb="4" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)", border: "1px solid var(--gray-4)" }}>
                      <Text size="2" weight="bold" color="gray">Occupancy</Text>
                      <Text size="2" weight="bold">
                        {(selectedTable.assignments || []).reduce((sum: number, a: any) => sum + (a.assigned_pax || 0), 0)} / {selectedTable.capacity} Pax
                      </Text>
                    </Flex>

                    <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.02em" }}>Seated Guests</Text>
                    
                    <Box mt="2" mb="5">
                      {!(selectedTable.assignments?.length) ? (
                        <Text size="2" color="gray" style={{ fontStyle: "italic", textAlign: "center", display: "block", padding: "16px 0" }}>No guests currently assigned to this table.</Text>
                      ) : (
                        <Flex direction="column" gap="2">
                          {selectedTable.assignments.map((a: any) => {
                            const inv = a.invitation || {};
                            const guest = inv.guest || {};
                            const isCheck = !!inv.checked_in_at;
                            return (
                              <Card key={a.id} size="1" variant="surface">
                                <Flex justify="between" align="center">
                                  <Box>
                                    <Flex align="center" gap="2">
                                      <Text size="2" weight="bold">{guest.name}</Text>
                                      {isCheck && <Check width={14} height={14} style={{ color: "var(--emerald-11)" }} />}
                                    </Flex>
                                    <Text size="1" color="gray">{guest.owner} • {guest.category}</Text>
                                  </Box>
                                  <Badge color="gray" variant="surface" size="2">
                                    {a.assigned_pax} Pax
                                  </Badge>
                                </Flex>
                              </Card>
                            );
                          })}
                        </Flex>
                      )}
                    </Box>

                    <Flex justify="end">
                      <Dialog.Close>
                        <Button variant="solid" color="gray" size="3">Close View</Button>
                      </Dialog.Close>
                    </Flex>
                  </>
                )}
              </Dialog.Content>
            </Dialog.Root>

            {/* Guest Details & VIP Pop Up */}
            <Dialog.Root open={!!detailsModalInv} onOpenChange={(open) => !open && handleOpenDetails(null)}>
              <Dialog.Content style={{ maxWidth: 450 }}>
                {detailsModalInv && (
                  <>
                    <Flex align="start" justify="between" mb="4">
                      <Box>
                        <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.02em" }}>Guest Details</Text>
                        <Dialog.Title mt="1">{detailsModalInv.guest?.name}</Dialog.Title>
                      </Box>
                      <Dialog.Close>
                        <IconButton variant="ghost" color="gray">
                          <X width={20} height={20} />
                        </IconButton>
                      </Dialog.Close>
                    </Flex>

                    <Grid columns="2" gap="3" p="3" mb="4" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)", border: "1px solid var(--gray-4)" }}>
                      <Box>
                        <Text size="1" color="gray" weight="medium" as="div">Owner</Text>
                        <Text size="2" weight="bold">{detailsModalInv.guest?.owner}</Text>
                      </Box>
                      <Box>
                        <Text size="1" color="gray" weight="medium" as="div">Category</Text>
                        <Text size="2" weight="bold">{detailsModalInv.guest?.category}</Text>
                      </Box>
                      <Box>
                        <Text size="1" color="gray" weight="medium" as="div">Expected Pax</Text>
                        <Text size="2" weight="bold">{detailsModalInv.max_pax} Pax</Text>
                      </Box>
                      <Box>
                        <Text size="1" color="gray" weight="medium" as="div">Table Assigned</Text>
                        <Text size="2" weight="bold" style={{ color: "var(--purple-11)" }}>
                          {detailsModalInv.seating_assignment?.[0]?.seating_table?.table_name || "Unassigned"}
                        </Text>
                      </Box>
                    </Grid>

                    {/* VIP Checkbox Option */}
                    <Box p="3" mb="4" style={{ backgroundColor: "var(--amber-3)", border: "1px solid var(--amber-5)", borderRadius: "var(--radius-3)" }}>
                      <Text as="label" size="2">
                        <Flex gap="3" align="center">
                          <Checkbox 
                            size="2" 
                            color="amber"
                            checked={isVip}
                            onCheckedChange={(checked) => setIsVip(!!checked)}
                          />
                          <Text size="2" weight="bold" style={{ color: "var(--amber-12)" }}>★ Mark as VIP Guest</Text>
                        </Flex>
                      </Text>
                    </Box>

                    {/* Notes display */}
                    <Box mb="5">
                      <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.02em" }} as="div" mb="2">
                        Notes
                      </Text>
                      <TextArea 
                        size="2" 
                        placeholder="Add a note for this guest..."
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        style={{ minHeight: "80px", backgroundColor: "var(--gray-2)" }}
                      />
                    </Box>

                    <Flex justify="end">
                      <Dialog.Close>
                        <Button variant="solid" color="gray" size="3">Done</Button>
                      </Dialog.Close>
                    </Flex>
                  </>
                )}
              </Dialog.Content>
            </Dialog.Root>

          </Container>
        </>
      )}
    </Box>
  );
}
