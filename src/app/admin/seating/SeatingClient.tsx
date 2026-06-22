"use client";

import { useState, useTransition, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  initializeTables, 
  assignGuestToTable, 
  removeGuestFromTable, 
  updateTableCapacity 
} from "@/lib/actions/seating";

import { SeatingVisualizer } from "@/components/admin/seating/SeatingVisualizer";
import { SeatingSidebar } from "@/components/admin/seating/SeatingSidebar";
import { EditCapacityModal } from "@/components/admin/seating/modals/EditCapacityModal";
import { AssignGuestModal } from "@/components/admin/seating/modals/AssignGuestModal";

export function SeatingClient({
  initialTables,
  initialEligibleGuests,
  currentEvent,
  currentSearch,
  currentOwner,
  currentCategory
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Selected Table State
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const selectedTable = useMemo(() => initialTables.find((t: any) => t.id === selectedTableId), [initialTables, selectedTableId]);

  // Modals
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);
  
  // Capacity Form
  const [newCapacity, setNewCapacity] = useState(10);

  // Metrics calculation
  const totalTables = initialTables.length;
  let occupiedSeats = 0;
  let totalCapacity = 0;
  let totalAssignedGuests = 0;
  
  initialTables.forEach((table: any) => {
    totalCapacity += table.capacity;
    table.assignments.forEach((a: any) => {
      occupiedSeats += a.assigned_pax;
      totalAssignedGuests += 1;
    });
  });

  const remainingSeats = totalCapacity - occupiedSeats;

  // URL Updates
  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router]);

  // Actions
  const handleInitialize = async () => {
    await initializeTables();
  };

  const handleUpdateCapacity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTable) {
      await updateTableCapacity(selectedTable.id, newCapacity);
      setIsCapacityModalOpen(false);
    }
  };

  const handleRemoveGuest = async (assignmentId: string) => {
    if (confirm("Are you sure you want to remove this guest from the table?")) {
      await removeGuestFromTable(assignmentId);
    }
  };

  const handleAssignGuest = async (invitation: any) => {
    if (!selectedTable) return;

    // Occupancy check
    const currentOccupancy = selectedTable.assignments.reduce((sum: number, a: any) => sum + a.assigned_pax, 0);
    const paxToAdd = invitation.rsvp.confirmed_pax;

    if (currentOccupancy + paxToAdd > selectedTable.capacity) {
      if (!confirm(`Warning: Adding this guest (${paxToAdd} pax) will exceed the table's capacity of ${selectedTable.capacity}. Proceed anyway?`)) {
        return;
      }
    }

    await assignGuestToTable({
      invitation_id: invitation.id,
      seating_table_id: selectedTable.id,
      assigned_pax: paxToAdd
    });

    setIsSearchModalOpen(false);
    updateUrl({ guestSearch: null, guestOwner: null, guestCategory: null });
  };

  return (
    <div className="w-full h-full md:h-[calc(100vh-64px)] flex overflow-hidden font-sans relative bg-slate-100">
      
      <SeatingVisualizer 
        initialTables={initialTables}
        currentEvent={currentEvent}
        selectedTableId={selectedTableId}
        setSelectedTableId={setSelectedTableId}
        updateUrl={updateUrl}
        handleInitialize={handleInitialize}
        totalTables={totalTables}
        occupiedSeats={occupiedSeats}
        totalCapacity={totalCapacity}
        remainingSeats={remainingSeats}
        totalAssignedGuests={totalAssignedGuests}
      />

      <SeatingSidebar 
        selectedTableId={selectedTableId}
        selectedTable={selectedTable}
        setSelectedTableId={setSelectedTableId}
        setNewCapacity={setNewCapacity}
        setIsCapacityModalOpen={setIsCapacityModalOpen}
        setIsSearchModalOpen={setIsSearchModalOpen}
        handleRemoveGuest={handleRemoveGuest}
      />

      <EditCapacityModal 
        isCapacityModalOpen={isCapacityModalOpen}
        setIsCapacityModalOpen={setIsCapacityModalOpen}
        selectedTable={selectedTable}
        newCapacity={newCapacity}
        setNewCapacity={setNewCapacity}
        handleUpdateCapacity={handleUpdateCapacity}
      />

      <AssignGuestModal 
        isSearchModalOpen={isSearchModalOpen}
        setIsSearchModalOpen={setIsSearchModalOpen}
        selectedTable={selectedTable}
        currentSearch={currentSearch}
        currentOwner={currentOwner}
        currentCategory={currentCategory}
        updateUrl={updateUrl}
        initialEligibleGuests={initialEligibleGuests}
        handleAssignGuest={handleAssignGuest}
      />

    </div>
  );
}
