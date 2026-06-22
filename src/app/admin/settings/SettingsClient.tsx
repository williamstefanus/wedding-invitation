"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Image as ImageIcon, Plus, Trash2, Calendar, MapPin, Link as LinkIcon, Music, Gift, Clock, UploadCloud, X, Settings } from "lucide-react";
import { saveSettings } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/client";

interface SettingsClientProps {
  initialData: any;
}

export function SettingsClient({ initialData }: SettingsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"wedding" | "sangjit">("wedding");
  
  // State
  const [deadlines, setDeadlines] = useState(initialData.deadlines || { wedding: "", sangjit: "" });
  const [sessions, setSessions] = useState(initialData.sessions || { holyMatrimony: null, reception: null, sangjit: null });
  const [config, setConfig] = useState(initialData.config || {
    couple_names: "William & Aziel",
    music_url: "",
    countdown_date: "",
    gift_bank: "",
    gift_account: "",
    gift_name: "",
    gallery_images: []
  });

  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const payload = { deadlines, sessions, config };
    const res = await saveSettings(payload);
    setIsSaving(false);

    if (res.success) {
      alert("Settings saved successfully!");
      startTransition(() => {
        router.refresh();
      });
    } else {
      alert("Failed to save settings: " + res.error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5MB Limit
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath);

      setConfig((prev: any) => ({
        ...prev,
        gallery_images: [...(prev.gallery_images || []), publicUrlData.publicUrl]
      }));

    } catch (err: any) {
      alert(`Upload failed: ${err.message}. Ensure 'gallery' bucket exists and is public.`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(config.gallery_images || [])];
    newImages.splice(index, 1);
    setConfig({ ...config, gallery_images: newImages });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 font-sans pb-24">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1">Manage public invitation content dynamically.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center gap-2 shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl mb-8 w-fit">
        <button 
          onClick={() => setActiveTab("wedding")}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'wedding' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Wedding Celebration
        </button>
        <button 
          onClick={() => setActiveTab("sangjit")}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'sangjit' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Sangjit Ceremony
        </button>
      </div>

      {activeTab === "wedding" && (
        <div className="space-y-8 animate-fade-up">
          
          {/* General Config */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-600" /> General Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Couple Names</label>
                <input 
                  type="text" 
                  value={config.couple_names || ""} 
                  onChange={e => setConfig({...config, couple_names: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Countdown Date/Time</label>
                <input 
                  type="datetime-local" 
                  value={config.countdown_date ? new Date(config.countdown_date).toISOString().slice(0, 16) : ""}
                  onChange={e => setConfig({...config, countdown_date: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
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
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Clock className="w-3 h-3"/> RSVP Edit Deadline</label>
                <input 
                  type="datetime-local" 
                  value={deadlines.wedding ? new Date(deadlines.wedding).toISOString().slice(0, 16) : ""}
                  onChange={e => setDeadlines({...deadlines, wedding: e.target.value})}
                  className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
                <p className="text-xs text-slate-400 mt-2">After this date, guests will not be able to modify their RSVP status.</p>
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

          {/* Gift Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-600" /> Gift Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bank Name</label>
                <input type="text" value={config.gift_bank || ""} onChange={e => setConfig({...config, gift_bank: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" placeholder="e.g. BCA"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Number</label>
                <input type="text" value={config.gift_account || ""} onChange={e => setConfig({...config, gift_account: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" placeholder="e.g. 1234567890"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recipient Name</label>
                <input type="text" value={config.gift_name || ""} onChange={e => setConfig({...config, gift_name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" placeholder="e.g. William Stefanus"/>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-600" /> Image Gallery
            </h2>
            <p className="text-sm text-slate-500 mb-6">Upload images directly to Supabase Storage (Max 5MB per file).</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {config.gallery_images?.map((url: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200">
                  <img src={url} alt="Gallery item" className="object-cover w-full h-full" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition hover:bg-amber-50 relative">
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-500">Upload Image</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

        </div>
      )}

      {activeTab === "sangjit" && (
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
      )}
    </div>
  );
}
