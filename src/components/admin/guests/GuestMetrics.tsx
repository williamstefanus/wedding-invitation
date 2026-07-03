"use client";

import { Mail, Users, UserCheck } from "lucide-react";

interface GuestMetricsProps {
  invitations: any[];
  config?: any;
}

export function GuestMetrics({ invitations = [], config = {} }: GuestMetricsProps) {
  const groomName = config.groom_first_name || "William";
  const brideName = config.bride_first_name || "Aziel";
  const totalInv = invitations.length;
  const totalPax = invitations.reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const relativesPax = invitations
    .filter(inv => inv.guest?.category === "Relatives")
    .reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const friendsPax = invitations
    .filter(inv => inv.guest?.category === "Friends")
    .reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const churchPax = invitations
    .filter(inv => inv.guest?.category === "Church")
    .reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const williamPax = invitations
    .filter(inv => inv.guest?.owner === "William")
    .reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const azielPax = invitations
    .filter(inv => inv.guest?.owner === "Aziel")
    .reduce((s, inv) => s + (inv.max_pax || 0), 0);

  const sentInv = invitations.filter(inv => !!inv.is_sent).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 animate-fade-up">
      {/* Total Inv */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Inv.</p>
          <p className="text-2xl font-bold text-slate-800">{totalInv}</p>
        </div>
      </div>

      {/* Total Pax Breakdown */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center col-span-2 md:col-span-1">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Pax</p>
            <p className="text-xl font-bold text-slate-800">{totalPax}</p>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-100 font-medium">
          <span>Rel: <b className="text-slate-700">{relativesPax}</b></span>
          <span>Fri: <b className="text-slate-700">{friendsPax}</b></span>
          <span>Chr: <b className="text-slate-700">{churchPax}</b></span>
        </div>
      </div>

      {/* Groom's Pax */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100/60 flex items-center gap-4 bg-gradient-to-br from-blue-50/30 to-white">
        <div className="p-3 bg-blue-100/70 text-blue-700 rounded-lg font-black text-sm">
          {groomName.charAt(0)}
        </div>
        <div>
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{groomName}&apos;s Pax</p>
          <p className="text-2xl font-extrabold text-blue-900">{williamPax}</p>
        </div>
      </div>

      {/* Bride's Pax */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-100/60 flex items-center gap-4 bg-gradient-to-br from-pink-50/30 to-white">
        <div className="p-3 bg-pink-100/70 text-pink-700 rounded-lg font-black text-sm">
          {brideName.charAt(0)}
        </div>
        <div>
          <p className="text-xs text-pink-600 font-bold uppercase tracking-wider">{brideName}&apos;s Pax</p>
          <p className="text-2xl font-extrabold text-pink-900">{azielPax}</p>
        </div>
      </div>

      {/* Sent Invitations */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 col-span-2 md:col-span-1">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Sent Invitations</p>
          <p className="text-2xl font-bold text-slate-800">
            {sentInv} <span className="text-sm font-medium text-slate-400">/ {totalInv}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
