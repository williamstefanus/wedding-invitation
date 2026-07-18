"use client";

import { Trash2 } from "lucide-react";
import { Dialog, Flex, Box, Text, Button, Callout } from "@radix-ui/themes";

interface ResetRsvpModalProps {
  isResetOpen: boolean;
  setIsResetOpen: (isOpen: boolean) => void;
  selectedInv: any;
  handleReset: () => void;
}

export function ResetRsvpModal({
  isResetOpen,
  setIsResetOpen,
  selectedInv,
  handleReset
}: ResetRsvpModalProps) {
  if (!isResetOpen || !selectedInv) return null;

  return (
    <Dialog.Root open={isResetOpen} onOpenChange={setIsResetOpen}>
      <Dialog.Content size="3" maxWidth="400px">
        <Dialog.Title>Reset RSVP?</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          This will completely wipe the RSVP record for {selectedInv.guest.name}, returning the invitation to <Text weight="bold">Pending</Text>.
        </Dialog.Description>

        {selectedInv?.seating_assignment && (
          <Callout.Root color="red" variant="surface" mb="4">
            <Callout.Text>
              <strong>Warning:</strong> This will also wipe their seating assignment.
            </Callout.Text>
          </Callout.Root>
        )}

        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="gray" onClick={() => setIsResetOpen(false)}>
            Cancel
          </Button>
          <Button variant="solid" color="red" onClick={handleReset}>
            Yes, Reset
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
