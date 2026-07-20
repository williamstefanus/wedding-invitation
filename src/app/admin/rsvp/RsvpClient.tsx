"use client";

import { useState, useTransition, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { adminUpdateRsvp, resetRsvp, getAllRsvpsForExport } from "@/lib/actions/adminRsvp";
import { exportToExcel } from "@/lib/utils";
import { Box, Flex, Heading, Text, Button as RadixButton, Tabs, Card } from "@radix-ui/themes";
import { RsvpMetrics } from "@/components/admin/rsvp/RsvpMetrics";

// Extracted Components
import { RsvpFilters } from "@/components/admin/rsvp/RsvpFilters";
import { RsvpTable } from "@/components/admin/rsvp/RsvpTable";
import { ViewRsvpModal } from "@/components/admin/rsvp/modals/ViewRsvpModal";
import { EditRsvpModal } from "@/components/admin/rsvp/modals/EditRsvpModal";
import { ResetRsvpModal } from "@/components/admin/rsvp/modals/ResetRsvpModal";

export function RsvpClient({
  initialInvitations,
  allInvitations = [],
  eventTypes,
  eventSessions,
  total,
  totalPages,
  currentPage,
  currentSearch,
  currentTab,
  currentOwner,
  currentCategory,
  currentStatus,
  currentSort,
  config = {}
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filteredOverviewInvitations = useMemo(() => {
    if (!allInvitations) return [];
    const activeTab = currentTab || "wedding";
    if (activeTab === "all") return allInvitations; // Fallback just in case
    return allInvitations.filter((inv: any) => inv.event_type?.slug === activeTab);
  }, [allInvitations, currentTab]);

  // Modals state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState<any>(null);

  // Edit Form State
  const [editStatus, setEditStatus] = useState("pending");
  const [editPax, setEditPax] = useState(0);
  const [editSelectedSessions, setEditSelectedSessions] = useState<string[]>([]);
  const [exportError, setExportError] = useState<string | null>(null);

  let currentRsvp = null;
  if (selectedInv?.rsvp) {
    if (Array.isArray(selectedInv.rsvp)) {
      if (selectedInv.rsvp.length > 0) currentRsvp = selectedInv.rsvp[0];
    } else {
      currentRsvp = selectedInv.rsvp;
    }
  }
  const isSelectedPending = !currentRsvp;

  // URL Updates
  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Changing filters resets pagination
    if (updates.search !== undefined || updates.owner !== undefined || updates.category !== undefined || updates.status !== undefined || updates.tab !== undefined || updates.sort !== undefined) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateUrl({ page: newPage.toString() });
  };

  // Export
  const handleExport = async () => {
    setExportError(null);
    const res = await getAllRsvpsForExport({
      search: currentSearch,
      eventType: currentTab === "all" ? "All" : currentTab,
      owner: currentOwner,
      category: currentCategory,
      status: currentStatus
    });

    if (res.success && res.data) {
      exportToExcel(res.data, `RSVP_Export_${new Date().toISOString().split('T')[0]}`);
    } else {
      setExportError("Failed to export RSVP data.");
      setTimeout(() => setExportError(null), 4000);
    }
  };

  // Modal Handlers
  const openViewModal = (inv: any) => {
    setSelectedInv(inv);
    setIsViewOpen(true);
  };

  const openEditModal = (inv: any) => {
    setSelectedInv(inv);
    let rsvp = null;
    if (inv.rsvp) {
      if (Array.isArray(inv.rsvp)) {
        if (inv.rsvp.length > 0) rsvp = inv.rsvp[0];
      } else {
        rsvp = inv.rsvp;
      }
    }
    const isPend = !rsvp;
    
    setEditStatus(isPend ? "pending" : rsvp.attendance_status);
    setEditPax(isPend ? 0 : rsvp.confirmed_pax);
    setEditSelectedSessions(isPend ? [] : rsvp.selected_sessions.map((s: any) => s.event_session_id));
    
    setIsEditOpen(true);
  };

  const openResetModal = (inv: any) => {
    setSelectedInv(inv);
    setIsResetOpen(true);
  };

  // Submission Handlers
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInv) {
      if (editStatus === "pending") {
        await resetRsvp(selectedInv.id);
      } else {
        await adminUpdateRsvp({
          invitation_id: selectedInv.id,
          attendance_status: editStatus as "attending" | "not_attending",
          confirmed_pax: editPax,
          selected_session_ids: editSelectedSessions
        });
      }
      setIsEditOpen(false);
    }
  };

  const handleReset = async () => {
    if (selectedInv) {
      await resetRsvp(selectedInv.id);
      setIsResetOpen(false);
    }
  };

  return (
    <Box className="knotice-app" p={{ initial: "4", md: "7" }}>
      <Flex direction="column" gap="4" style={{ maxWidth: 1180, margin: "0 auto" }}>
        
        <Flex direction={{ initial: "column", md: "row" }} justify="between" align={{ initial: "start", md: "end" }} gap="4">
          <Box>
            <Heading size="8">RSVP Management</Heading>
          </Box>
          <RadixButton 
            onClick={handleExport}
            color="red"
            size="3"
            style={{ fontWeight: 600, cursor: "pointer" }}
          >
            <Download width={18} height={18} />
            Export to Excel
          </RadixButton>
        </Flex>

        {exportError && (
          <Box p="4" style={{ backgroundColor: "var(--red-2)", color: "var(--red-11)", border: "1px solid var(--red-5)", borderRadius: "var(--radius-3)", fontWeight: 600 }}>
            <span>✕</span> {exportError}
          </Box>
        )}

        {allInvitations && allInvitations.length > 0 && (
          <RsvpMetrics invitations={filteredOverviewInvitations} config={config} />
        )}

        {/* Tabs */}
        <Box mb="4">
          <Tabs.Root value={currentTab || "wedding"} onValueChange={(val) => updateUrl({ tab: val })}>
            <Tabs.List size="2">
              {eventTypes.map((et: any) => (
                <Tabs.Trigger key={et.id} value={et.slug}>{et.name}</Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        </Box>

          <RsvpFilters 
            currentSearch={currentSearch}
            currentOwner={currentOwner}
            currentCategory={currentCategory}
            currentStatus={currentStatus}
            currentSort={currentSort}
            updateUrl={updateUrl}
            config={config}
          />

          <RsvpTable 
            initialInvitations={initialInvitations}
            totalPages={totalPages}
            currentPage={currentPage}
            isPending={isPending}
            openViewModal={openViewModal}
            openEditModal={openEditModal}
            openResetModal={openResetModal}
            handlePageChange={handlePageChange}
          />

      <ViewRsvpModal 
        isViewOpen={isViewOpen}
        setIsViewOpen={setIsViewOpen}
        selectedInv={selectedInv}
        currentRsvp={currentRsvp}
        isSelectedPending={isSelectedPending}
        eventSessions={eventSessions}
      />

      <EditRsvpModal 
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        selectedInv={selectedInv}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        editPax={editPax}
        setEditPax={setEditPax}
        editSelectedSessions={editSelectedSessions}
        setEditSelectedSessions={setEditSelectedSessions}
        eventSessions={eventSessions}
        handleEditSubmit={handleEditSubmit}
      />

      <ResetRsvpModal 
        isResetOpen={isResetOpen}
        setIsResetOpen={setIsResetOpen}
        selectedInv={selectedInv}
        handleReset={handleReset}
      />

      </Flex>
    </Box>
  );
}
