"use client";

import { X, Edit2, Trash2, Plus, MapPin } from "lucide-react";
import { unassignTableMapPosition } from "@/lib/actions/seating";
import { Box, Flex, Text, Heading, Button, Badge, ScrollArea, IconButton } from "@radix-ui/themes";

interface SeatingSidebarProps {
  selectedTableId: string | null;
  selectedTable: any;
  setSelectedTableId: (id: string | null) => void;
  setNewCapacity: (cap: number) => void;
  setEditTableName?: (name: string) => void;
  setIsCapacityModalOpen: (isOpen: boolean) => void;
  setIsSearchModalOpen: (isOpen: boolean) => void;
  handleRemoveGuest: (assignmentId: string) => void;
  handleDeleteTable?: (tableId: string) => void;
}

export function SeatingSidebar({
  selectedTableId,
  selectedTable,
  setSelectedTableId,
  setNewCapacity,
  setEditTableName,
  setIsCapacityModalOpen,
  setIsSearchModalOpen,
  handleRemoveGuest,
  handleDeleteTable
}: SeatingSidebarProps) {
  return (
    <div 
      className={`fixed top-0 md:top-[64px] right-0 h-full md:h-[calc(100vh-64px)] w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out z-50 xl:z-20 flex flex-col
      ${selectedTableId ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {selectedTable && (
        <Flex direction="column" height="100%">
          {/* Sidebar Header */}
          <Box p="5" style={{ borderBottom: "1px solid var(--gray-5)", backgroundColor: "var(--gray-2)" }}>
            <Flex justify="between" align="start">
              <Box>
                <Badge color="amber" variant="soft" mb="2">
                  Table #{selectedTable.sort_order || 1}
                </Badge>
                <Heading size="5">{selectedTable.table_name}</Heading>
                <Flex align="center" gap="2" mt="2">
                  <Text size="2" color="gray" weight="medium">
                    Capacity: {selectedTable.capacity}
                  </Text>
                  <IconButton 
                    size="1" 
                    variant="ghost" 
                    color="amber"
                    style={{ cursor: "pointer" }}
                    onClick={() => { 
                      setNewCapacity(selectedTable.capacity); 
                      if (setEditTableName) setEditTableName(selectedTable.table_name); 
                      setIsCapacityModalOpen(true); 
                    }}
                  >
                    <Edit2 className="w-3 h-3" />
                  </IconButton>
                </Flex>
              </Box>
              <IconButton size="2" variant="ghost" color="gray" onClick={() => setSelectedTableId(null)} radius="full" style={{ cursor: "pointer" }}>
                <X className="w-4 h-4" />
              </IconButton>
            </Flex>
          </Box>

          {/* Sidebar Content */}
          <ScrollArea style={{ flex: 1, padding: "var(--space-5)" }}>
            <Flex justify="between" align="center" mb="4">
              <Text weight="bold" size="3">Assigned Guests</Text>
              <Badge color="gray" variant="soft">
                {selectedTable.assignments.reduce((sum: number, a: any) => sum + a.assigned_pax, 0)} / {selectedTable.capacity}
              </Badge>
            </Flex>

            {selectedTable.assignments.length === 0 ? (
              <Box p="6" style={{ textAlign: "center", backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)", border: "1px dashed var(--gray-5)" }}>
                <Text size="2" color="gray">No guests assigned to this table yet.</Text>
              </Box>
            ) : (
              <Flex direction="column" gap="3">
                {selectedTable.assignments.map((assignment: any) => (
                  <Box key={assignment.id} p="3" style={{ backgroundColor: "white", border: "1px solid var(--gray-5)", borderRadius: "var(--radius-3)", boxShadow: "var(--shadow-1)" }} className="group hover:border-amber-200 transition">
                    <Flex justify="between" align="start">
                      <Box>
                        <Text as="div" weight="bold" size="2" style={{ lineHeight: 1.2 }}>{assignment.invitation.guest.name}</Text>
                        <Text as="div" size="1" color="gray" mt="1">{assignment.invitation.guest.owner} • {assignment.invitation.guest.category}</Text>
                      </Box>
                      <Badge color="amber" variant="soft">
                        {assignment.assigned_pax} pax
                      </Badge>
                    </Flex>
                    <Flex justify="end" mt="3" pt="3" style={{ borderTop: "1px solid var(--gray-3)" }}>
                      <Button size="1" variant="ghost" color="red" onClick={() => handleRemoveGuest(assignment.id)} style={{ cursor: "pointer" }}>
                        <Trash2 className="w-3 h-3" /> Remove
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            )}
          </ScrollArea>

          {/* Sidebar Footer */}
          <Box p="5" style={{ borderTop: "1px solid var(--gray-5)", backgroundColor: "white" }}>
            <Flex direction="column" gap="3">
              <Button size="3" variant="solid" color="gray" highContrast onClick={() => setIsSearchModalOpen(true)} style={{ width: "100%", cursor: "pointer" }}>
                <Plus className="w-4 h-4" /> Add Guest to Table
              </Button>
              {selectedTable.sort_order >= 1 && selectedTable.sort_order <= 26 && (
                <Button size="3" variant="outline" color="crimson" onClick={async () => {
                  if (!confirm(`Remove ${selectedTable.table_name} from the floor plan map? (Guests will remain assigned to the table)`)) return;
                  await unassignTableMapPosition(selectedTable.id);
                  setSelectedTableId(null);
                }} style={{ width: "100%", cursor: "pointer" }}>
                  <MapPin className="w-4 h-4" /> Remove from Floor Map
                </Button>
              )}
              {handleDeleteTable && (
                <Button size="3" variant="outline" color="red" onClick={() => handleDeleteTable(selectedTable.id)} style={{ width: "100%", cursor: "pointer" }}>
                  <Trash2 className="w-4 h-4" /> Delete Table
                </Button>
              )}
            </Flex>
          </Box>
        </Flex>
      )}
    </div>
  );
}
