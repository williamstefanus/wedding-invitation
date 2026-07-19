"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit2, Trash2, Check, Copy, RefreshCw, ChevronLeft, ChevronRight, Send, CheckCheck, Link as LinkIcon, MessageCircle } from "lucide-react";
import { bulkDeleteGuests, bulkDeleteInvitations } from "@/lib/actions/guests";
import { Table, Checkbox, Badge, IconButton, Flex, Box, Text, Button } from "@radix-ui/themes";

interface GuestTableProps {
  initialGuests: any[];
  currentTab: string;
  eventTypes: any[];
  totalPages: number;
  currentPage: number;
  isPending: boolean;
  copiedId: string | null;
  openEditModal: (guest: any) => void;
  setSelectedGuest: (guest: any) => void;
  setIsDeleteGuestOpen: (isOpen: boolean) => void;
  setSelectedInv: (inv: any) => void;
  setEditMaxPax: (pax: number) => void;
  setIsEditPaxOpen: (isOpen: boolean) => void;
  setIsRegenerateOpen: (isOpen: boolean) => void;
  setIsDeleteInvOpen: (isOpen: boolean) => void;
  handleCopyLink: (inv: any, guestName?: string, guestPhone?: string) => void;
  handleCopyLinkOnly: (inv: any) => void;
  handleToggleSent: (invId: string, currentStatus: boolean, ownerName: string) => void;
  handlePageChange: (newPage: number) => void;
  config?: any;
}

export function GuestTable({
  initialGuests,
  currentTab,
  eventTypes,
  totalPages,
  currentPage,
  isPending,
  copiedId,
  openEditModal,
  setSelectedGuest,
  setIsDeleteGuestOpen,
  setSelectedInv,
  setEditMaxPax,
  setIsEditPaxOpen,
  setIsRegenerateOpen,
  setIsDeleteInvOpen,
  handleCopyLink,
  handleCopyLinkOnly,
  handleToggleSent,
  handlePageChange,
  config = {}
}: GuestTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const groomName = config.groomFirstName || "William";
  const brideName = config.brideFirstName || "Aziel";

  useEffect(() => {
    setSelectedIds([]);
  }, [currentTab, currentPage]);

  const currentVisibleIds = initialGuests.map(g => {
    if (currentTab === "all") return g.id;
    return g.invitations?.[0]?.id || g.id;
  }).filter(Boolean);

  const allSelected = currentVisibleIds.length > 0 && currentVisibleIds.every(id => selectedIds.includes(id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(Array.from(new Set([...selectedIds, ...currentVisibleIds])));
    } else {
      setSelectedIds(selectedIds.filter(id => !currentVisibleIds.includes(id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const label = currentTab === "all" ? "guest(s)" : "invitation(s)";
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected ${label}? This cannot be undone.`)) {
      return;
    }
    setIsBulkDeleting(true);
    if (currentTab === "all") {
      await bulkDeleteGuests(selectedIds);
    } else {
      await bulkDeleteInvitations(selectedIds);
    }
    setIsBulkDeleting(false);
    setSelectedIds([]);
  };

  return (
    <Box style={{ overflow: "hidden" }}>
      {/* ── Bulk Actions Banner ── */}
      {selectedIds.length > 0 && (
        <Flex align="center" justify="between" px="4" py="3" style={{ backgroundColor: "var(--amber-3)", borderBottom: "1px solid var(--amber-5)" }}>
          <Text size="2" weight="bold" style={{ color: "var(--amber-11)" }}>
            {selectedIds.length} {currentTab === "all" ? "guest(s)" : "invitation(s)"} selected
          </Text>
          <Flex align="center" gap="3">
            <Button variant="ghost" color="gray" size="1" onClick={() => setSelectedIds([])}>
              Clear Selection
            </Button>
            <Button disabled={isBulkDeleting} onClick={handleBulkDelete} color="red" size="1" variant="solid">
              <Trash2 width={14} height={14} />
              {isBulkDeleting ? "Deleting..." : "Delete Selected"}
            </Button>
          </Flex>
        </Flex>
      )}

      <Box style={{ overflowX: "auto" }}>
        <Table.Root variant="ghost" size="2">
          <Table.Header>
            <Table.Row style={{ height: "64px", verticalAlign: "middle" }}>
              <Table.ColumnHeaderCell align="center" width="40px" style={{ verticalAlign: "middle" }}>
                <Checkbox checked={allSelected} onCheckedChange={(checked: boolean) => handleSelectAll(checked)} />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Owner &amp; Category</Table.ColumnHeaderCell>
              {currentTab === "all" ? (
                <>
                  {eventTypes.map(et => (
                    <Table.ColumnHeaderCell key={et.id}>{et.name}</Table.ColumnHeaderCell>
                  ))}
                  <Table.ColumnHeaderCell justify="center">Actions</Table.ColumnHeaderCell>
                </>
              ) : (
                <>
                  <Table.ColumnHeaderCell>Code</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Pax</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>RSVP / Confirmed</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Table</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="center">Sent</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell justify="center">Actions</Table.ColumnHeaderCell>
                </>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {initialGuests.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={currentTab === "all" ? 5 : 9} align="center">
                  <Box py="6">
                    <Text color="gray">No records found matching your criteria.</Text>
                  </Box>
                </Table.Cell>
              </Table.Row>
            ) : (
              initialGuests.map((guest) => {
                const rowId = currentTab === "all" ? guest.id : (guest.invitations?.[0]?.id || guest.id);
                const isChecked = selectedIds.includes(rowId);

                const toggleRow = (checked: boolean) => {
                  if (!checked) setSelectedIds(selectedIds.filter(id => id !== rowId));
                  else setSelectedIds([...selectedIds, rowId]);
                };

                return (
                  <Table.Row key={guest.id} style={{ backgroundColor: isChecked ? "var(--amber-2)" : "transparent", height: "64px", verticalAlign: "middle" }}>
                    <Table.Cell align="center" style={{ verticalAlign: "middle" }}>
                      <Checkbox checked={isChecked} onCheckedChange={(c: boolean) => toggleRow(c)} />
                    </Table.Cell>
                    <Table.RowHeaderCell>
                      <Link href={`/admin/guests/${guest.id}`} style={{ fontWeight: 500, color: "var(--crimson-11)", textDecoration: "none" }}>
                        {guest.name}
                      </Link>
                      {guest.phone && <Text as="div" size="1" color="gray" mt="1">{guest.phone}</Text>}
                    </Table.RowHeaderCell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <Badge color={guest.owner?.toLowerCase() === "groom" || guest.owner?.toLowerCase() === "william" ? "blue" : "pink"} variant="soft">
                          {guest.owner?.toLowerCase() === "groom" || guest.owner?.toLowerCase() === "william" ? groomName : brideName}
                        </Badge>
                        <Text size="1" color="gray">{guest.category}</Text>
                      </Flex>
                    </Table.Cell>

                    {currentTab === "all" ? (
                      <>
                        {eventTypes.map(et => {
                          const inv = guest.invitations?.find((i: any) => i.event_type_id === et.id);
                          if (!inv) return <Table.Cell key={et.id}><Text color="gray">-</Text></Table.Cell>;
                          
                          let rsvp = null;
                          if (inv.rsvp) {
                            rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
                          }

                          let statusDisplay;
                          if (!rsvp) {
                            statusDisplay = <Badge size="2" color="gray" variant="soft">Pending ({inv.max_pax})</Badge>;
                          } else if (rsvp.attendance_status === 'attending') {
                            statusDisplay = <Badge size="2" color="green" variant="soft">Attending ({rsvp.confirmed_pax})</Badge>;
                          } else {
                            statusDisplay = <Badge size="2" color="red" variant="soft">Declined (0)</Badge>;
                          }

                          return (
                            <Table.Cell key={et.id}>
                              {statusDisplay}
                            </Table.Cell>
                          );
                        })}
                        <Table.Cell justify="center" style={{ verticalAlign: "middle" }}>
                          <Flex align="center" justify="center" gap="3">
                            <IconButton variant="ghost" color="gray" onClick={() => openEditModal(guest)}>
                              <Edit2 width={18} height={18} />
                            </IconButton>
                            <IconButton variant="ghost" color="gray" onClick={() => { setSelectedGuest(guest); setIsDeleteGuestOpen(true); }}>
                              <Trash2 width={18} height={18} />
                            </IconButton>
                          </Flex>
                        </Table.Cell>
                      </>
                    ) : (
                      <>{(() => {
                        const inv = guest.invitations?.[0];
                        if (!inv) return <Table.Cell colSpan={6}></Table.Cell>;

                        let rsvp = null;
                        if (inv.rsvp) {
                          rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
                        }

                        return (
                          <>
                            <Table.Cell>
                              <Text size="1" style={{ fontFamily: "monospace" }} color="gray">{inv.invitation_code}</Text>
                            </Table.Cell>
                            <Table.Cell>
                              <Text weight="medium">{inv.max_pax}</Text>
                            </Table.Cell>
                            <Table.Cell style={{ verticalAlign: "middle" }}>
                              {rsvp ? (
                                rsvp.attendance_status === 'attending' ? (
                                  <Badge size="2" color="green" variant="soft">Attending ({rsvp.confirmed_pax})</Badge>
                                ) : (
                                  <Badge size="2" color="red" variant="soft">Declined (0)</Badge>
                                )
                              ) : (
                                <Badge size="2" color="gray" variant="soft">Pending ({inv.max_pax})</Badge>
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              <Text color="gray">{inv.seating_assignment?.[0]?.seating_table?.table_name || "-"}</Text>
                            </Table.Cell>
                            {/* Mark as Sent */}
                            <Table.Cell align="center">
                              <IconButton
                                variant={inv.is_sent ? "soft" : "surface"}
                                color={inv.is_sent ? "amber" : "gray"}
                                onClick={() => handleToggleSent(inv.id, !!inv.is_sent, guest.name)}
                                title={inv.is_sent ? "Mark as unsent" : "Mark as sent"}
                              >
                                {inv.is_sent ? <CheckCheck width={16} height={16} /> : <Send width={16} height={16} />}
                              </IconButton>
                            </Table.Cell>
                            <Table.Cell justify="center" style={{ verticalAlign: "middle" }}>
                              <Flex align="center" justify="center" gap="3">
                                <IconButton variant="ghost" color="gray" onClick={() => handleCopyLinkOnly(inv)} title="Copy Link Only">
                                  {copiedId === inv.id + "_link" ? <Check width={18} height={18} color="var(--green-9)" /> : <LinkIcon width={18} height={18} />}
                                </IconButton>
                                <IconButton variant="ghost" color="gray" onClick={() => handleCopyLink(inv, guest.name, guest.phone)} title="Copy & Send WhatsApp Message">
                                  {copiedId === inv.id + "_wa" ? <Check width={18} height={18} color="var(--green-9)" /> : <MessageCircle width={18} height={18} />}
                                </IconButton>
                                <IconButton variant="ghost" color="gray" onClick={() => { setSelectedGuest(guest); setSelectedInv(inv); setEditMaxPax(inv.max_pax); setIsEditPaxOpen(true); }} title="Edit Max Pax">
                                  <Edit2 width={18} height={18} />
                                </IconButton>
                                <IconButton variant="ghost" color="gray" onClick={() => { setSelectedGuest(guest); setSelectedInv(inv); setIsRegenerateOpen(true); }} title="Regenerate Link">
                                  <RefreshCw width={18} height={18} />
                                </IconButton>
                                <IconButton variant="ghost" color="gray" onClick={() => { setSelectedGuest(guest); setSelectedInv(inv); setIsDeleteInvOpen(true); }} title={`Delete ${inv.event_type.name} Invitation`}>
                                  <Trash2 width={18} height={18} />
                                </IconButton>
                              </Flex>
                            </Table.Cell>
                          </>
                        )
                      })()}</>
                    )}
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Box>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Flex align="center" justify="between" px="2" py="4">
          <Text size="2" color="gray">Page {currentPage} of {totalPages}</Text>
          <Flex gap="2">
            <IconButton variant="surface" color="gray" disabled={currentPage === 1 || isPending} onClick={() => handlePageChange(currentPage - 1)}>
              <ChevronLeft width={16} height={16} />
            </IconButton>
            <IconButton variant="surface" color="gray" disabled={currentPage === totalPages || isPending} onClick={() => handlePageChange(currentPage + 1)}>
              <ChevronRight width={16} height={16} />
            </IconButton>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}
