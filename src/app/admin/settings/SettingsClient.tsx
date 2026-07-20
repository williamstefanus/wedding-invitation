"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { saveSettings } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/client";

import { WeddingSettingsForm } from "@/components/admin/settings/WeddingSettingsForm";
import { SangjitSettingsForm } from "@/components/admin/settings/SangjitSettingsForm";
import { GeneralSettingsForm } from "@/components/admin/settings/GeneralSettingsForm";

import { Box, Flex, Heading, Text, Button, Tabs, Callout } from "@radix-ui/themes";
import { CheckCircle2, XCircle } from "lucide-react";

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
    galleryImages: [],
    sangjitGalleryImages: [],
    faviconUrl: "",
    adminPassword: ""
  });

  const [uploading, setUploading] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
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

  const handleSangjitImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const fileName = `sangjit_${getFileStem(uploadFile.name)}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
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
        sangjitGalleryImages: [...(prev.sangjitGalleryImages || []), publicUrlData.publicUrl]
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

  const removeSangjitImage = (index: number) => {
    const newImages = [...(config.sangjitGalleryImages || [])];
    newImages.splice(index, 1);
    setConfig({ ...config, sangjitGalleryImages: newImages });
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SOURCE_IMAGE_BYTES) {
      showNotification('error', `File size exceeds ${formatBytes(MAX_SOURCE_IMAGE_BYTES)} limit.`);
      return;
    }

    setUploadingFavicon(true);
    try {
      const supabase = createClient();

      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `favicon_${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file, {
          cacheControl: '31536000',
          contentType: file.type || 'image/png',
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath);

      setConfig((prev: any) => ({
        ...prev,
        faviconUrl: publicUrlData.publicUrl
      }));

      showNotification('success', `Favicon uploaded successfully (${formatBytes(file.size)}).`);
    } catch (err: any) {
      showNotification('error', `Favicon upload failed: ${err.message}.`);
    } finally {
      e.target.value = "";
      setUploadingFavicon(false);
    }
  };

  return (
    <Box className="knotice-app" p={{ initial: "4", md: "7" }}>
      <Flex direction="column" gap="4" style={{ maxWidth: 1180, margin: "0 auto", paddingBottom: "96px" }}>
        
        <Flex direction={{ initial: "column", sm: "row" }} justify="between" align={{ initial: "start", sm: "center" }} gap="4" mb="4">
          <Box>
            <Heading size="8">Settings</Heading>
          </Box>
          <Button 
            size="3"
            color="red"
            variant="solid"
            onClick={handleSave}
            disabled={isSaving}
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </Flex>

        {notification && (
          <Callout.Root color={notification.type === 'success' ? 'green' : 'red'} mb="4">
            <Callout.Icon>
              {notification.type === 'success' ? <CheckCircle2 width={18} /> : <XCircle width={18} />}
            </Callout.Icon>
            <Callout.Text>
              {notification.text}
            </Callout.Text>
          </Callout.Root>
        )}

        <Tabs.Root value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <Tabs.List size="2" mb="6" style={{ width: "fit-content" }}>
            <Tabs.Trigger value="general">General</Tabs.Trigger>
            <Tabs.Trigger value="wedding">Wedding Celebration</Tabs.Trigger>
            <Tabs.Trigger value="sangjit">Sangjit Ceremony</Tabs.Trigger>
          </Tabs.List>

          <Box pt="2">
            <Tabs.Content value="general">
              <GeneralSettingsForm 
                config={config}
                setConfig={setConfig}
                uploadingFavicon={uploadingFavicon}
                handleFaviconUpload={handleFaviconUpload}
              />
            </Tabs.Content>

            <Tabs.Content value="wedding">
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
            </Tabs.Content>

            <Tabs.Content value="sangjit">
              <SangjitSettingsForm 
                config={config}
                setConfig={setConfig}
                deadlines={deadlines}
                setDeadlines={setDeadlines}
                sessions={sessions}
                setSessions={setSessions}
                uploading={uploading}
                handleSangjitImageUpload={handleSangjitImageUpload}
                removeSangjitImage={removeSangjitImage}
              />
            </Tabs.Content>
          </Box>
        </Tabs.Root>

      </Flex>
    </Box>
  );
}
