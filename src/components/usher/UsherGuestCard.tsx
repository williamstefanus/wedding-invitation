"use client";

import { useState } from "react";
import { CheckCircle2, UserCheck, Users, MapPin, FileText, Plus, Minus, Loader2 } from "lucide-react";

interface UsherGuestCardProps {
  invitation: any;
  onToggleCheckIn: (invId: string, actualPax: number, isCheckingIn: boolean) => Promise<void>;
  onOpenDetails: (inv: any) => void;
  config?: any;
}

export function UsherGuestCard({ invitation, onToggleCheckIn, onOpenDetails, config = {} }: UsherGuestCardProps) {
  const guest = invitation.guest || {};
  const rsvp = Array.isArray(invitation.rsvp) ? invitation.rsvp[0] : invitation.rsvp;
  const assignment = Array.isArray(invitation.seating_assignment) ? invitation.seating_assignment[0] : invitation.seating_assignment;

  const isCheckedIn = !!invitation.checked_in_at;
  const defaultPax = rsvp?.confirmed_pax || invitation.max_pax || 1;
  const [actualPax, setActualPax] = useState<number>(Math.min(defaultPax, invitation.checked_in_pax || defaultPax));
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggleCheckIn(invitation.id, Math.min(actualPax, defaultPax), !isCheckedIn);
    } finally {
      setLoading(false);
    }
  };

  const isVip = !!guest.notes?.toLowerCase().includes("vip");

  return (
    <div className={`rounded-2xl p-5 border transition-all duration-300 shadow-sm flex flex-col justify-between gap-4 ${
      isCheckedIn 
        ? "bg-emerald-50/70 border-emerald-300 shadow-emerald-500/5 opacity-85" 
        : isVip 
          ? "bg-gradient-to-br from-amber-50/60 via-white to-white border-amber-200/80 shadow-md" 
          : "bg-white border-slate-200 hover:border-slate-300"
    }`}>
      
      {/* Top Header */}
      <div>
        <div className="flex justify-between items-start gap-3 mb-2">
          <div onClick={() => onOpenDetails(invitation)} className="cursor-pointer group flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className={`text-lg font-black tracking-tight group-hover:underline ${isCheckedIn ? "text-emerald-900" : "text-slate-900"}`}>
                {guest.name || "Unnamed Guest"}
              </h3>
              {isVip && !isCheckedIn && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
                  ★ VIP
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className={`px-2 py-0.5 rounded-md ${guest.owner === "groom" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"}`}>
                {guest.owner === "groom" ? (config.groomFirstName || "John") : (config.brideFirstName || "Jane")}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-semibold">{guest.category}</span>
              <span className="text-amber-600 text-[10px] font-semibold underline opacity-0 group-hover:opacity-100 transition">View Details</span>
            </div>
          </div>

          {/* Table Badge */}
          <div className={`px-3 py-2 rounded-xl border text-center flex flex-col items-center justify-center min-w-[85px] ${
            assignment?.seating_table 
              ? "bg-purple-50 border-purple-200 text-purple-900" 
              : "bg-slate-100 border-slate-200 text-slate-500"
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Table
            </span>
            <span className="text-sm font-black mt-0.5">
              {assignment?.seating_table?.table_name || "Unassigned"}
            </span>
          </div>
        </div>

        {/* RSVP Info */}
        <div className="flex items-center gap-3 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100/80">
          <div className="flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>RSVP Status: <b className={`capitalize ${rsvp?.attendance_status === "attending" ? "text-emerald-600 font-bold" : "text-slate-700"}`}>{rsvp?.attendance_status || "Pending"}</b></span>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            Expected: <b className="text-slate-800 font-bold">{defaultPax} Pax</b>
          </div>
        </div>

        {/* Notes */}
        {guest.notes && (
          <div onClick={() => onOpenDetails(invitation)} className="mt-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-amber-900 text-xs flex items-start gap-2 cursor-pointer hover:bg-amber-100/80 transition">
            <FileText className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="font-medium line-clamp-2">{guest.notes}</p>
          </div>
        )}
      </div>

      {/* Check-In Action Bar */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
        {/* Headcount Stepper */}
        {!isCheckedIn ? (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActualPax(Math.max(1, actualPax - 1))}
              disabled={loading || actualPax <= 1}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-sm disabled:opacity-30 transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-black text-sm text-slate-800">
              {actualPax}
            </span>
            <button
              type="button"
              onClick={() => setActualPax(actualPax + 1)}
              disabled={loading || actualPax >= defaultPax}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-sm disabled:opacity-30 transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Arrived: <b>{invitation.checked_in_pax || actualPax} Pax</b>
          </div>
        )}

        {/* Check In Button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 ${
            isCheckedIn
              ? "bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-300"
              : "bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-emerald-600/20"
          }`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isCheckedIn ? (
            "Cancel Check-In"
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" /> Check In
            </>
          )}
        </button>
      </div>

    </div>
  );
}
