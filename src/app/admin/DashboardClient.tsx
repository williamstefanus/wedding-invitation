"use client";

import { useState } from "react";
import { OverviewMetrics } from "@/components/admin/OverviewMetrics";
import { Mail, Users, UserCheck, Clock, MapPin, CalendarDays } from "lucide-react";
import { Box, Flex, Grid, Card, Heading, Text, Button, Progress, SegmentedControl, Badge } from "@radix-ui/themes";

interface DashboardClientProps {
  invitations: any[];
  totalGuestsCount: number;
  config?: any;
  sessions?: any;
}

type FilterOption = "all" | "wedding" | "sangjit";

export function DashboardClient({ invitations, totalGuestsCount, config = {}, sessions = {} }: DashboardClientProps) {
  const [filter, setFilter] = useState<FilterOption>("all");

  // Filter invitations based on the active tab
  const filteredInvitations = invitations.filter((inv) => {
    if (filter === "all") return true;
    return inv.event_type?.slug === filter;
  });

  // Core Metrics
  const totalInvitations = filteredInvitations.length;
  const totalInvitedPax = filteredInvitations.reduce((sum, inv) => sum + (inv.max_pax || 0), 0);
  
  const rsvpConfirmed = filteredInvitations.filter(inv => {
    const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
    return !!rsvp;
  }).length;
  const pendingRsvp = totalInvitations - rsvpConfirmed;

  const getAttendanceStatus = (inv: any) => {
    const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
    return rsvp?.attendance_status || null;
  };
  const getConfirmedPax = (inv: any) => {
    const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
    return rsvp?.confirmed_pax || 0;
  };

  const attendingInvitations = filteredInvitations.filter(inv => getAttendanceStatus(inv) === "attending").length;
  const declinedInvitations = filteredInvitations.filter(inv => getAttendanceStatus(inv) === "declined").length;

  const expectedAttendance = filteredInvitations.reduce((sum, inv) => {
    if (getAttendanceStatus(inv) === "attending") {
      return sum + getConfirmedPax(inv);
    }
    return sum;
  }, 0);

  // Attending by Event Session
  const sessionCountMap: Record<string, number> = {};
  filteredInvitations.forEach(inv => {
    const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
    if (rsvp?.attendance_status === "attending" && rsvp.selected_sessions) {
      rsvp.selected_sessions.forEach((ss: any) => {
        const name = ss.event_session?.name || "Unknown";
        sessionCountMap[name] = (sessionCountMap[name] || 0) + (rsvp.confirmed_pax || 1);
      });
    }
  });
  const sessionBreakdown = Object.entries(sessionCountMap).sort((a, b) => b[1] - a[1]);

  return (
    <Box className="knotice-app" p={{ initial: "4", md: "7" }}>
      <Flex direction="column" gap="6" style={{ maxWidth: 1180, margin: "0 auto" }}>
        
        {/* Header */}
        <Box>
          <Heading size="8">Hello {config.groomFirstName || "William"} & {config.brideFirstName || "Aziel"}</Heading>
        </Box>

        {/* Filters - Full Width */}
        <Box>
          <SegmentedControl.Root value={filter} onValueChange={(v) => setFilter(v as FilterOption)} size="2" style={{ width: "100%" }}>
            <SegmentedControl.Item value="all">All Events</SegmentedControl.Item>
            <SegmentedControl.Item value="wedding">Wedding</SegmentedControl.Item>
            <SegmentedControl.Item value="sangjit">Sangjit</SegmentedControl.Item>
          </SegmentedControl.Root>
        </Box>

        {/* Event Details Cards (if specific event selected) */}
        {filter !== "all" && (
          <Grid columns={{ initial: "1", lg: (filter === "wedding" ? "2" : "1") }} gap="4">
            {(filter === "wedding" ? [sessions.holyMatrimony, sessions.reception] : [sessions.sangjit]).map((session, i) => {
              if (!session) return null;
              
              // Fallback default dates if DB dates are missing
              let defaultDateStr = filter === "wedding" 
                ? (config.countdownDate ? config.countdownDate : "2026-10-23")
                : (config.sangjitCountdownDate ? config.sangjitCountdownDate : "2026-10-17");
              
              const dateToDisplay = session.date || defaultDateStr;
              
              return (
                <Card key={i} size="2" style={{ background: "var(--color-panel-solid)", border: "1px solid var(--gray-5)" }}>
                  <Flex direction={{ initial: "column", sm: "row", lg: "column", xl: "row" }} gap="4" align={{ initial: "start", sm: "center", lg: "start", xl: "center" }} justify="between">
                    <Box>
                      <Heading size="4" mb="1" style={{ color: "var(--gray-12)" }}>
                        {session.name || (filter === "wedding" ? (i === 0 ? "Holy Matrimony" : "Reception") : "Sangjit")}
                      </Heading>
                      <Text size="2" color="gray">
                        {filter === "wedding" ? "Wedding Day Event" : "Engagement Ceremony"}
                      </Text>
                    </Box>
                    
                    <Flex gap="4" direction={{ initial: "column", sm: "row", lg: "column", xl: "row" }}>
                      <Flex align="center" gap="2">
                        <Box style={{ padding: "6px", background: "var(--red-3)", borderRadius: "var(--radius-2)" }}>
                          <CalendarDays className="w-4 h-4" style={{ color: "var(--red-11)" }} />
                        </Box>
                        <Box>
                          <Text as="div" size="1" color="gray" weight="medium">Date</Text>
                          <Text as="div" size="2" weight="bold">
                            {new Date(dateToDisplay).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </Text>
                        </Box>
                      </Flex>

                      <Flex align="center" gap="2">
                        <Box style={{ padding: "6px", background: "var(--red-3)", borderRadius: "var(--radius-2)" }}>
                          <Clock className="w-4 h-4" style={{ color: "var(--red-11)" }} />
                        </Box>
                        <Box>
                          <Text as="div" size="1" color="gray" weight="medium">Time</Text>
                          <Text as="div" size="2" weight="bold">
                            {session.start_time?.substring(0, 5) || "TBA"}
                          </Text>
                        </Box>
                      </Flex>
                      
                      <Flex align="center" gap="2">
                        <Box style={{ padding: "6px", background: "var(--red-3)", borderRadius: "var(--radius-2)" }}>
                          <MapPin className="w-4 h-4" style={{ color: "var(--red-11)" }} />
                        </Box>
                        <Box>
                          <Text as="div" size="1" color="gray" weight="medium">Venue</Text>
                          <Text as="div" size="2" weight="bold" style={{ maxWidth: "160px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={session.venue_name}>
                            {session.venue_name || "TBA"}
                          </Text>
                        </Box>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              );
            })}
          </Grid>
        )}

        {/* Main Metric Cards */}
        <Grid columns={{ initial: "2", md: "4" }} gap="3">
          <Card size="2" style={{ background: "var(--color-panel-solid)" }}>
            <Flex align="start" gap="3">
              <Box style={{ padding: "8px", background: "var(--red-3)", borderRadius: "var(--radius-3)", flexShrink: 0 }}>
                <Mail className="w-5 h-5" style={{ color: "var(--red-10)" }} />
              </Box>
              <Box>
                <Text size="1" weight="bold" style={{ color: "var(--gray-11)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Invitations</Text>
                <Heading size="7" mt="1" style={{ color: "var(--gray-12)" }}>{totalInvitations}</Heading>
                <Text size="1" style={{ color: "var(--gray-10)" }}>All sent invitations</Text>
              </Box>
            </Flex>
          </Card>
          <Card size="2" style={{ background: "var(--color-panel-solid)" }}>
            <Flex align="start" gap="3">
              <Box style={{ padding: "8px", background: "var(--red-3)", borderRadius: "var(--radius-3)", flexShrink: 0 }}>
                <Users className="w-5 h-5" style={{ color: "var(--red-10)" }} />
              </Box>
              <Box>
                <Text size="1" weight="bold" style={{ color: "var(--gray-11)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Invited Pax</Text>
                <Heading size="7" mt="1" style={{ color: "var(--gray-12)" }}>{totalInvitedPax}</Heading>
                <Text size="1" style={{ color: "var(--gray-10)" }}>Total people invited</Text>
              </Box>
            </Flex>
          </Card>
          <Card size="2" style={{ background: "var(--color-panel-solid)" }}>
            <Flex align="start" gap="3">
              <Box style={{ padding: "8px", background: "var(--red-3)", borderRadius: "var(--radius-3)", flexShrink: 0 }}>
                <UserCheck className="w-5 h-5" style={{ color: "var(--red-10)" }} />
              </Box>
              <Box>
                <Text size="1" weight="bold" style={{ color: "var(--gray-11)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Expected Attendance</Text>
                <Heading size="7" mt="1" style={{ color: "var(--gray-12)" }}>{expectedAttendance}</Heading>
                <Text size="1" style={{ color: "var(--gray-10)" }}>Based on responses</Text>
              </Box>
            </Flex>
          </Card>
          <Card size="2" style={{ background: "var(--color-panel-solid)" }}>
            <Flex align="start" gap="3">
              <Box style={{ padding: "8px", background: "var(--red-3)", borderRadius: "var(--radius-3)", flexShrink: 0 }}>
                <Clock className="w-5 h-5" style={{ color: "var(--red-10)" }} />
              </Box>
              <Box>
                <Text size="1" weight="bold" style={{ color: "var(--gray-11)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pending RSVP</Text>
                <Heading size="7" mt="1" style={{ color: "var(--gray-12)" }}>{pendingRsvp}</Heading>
                <Text size="1" style={{ color: "var(--gray-10)" }}>Awaiting response</Text>
              </Box>
            </Flex>
          </Card>
        </Grid>

        {/* Attendance Projection */}
        <Card size="3" style={{ background: "var(--color-panel-solid)" }}>
          <Heading size="4" mb="5">Attendance Projection (Pax)</Heading>
          <Flex direction={{ initial: "column", md: "row" }} align="center" gap="6">
            <Box style={{ flex: 1, width: "100%" }}>
              <Flex justify="between" mb="2">
                <Text size="2" weight="medium">Expected vs Total Invited</Text>
                <Text size="2" style={{ color: "var(--gray-11)" }} weight="medium">{expectedAttendance} / {totalInvitedPax}</Text>
              </Flex>
              <Progress 
                value={totalInvitedPax > 0 ? (expectedAttendance / totalInvitedPax) * 100 : 0} 
                color="red"
                style={{ height: "12px", backgroundColor: "var(--gray-3)" }}
              />
            </Box>
            <Box style={{ textAlign: "right", minWidth: "140px" }}>
              <Text size="2" weight="medium" style={{ color: "var(--gray-12)" }} as="div">Unconfirmed Pax</Text>
              <Text size="1" style={{ color: "var(--gray-10)" }} as="div">Assuming pending RSVPs</Text>
              <Text size="6" weight="bold" style={{ color: "var(--orange-10)" }} as="div" mt="1">
                {totalInvitedPax - expectedAttendance} pax
              </Text>
            </Box>
          </Flex>
        </Card>

        {/* John / Jane Overview Breakdown */}
        <Box>
          <OverviewMetrics 
            invitations={filteredInvitations} 
            config={config}
          />
        </Box>

        {/* Attending by Event Session */}
        {sessionBreakdown.length > 0 && (
          <Card size="3" style={{ background: "var(--color-panel-solid)" }}>
            <Flex align="center" gap="3" mb="5">
              <Box style={{ padding: "6px", background: "var(--red-3)", borderRadius: "var(--radius-full)" }}>
                <Users className="w-4 h-4" style={{ color: "var(--red-10)" }} />
              </Box>
              <Heading size="4">Attending by Event Session (Pax)</Heading>
            </Flex>
            <Flex direction="column" gap="4">
              {sessionBreakdown.map(([name, pax]) => (
                <Flex key={name} align="center" gap="4">
                  <Text size="2" weight="medium" style={{ width: "160px", flexShrink: 0 }}>{name}</Text>
                  <Box style={{ flex: 1 }}>
                    <Progress 
                      value={expectedAttendance > 0 ? (pax / expectedAttendance) * 100 : 0} 
                      color="red"
                      style={{ height: "12px", backgroundColor: "var(--gray-3)" }}
                    />
                  </Box>
                  <Text size="2" weight="bold" style={{ width: "64px", textAlign: "right" }}>{pax} pax</Text>
                </Flex>
              ))}
            </Flex>
          </Card>
        )}

      </Flex>
    </Box>
  );
}
