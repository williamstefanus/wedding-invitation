"use client";

import { useState } from "react";
import { CheckCircle2, UserCheck, Users, MapPin, FileText, Plus, Minus, Loader2 } from "lucide-react";
import { Card, Flex, Box, Text, Heading, Badge, Button, IconButton } from "@radix-ui/themes";

interface UsherGuestCardProps {
  invitation: any;
  onToggleCheckIn: (invId: string, actualPax: number, isCheckingIn: boolean) => Promise<void>;
  onOpenDetails: (inv: any) => void;
  config?: any;
}

export function UsherGuestCard({ invitation, onToggleCheckIn, onOpenDetails, config = {} }: UsherGuestCardProps) {
  const guest = Array.isArray(invitation.guest) ? invitation.guest[0] : (invitation.guest || {});
  const rsvp = Array.isArray(invitation.rsvp) ? invitation.rsvp[0] : invitation.rsvp;
  const assignment = Array.isArray(invitation.seating_assignment) ? invitation.seating_assignment[0] : invitation.seating_assignment;

  const isCheckedIn = !!invitation.checked_in_at;
  const defaultPax = rsvp?.confirmed_pax || invitation.max_pax || 1;
  const [actualPax, setActualPax] = useState<number>(Math.min(defaultPax, invitation.checked_in_pax || defaultPax));
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggleCheckIn(invitation.id, Math.min(actualPax, defaultPax), !isCheckedIn);
    } finally {
      setLoading(false);
    }
  };

  const isVip = !!guest.notes?.toLowerCase().includes("vip");

  return (
    <Card 
      size="3" 
      style={{ 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: isCheckedIn ? "var(--emerald-2)" : isVip ? "var(--amber-2)" : undefined,
        borderColor: isCheckedIn ? "var(--emerald-6)" : isVip ? "var(--amber-6)" : undefined,
      }}
    >
      <Box>
        <Flex justify="between" align="start" gap="3" mb="3">
          <Box onClick={() => onOpenDetails(invitation)} style={{ cursor: "pointer", flex: 1 }} className="group">
            <Flex align="center" gap="2" wrap="wrap" mb="1">
              <Heading size="4" style={{ color: isCheckedIn ? "var(--emerald-11)" : "var(--gray-12)" }} className="group-hover:underline">
                {guest.name || "Unnamed Guest"}
              </Heading>
              {isVip && (
                <Badge color="amber" variant="solid" size="1">★ VIP</Badge>
              )}
            </Flex>

            <Flex align="center" gap="2">
              <Badge color={guest?.owner?.toLowerCase() === "groom" || guest?.owner?.toLowerCase() === "william" ? "blue" : "crimson"} variant="soft" size="1">
                {guest?.owner?.toLowerCase() === "groom" || guest?.owner?.toLowerCase() === "william" ? (config.groomFirstName || "Groom") : (config.brideFirstName || "Bride")}
              </Badge>
              <Text size="1" color="gray">•</Text>
              <Text size="1" weight="medium" color="gray">{guest.category}</Text>
              <Text size="1" weight="bold" color="amber" style={{ textDecoration: "underline" }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                View Details
              </Text>
            </Flex>
          </Box>

          {/* Table Badge */}
          <Flex direction="column" align="center" justify="center" px="3" py="2" style={{ borderRadius: "var(--radius-3)", minWidth: 85, backgroundColor: assignment?.seating_table ? "var(--purple-3)" : "var(--gray-3)", border: "1px solid", borderColor: assignment?.seating_table ? "var(--purple-5)" : "var(--gray-5)" }}>
            <Flex align="center" gap="1">
              <MapPin width={12} height={12} style={{ color: assignment?.seating_table ? "var(--purple-11)" : "var(--gray-11)" }} />
              <Text size="1" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.02em", color: assignment?.seating_table ? "var(--purple-11)" : "var(--gray-11)" }}>Table</Text>
            </Flex>
            <Text size="3" weight="bold" style={{ color: assignment?.seating_table ? "var(--purple-11)" : "var(--gray-11)" }}>
              {assignment?.seating_table?.table_name || "None"}
            </Text>
          </Flex>
        </Flex>

        {/* RSVP Info */}
        <Flex align="center" gap="3" mt="3" pt="3" style={{ borderTop: "1px solid var(--gray-4)" }}>
          <Flex align="center" gap="2">
            <Users width={14} height={14} style={{ color: "var(--gray-8)" }} />
            <Text size="1" color="gray">
              RSVP: <Text weight="bold" style={{ color: rsvp?.attendance_status === "attending" ? "var(--emerald-11)" : "var(--gray-11)", textTransform: "capitalize" }}>{rsvp?.attendance_status || "Pending"}</Text>
            </Text>
          </Flex>
          <Text size="1" color="gray">|</Text>
          <Text size="1" color="gray">
            Expected: <Text weight="bold" color="gray">{defaultPax} Pax</Text>
          </Text>
        </Flex>

        {/* Notes */}
        {guest.notes?.replace(/\[?vip\]?/gi, "").trim() && (
          <Box onClick={() => onOpenDetails(invitation)} mt="3" p="2" style={{ backgroundColor: "var(--amber-3)", border: "1px solid var(--amber-5)", borderRadius: "var(--radius-3)", cursor: "pointer" }}>
            <Flex align="start" gap="2">
              <FileText width={14} height={14} style={{ color: "var(--amber-11)", marginTop: 2, flexShrink: 0 }} />
              <Text size="1" color="amber" weight="medium" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {guest.notes.replace(/\[?vip\]?/gi, "").trim()}
              </Text>
            </Flex>
          </Box>
        )}
      </Box>

      {/* Check-In Action Bar */}
      <Flex align="center" justify="between" gap="3" mt="4" pt="3" style={{ borderTop: "1px solid var(--gray-4)" }}>
        {/* Headcount Stepper */}
        {!isCheckedIn ? (
          <Flex align="center" gap="2" p="1" style={{ backgroundColor: "var(--gray-2)", border: "1px solid var(--gray-5)", borderRadius: "var(--radius-3)" }}>
            <IconButton 
              variant="soft" 
              color="gray" 
              size="1" 
              onClick={() => setActualPax(Math.max(1, actualPax - 1))}
              disabled={loading || actualPax <= 1}
              style={{ cursor: "pointer" }}
            >
              <Minus width={14} height={14} />
            </IconButton>
            <Text size="2" weight="bold" align="center" style={{ width: 24 }}>{actualPax}</Text>
            <IconButton 
              variant="soft" 
              color="gray" 
              size="1" 
              onClick={() => setActualPax(actualPax + 1)}
              disabled={loading || actualPax >= defaultPax}
              style={{ cursor: "pointer" }}
            >
              <Plus width={14} height={14} />
            </IconButton>
          </Flex>
        ) : (
          <Flex align="center" gap="2">
            <UserCheck width={16} height={16} style={{ color: "var(--emerald-11)" }} />
            <Text size="1" weight="bold" color="green">Arrived: {invitation.checked_in_pax || actualPax} Pax</Text>
          </Flex>
        )}

        {/* Check In Button */}
        <Button
          variant={isCheckedIn ? "outline" : "solid"}
          color={isCheckedIn ? "ruby" : "green"}
          size="2"
          onClick={handleToggle}
          disabled={loading}
          style={{ flex: 1 }}
        >
          {loading ? (
            <Loader2 width={16} height={16} className="animate-spin" />
          ) : isCheckedIn ? (
            "Cancel Check-In"
          ) : (
            <>
              <CheckCircle2 width={16} height={16} /> Check In
            </>
          )}
        </Button>
      </Flex>
    </Card>
  );
}
