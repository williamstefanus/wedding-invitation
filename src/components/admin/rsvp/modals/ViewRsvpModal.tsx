"use client";

import { X } from "lucide-react";
import { Dialog, Flex, Box, Text, Button, Callout } from "@radix-ui/themes";

interface ViewRsvpModalProps {
  isViewOpen: boolean;
  setIsViewOpen: (isOpen: boolean) => void;
  selectedInv: any;
  currentRsvp: any;
  isSelectedPending: boolean;
  eventSessions: any[];
}

export function ViewRsvpModal({
  isViewOpen,
  setIsViewOpen,
  selectedInv,
  currentRsvp,
  isSelectedPending,
  eventSessions
}: ViewRsvpModalProps) {
  if (!isViewOpen || !selectedInv) return null;

  return (
    <Dialog.Root open={isViewOpen} onOpenChange={setIsViewOpen}>
      <Dialog.Content size="3" maxWidth="450px">
        <Dialog.Title>RSVP Details</Dialog.Title>

        <Box mt="4">
          <Text size="5" weight="bold" as="div" mb="1">{selectedInv.guest.name}</Text>
          <Text size="2" color="gray" as="div" mb="5">{selectedInv.event_type.name} Invitation</Text>

          {isSelectedPending ? (
            <Callout.Root color="gray" variant="surface">
              <Callout.Text>Guest has not submitted an RSVP yet.</Callout.Text>
            </Callout.Root>
          ) : (
            <Flex direction="column" gap="4">
              <Flex justify="between" pb="3" style={{ borderBottom: "1px solid var(--gray-5)" }}>
                <Text size="2" color="gray">Status</Text>
                <Text size="2" weight="medium" color={currentRsvp?.attendance_status === 'attending' ? 'green' : 'red'}>
                  {currentRsvp?.attendance_status === 'attending' ? 'Attending' : 'Declined'}
                </Text>
              </Flex>
              
              {currentRsvp?.attendance_status === 'attending' && (
                <>
                  <Flex justify="between" pb="3" style={{ borderBottom: "1px solid var(--gray-5)" }}>
                    <Text size="2" color="gray">Confirmed Pax</Text>
                    <Text size="2" weight="medium">{currentRsvp.confirmed_pax} of {selectedInv.max_pax}</Text>
                  </Flex>
                  <Flex direction="column" pb="3" gap="1" style={{ borderBottom: "1px solid var(--gray-5)" }}>
                    <Text size="2" color="gray">Selected Sessions</Text>
                    {currentRsvp.selected_sessions.length > 0 ? (
                      <ul style={{ paddingLeft: "20px", margin: 0 }}>
                        {currentRsvp.selected_sessions.map((ss: any) => {
                          const sObj = eventSessions.find((es: any) => es.id === ss.event_session_id);
                          return (
                            <li key={ss.event_session_id}>
                              <Text size="2" weight="medium">{sObj?.name || 'Unknown Session'}</Text>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <Text size="2" color="gray">None selected</Text>
                    )}
                  </Flex>
                </>
              )}

              <Flex direction="column" gap="2" pt="2">
                <Text size="2" color="gray">Wishes Message</Text>
                <Box p="4" style={{ backgroundColor: "var(--amber-2)", border: "1px solid var(--amber-5)", borderRadius: "var(--radius-3)", minHeight: "80px" }}>
                  {currentRsvp?.wish_message ? (
                    <Text size="2" style={{ fontStyle: "italic", color: "var(--amber-12)" }}>
                      "{currentRsvp.wish_message}"
                    </Text>
                  ) : (
                    <Text size="2" style={{ color: "var(--amber-11)", opacity: 0.5 }}>
                      No message provided.
                    </Text>
                  )}
                </Box>
              </Flex>
              
              <Text size="1" color="gray" align="right" mt="2">
                Submitted: {new Date(currentRsvp?.submitted_at).toLocaleString()}
              </Text>
            </Flex>
          )}
        </Box>

        <Flex justify="end" mt="5">
          <Button variant="soft" color="gray" onClick={() => setIsViewOpen(false)}>
            Close
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
