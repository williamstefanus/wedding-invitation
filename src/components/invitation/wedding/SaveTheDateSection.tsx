import { AssetPlaceholder } from "@/components/ui/AssetPlaceholder";

export function SaveTheDateSection() {
  return (
    <section className="w-full flex flex-col items-center py-16 bg-[#416130] z-20 relative">
      <div className="relative mb-8">
        <AssetPlaceholder label="[gold-badge.png]" width="140px" height="140px" className="rounded-full bg-yellow-600/20 border-yellow-500 text-yellow-200" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-yellow-100 uppercase tracking-widest text-sm" style={{ fontFamily: "var(--font-alegreya)" }}>Save</span>
          <span className="text-yellow-100 uppercase tracking-widest text-xs" style={{ fontFamily: "var(--font-alegreya)" }}>— The —</span>
          <span className="text-yellow-100 uppercase tracking-widest text-2xl" style={{ fontFamily: "var(--font-alegreya)" }}>Date</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-[#faf9f0]" style={{ fontFamily: "var(--font-alegreya)" }}>
        <span className="text-2xl font-light">Friday,</span>
        <span className="text-4xl font-medium">23 Oct 2026</span>
      </div>
    </section>
  );
}
