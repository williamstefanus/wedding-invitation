"use client";

import { Clock, Calendar, MapPin, Link as LinkIcon } from "lucide-react";

interface SangjitSettingsFormProps {
  deadlines: any;
  setDeadlines: (deadlines: any) => void;
  sessions: any;
  setSessions: (sessions: any) => void;
}

export function SangjitSettingsForm({
  deadlines,
  setDeadlines,
  sessions,
  setSessions
}: SangjitSettingsFormProps) {
  return (
    <div className="space-y-8 animate-fade-up">
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-600" /> RSVP Configuration
        </h2>
        <div className="md:w-1/2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">RSVP Edit Deadline</label>
          <input 
            type="datetime-local" 
            value={deadlines.sangjit ? new Date(deadlines.sangjit).toISOString().slice(0, 16) : ""}
            onChange={e => setDeadlines({...deadlines, sangjit: e.target.value})}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
          />
          <p className="text-xs text-slate-400 mt-2">After this date, guests will not be able to modify their RSVP status.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-600" /> Event Details
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date</label>
            <input type="date" value={sessions.sangjit?.date || ""} onChange={e => setSessions({...sessions, sangjit: {...(sessions.sangjit || {}), date: e.target.value}})} className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
          </div>
          <div className="grid grid-cols-2 md:w-1/2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Start Time</label>
              <input type="time" value={sessions.sangjit?.start_time || ""} onChange={e => setSessions({...sessions, sangjit: {...(sessions.sangjit || {}), start_time: e.target.value}})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">End Time</label>
              <input type="time" value={sessions.sangjit?.end_time || ""} onChange={e => setSessions({...sessions, sangjit: {...(sessions.sangjit || {}), end_time: e.target.value}})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1"><MapPin className="w-3 h-3 inline"/> Venue Name</label>
            <input type="text" value={sessions.sangjit?.venue_name || ""} onChange={e => setSessions({...sessions, sangjit: {...(sessions.sangjit || {}), venue_name: e.target.value}})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Address</label>
            <textarea value={sessions.sangjit?.address || ""} onChange={e => setSessions({...sessions, sangjit: {...(sessions.sangjit || {}), address: e.target.value}})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1"><LinkIcon className="w-3 h-3 inline"/> Google Maps URL</label>
            <input type="text" value={sessions.sangjit?.google_maps_url || ""} onChange={e => setSessions({...sessions, sangjit: {...(sessions.sangjit || {}), google_maps_url: e.target.value}})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
          </div>
        </div>
      </div>

    </div>
  );
}
