"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { bulkResetRsvps, bulkDeleteRsvpInvitations } from "@/lib/actions/adminRsvp";
import { Table, Checkbox, Badge, IconButton, Flex, Box, Text, Button } from "@radix-ui/themes";

interface RsvpTableProps {
  initialInvitations: any[];
  totalPages: number;
  currentPage: number;
  isPending: boolean;
  openViewModal: (inv: any) => void;
  openEditModal: (inv: any) => void;
  openResetModal: (inv: any) => void;
  handlePageChange: (newPage: number) => void;
}

export function RsvpTable({
  initialInvitations,
  totalPages,
  currentPage,
  isPending,
  openViewModal,
  openEditModal,
  openResetModal,
  handlePageChange
}: RsvpTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  useEffect(() => {
    setSelectedIds([]);
  }, [currentPage]);

  const currentVisibleIds = initialInvitations.map(inv => inv.id).filter(Boolean);
  const allSelected = currentVisibleIds.length > 0 && currentVisibleIds.every(id => selectedIds.includes(id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(Array.from(new Set([...selectedIds, ...currentVisibleIds])));
    } else {
      setSelectedIds(selectedIds.filter(id => !currentVisibleIds.includes(id)));
    }
  };

  const handleBulkReset = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to reset RSVPs for ${selectedIds.length} selected invitation(s)? This will clear their RSVP responses and seating assignments.`)) {
      return;
    }
    setIsBulkProcessing(true);
    await bulkResetRsvps(selectedIds);
    setIsBulkProcessing(false);
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected invitation(s)? This cannot be undone.`)) {
      return;
    }
    setIsBulkProcessing(true);
    await bulkDeleteRsvpInvitations(selectedIds);
    setIsBulkProcessing(false);
    setSelectedIds([]);
  };

  return (
    <Box style={{ overflow: "hidden" }}>
      {/* ── Bulk Actions Banner ── */}
      {selectedIds.length > 0 && (
        <Flex align="center" justify="between" px="4" py="3" style={{ backgroundColor: "var(--amber-3)", borderBottom: "1px solid var(--amber-5)" }}>
          <Text size="2" weight="bold" style={{ color: "var(--amber-11)" }}>
            {selectedIds.length} invitation(s) selected
          </Text>
          <Flex align="center" gap="3">
            <Button variant="ghost" color="gray" size="1" onClick={() => setSelectedIds([])}>
              Clear Selection
            </Button>
            <Button disabled={isBulkProcessing} onClick={handleBulkReset} color="amber" size="1" variant="solid">
              <Trash2 width={14} height={14} />
              {isBulkProcessing ? "Processing..." : "Reset RSVPs"}
            </Button>
            <Button disabled={isBulkProcessing} onClick={handleBulkDelete} color="red" size="1" variant="solid">
              <Trash2 width={14} height={14} />
              {isBulkProcessing ? "Processing..." : "Delete Invitations"}
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
              <Table.ColumnHeaderCell>Guest Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Event</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Owner / Cat</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Pax</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Submitted</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Table</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="center">Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {initialInvitations.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={9} align="center">
                  <Box py="6">
                    <Text color="gray">No RSVP records found.</Text>
                  </Box>
                </Table.Cell>
              </Table.Row>
            ) : (
              initialInvitations.map((inv: any) => {
                let rsvp = null;
                if (Array.isArray(inv.rsvp)) {
                  if (inv.rsvp.length > 0) rsvp = inv.rsvp[0];
                } else if (inv.rsvp) {
                  rsvp = inv.rsvp;
                }
                const isPend = !rsvp;
                const isChecked = selectedIds.includes(inv.id);

                const toggleRow = (checked: boolean) => {
                  if (!checked) setSelectedIds(selectedIds.filter(id => id !== inv.id));
                  else setSelectedIds([...selectedIds, inv.id]);
                };
                
                return (
                  <Table.Row key={inv.id} style={{ backgroundColor: isChecked ? "var(--amber-2)" : "transparent", height: "64px", verticalAlign: "middle" }}>
                    <Table.Cell align="center" style={{ verticalAlign: "middle" }}>
                      <Checkbox checked={isChecked} onCheckedChange={(c: boolean) => toggleRow(c)} />
                    </Table.Cell>
                    <Table.RowHeaderCell>
                      <button 
                        onClick={() => openViewModal(inv)}
                        className="font-medium text-[var(--crimson-11)] hover:underline text-left bg-transparent border-none p-0 cursor-pointer"
                        style={{ fontSize: "var(--font-size-2)" }}
                      >
                        {inv.guest.name}
                      </button>
                    </Table.RowHeaderCell>
                    <Table.Cell>
                      <Text color="gray">{inv.event_type.name}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex direction="column">
                        <Text>{inv.guest.owner}</Text>
                        <Text size="1" color="gray">{inv.guest.category}</Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell style={{ verticalAlign: "middle" }}>
                      {isPend ? (
                        <Badge size="2" color="gray" variant="soft">Pending</Badge>
                      ) : rsvp.attendance_status === 'attending' ? (
                        <Badge size="2" color="green" variant="soft">Attending</Badge>
                      ) : (
                        <Badge size="2" color="red" variant="soft">Declined</Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{isPend ? "-" : `${rsvp.confirmed_pax} / ${inv.max_pax}`}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="1" color="gray">{isPend ? "-" : new Date(rsvp.submitted_at).toLocaleDateString()}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text color="gray">{inv.seating_assignment?.seating_table?.table_name || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell justify="center" style={{ verticalAlign: "middle" }}>
                      <Flex align="center" justify="center" gap="3">
                        <IconButton variant="ghost" color="gray" onClick={() => openEditModal(inv)} title="Edit RSVP">
                          <Edit2 width={18} height={18} />
                        </IconButton>
                        <IconButton variant="ghost" color="gray" onClick={() => openResetModal(inv)} title="Reset RSVP">
                          <Trash2 width={18} height={18} />
                        </IconButton>
                      </Flex>
                    </Table.Cell>
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
