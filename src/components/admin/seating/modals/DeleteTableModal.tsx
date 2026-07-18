"use client";

import { useState } from "react";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Dialog, Button, Flex, Box, Text, Callout } from "@radix-ui/themes";

interface DeleteTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: any;
  onDelete: (tableId: string) => Promise<{ success: boolean; error?: string }>;
}

export function DeleteTableModal({ isOpen, onClose, table, onDelete }: DeleteTableModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !table) return null;

  const handleDelete = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await onDelete(table.id);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to delete table.");
      } else {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content size="3" maxWidth="400px">
        <Dialog.Title>
          <Flex align="center" gap="2">
            <Box p="1" style={{ backgroundColor: "var(--red-3)", color: "var(--red-11)", borderRadius: "var(--radius-2)" }}>
              <Trash2 className="w-4 h-4" />
            </Box>
            Delete Table
          </Flex>
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Are you sure you want to delete <Text weight="bold">{table.table_name}</Text>?
        </Dialog.Description>

        <Flex direction="column" gap="4">
          {table.assignments && table.assignments.length > 0 && (
            <Callout.Root color="amber">
              <Callout.Icon>
                <AlertTriangle className="w-4 h-4" />
              </Callout.Icon>
              <Callout.Text>
                This table currently has assigned guests. You must remove or reassign them before deleting.
              </Callout.Text>
            </Callout.Root>
          )}

          {errorMsg && (
            <Callout.Root color="red">
              <Callout.Text>{errorMsg}</Callout.Text>
            </Callout.Root>
          )}
        </Flex>

        <Flex justify="end" gap="3" mt="5">
          <Button variant="soft" color="gray" onClick={onClose} disabled={loading} style={{ cursor: "pointer" }}>
            Cancel
          </Button>
          <Button 
            color="red" 
            onClick={handleDelete}
            disabled={loading || (table.assignments && table.assignments.length > 0)}
            style={{ cursor: "pointer" }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete Table
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
