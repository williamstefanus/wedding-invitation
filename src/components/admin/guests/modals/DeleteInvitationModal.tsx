"use client";

import { Dialog, Button, Flex, Callout } from "@radix-ui/themes";
import { AlertCircle } from "lucide-react";

interface DeleteInvitationModalProps {
  isDeleteInvOpen: boolean;
  setIsDeleteInvOpen: (isOpen: boolean) => void;
  selectedGuest: any;
  selectedInv: any;
  handleDeleteInv: () => void;
  hasInvRsvpData: (inv: any) => boolean;
}

export function DeleteInvitationModal({
  isDeleteInvOpen,
  setIsDeleteInvOpen,
  selectedGuest,
  selectedInv,
  handleDeleteInv,
  hasInvRsvpData
}: DeleteInvitationModalProps) {
  return (
    <Dialog.Root open={isDeleteInvOpen} onOpenChange={setIsDeleteInvOpen}>
      <Dialog.Content maxWidth="400px">
        <Dialog.Title>Delete Invitation?</Dialog.Title>
        
        {selectedGuest?.invitations?.length === 1 ? (
          <Callout.Root color="red" mb="4" size="1">
            <Callout.Icon>
              <AlertCircle size={16} />
            </Callout.Icon>
            <Callout.Text>
              <strong>Crucial Warning:</strong> This is {selectedGuest.name}'s LAST remaining invitation. A guest cannot exist without an invitation. Proceeding will also <strong>delete the master Guest record</strong>.
            </Callout.Text>
          </Callout.Root>
        ) : (
          <>
            <Dialog.Description size="2" mb="4">
              Are you sure you want to delete the {selectedInv?.event_type.name} invitation for {selectedGuest?.name}?
            </Dialog.Description>
            {hasInvRsvpData(selectedInv) && (
              <Callout.Root color="red" mb="4" size="1">
                <Callout.Icon>
                  <AlertCircle size={16} />
                </Callout.Icon>
                <Callout.Text>
                  <strong>Warning:</strong> Active RSVP or Seating data found for this event. It will be lost!
                </Callout.Text>
              </Callout.Root>
            )}
          </>
        )}

        <Flex gap="3" justify="end">
          <Button variant="soft" color="gray" onClick={() => setIsDeleteInvOpen(false)}>
            Cancel
          </Button>
          <Button variant="solid" color="red" onClick={handleDeleteInv}>
            Yes, Delete
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
