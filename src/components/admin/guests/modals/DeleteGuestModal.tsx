"use client";

import { Dialog, Button, Flex, Callout } from "@radix-ui/themes";
import { AlertCircle } from "lucide-react";

interface DeleteGuestModalProps {
  isDeleteGuestOpen: boolean;
  setIsDeleteGuestOpen: (isOpen: boolean) => void;
  selectedGuest: any;
  handleDeleteGuest: () => void;
  hasRsvpData: (guest: any) => boolean;
}

export function DeleteGuestModal({
  isDeleteGuestOpen,
  setIsDeleteGuestOpen,
  selectedGuest,
  handleDeleteGuest,
  hasRsvpData
}: DeleteGuestModalProps) {
  return (
    <Dialog.Root open={isDeleteGuestOpen} onOpenChange={setIsDeleteGuestOpen}>
      <Dialog.Content maxWidth="400px">
        <Dialog.Title>Delete Master Guest?</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Are you sure you want to delete {selectedGuest?.name}? This deletes ALL of their invitations.
        </Dialog.Description>
        
        {hasRsvpData(selectedGuest) && (
          <Callout.Root color="red" mb="4" size="1">
            <Callout.Icon>
              <AlertCircle size={16} />
            </Callout.Icon>
            <Callout.Text>
              <strong>Warning:</strong> This guest has submitted RSVP data. Deleting them will permanently erase all RSVP and seating records!
            </Callout.Text>
          </Callout.Root>
        )}

        <Flex gap="3" justify="end">
          <Button variant="soft" color="gray" onClick={() => setIsDeleteGuestOpen(false)}>
            Cancel
          </Button>
          <Button variant="solid" color="red" onClick={handleDeleteGuest}>
            Yes, Delete
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
