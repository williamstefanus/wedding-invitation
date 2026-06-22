"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { adminUpdateRsvp, resetRsvp, getAllRsvpsForExport } from "@/lib/actions/adminRsvp";
import { exportToExcel } from "@/lib/utils";

// Extracted Components
import { RsvpFilters } from "@/components/admin/rsvp/RsvpFilters";
import { RsvpTable } from "@/components/admin/rsvp/RsvpTable";
import { ViewRsvpModal } from "@/components/admin/rsvp/modals/ViewRsvpModal";
import { EditRsvpModal } from "@/components/admin/rsvp/modals/EditRsvpModal";
import { ResetRsvpModal } from "@/components/admin/rsvp/modals/ResetRsvpModal";

export function RsvpClient({
  initialInvitations,
  eventTypes,
  eventSessions,
  total,
  totalPages,
  currentPage,
  currentSearch,
  currentEventType,
  currentOwner,
  currentCategory,
  currentStatus
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState<any>(null);

  // Edit Form State
  const [editStatus, setEditStatus] = useState("pending");
  const [editPax, setEditPax] = useState(0);
  const [editSelectedSessions, setEditSelectedSessions] = useState<string[]>([]);

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
    if (Object.keys(updates).some(k => k !== "page")) {
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
    // Fetch all records for the current filters
    const res = await getAllRsvpsForExport({
      search: currentSearch,
      eventType: currentEventType,
      owner: currentOwner,
      category: currentCategory,
      status: currentStatus
    });

    if (res.success && res.data) {
      exportToExcel(res.data, `RSVP_Export_${new Date().toISOString().split('T')[0]}`);
    } else {
      alert("Failed to export data.");
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
        // Equivalent to reset if they change it back to pending
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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">RSVP Management</h1>
          <p className="text-slate-500 mt-1">Monitor, edit, and export guest submissions.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>

      <RsvpFilters 
        currentSearch={currentSearch}
        currentEventType={currentEventType}
        currentOwner={currentOwner}
        currentCategory={currentCategory}
        currentStatus={currentStatus}
        eventTypes={eventTypes}
        updateUrl={updateUrl}
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

    </div>
  );
}
