"use client";

import { useState } from "react";
import { MetricCard } from "./components/MetricCard";
import { ProgressBar } from "./components/ProgressBar";
import { Users, UserCheck } from "lucide-react";

interface DashboardClientProps {
  invitations: any[];
  totalGuestsCount: number;
}

type FilterOption = "all" | "wedding" | "sangjit";

export function DashboardClient({ invitations, totalGuestsCount }: DashboardClientProps) {
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

  // Pax by Owner
  const ownerStats = ["William", "Aziel"].map(owner => {
    const ownerInvs = filteredInvitations.filter(inv => inv.guest?.owner === owner);
    const invitedPax = ownerInvs.reduce((s, inv) => s + (inv.max_pax || 0), 0);
    const attendingPax = ownerInvs.reduce((s, inv) => {
      if (getAttendanceStatus(inv) === "attending") return s + getConfirmedPax(inv);
      return s;
    }, 0);
    return { owner, invitedPax, attendingPax, invitations: ownerInvs.length };
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

      {/* Pax by Owner */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Total Pax by Side</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ownerStats.map(stat => (
            <div key={stat.owner} className={`rounded-xl p-5 border ${stat.owner === "William" ? "bg-blue-50 border-blue-100" : "bg-pink-50 border-pink-100"}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${stat.owner === "William" ? "text-blue-700" : "text-pink-700"}`}>
                    {stat.owner}
                  </p>
                  <p className="text-xs text-slate-500">{stat.invitations} invitations</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">{stat.invitedPax}</p>
                  <p className="text-xs text-slate-500">invited pax</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">Expected attendance</span>
                <span className={`font-bold ${stat.owner === "William" ? "text-blue-700" : "text-pink-700"}`}>{stat.attendingPax} pax</span>
              </div>
              <div className="mt-3 bg-white/60 rounded-lg overflow-hidden h-2">
                <div 
                  className={`h-full rounded-lg transition-all ${stat.owner === "William" ? "bg-blue-500" : "bg-pink-500"}`}
                  style={{ width: stat.invitedPax > 0 ? `${Math.round((stat.attendingPax / stat.invitedPax) * 100)}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

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
