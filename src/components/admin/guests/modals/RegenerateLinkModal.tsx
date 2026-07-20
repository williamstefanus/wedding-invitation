"use client";

import { Dialog, Button, Flex, Callout } from "@radix-ui/themes";


interface RegenerateLinkModalProps {
  isRegenerateOpen: boolean;
  setIsRegenerateOpen: (isOpen: boolean) => void;
  handleRegenerate: () => void;
}

export function RegenerateLinkModal({
  isRegenerateOpen,
  setIsRegenerateOpen,
  handleRegenerate
}: RegenerateLinkModalProps) {
  return (
    <Dialog.Root open={isRegenerateOpen} onOpenChange={setIsRegenerateOpen}>
      <Dialog.Content maxWidth="400px">
        <Dialog.Title>Regenerate Link?</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          This creates a new code. <strong>The old link will immediately stop working.</strong>
        </Dialog.Description>
        
        <Flex gap="3" justify="end">
          <Button variant="soft" color="gray" onClick={() => setIsRegenerateOpen(false)}>
            Cancel
          </Button>
          <Button variant="solid" color="amber" onClick={handleRegenerate}>
            Regenerate
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
