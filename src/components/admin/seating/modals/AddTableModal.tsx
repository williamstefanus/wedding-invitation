"use client";

import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { Dialog, Button, Flex, Box, Text, TextField, Badge } from "@radix-ui/themes";

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tableName?: string, capacity?: number) => Promise<void>;
}

export function AddTableModal({ isOpen, onClose, onAdd }: AddTableModalProps) {
  const [tableName, setTableName] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd(tableName.trim() || undefined, capacity);
      setTableName("");
      setCapacity(10);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content size="3" maxWidth="450px" className="animate-fade-up">
        <Dialog.Title>
          <Flex align="center" gap="2">
            <Box p="1" style={{ backgroundColor: "var(--amber-3)", color: "var(--amber-11)", borderRadius: "var(--radius-2)" }}>
              <Plus className="w-4 h-4" />
            </Box>
            Add New Table
          </Flex>
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Fill in the details to create a new seating table.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <Box p="2" style={{ backgroundColor: "var(--amber-3)", borderRadius: "var(--radius-2)", border: "1px solid var(--amber-5)" }}>
              <Flex justify="between" align="center">
                <Text size="1" weight="bold" color="amber">Table Number</Text>
                <Badge color="amber" variant="solid" size="1">Auto-Generated (Sequential)</Badge>
              </Flex>
            </Box>

            <Box>
              <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Table Name <Text color="gray" weight="regular">(Optional)</Text>
              </Text>
              <TextField.Root 
                placeholder="e.g. VIP Family, Bride Friends" 
                value={tableName}
                onChange={e => setTableName(e.target.value)}
                disabled={loading}
              />
            </Box>

            <Box>
              <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Seating Capacity
              </Text>
              <TextField.Root 
                type="number" 
                min="1"
                max="50"
                value={capacity}
                onChange={e => setCapacity(parseInt(e.target.value) || 1)}
                disabled={loading}
                required
              />
            </Box>
          </Flex>

          <Flex justify="end" gap="3" mt="5">
            <Button variant="soft" color="gray" onClick={onClose} disabled={loading} style={{ cursor: "pointer" }}>
              Cancel
            </Button>
            <Button type="submit" color="red" disabled={loading} style={{ cursor: "pointer" }}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Table
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
