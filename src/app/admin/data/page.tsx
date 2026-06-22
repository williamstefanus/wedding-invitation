import { fetchExistingIdentifiers } from "@/lib/actions/importExport";
import { DataClient } from "./DataClient";

export const revalidate = 0;

export default async function DataPage() {
  // Pre-fetch identifiers for duplicate validation
  const { data: identifiers } = await fetchExistingIdentifiers();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <DataClient existingIdentifiers={identifiers || []} />
    </div>
  );
}
