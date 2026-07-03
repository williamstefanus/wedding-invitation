"use client";

import { UserCheck, Users, CheckCircle, XCircle, Clock } from "lucide-react";

interface RsvpMetricsProps {
  invitations: any[];
  config?: any;
}

export function RsvpMetrics({ invitations = [], config = {} }: RsvpMetricsProps) {
  const getAttendanceStatus = (inv: any) => {
    const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
    return rsvp?.attendance_status || null;
  };

  const getConfirmedPax = (inv: any) => {
    const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
    return rsvp?.confirmed_pax || 0;
  };

  const attendingInvs = invitations.filter(inv => getAttendanceStatus(inv) === "attending").length;
  const declinedInvs = invitations.filter(inv => getAttendanceStatus(inv) === "declined" || getAttendanceStatus(inv) === "not_attending").length;
  const pendingInvs = invitations.length - attendingInvs - declinedInvs;

  const expectedAttendance = invitations.reduce((s, inv) => {
    if (getAttendanceStatus(inv) === "attending") return s + getConfirmedPax(inv);
    return s;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-up">
      {/* Expected Attendance */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-emerald-100 flex items-center gap-4 bg-gradient-to-br from-emerald-50/40 to-white">
        <div className="p-3 bg-emerald-100/80 text-emerald-600 rounded-xl">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Expected Attendance</p>
          <p className="text-3xl font-extrabold text-emerald-950 mt-0.5">{expectedAttendance} <span className="text-sm font-semibold text-emerald-600">pax</span></p>
        </div>
      </div>

      {/* Attending Invs */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Confirmed Attending</p>
          <p className="text-2xl font-bold text-slate-800 mt-0.5">{attendingInvs} <span className="text-sm font-medium text-slate-400">invitations</span></p>
        </div>
      </div>

      {/* Declined Invs */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
          <XCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Declined</p>
          <p className="text-2xl font-bold text-slate-800 mt-0.5">{declinedInvs} <span className="text-sm font-medium text-slate-400">invitations</span></p>
        </div>
      </div>

      {/* Pending Invs */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pending Response</p>
          <p className="text-2xl font-bold text-slate-800 mt-0.5">{pendingInvs} <span className="text-sm font-medium text-slate-400">invitations</span></p>
        </div>
      </div>
    </div>
  );
}
