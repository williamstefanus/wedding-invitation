import { SettingsClient } from "./SettingsClient";
import { getSettings } from "@/lib/actions/settings";

export const revalidate = 0;

export default async function SettingsPage() {
  const settingsRes = await getSettings();
  
  if (!settingsRes.success) {
    return (
      <div className="p-8 text-red-500">
        Failed to load settings: {settingsRes.error}
      </div>
    );
  }

  return <SettingsClient initialData={settingsRes.data} />;
}
