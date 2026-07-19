"use client";

import { Mail, Users, UserCheck } from "lucide-react";
import { Grid, Card, Flex, Box, Text, Heading } from "@radix-ui/themes";

interface GuestMetricsProps {
  invitations: any[];
  config?: any;
}

export function GuestMetrics({ invitations = [], config = {} }: GuestMetricsProps) {
  const groomName = config.groomFirstName || "William";
  const brideName = config.brideFirstName || "Aziel";
  const totalInv = invitations.length;
  const totalPax = invitations.reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const relativesPax = invitations
    .filter(inv => inv.guest?.category === "Relatives")
    .reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const friendsPax = invitations
    .filter(inv => inv.guest?.category === "Friends")
    .reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const churchPax = invitations
    .filter(inv => inv.guest?.category === "Church")
    .reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const groomPax = invitations
    .filter(inv => inv.guest?.owner?.toLowerCase() === "groom" || inv.guest?.owner?.toLowerCase() === "william")
    .reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const bridePax = invitations
    .filter(inv => inv.guest?.owner?.toLowerCase() === "bride" || inv.guest?.owner?.toLowerCase() === "aziel")
    .reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const sentInv = invitations.filter(inv => !!inv.is_sent).length;

  return (
    <Grid columns={{ initial: "2", md: "5" }} gap="4" mb="2">
      <Card size="2">
        <Flex align="center" gap="3">
          <Flex align="center" justify="center" style={{ width: 40, height: 40, backgroundColor: "var(--crimson-3)", color: "var(--crimson-11)", borderRadius: "var(--radius-3)" }}>
            <Mail width={20} height={20} />
          </Flex>
          <Box>
            <Text size="1" weight="medium" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.02em" }}>Total Inv.</Text>
            <Heading size="6" mt="1">{totalInv}</Heading>
          </Box>
        </Flex>
      </Card>

      <Card size="2">
        <Flex align="center" justify="between" gap="2" style={{ height: "100%" }}>
          <Flex align="center" gap="3">
            <Flex align="center" justify="center" style={{ width: 40, height: 40, backgroundColor: "var(--crimson-3)", color: "var(--crimson-11)", borderRadius: "var(--radius-3)", flexShrink: 0 }}>
              <Users width={20} height={20} />
            </Flex>
            <Box>
              <Text size="1" weight="medium" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.02em" }}>Total Pax</Text>
              <Heading size="6" mt="1">{totalPax}</Heading>
            </Box>
          </Flex>
          
          <Flex direction="column" align="end" gap="1" style={{ borderLeft: "1px solid var(--gray-4)", paddingLeft: "12px", minWidth: "50px" }}>
            <Text style={{ fontSize: "11px", color: "var(--gray-11)", lineHeight: 1.2 }}>Rel: <strong style={{ color: "var(--gray-12)" }}>{relativesPax}</strong></Text>
            <Text style={{ fontSize: "11px", color: "var(--gray-11)", lineHeight: 1.2 }}>Fri: <strong style={{ color: "var(--gray-12)" }}>{friendsPax}</strong></Text>
            <Text style={{ fontSize: "11px", color: "var(--gray-11)", lineHeight: 1.2 }}>Chr: <strong style={{ color: "var(--gray-12)" }}>{churchPax}</strong></Text>
          </Flex>
        </Flex>
      </Card>

      <Card size="2">
        <Flex align="center" gap="3">
          <Flex align="center" justify="center" style={{ width: 40, height: 40, backgroundColor: "var(--crimson-4)", color: "var(--crimson-11)", borderRadius: "var(--radius-3)" }}>
            <Text weight="bold">{groomName.charAt(0)}</Text>
          </Flex>
          <Box>
            <Text size="1" weight="medium" style={{ color: "var(--crimson-11)", textTransform: "uppercase", letterSpacing: "0.02em" }}>{groomName}'s Pax</Text>
            <Heading size="6" mt="1">{groomPax}</Heading>
          </Box>
        </Flex>
      </Card>

      <Card size="2">
        <Flex align="center" gap="3">
          <Flex align="center" justify="center" style={{ width: 40, height: 40, backgroundColor: "var(--crimson-4)", color: "var(--crimson-11)", borderRadius: "var(--radius-3)" }}>
            <Text weight="bold">{brideName.charAt(0)}</Text>
          </Flex>
          <Box>
            <Text size="1" weight="medium" style={{ color: "var(--crimson-11)", textTransform: "uppercase", letterSpacing: "0.02em" }}>{brideName}'s Pax</Text>
            <Heading size="6" mt="1">{bridePax}</Heading>
          </Box>
        </Flex>
      </Card>

      <Card size="2">
        <Flex align="center" gap="3">
          <Flex align="center" justify="center" style={{ width: 40, height: 40, backgroundColor: "var(--crimson-3)", color: "var(--crimson-11)", borderRadius: "var(--radius-3)" }}>
            <UserCheck width={20} height={20} />
          </Flex>
          <Box>
            <Text size="1" weight="medium" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.02em" }}>Sent Invs.</Text>
            <Heading size="6" mt="1">
              {sentInv} <Text size="2" color="gray" weight="medium">/ {totalInv}</Text>
            </Heading>
          </Box>
        </Flex>
      </Card>
    </Grid>
  );
}
