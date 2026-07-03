"use client";

import { useState } from "react";
import { MetricCard } from "./components/MetricCard";
import { ProgressBar } from "./components/ProgressBar";
import { OverviewMetrics } from "@/components/admin/OverviewMetrics";
import { Users, UserCheck } from "lucide-react";

interface DashboardClientProps {
  invitations: any[];
  totalGuestsCount: number;
  config?: any;
}

type FilterOption = "all" | "wedding" | "sangjit";

export function DashboardClient({ invitations, totalGuestsCount, config = {} }: DashboardClientProps) {
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
  const declinedInvitations = filteredInvitations.filter(inv => getAttendanceStatus(inv) === "not_attending").length;

  const expectedAttendance = filteredInvitations.reduce((sum, inv) => {
    if (getAttendanceStatus(inv) === "attending") {
      return sum + getConfirmedPax(inv);
    }
    return sum;
  }, 0);

  // Pax & RSVP Breakdown by Owner
  const ownerStats = ["groom", "bride"].map(owner => {
    const ownerInvs = filteredInvitations.filter(inv => inv.guest?.owner === owner);
    const invitedPax = ownerInvs.reduce((s, inv) => s + (inv.max_pax || 0), 0);
    const attendingPax = ownerInvs.reduce((s, inv) => {
      if (getAttendanceStatus(inv) === "attending") return s + getConfirmedPax(inv);
      return s;
    }, 0);
    const attendingInvs = ownerInvs.filter(inv => getAttendanceStatus(inv) === "attending").length;
    const declinedInvs = ownerInvs.filter(inv => getAttendanceStatus(inv) === "declined").length;
    const pendingInvs = ownerInvs.length - attendingInvs - declinedInvs;
    const respondedInvs = attendingInvs + declinedInvs;

    return { 
      owner, 
      invitedPax, 
      attendingPax, 
      invitations: ownerInvs.length,
      attendingInvs,
      declinedInvs,
      pendingInvs,
      respondedInvs
    };
  });

  // Attending by Event Session (for wedding filter: Holy Matrimony vs Reception)
  // Counts how many attending guests selected each session
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

      {/* Attendance Projection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Attendance Projection (Pax)</h3>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full">
            <ProgressBar 
              label="Expected vs Total Invited" 
              value={expectedAttendance} 
              total={totalInvitedPax} 
              colorClass="bg-blue-500"
            />
          </div>
          <div className="flex justify-between md:flex-col justify-center items-end md:items-end w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="flex flex-col text-left md:text-right">
              <span className="text-slate-500 text-sm font-medium">Unconfirmed Pax</span>
              <span className="text-slate-400 text-xs mt-1">Assuming pending RSVPs</span>
            </div>
            <span className="text-xl font-bold text-amber-500 mt-1">
              {totalInvitedPax - expectedAttendance} pax
            </span>
          </div>
        </div>
      </div>

      {/* John / Jane Overview Breakdown */}
      <OverviewMetrics 
        invitations={filteredInvitations} 
        config={config}
      />

      {/* Attending by Event Session */}
      {sessionBreakdown.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-50 rounded-lg">
              <UserCheck className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Attending by Event Session (Pax)</h3>
          </div>
          <div className="space-y-4">
            {sessionBreakdown.map(([name, pax]) => (
              <div key={name} className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 w-40 flex-shrink-0">{name}</span>
                <div className="flex-1 bg-slate-100 rounded-full overflow-hidden h-3">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: expectedAttendance > 0 ? `${Math.round((pax / expectedAttendance) * 100)}%` : "0%" }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-800 w-16 text-right">{pax} pax</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
