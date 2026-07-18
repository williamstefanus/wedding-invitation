"use client";

import { X } from "lucide-react";
import { Dialog, Flex, Box, Text, TextField, Button, Badge } from "@radix-ui/themes";

interface EditCapacityModalProps {
  isCapacityModalOpen: boolean;
  setIsCapacityModalOpen: (isOpen: boolean) => void;
  selectedTable: any;
  newCapacity: number;
  setNewCapacity: (cap: number) => void;
  editTableName?: string;
  setEditTableName?: (name: string) => void;
  handleUpdateCapacity: (e: React.FormEvent) => void;
}

export function EditCapacityModal({
  isCapacityModalOpen,
  setIsCapacityModalOpen,
  selectedTable,
  newCapacity,
  setNewCapacity,
  editTableName = "",
  setEditTableName,
  handleUpdateCapacity
}: EditCapacityModalProps) {
  if (!isCapacityModalOpen || !selectedTable) return null;

  return (
    <Dialog.Root open={isCapacityModalOpen} onOpenChange={(open) => !open && setIsCapacityModalOpen(false)}>
      <Dialog.Content size="3" maxWidth="400px">
        <Dialog.Title>
          <Badge color="amber" variant="soft" size="1" mb="2">
            Table #{selectedTable?.sort_order || 1}
          </Badge>
          <Box>Edit Table Details</Box>
        </Dialog.Title>

        <form onSubmit={handleUpdateCapacity}>
          <Flex direction="column" gap="4" mt="4">
            {setEditTableName && (
              <Box>
                <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Table Name <Text color="gray" weight="regular">(Optional)</Text>
                </Text>
                <TextField.Root 
                  placeholder="e.g. VIP Family (Optional)"
                  value={editTableName}
                  onChange={e => setEditTableName(e.target.value)}
                />
              </Box>
            )}
            <Box>
              <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Seating Capacity (Pax)
              </Text>
              <TextField.Root 
                type="number" 
                min="1"
                value={newCapacity}
                onChange={e => setNewCapacity(parseInt(e.target.value) || 1)}
                required
              />
            </Box>
          </Flex>

          <Flex justify="end" gap="3" mt="5">
            <Button type="button" variant="soft" color="gray" onClick={() => setIsCapacityModalOpen(false)} style={{ cursor: "pointer" }}>
              Cancel
            </Button>
            <Button type="submit" color="crimson" style={{ cursor: "pointer" }}>
              Save Changes
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
