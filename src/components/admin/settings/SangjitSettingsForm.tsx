"use client";

import { Clock, Calendar, MapPin, Link as LinkIcon, Music, MessageSquare } from "lucide-react";

interface SangjitSettingsFormProps {
  config: any;
  setConfig: (config: any) => void;
  deadlines: any;
  setDeadlines: (deadlines: any) => void;
  sessions: any;
  setSessions: (sessions: any) => void;
}

export function SangjitSettingsForm({
  config,
  setConfig,
  deadlines,
  setDeadlines,
  sessions,
  setSessions
}: SangjitSettingsFormProps) {
  return (
    <div className="space-y-8 animate-fade-up">

      {/* General Config */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-600" /> General Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Countdown Date/Time</label>
            <input
              type="datetime-local"
              value={config.sangjit_countdown_date ? new Date(config.sangjit_countdown_date).toISOString().slice(0, 16) : ""}
              onChange={e => setConfig({ ...config, sangjit_countdown_date: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              RSVP Edit Deadline
            </label>
            <input
              type="datetime-local"
              value={deadlines.sangjit ? new Date(deadlines.sangjit).toISOString().slice(0, 16) : ""}
              onChange={e => setDeadlines({ ...deadlines, sangjit: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
            />
            <p className="text-xs text-slate-400 mt-2">After this date, guests will not be able to modify their RSVP status.</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Music className="w-3 h-3" /> Background Music URL
            </label>
            <input
              type="text"
              placeholder="e.g. /audio/sangjit-bgm.mp3 or https://example.com/song.mp3"
              value={config.sangjit_music_url || ""}
              onChange={e => setConfig({ ...config, sangjit_music_url: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
            />
          </div>
        </div>
      </div>

      {/* Event Details */}
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

      {/* WhatsApp Message Template */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-rose-600" /> WhatsApp Message Template
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Use <code className="bg-slate-100 px-1 rounded text-rose-600 font-mono">{"{nama}"}</code> and{" "}
          <code className="bg-slate-100 px-1 rounded text-rose-600 font-mono">{"{link}"}</code> as placeholders.
          They will be replaced with the guest's name and invitation link when copying.
        </p>
        <textarea
          rows={5}
          value={config.wa_template_sangjit || ""}
          onChange={e => setConfig({ ...config, wa_template_sangjit: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-mono focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
          placeholder="Halo {nama}! ..."
        />
      </div>

    </div>
  );
}
