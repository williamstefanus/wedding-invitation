"use client";

import { Users } from "lucide-react";
import { Box, Flex, Grid, Card, Heading, Text, Progress } from "@radix-ui/themes";

interface OverviewMetricsProps {
  invitations: any[];
  config?: any;
}

export function OverviewMetrics({ invitations = [], config = {} }: OverviewMetricsProps) {
  const getAttendanceStatus = (inv: any) => {
    const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
    return rsvp?.attendance_status || null;
  };

  const getConfirmedPax = (inv: any) => {
    const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
    return rsvp?.confirmed_pax || 0;
  };

  const groomName = config.groomFirstName || "William";
  const brideName = config.brideFirstName || "Aziel";

  const ownerStats = [
    { key: "groom", displayName: groomName },
    { key: "bride", displayName: brideName }
  ].map(({ key, displayName }) => {
    const ownerInvs = invitations.filter(inv => {
      const owner = inv.guest?.owner?.toLowerCase() || "";
      return owner === key || owner === displayName.toLowerCase();
    });
    const invitedPax = ownerInvs.reduce((s, inv) => s + (inv.max_pax || 0), 0);
    const attendingPax = ownerInvs.reduce((s, inv) => {
      if (getAttendanceStatus(inv) === "attending") return s + getConfirmedPax(inv);
      return s;
    }, 0);
    const attendingInvs = ownerInvs.filter(inv => getAttendanceStatus(inv) === "attending").length;
    const declinedInvs = ownerInvs.filter(inv => getAttendanceStatus(inv) === "declined" || getAttendanceStatus(inv) === "not_attending").length;
    const pendingInvs = ownerInvs.length - attendingInvs - declinedInvs;
    const respondedInvs = attendingInvs + declinedInvs;

    return { 
      owner: key, 
      displayName,
      invitedPax, 
      attendingPax, 
      invitations: ownerInvs.length,
      attendingInvs,
      declinedInvs,
      pendingInvs,
      respondedInvs
    };
  });

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="4" mt="4">
      {ownerStats.map(stat => {
        return (
          <Card key={stat.owner} size="3" style={{ padding: 0, overflow: "hidden", background: "var(--color-panel-solid)" }}>
            {/* Owner Header */}
            <Flex justify="between" align="center" style={{ backgroundColor: "var(--red-2)", borderBottom: "1px solid var(--red-4)", padding: "16px 24px" }}>
              <Box>
                <Heading size="4" weight="bold" style={{ color: "var(--red-11)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.displayName}
                </Heading>
                <Text size="1" style={{ color: "var(--red-11)", opacity: 0.8 }}>{stat.invitations} Total Invitations</Text>
              </Box>
              <Box style={{ padding: "6px", background: "var(--color-panel-solid)", borderRadius: "var(--radius-3)", border: "1px solid var(--red-4)" }}>
                <Users className="w-4 h-4" style={{ color: "var(--red-10)" }} />
              </Box>
            </Flex>

            <Box p="5">
              {/* Total Pax Subsection */}
              <Box mb="6">
                <Text size="1" weight="bold" style={{ color: "var(--gray-9)", textTransform: "uppercase", letterSpacing: "0.05em" }} mb="3" as="div">
                  Total Pax Breakdown
                </Text>
                <Grid columns="2" gap="4" mb="4">
                  <Box>
                    <Text size="1" style={{ color: "var(--gray-10)" }} as="div">Invited Pax</Text>
                    <Heading size="6" style={{ color: "var(--gray-12)" }}>{stat.invitedPax}</Heading>
                  </Box>
                  <Box>
                    <Text size="1" style={{ color: "var(--gray-10)" }} as="div">Expected Attendance</Text>
                    <Heading size="6" style={{ color: "var(--gray-12)" }}>{stat.attendingPax}</Heading>
                  </Box>
                </Grid>
                
                <Flex justify="between" mb="2">
                  <Text size="2" weight="medium">Pax Attendance Rate</Text>
                  <Text size="2" weight="bold">{stat.invitedPax > 0 ? Math.round((stat.attendingPax / stat.invitedPax) * 100) : 0}%</Text>
                </Flex>
                <Progress 
                  value={stat.invitedPax > 0 ? (stat.attendingPax / stat.invitedPax) * 100 : 0} 
                  color="red" 
                  style={{ height: "6px", backgroundColor: "var(--gray-3)" }} 
                />
              </Box>

              {/* RSVP Status Subsection */}
              <Box>
                <Text size="1" weight="bold" style={{ color: "var(--gray-9)", textTransform: "uppercase", letterSpacing: "0.05em" }} mb="3" as="div">
                  RSVP Status Breakdown
                </Text>
                <Grid columns="3" gap="3" mb="4">
                  <Flex direction="column" align="center" justify="center" p="3" style={{ backgroundColor: "var(--green-2)", border: "1px solid var(--green-4)", borderRadius: "var(--radius-3)" }}>
                    <Text size="1" weight="bold" style={{ color: "var(--green-11)" }}>Attending</Text>
                    <Heading size="5" style={{ color: "var(--green-11)" }}>{stat.attendingInvs}</Heading>
                  </Flex>
                  <Flex direction="column" align="center" justify="center" p="3" style={{ backgroundColor: "var(--red-2)", border: "1px solid var(--red-4)", borderRadius: "var(--radius-3)" }}>
                    <Text size="1" weight="bold" style={{ color: "var(--red-11)" }}>Declined</Text>
                    <Heading size="5" style={{ color: "var(--red-11)" }}>{stat.declinedInvs}</Heading>
                  </Flex>
                  <Flex direction="column" align="center" justify="center" p="3" style={{ backgroundColor: "var(--orange-2)", border: "1px solid var(--orange-4)", borderRadius: "var(--radius-3)" }}>
                    <Text size="1" weight="bold" style={{ color: "var(--orange-11)" }}>Pending</Text>
                    <Heading size="5" style={{ color: "var(--orange-11)" }}>{stat.pendingInvs}</Heading>
                  </Flex>
                </Grid>
                
                <Flex justify="between" mb="2">
                  <Text size="2" weight="medium">Response Rate</Text>
                  <Text size="2" weight="bold">{stat.invitations > 0 ? Math.round((stat.respondedInvs / stat.invitations) * 100) : 0}%</Text>
                </Flex>
                <Progress 
                  value={stat.invitations > 0 ? (stat.respondedInvs / stat.invitations) * 100 : 0} 
                  color="red" 
                  style={{ height: "6px", backgroundColor: "var(--gray-3)" }} 
                />
              </Box>
            </Box>
          </Card>
        );
      })}
    </Grid>
  );
}
