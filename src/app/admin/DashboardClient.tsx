"use client";

import { useState } from "react";
import { MetricCard } from "./components/MetricCard";
import { ProgressBar } from "./components/ProgressBar";

interface DashboardClientProps {
  invitations: any[];
  totalGuestsCount: number; // Raw count of guests from the database if needed
}

type FilterOption = "all" | "wedding" | "sangjit";

export function DashboardClient({ invitations, totalGuestsCount }: DashboardClientProps) {
  const [filter, setFilter] = useState<FilterOption>("all");

  // Filter invitations based on the active tab
  const filteredInvitations = invitations.filter((inv) => {
    if (filter === "all") return true;
    return inv.event_type?.slug === filter;
  });

  // Calculate Metrics
  const totalInvitations = filteredInvitations.length;
  const totalInvitedPax = filteredInvitations.reduce((sum, inv) => sum + (inv.max_pax || 0), 0);
  
  const rsvpConfirmed = filteredInvitations.filter(inv => inv.rsvp !== null).length;
  const pendingRsvp = totalInvitations - rsvpConfirmed;

  const attendingInvitations = filteredInvitations.filter(inv => inv.rsvp?.attendance_status === "attending").length;
  const declinedInvitations = filteredInvitations.filter(inv => inv.rsvp?.attendance_status === "not_attending").length;

  const expectedAttendance = filteredInvitations.reduce((sum, inv) => {
    if (inv.rsvp?.attendance_status === "attending") {
      return sum + (inv.rsvp.confirmed_pax || 0);
    }
    return sum;
  }, 0);

  // Determine "Total Guests" based on filter. If 'all', we might just show totalInvitedPax for consistency
  // or the raw guests table count. Using totalInvitedPax makes the dashboard cohesive.
  const totalGuestsDisplay = totalInvitedPax;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 font-sans">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Command center for your event planning.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          {(["all", "wedding", "sangjit"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${
                filter === opt 
                  ? "bg-white text-slate-800 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Invitations" value={totalInvitations} />
        <MetricCard title="Total Invited Pax" value={totalInvitedPax} />
        <MetricCard title="Expected Attendance" value={expectedAttendance} />
        <MetricCard title="Pending RSVP" value={pendingRsvp} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* RSVP Status Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">RSVP Status Breakdown</h3>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-500 text-sm font-medium mb-1">Attending</p>
              <p className="text-2xl font-bold text-green-600">{attendingInvitations}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-500 text-sm font-medium mb-1">Declined</p>
              <p className="text-2xl font-bold text-rose-500">{declinedInvitations}</p>
            </div>
          </div>
          <ProgressBar 
            label="RSVP Response Rate" 
            value={rsvpConfirmed} 
            total={totalInvitations} 
            colorClass="bg-[#416130]"
            format="percentage"
          />
        </div>

        {/* Attendance Projection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Attendance Projection (Pax)</h3>
          
          <div className="flex flex-col gap-8">
            <ProgressBar 
              label="Expected vs Total Invited" 
              value={expectedAttendance} 
              total={totalInvitedPax} 
              colorClass="bg-blue-500"
            />
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-slate-500 text-sm font-medium">Unconfirmed Pax</span>
                <span className="text-slate-400 text-xs mt-1">Assuming pending RSVPs</span>
              </div>
              <span className="text-xl font-bold text-amber-500">
                {totalInvitedPax - expectedAttendance}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
