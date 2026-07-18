"use client";

import { X, Search, ChevronRight } from "lucide-react";
import { Dialog, Flex, Box, Text, TextField, Select, Card, Button, Badge } from "@radix-ui/themes";

interface AssignGuestModalProps {
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (isOpen: boolean) => void;
  selectedTable: any;
  currentSearch: string;
  currentOwner: string;
  currentCategory: string;
  updateUrl: (updates: Record<string, string | null>) => void;
  initialEligibleGuests: any[];
  handleAssignGuest: (invitation: any) => void;
}

export function AssignGuestModal({
  isSearchModalOpen,
  setIsSearchModalOpen,
  selectedTable,
  currentSearch,
  currentOwner,
  currentCategory,
  updateUrl,
  initialEligibleGuests,
  handleAssignGuest
}: AssignGuestModalProps) {
  if (!isSearchModalOpen || !selectedTable) return null;

  return (
    <Dialog.Root open={isSearchModalOpen} onOpenChange={(open) => {
      if (!open) {
        setIsSearchModalOpen(false);
        updateUrl({ guestSearch: null, guestOwner: null, guestCategory: null });
      }
    }}>
      <Dialog.Content size="3" maxWidth="600px" className="animate-fade-up">
        <Dialog.Title mb="4">
          Assign to {selectedTable?.table_name}
        </Dialog.Title>

        {/* Filters Bar */}
        <Flex direction={{ initial: "column", sm: "row" }} gap="3" pb="4" mb="4" style={{ borderBottom: "1px solid var(--gray-5)" }}>
          <Box style={{ flex: 1 }}>
            <TextField.Root 
              placeholder="Search attending guests..." 
              defaultValue={currentSearch}
              onChange={(e) => updateUrl({ guestSearch: e.target.value })}
            >
              <TextField.Slot>
                <Search className="w-4 h-4" />
              </TextField.Slot>
            </TextField.Root>
          </Box>
          <Select.Root value={currentOwner || "All"} onValueChange={(val) => updateUrl({ guestOwner: val })}>
            <Select.Trigger style={{ minWidth: "120px" }} />
            <Select.Content>
              <Select.Item value="All">All Owners</Select.Item>
              <Select.Item value="groom">William</Select.Item>
              <Select.Item value="bride">Aziel</Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root value={currentCategory || "All"} onValueChange={(val) => updateUrl({ guestCategory: val })}>
            <Select.Trigger style={{ minWidth: "140px" }} />
            <Select.Content>
              <Select.Item value="All">All Categories</Select.Item>
              <Select.Item value="Relatives">Relatives</Select.Item>
              <Select.Item value="Friends">Friends</Select.Item>
              <Select.Item value="Church">Church</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>

        {/* Results List */}
        <Box p="4" style={{ backgroundColor: "var(--gray-2)", maxHeight: "50vh", overflowY: "auto" }}>
          {initialEligibleGuests.length === 0 ? (
            <Box py="9" style={{ textAlign: "center" }}>
              <Flex align="center" justify="center" style={{ width: "64px", height: "64px", backgroundColor: "white", borderRadius: "50%", margin: "0 auto 16px", border: "1px solid var(--gray-5)" }}>
                <Search className="w-6 h-6 text-slate-300" />
              </Flex>
              <Text as="div" weight="medium" size="3" mb="2">No eligible guests found.</Text>
              <Text as="p" size="2" color="gray" style={{ maxWidth: "300px", margin: "0 auto" }}>
                Only guests who have RSVP'd as "Attending" and are not yet assigned to a table will appear here.
              </Text>
            </Box>
          ) : (
            <Flex direction="column" gap="2">
              {initialEligibleGuests.map((inv: any) => (
                <Card key={inv.id} className="group hover:border-amber-300 transition" style={{ cursor: "pointer" }} onClick={() => handleAssignGuest(inv)}>
                  <Flex justify="between" align="center">
                    <Box>
                      <Text as="div" weight="bold" size="2">{inv.guest.name}</Text>
                      <Text as="div" size="1" color="gray" mt="1">{inv.guest.owner} • {inv.guest.category}</Text>
                    </Box>
                    <Flex align="center" gap="4">
                      <Badge color="amber" variant="soft" size="2">
                        {inv.rsvp.confirmed_pax} pax
                      </Badge>
                      <Button size="2" variant="ghost" color="gray" style={{ cursor: "pointer" }}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Flex>
          )}
        </Box>

        <Flex justify="end" p="4" style={{ borderTop: "1px solid var(--gray-5)" }}>
          <Dialog.Close>
            <Button variant="soft" color="gray" style={{ cursor: "pointer" }}>Close</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
