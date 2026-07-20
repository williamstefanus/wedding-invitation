"use client";

import { UserCheck, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { Grid, Card, Flex, Box, Text, Heading } from "@radix-ui/themes";

interface RsvpMetricsProps {
  invitations: any[];
  config?: any;
}

export function RsvpMetrics({ invitations = [], config = {} }: RsvpMetricsProps) {
  const getAttendanceStatus = (inv: any) => {
    const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
    return rsvp?.attendance_status || null;
  };

  const getConfirmedPax = (inv: any) => {
    const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
    return rsvp?.confirmed_pax || 0;
  };

  const attendingInvs = invitations.filter(inv => getAttendanceStatus(inv) === "attending").length;
  const declinedInvs = invitations.filter(inv => getAttendanceStatus(inv) === "declined" || getAttendanceStatus(inv) === "not_attending").length;
  const pendingInvs = invitations.length - attendingInvs - declinedInvs;

  const expectedAttendance = invitations.reduce((s, inv) => {
    if (getAttendanceStatus(inv) === "attending") return s + getConfirmedPax(inv);
    return s;
  }, 0);

  return (
    <Grid columns={{ initial: "1", md: "4" }} gap="4" mb="2">
      <Card size="2" style={{ backgroundColor: "var(--red-2)", border: "1px solid var(--red-5)" }}>
        <Flex align="center" gap="3">
          <Flex align="center" justify="center" style={{ width: 48, height: 48, backgroundColor: "var(--red-4)", color: "var(--red-11)", borderRadius: "var(--radius-3)" }}>
            <UserCheck width={24} height={24} />
          </Flex>
          <Box>
            <Text size="1" weight="bold" style={{ color: "var(--red-11)", textTransform: "uppercase", letterSpacing: "0.02em" }}>Expected Attendance</Text>
            <Heading size="7" mt="1" style={{ color: "var(--red-12)" }}>
              {expectedAttendance} <Text size="2" weight="medium" style={{ color: "var(--red-11)" }}>pax</Text>
            </Heading>
          </Box>
        </Flex>
      </Card>

      <Card size="2">
        <Flex align="center" gap="3">
          <Flex align="center" justify="center" style={{ width: 40, height: 40, backgroundColor: "var(--green-3)", color: "var(--green-11)", borderRadius: "var(--radius-3)" }}>
            <CheckCircle width={20} height={20} />
          </Flex>
          <Box>
            <Text size="1" weight="medium" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.02em" }}>Attending</Text>
            <Heading size="6" mt="1">{attendingInvs} <Text size="1" color="gray" weight="medium">invs</Text></Heading>
          </Box>
        </Flex>
      </Card>

      <Card size="2">
        <Flex align="center" gap="3">
          <Flex align="center" justify="center" style={{ width: 40, height: 40, backgroundColor: "var(--red-3)", color: "var(--red-11)", borderRadius: "var(--radius-3)" }}>
            <XCircle width={20} height={20} />
          </Flex>
          <Box>
            <Text size="1" weight="medium" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.02em" }}>Declined</Text>
            <Heading size="6" mt="1">{declinedInvs} <Text size="1" color="gray" weight="medium">invs</Text></Heading>
          </Box>
        </Flex>
      </Card>

      <Card size="2">
        <Flex align="center" gap="3">
          <Flex align="center" justify="center" style={{ width: 40, height: 40, backgroundColor: "var(--gray-3)", color: "var(--gray-11)", borderRadius: "var(--radius-3)" }}>
            <Clock width={20} height={20} />
          </Flex>
          <Box>
            <Text size="1" weight="medium" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.02em" }}>Pending</Text>
            <Heading size="6" mt="1">{pendingInvs} <Text size="1" color="gray" weight="medium">invs</Text></Heading>
          </Box>
        </Flex>
      </Card>
    </Grid>
  );
}
