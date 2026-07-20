"use client";

import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";

interface EditPaxModalProps {
  isEditPaxOpen: boolean;
  setIsEditPaxOpen: (isOpen: boolean) => void;
  editMaxPax: number;
  setEditMaxPax: (pax: number) => void;
  handleEditPaxSubmit: (e: React.FormEvent) => void;
}

export function EditPaxModal({
  isEditPaxOpen,
  setIsEditPaxOpen,
  editMaxPax,
  setEditMaxPax,
  handleEditPaxSubmit
}: EditPaxModalProps) {
  return (
    <Dialog.Root open={isEditPaxOpen} onOpenChange={setIsEditPaxOpen}>
      <Dialog.Content maxWidth="400px">
        <Dialog.Title>Edit Max Pax</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Update the maximum number of guests allowed for this invitation.
        </Dialog.Description>
        
        <form onSubmit={handleEditPaxSubmit}>
          <Box mb="4">
            <Text as="div" size="2" mb="1" weight="medium">
              Max Pax allowed
            </Text>
            <TextField.Root 
              required 
              type="number" 
              min="1" 
              value={editMaxPax} 
              onChange={e => setEditMaxPax(parseInt(e.target.value) || 1)} 
            />
          </Box>

          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" type="button" onClick={() => setIsEditPaxOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" color="amber" type="submit">
              Save
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
