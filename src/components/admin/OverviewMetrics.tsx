"use client";

import { Users } from "lucide-react";
import { ProgressBar } from "@/app/admin/components/ProgressBar";

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

  const groomName = config.groomFirstName || "John";
  const brideName = config.brideFirstName || "Jane";

  const ownerStats = [
    { key: "groom", displayName: groomName },
    { key: "bride", displayName: brideName }
  ].map(({ key, displayName }) => {
    const ownerInvs = invitations.filter(inv => inv.guest?.owner === key);
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 animate-fade-up">
      {ownerStats.map(stat => {
        const isWilliam = stat.owner === "groom";
        const headerBg = isWilliam ? "bg-blue-50 border-blue-100" : "bg-pink-50 border-pink-100";
        const titleColor = isWilliam ? "text-blue-700" : "text-pink-700";
        const barColor = isWilliam ? "bg-blue-500" : "bg-pink-500";

        return (
          <div key={stat.owner} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            {/* Owner Header */}
            <div className={`p-6 border-b ${headerBg} flex justify-between items-center`}>
              <div>
                <h3 className={`text-xl font-black tracking-wider uppercase ${titleColor}`}>
                  {stat.displayName}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.invitations} Total Invitations</p>
              </div>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Users className={`w-5 h-5 ${titleColor}`} />
              </div>
            </div>

            <div className="p-6 space-y-8 flex-1 flex flex-col justify-between">
              {/* Total Pax Subsection */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  Total Pax Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100/80">
                    <p className="text-slate-500 text-xs font-medium mb-1">Invited Pax</p>
                    <p className="text-2xl font-extrabold text-slate-800">{stat.invitedPax}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100/80">
                    <p className="text-slate-500 text-xs font-medium mb-1">Expected Attendance</p>
                    <p className={`text-2xl font-extrabold ${titleColor}`}>{stat.attendingPax}</p>
                  </div>
                </div>
                <ProgressBar 
                  label="Pax Attendance Rate" 
                  value={stat.attendingPax} 
                  total={stat.invitedPax} 
                  colorClass={barColor}
                  format="percentage"
                />
              </div>

              <hr className="border-slate-100" />

              {/* RSVP Status Subsection */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  RSVP Status Breakdown
                </h4>
                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-green-50/70 border border-green-100 rounded-lg p-3">
                    <p className="text-green-700 text-xs font-bold mb-1">Attending</p>
                    <p className="text-xl font-extrabold text-green-600">{stat.attendingInvs}</p>
                  </div>
                  <div className="bg-rose-50/70 border border-rose-100 rounded-lg p-3">
                    <p className="text-rose-700 text-xs font-bold mb-1">Declined</p>
                    <p className="text-xl font-extrabold text-rose-500">{stat.declinedInvs}</p>
                  </div>
                  <div className="bg-amber-50/70 border border-amber-100 rounded-lg p-3">
                    <p className="text-amber-700 text-xs font-bold mb-1">Pending</p>
                    <p className="text-xl font-extrabold text-amber-600">{stat.pendingInvs}</p>
                  </div>
                </div>
                <ProgressBar 
                  label="Response Rate" 
                  value={stat.respondedInvs} 
                  total={stat.invitations} 
                  colorClass="bg-[#416130]"
                  format="percentage"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
