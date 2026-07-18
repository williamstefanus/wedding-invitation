"use client";

import { X } from "lucide-react";
import type { GuestCategory, GuestOwner } from "@/types";
import { Dialog, Flex, Box, Text, TextField, Button, Select, Grid, Checkbox } from "@radix-ui/themes";

interface GuestFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedGuest: any;
  formData: {
    name: string;
    phone: string;
    owner: GuestOwner;
    category: GuestCategory;
    notes: string;
  };
  setFormData: (data: any) => void;
  eventTypes: any[];
  invitationsForm: any;
  setInvitationsForm: (data: any) => void;
  formError: string;
  handleSave: (e: React.FormEvent) => void;
  config?: any;
}

export function GuestFormModal({
  isModalOpen,
  setIsModalOpen,
  selectedGuest,
  formData,
  setFormData,
  eventTypes,
  invitationsForm,
  setInvitationsForm,
  formError,
  handleSave,
  config = {}
}: GuestFormModalProps) {
  const groomName = config.groomFirstName || "John";
  const brideName = config.brideFirstName || "Jane";

  if (!isModalOpen) return null;

  const isVip = !!formData.notes?.toLowerCase().includes("vip");
  const handleVipToggle = (checked: boolean) => {
    let currentNotes = formData.notes || "";
    if (checked) {
      if (!currentNotes.toLowerCase().includes("vip")) {
        currentNotes = currentNotes ? `[VIP] ${currentNotes}` : "[VIP]";
      }
    } else {
      currentNotes = currentNotes.replace(/\[?vip\]?/gi, "").replace(/\s+/g, " ").trim();
    }
    setFormData({ ...formData, notes: currentNotes });
  };

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Content size="3" maxWidth="500px">
        <Dialog.Title>{selectedGuest ? 'Edit Guest & Invitations' : 'Add Guest'}</Dialog.Title>

        <Box style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "4px" }}>
          <form id="guest-form" onSubmit={handleSave}>
            <Flex direction="column" gap="4">
              
              {/* 1. Guest Details */}
              <Box>
                <Flex align="center" justify="between" mb="3">
                  <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }} as="div">
                    1. Guest Details
                  </Text>
                  <Text as="label" size="1" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 8px", backgroundColor: "var(--amber-3)", border: "1px solid var(--amber-5)", borderRadius: "var(--radius-3)", cursor: "pointer", transition: "all 0.2s" }}>
                    <Checkbox 
                      checked={isVip} 
                      onCheckedChange={(c) => handleVipToggle(c === true)} 
                      color="amber"
                    />
                    <Text weight="bold" style={{ color: "var(--amber-11)" }}>★ Mark as VIP</Text>
                  </Text>
                </Flex>
                
                <Flex direction="column" gap="3">
                  <Box>
                    <Text as="div" size="2" mb="1" weight="medium">Full Name</Text>
                    <TextField.Root 
                      required 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      placeholder="Enter guest's full name"
                    />
                  </Box>

                  <Grid columns="2" gap="3">
                    <Box>
                      <Text as="div" size="2" mb="1" weight="medium">Phone Number (Optional)</Text>
                      <TextField.Root 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                        placeholder="e.g. +628123456789"
                      />
                    </Box>
                    <Box>
                      <Text as="div" size="2" mb="1" weight="medium">Owner</Text>
                      <Select.Root 
                        value={formData.owner} 
                        onValueChange={(val) => setFormData({...formData, owner: val as GuestOwner})}
                      >
                        <Select.Trigger style={{ width: "100%" }} />
                        <Select.Content>
                          <Select.Item value="groom">{groomName}</Select.Item>
                          <Select.Item value="bride">{brideName}</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </Box>
                  </Grid>

                  <Grid columns="2" gap="3">
                    <Box>
                      <Text as="div" size="2" mb="1" weight="medium">Category</Text>
                      <Select.Root 
                        value={formData.category} 
                        onValueChange={(val) => setFormData({...formData, category: val as GuestCategory})}
                      >
                        <Select.Trigger style={{ width: "100%" }} />
                        <Select.Content>
                          <Select.Item value="Relatives">Relatives</Select.Item>
                          <Select.Item value="Friends">Friends</Select.Item>
                          <Select.Item value="Church">Church</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </Box>
                    <Box>
                      <Text as="div" size="2" mb="1" weight="medium">Notes (Optional)</Text>
                      <TextField.Root 
                        value={formData.notes} 
                        onChange={e => setFormData({...formData, notes: e.target.value})} 
                        placeholder="Dietary requirements, etc."
                      />
                    </Box>
                  </Grid>

                </Flex>
              </Box>

              {/* 2. Invitations */}
              <Box mt="2" pt="4" style={{ borderTop: "1px solid var(--gray-5)" }}>
                <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }} mb="3" as="div">
                  2. Invitations
                </Text>

                <Flex direction="column" gap="3">
                  {eventTypes.map(et => {
                    const isSelected = invitationsForm[et.id]?.is_selected || false;
                    return (
                      <Flex key={et.id} align="center" justify="between" width="100%">
                        <Text as="label" size="2" style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", flex: 1 }}>
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={(c) => setInvitationsForm({...invitationsForm, [et.id]: {...invitationsForm[et.id], is_selected: c === true}})}
                            color="crimson"
                          />
                          <Text weight="medium" style={{ color: isSelected ? "var(--crimson-11)" : "var(--gray-11)" }}>
                            {et.name}
                          </Text>
                        </Text>
                        {isSelected && (
                          <Flex align="center" gap="2">
                            <Text size="1" color="gray">Max Pax:</Text>
                            <TextField.Root 
                              type="number" 
                              min="1" 
                              value={invitationsForm[et.id]?.max_pax || 1} 
                              onChange={e => setInvitationsForm({...invitationsForm, [et.id]: {...invitationsForm[et.id], max_pax: parseInt(e.target.value) || 1}})}
                              style={{ width: "60px" }}
                            />
                          </Flex>
                        )}
                      </Flex>
                    );
                  })}
                </Flex>
              </Box>

              {formError && (
                <Text size="2" color="red" weight="medium">{formError}</Text>
              )}
            </Flex>
          </form>
        </Box>

        <Flex justify="end" gap="3" mt="5">
          <Button variant="soft" color="gray" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="guest-form" color="crimson">
            Save
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
