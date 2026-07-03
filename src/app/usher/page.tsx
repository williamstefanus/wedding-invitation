import { getUsherRoster } from "@/lib/actions/usher";
import { getSeatingData } from "@/lib/actions/seating";
import { getSettings } from "@/lib/actions/settings";
import { UsherClient } from "./UsherClient";

export const revalidate = 0;

export default async function UsherPage() {
  const [weddingRes, sangjitRes, weddingTablesRes, sangjitTablesRes, settingsRes] = await Promise.all([
    getUsherRoster("wedding"),
    getUsherRoster("sangjit"),
    getSeatingData("wedding"),
    getSeatingData("sangjit"),
    getSettings()
  ]);

  const config = (settingsRes.success ? settingsRes.data?.config : {}) as any;

  return (
    <UsherClient
      initialWeddingRoster={weddingRes.success ? weddingRes.data : []}
      initialSangjitRoster={sangjitRes.success ? sangjitRes.data : []}
      initialWeddingTables={weddingTablesRes.success ? weddingTablesRes.data : []}
      initialSangjitTables={sangjitTablesRes.success ? sangjitTablesRes.data : []}
      config={config}
    />
  );
}
