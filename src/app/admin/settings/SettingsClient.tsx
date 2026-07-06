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

const MAX_SOURCE_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_OPTIMIZED_IMAGE_BYTES = 2.5 * 1024 * 1024;
const GALLERY_IMAGE_MAX_DIMENSION = 1600;
const GALLERY_IMAGE_QUALITY = 0.78;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)}KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function getFileStem(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "") || "gallery";
}

async function loadImageElement(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new window.Image();
    image.decoding = "async";
    image.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Unable to read the selected image."));
    });

    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function optimizeImageForUpload(file: File) {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return { file, optimized: false };
  }

  const image = await loadImageElement(file);
  const scale = Math.min(1, GALLERY_IMAGE_MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) {
    return { file, optimized: false };
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", GALLERY_IMAGE_QUALITY);
  });

  if (!blob || blob.size >= file.size) {
    return { file, optimized: false };
  }

  return {
    file: new File([blob], `${getFileStem(file.name)}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    }),
    optimized: true,
  };
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
    groomFirstName: "William",
    groomLastName: "Stefanus",
    groomTitle: "S.Kom",
    groomParents: "Mr. Hadi Stefanus & Mrs. Lanny Mariana",
    groomOrderTitle: "First son of",
    phoneGroom: "",
    giftBankGroom: "",
    giftAccountGroom: "",
    giftNameGroom: "",
    
    brideFirstName: "Aziel",
    brideLastName: "Yorieza",
    brideTitle: "B.A",
    brideParents: "Mr. Yopie Kusnandar & Mrs. Ina Rostiana Rahardja",
    brideOrderTitle: "Second daughter of",
    phoneBride: "",
    giftBankBride: "",
    giftAccountBride: "",
    giftNameBride: "",
    
    woPin: "123456",
    musicUrl: "",
    countdownDate: "",
    galleryImages: []
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

    if (file.size > MAX_SOURCE_IMAGE_BYTES) {
      showNotification('error', `File size exceeds ${formatBytes(MAX_SOURCE_IMAGE_BYTES)} limit.`);
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const { file: uploadFile, optimized } = await optimizeImageForUpload(file);

      if (uploadFile.size > MAX_OPTIMIZED_IMAGE_BYTES) {
        showNotification('error', `Optimized image is still too large (${formatBytes(uploadFile.size)}). Please choose a smaller image.`);
        return;
      }

      const fileExt = uploadFile.name.split('.').pop() || 'webp';
      const fileName = `${getFileStem(uploadFile.name)}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, uploadFile, {
          cacheControl: '31536000',
          contentType: uploadFile.type || 'application/octet-stream',
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath);

      setConfig((prev: any) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), publicUrlData.publicUrl]
      }));

      if (optimized) {
        showNotification('success', `Image optimized from ${formatBytes(file.size)} to ${formatBytes(uploadFile.size)} and uploaded.`);
      } else {
        showNotification('success', `Image uploaded (${formatBytes(uploadFile.size)}).`);
      }
    } catch (err: any) {
      showNotification('error', `Upload failed: ${err.message}. Ensure 'gallery' bucket exists and is public.`);
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(config.galleryImages || [])];
    newImages.splice(index, 1);
    setConfig({ ...config, galleryImages: newImages });
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
