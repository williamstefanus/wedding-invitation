"use client";

import { Clock, Calendar, MapPin, Link as LinkIcon, Music, MessageSquare, Gift, Image as ImageIcon, UploadCloud, Trash2, Loader2 } from "lucide-react";

interface SangjitSettingsFormProps {
  config: any;
  setConfig: (config: any) => void;
  deadlines: any;
  setDeadlines: (deadlines: any) => void;
  sessions: any;
  setSessions: (sessions: any) => void;
  uploading: boolean;
  handleSangjitImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeSangjitImage: (index: number) => void;
}

export function SangjitSettingsForm({
  config,
  setConfig,
  deadlines,
  setDeadlines,
  sessions,
  setSessions,
  uploading,
  handleSangjitImageUpload,
  removeSangjitImage
}: SangjitSettingsFormProps) {
  const moveSangjitImage = (index: number, direction: 'left' | 'right') => {
    if (!config.sangjitGalleryImages) return;
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= config.sangjitGalleryImages.length) return;
    const updated = [...config.sangjitGalleryImages];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setConfig({ ...config, sangjitGalleryImages: updated });
  };
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
              value={config.sangjitCountdownDate ? new Date(config.sangjitCountdownDate).toISOString().slice(0, 16) : ""}
              onChange={e => setConfig({ ...config, sangjitCountdownDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              RSVP Submission Deadline
            </label>
            <input
              type="datetime-local"
              value={deadlines.sangjit ? new Date(deadlines.sangjit).toISOString().slice(0, 16) : ""}
              onChange={e => setDeadlines({ ...deadlines, sangjit: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
            />
            <p className="text-[10px] text-slate-400 mt-1">After this date, new RSVP submissions will be closed.</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Music className="w-3 h-3" /> Background Music URL
            </label>
            <input
              type="text"
              placeholder="e.g. /audio/sangjit-bgm.mp3 or https://example.com/song.mp3"
              value={config.sangjitMusicUrl || ""}
              onChange={e => setConfig({ ...config, sangjitMusicUrl: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
            />
          </div>
        </div>
      </div>

      {/* Sangjit Bible Verse */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          📖 Sangjit Bible Verse
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verse Text (EN)</label>
            <textarea 
              value={config.sangjitBibleVerseTextEn || ""} 
              onChange={e => setConfig({...config, sangjitBibleVerseTextEn: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition min-h-[100px]"
              placeholder="And over all these virtues put on love..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verse Text (ID)</label>
            <textarea 
              value={config.sangjitBibleVerseTextId || ""} 
              onChange={e => setConfig({...config, sangjitBibleVerseTextId: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition min-h-[100px]"
              placeholder="Dan di atas semuanya itu: kenakanlah kasih..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verse Reference (EN)</label>
            <input 
              type="text" 
              value={config.sangjitBibleVerseReferenceEn || ""} 
              onChange={e => setConfig({...config, sangjitBibleVerseReferenceEn: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
              placeholder="e.g. Colossians 3:14"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verse Reference (ID)</label>
            <input 
              type="text" 
              value={config.sangjitBibleVerseReferenceId || ""} 
              onChange={e => setConfig({...config, sangjitBibleVerseReferenceId: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
              placeholder="e.g. Kolose 3:14"
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

      {/* Gallery */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-rose-600" /> Image Gallery & Layout Preview
            </h2>
            <p className="text-sm text-slate-500 mt-1">Use arrow buttons to rearrange photos. The order below reflects the exact arrangement on the web invitation.</p>
          </div>
          <label className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer flex items-center gap-2 transition active:scale-95">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={handleSangjitImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {/* Web Layout Preview Structure */}
        <div className="space-y-6">
          {/* Section 1: Top Hero Image */}
          <div className="border border-rose-200 bg-rose-50/30 rounded-xl p-4">
            <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>🌟 Top Featured Hero Image (Web Cover)</span>
            </h3>
            {(!config.sangjitGalleryImages || config.sangjitGalleryImages.length === 0) ? (
              <p className="text-xs text-slate-400 italic">No images uploaded yet.</p>
            ) : (
              <div className="relative aspect-[16/9] max-w-md rounded-lg overflow-hidden border border-rose-300 group shadow-sm bg-white">
                <img src={config.sangjitGalleryImages[0]} alt="Hero preview" className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button type="button" onClick={() => moveSangjitImage(0, 'right')} disabled={config.sangjitGalleryImages.length <= 1} className="p-2 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-xs font-bold shadow disabled:opacity-30">
                    Move Next ▶
                  </button>
                  <button type="button" onClick={() => removeSangjitImage(0)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold shadow">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">#1 Featured</span>
              </div>
            )}
          </div>

          {/* Section 2: Bento Block 1 (Next 5 images) */}
          {config.sangjitGalleryImages && config.sangjitGalleryImages.length > 1 && (
            <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                🍱 Bento Grid Block 1 (Positions #2 to #6 on Web)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {config.sangjitGalleryImages.slice(1, 6).map((url: string, subIdx: number) => {
                  const actualIdx = subIdx + 1;
                  return (
                    <div key={actualIdx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 group bg-white shadow-sm">
                      <img src={url} alt="Bento item" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-1">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveSangjitImage(actualIdx, 'left')} className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded text-xs font-bold shadow">◀</button>
                          <button type="button" onClick={() => moveSangjitImage(actualIdx, 'right')} disabled={actualIdx === config.sangjitGalleryImages.length - 1} className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded text-xs font-bold shadow disabled:opacity-30">▶</button>
                        </div>
                        <button type="button" onClick={() => removeSangjitImage(actualIdx)} className="p-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">#{actualIdx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Bento Block 2 / Remaining Grid */}
          {config.sangjitGalleryImages && config.sangjitGalleryImages.length > 6 && (
            <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                📱 Additional Gallery Photos (Positions #7+ on Web)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {config.sangjitGalleryImages.slice(6).map((url: string, subIdx: number) => {
                  const actualIdx = subIdx + 6;
                  return (
                    <div key={actualIdx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 group bg-white shadow-sm">
                      <img src={url} alt="Grid item" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-1">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveSangjitImage(actualIdx, 'left')} className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded text-xs font-bold shadow">◀</button>
                          <button type="button" onClick={() => moveSangjitImage(actualIdx, 'right')} disabled={actualIdx === config.sangjitGalleryImages.length - 1} className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded text-xs font-bold shadow disabled:opacity-30">▶</button>
                        </div>
                        <button type="button" onClick={() => removeSangjitImage(actualIdx)} className="p-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">#{actualIdx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Message Template */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-rose-600" /> WhatsApp Message Template
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Use <code className="bg-slate-100 px-1 rounded text-rose-600 font-mono">{"{nama}"}</code>,{" "}
          <code className="bg-slate-100 px-1 rounded text-rose-600 font-mono">{"{link}"}</code>, and{" "}
          <code className="bg-slate-100 px-1 rounded text-rose-600 font-mono">{"{deadline}"}</code> as placeholders.
          They will be replaced dynamically when copying.
        </p>
        <textarea
          rows={5}
          value={config.waTemplateSangjit || ""}
          onChange={e => setConfig({ ...config, waTemplateSangjit: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-mono focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
          placeholder="Halo {nama}! ..."
        />
      </div>

    </div>
  );
}
