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
    .filter(inv => inv.guest?.owner === "groom")
    .reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const bridePax = invitations
    .filter(inv => inv.guest?.owner === "bride")
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
        <Flex direction="column" justify="center" style={{ height: "100%" }}>
          <Flex align="center" gap="3" mb="2">
            <Flex align="center" justify="center" style={{ width: 32, height: 32, backgroundColor: "var(--crimson-3)", color: "var(--crimson-11)", borderRadius: "var(--radius-3)" }}>
              <Users width={16} height={16} />
            </Flex>
            <Box>
              <Text size="1" weight="medium" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.02em" }}>Total Pax</Text>
              <Heading size="5" mt="1">{totalPax}</Heading>
            </Box>
          </Flex>
          <Flex justify="between" style={{ borderTop: "1px solid var(--gray-4)", paddingTop: "8px", marginTop: "4px" }}>
            <Text size="1" color="gray">Rel: <Text weight="bold" color="gray">{relativesPax}</Text></Text>
            <Text size="1" color="gray">Fri: <Text weight="bold" color="gray">{friendsPax}</Text></Text>
            <Text size="1" color="gray">Chr: <Text weight="bold" color="gray">{churchPax}</Text></Text>
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
