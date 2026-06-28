import { getUsherRoster } from "@/lib/actions/usher";
import { getSeatingData } from "@/lib/actions/seating";
import { UsherClient } from "./UsherClient";

export const revalidate = 0;

export default async function UsherPage() {
  const [weddingRes, sangjitRes, weddingTablesRes, sangjitTablesRes] = await Promise.all([
    getUsherRoster("wedding"),
    getUsherRoster("sangjit"),
    getSeatingData("wedding"),
    getSeatingData("sangjit")
  ]);

  return (
    <UsherClient
      initialWeddingRoster={weddingRes.success ? weddingRes.data : []}
      initialSangjitRoster={sangjitRes.success ? sangjitRes.data : []}
      initialWeddingTables={weddingTablesRes.success ? weddingTablesRes.data : []}
      initialSangjitTables={sangjitTablesRes.success ? sangjitTablesRes.data : []}
    />
  );
}
