"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { saveSettings } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/client";

import { WeddingSettingsForm } from "@/components/admin/settings/WeddingSettingsForm";
import { SangjitSettingsForm } from "@/components/admin/settings/SangjitSettingsForm";
import { GeneralSettingsForm } from "@/components/admin/settings/GeneralSettingsForm";

interface SettingsClientProps {
  initialData: any;
}

export function SettingsClient({ initialData }: SettingsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "wedding" | "sangjit">("general");
  
  // State
  const [deadlines, setDeadlines] = useState(initialData.deadlines || { wedding: "", sangjit: "" });
  const [sessions, setSessions] = useState(initialData.sessions || { holyMatrimony: null, reception: null, sangjit: null });
  const [config, setConfig] = useState(initialData.config || {
    groom_first_name: "William",
    groom_last_name: "Stefanus",
    groom_title: "S.Kom",
    groom_parents: "Mr. Hadi Stefanus & Mrs. Lanny Mariana",
    groom_order_title: "First son of",
    phone_groom: "",
    gift_bank_groom: "",
    gift_account_groom: "",
    gift_name_groom: "",
    
    bride_first_name: "Aziel",
    bride_last_name: "Yorieza",
    bride_title: "B.A",
    bride_parents: "Mr. Yopie Kusnandar & Mrs. Ina Rostiana Rahardja",
    bride_order_title: "Second daughter of",
    phone_bride: "",
    gift_bank_bride: "",
    gift_account_bride: "",
    gift_name_bride: "",
    
    wo_pin: "123456",
    music_url: "",
    countdown_date: "",
    gallery_images: []
  });

  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = { deadlines, sessions, config };
    const res = await saveSettings(payload);
    setIsSaving(false);

    if (res.success) {
      showNotification('success', "Settings saved successfully!");
      startTransition(() => {
        router.refresh();
      });
    } else {
      showNotification('error', "Failed to save settings: " + res.error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5MB Limit
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', "File size exceeds 5MB limit.");
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
      showNotification('error', `Upload failed: ${err.message}. Ensure 'gallery' bucket exists and is public.`);
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
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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

      {notification && (
        <div className={`p-4 rounded-xl mb-6 font-bold flex items-center gap-2 shadow-sm transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>{notification.type === 'success' ? '✓' : '✕'}</span>
          <span>{notification.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-200/50 rounded-xl mb-8 w-fit">
        <button 
          onClick={() => setActiveTab("general")}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'general' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          General
        </button>
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

      {activeTab === "general" && (
        <GeneralSettingsForm 
          config={config}
          setConfig={setConfig}
        />
      )}

      {activeTab === "wedding" && (
        <WeddingSettingsForm 
          config={config}
          setConfig={setConfig}
          deadlines={deadlines}
          setDeadlines={setDeadlines}
          sessions={sessions}
          setSessions={setSessions}
          uploading={uploading}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
        />
      )}

      {activeTab === "sangjit" && (
        <SangjitSettingsForm 
          config={config}
          setConfig={setConfig}
          deadlines={deadlines}
          setDeadlines={setDeadlines}
          sessions={sessions}
          setSessions={setSessions}
        />
      )}

    </div>
  );
}
