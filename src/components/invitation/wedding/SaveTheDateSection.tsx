import Image from "next/image";
import { WEDDING_INVITATION_ASSETS } from "@/lib/constants/weddingInvitationAssets";

export function SaveTheDateSection() {
  return (
    <section className="w-full flex flex-col items-center py-16 bg-[#416130] z-20 relative">
      <div className="relative mb-8 flex justify-center items-center w-[140px] h-[140px]">
        <Image src={WEDDING_INVITATION_ASSETS.saveDateGoldBadge} alt="Save The Date Badge" fill className="object-contain drop-shadow-lg" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <span className="text-yellow-900 uppercase tracking-widest text-[10px]" style={{ fontFamily: "var(--font-alegreya)" }}>Save</span>
          <span className="text-yellow-900 uppercase tracking-widest text-[8px] my-1" style={{ fontFamily: "var(--font-alegreya)" }}>— The —</span>
          <span className="text-yellow-900 uppercase tracking-widest text-xl font-bold" style={{ fontFamily: "var(--font-alegreya)" }}>Date</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-[#faf9f0]" style={{ fontFamily: "var(--font-alegreya)" }}>
        <span className="text-2xl font-light">Friday,</span>
        <span className="text-4xl font-medium">23 Oct 2026</span>
      </div>
    </section>
  );
}
