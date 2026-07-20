"use client";

import { X } from "lucide-react";
import { Dialog, Flex, Box, Text, Button, Select, TextField, Checkbox, Callout } from "@radix-ui/themes";

interface EditRsvpModalProps {
  isEditOpen: boolean;
  setIsEditOpen: (isOpen: boolean) => void;
  selectedInv: any;
  editStatus: string;
  setEditStatus: (status: string) => void;
  editPax: number;
  setEditPax: (pax: number) => void;
  editSelectedSessions: string[];
  setEditSelectedSessions: (sessions: string[]) => void;
  eventSessions: any[];
  handleEditSubmit: (e: React.FormEvent) => void;
}

export function EditRsvpModal({
  isEditOpen,
  setIsEditOpen,
  selectedInv,
  editStatus,
  setEditStatus,
  editPax,
  setEditPax,
  editSelectedSessions,
  setEditSelectedSessions,
  eventSessions,
  handleEditSubmit
}: EditRsvpModalProps) {
  if (!isEditOpen || !selectedInv) return null;

  return (
    <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
      <Dialog.Content size="3" maxWidth="450px">
        <Dialog.Title>Edit RSVP for {selectedInv.guest.name}</Dialog.Title>

        <form onSubmit={handleEditSubmit} id="edit-rsvp-form">
          <Flex direction="column" gap="4" mt="4">
            
            <Box>
              <Text as="div" size="2" mb="1" weight="medium">Status</Text>
              <Select.Root 
                value={editStatus}
                onValueChange={(val) => {
                  setEditStatus(val);
                  if (val === 'not_attending') {
                    setEditPax(0);
                    setEditSelectedSessions([]);
                  } else if (val === 'attending' && editPax === 0) {
                    setEditPax(1);
                  }
                }}
              >
                <Select.Trigger style={{ width: "100%" }} />
                <Select.Content>
                  <Select.Item value="pending">Pending</Select.Item>
                  <Select.Item value="attending">Attending</Select.Item>
                  <Select.Item value="not_attending">Declined</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            {editStatus === 'attending' && (
              <>
                <Box>
                  <Text as="div" size="2" mb="1" weight="medium">Confirmed Pax (Max: {selectedInv.max_pax})</Text>
                  <TextField.Root 
                    type="number" 
                    min="1"
                    max={selectedInv.max_pax}
                    value={editPax}
                    onChange={(e) => setEditPax(parseInt(e.target.value) || 1)}
                  />
                </Box>
                <Box>
                  <Text as="div" size="2" mb="2" weight="medium">Selected Sessions</Text>
                  <Flex direction="column" gap="2">
                    {eventSessions
                      .filter((s: any) => s.event_type_id === selectedInv.event_type_id)
                      .map((session: any) => (
                      <Text as="label" size="2" key={session.id} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                        <Checkbox 
                          checked={editSelectedSessions.includes(session.id)}
                          onCheckedChange={(c) => {
                            if (c === true) {
                              setEditSelectedSessions([...editSelectedSessions, session.id]);
                            } else {
                              setEditSelectedSessions(editSelectedSessions.filter(id => id !== session.id));
                            }
                          }}
                          color="red"
                        />
                        {session.name}
                      </Text>
                    ))}
                  </Flex>
                </Box>
              </>
            )}

            {editStatus === 'not_attending' && selectedInv.seating_assignment && (
              <Callout.Root color="red" variant="surface">
                <Callout.Text>
                  <strong>Warning:</strong> Saving this will remove the guest's seating assignment.
                </Callout.Text>
              </Callout.Root>
            )}

            <Flex justify="end" gap="3" mt="4">
              <Button type="button" variant="soft" color="gray" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" color="red">
                Save Changes
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
