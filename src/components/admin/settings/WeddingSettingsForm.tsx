"use client";

import { Settings, Clock, Music, Calendar, MapPin, Link as LinkIcon, Gift, Image as ImageIcon, UploadCloud, Trash2, Loader2, MessageSquare } from "lucide-react";

interface WeddingSettingsFormProps {
  config: any;
  setConfig: (config: any) => void;
  deadlines: any;
  setDeadlines: (deadlines: any) => void;
  sessions: any;
  setSessions: (sessions: any) => void;
  uploading: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export function WeddingSettingsForm({
  config,
  setConfig,
  deadlines,
  setDeadlines,
  sessions,
  setSessions,
  uploading,
  handleImageUpload,
  removeImage
}: WeddingSettingsFormProps) {
  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (!config.gallery_images) return;
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= config.gallery_images.length) return;
    const updated = [...config.gallery_images];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setConfig({ ...config, gallery_images: updated });
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* General Config */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-600" /> General Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Countdown Date/Time</label>
            <input 
              type="datetime-local" 
              value={config.countdown_date ? new Date(config.countdown_date).toISOString().slice(0, 16) : ""}
              onChange={e => setConfig({...config, countdown_date: e.target.value})}
              className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Music className="w-3 h-3"/> Background Music URL</label>
            <input 
              type="text" 
              placeholder="e.g. /audio/bgm.mp3 or https://example.com/song.mp3"
              value={config.music_url || ""} 
              onChange={e => setConfig({...config, music_url: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Clock className="w-3 h-3"/> RSVP Submission Deadline</label>
            <input 
              type="datetime-local" 
              value={deadlines.wedding ? new Date(deadlines.wedding).toISOString().slice(0, 16) : ""}
              onChange={e => setDeadlines({...deadlines, wedding: e.target.value})}
              className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            />
            <p className="text-xs text-slate-400 mt-2">After this date, new RSVP submissions will be closed. Guests cannot edit their RSVP once submitted.</p>
          </div>
        </div>
      </div>

      {/* Event Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Holy Matrimony */}
        {sessions.holyMatrimony && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" /> Holy Matrimony
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date</label>
                <input type="date" value={sessions.holyMatrimony.date} onChange={e => setSessions({...sessions, holyMatrimony: {...sessions.holyMatrimony, date: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Start Time</label>
                  <input type="time" value={sessions.holyMatrimony.start_time} onChange={e => setSessions({...sessions, holyMatrimony: {...sessions.holyMatrimony, start_time: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">End Time</label>
                  <input type="time" value={sessions.holyMatrimony.end_time} onChange={e => setSessions({...sessions, holyMatrimony: {...sessions.holyMatrimony, end_time: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1"><MapPin className="w-3 h-3 inline"/> Venue Name</label>
                <input type="text" value={sessions.holyMatrimony.venue_name} onChange={e => setSessions({...sessions, holyMatrimony: {...sessions.holyMatrimony, venue_name: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Address</label>
                <textarea value={sessions.holyMatrimony.address} onChange={e => setSessions({...sessions, holyMatrimony: {...sessions.holyMatrimony, address: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" rows={2} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1"><LinkIcon className="w-3 h-3 inline"/> Google Maps URL</label>
                <input type="text" value={sessions.holyMatrimony.google_maps_url} onChange={e => setSessions({...sessions, holyMatrimony: {...sessions.holyMatrimony, google_maps_url: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Reception */}
        {sessions.reception && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" /> Reception Dinner
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date</label>
                <input type="date" value={sessions.reception.date} onChange={e => setSessions({...sessions, reception: {...sessions.reception, date: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Start Time</label>
                  <input type="time" value={sessions.reception.start_time} onChange={e => setSessions({...sessions, reception: {...sessions.reception, start_time: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">End Time</label>
                  <input type="time" value={sessions.reception.end_time} onChange={e => setSessions({...sessions, reception: {...sessions.reception, end_time: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1"><MapPin className="w-3 h-3 inline"/> Venue Name</label>
                <input type="text" value={sessions.reception.venue_name} onChange={e => setSessions({...sessions, reception: {...sessions.reception, venue_name: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Address</label>
                <textarea value={sessions.reception.address} onChange={e => setSessions({...sessions, reception: {...sessions.reception, address: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" rows={2} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1"><LinkIcon className="w-3 h-3 inline"/> Google Maps URL</label>
                <input type="text" value={sessions.reception.google_maps_url} onChange={e => setSessions({...sessions, reception: {...sessions.reception, google_maps_url: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wedding Bible Verse */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          📖 Wedding Bible Verse
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verse Text (EN)</label>
            <textarea 
              value={config.bible_verse_text_en || ""} 
              onChange={e => setConfig({...config, bible_verse_text_en: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition min-h-[100px]"
              placeholder="Every good and perfect gift is from above..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verse Text (ID)</label>
            <textarea 
              value={config.bible_verse_text_id || ""} 
              onChange={e => setConfig({...config, bible_verse_text_id: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition min-h-[100px]"
              placeholder="Semua yang baik datang dari Allah..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verse Reference (EN)</label>
            <input 
              type="text" 
              value={config.bible_verse_reference_en || ""} 
              onChange={e => setConfig({...config, bible_verse_reference_en: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              placeholder="e.g. James 1:17"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verse Reference (ID)</label>
            <input 
              type="text" 
              value={config.bible_verse_reference_id || ""} 
              onChange={e => setConfig({...config, bible_verse_reference_id: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              placeholder="e.g. Yakobus 1:17"
            />
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-600" /> Image Gallery & Layout Preview
            </h2>
            <p className="text-sm text-slate-500 mt-1">Use arrow buttons to rearrange photos. The order below reflects the exact arrangement on the web invitation.</p>
          </div>
          <label className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer flex items-center gap-2 transition active:scale-95">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {/* Web Layout Preview Structure */}
        <div className="space-y-6">
          {/* Section 1: Top Hero Image */}
          <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-4">
            <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>🌟 Top Featured Hero Image (Web Cover)</span>
            </h3>
            {(!config.gallery_images || config.gallery_images.length === 0) ? (
              <p className="text-xs text-slate-400 italic">No images uploaded yet.</p>
            ) : (
              <div className="relative aspect-[16/9] max-w-md rounded-lg overflow-hidden border border-amber-300 group shadow-sm bg-white">
                <img src={config.gallery_images[0]} alt="Hero preview" className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button type="button" onClick={() => moveImage(0, 'right')} disabled={config.gallery_images.length <= 1} className="p-2 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-xs font-bold shadow disabled:opacity-30">
                    Move Next ▶
                  </button>
                  <button type="button" onClick={() => removeImage(0)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold shadow">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">#1 Featured</span>
              </div>
            )}
          </div>

          {/* Section 2: Bento Block 1 (Next 5 images) */}
          {config.gallery_images && config.gallery_images.length > 1 && (
            <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                🍱 Bento Grid Block 1 (Positions #2 to #6 on Web)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {config.gallery_images.slice(1, 6).map((url: string, subIdx: number) => {
                  const actualIdx = subIdx + 1;
                  return (
                    <div key={actualIdx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 group bg-white shadow-sm">
                      <img src={url} alt="Bento item" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-1">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveImage(actualIdx, 'left')} className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded text-xs font-bold shadow">◀</button>
                          <button type="button" onClick={() => moveImage(actualIdx, 'right')} disabled={actualIdx === config.gallery_images.length - 1} className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded text-xs font-bold shadow disabled:opacity-30">▶</button>
                        </div>
                        <button type="button" onClick={() => removeImage(actualIdx)} className="p-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs">
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
          {config.gallery_images && config.gallery_images.length > 6 && (
            <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                📱 Additional Gallery Photos (Positions #7+ on Web)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {config.gallery_images.slice(6).map((url: string, subIdx: number) => {
                  const actualIdx = subIdx + 6;
                  return (
                    <div key={actualIdx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 group bg-white shadow-sm">
                      <img src={url} alt="Grid item" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-1">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveImage(actualIdx, 'left')} className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded text-xs font-bold shadow">◀</button>
                          <button type="button" onClick={() => moveImage(actualIdx, 'right')} disabled={actualIdx === config.gallery_images.length - 1} className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded text-xs font-bold shadow disabled:opacity-30">▶</button>
                        </div>
                        <button type="button" onClick={() => removeImage(actualIdx)} className="p-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs">
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
          <MessageSquare className="w-5 h-5 text-amber-600" /> WhatsApp Message Template
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Use <code className="bg-slate-100 px-1 rounded text-amber-600 font-mono">{"{nama}"}</code>,{" "}
          <code className="bg-slate-100 px-1 rounded text-amber-600 font-mono">{"{link}"}</code>, and{" "}
          <code className="bg-slate-100 px-1 rounded text-amber-600 font-mono">{"{deadline}"}</code> as placeholders.
          They will be replaced dynamically when copying.
        </p>
        <textarea
          rows={5}
          value={config.wa_template_wedding || ""}
          onChange={e => setConfig({ ...config, wa_template_wedding: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
          placeholder="Halo {nama}! ..."
        />
      </div>

    </div>
  );
}
