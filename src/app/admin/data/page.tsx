import { fetchExistingIdentifiers } from "@/lib/actions/importExport";
import { DataClient } from "./DataClient";

export const revalidate = 0;

export default async function DataPage() {
  // Pre-fetch identifiers for duplicate validation
  const { data: identifiers } = await fetchExistingIdentifiers();

  return (
    <div className="min-h-screen pb-20">
      <DataClient existingIdentifiers={identifiers || []} />
    </div>
  );
}
