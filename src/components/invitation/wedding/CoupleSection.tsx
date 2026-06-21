import Image from "next/image";
import { AssetPlaceholder } from "@/components/ui/AssetPlaceholder";

export function CoupleSection() {
  return (
    <section className="relative w-full flex flex-col items-center py-16 bg-[#faf9f0] z-10 overflow-hidden">
      <div className="relative w-full max-w-lg mx-auto flex flex-col items-center z-20 pt-12">
        {/* The Envelope Image */}
        <div className="relative w-full aspect-square max-w-[400px]">
          <Image
            src="/images/floral_envelope.png"
            alt="Floral Envelope"
            fill
            className="object-contain"
          />
          {/* Wax Seal positioned at the bottom tip of the top green flap */}
          <div className="absolute top-[68%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="relative w-[70px] h-[70px]">
              <Image
                src="/images/wax_seal.png"
                alt="Wax Seal"
                fill
                className="object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>

      {/* The Letter / Envelope Body */}
      <div className="w-full max-w-md mx-auto px-4 z-10 flex flex-col gap-12 relative pb-16">
        
        {/* Groom Section */}
        <div className="flex flex-row items-center gap-6">
          <div className="relative shrink-0">
            {/* Postage Stamp shape */}
            <div className="bg-white p-2 shadow-lg rotate-[-4deg]">
              <AssetPlaceholder label="[stamp-frame-groom.png]" width="120px" height="140px" />
            </div>
          </div>
          
          <div className="flex flex-col text-slate-800">
            <h2 className="text-5xl mb-2" style={{ fontFamily: "var(--font-justwrite)" }}>
              William<br />Stefanus,<br />S.Kom
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: "var(--font-alegreya)" }}>
              First son of Mr. Hadi Stefanus<br />
              &amp; Mrs. Lanny Mariana
            </p>
          </div>
        </div>

        <div className="flex justify-center text-slate-400 italic" style={{ fontFamily: "var(--font-alegreya)" }}>
          – and –
        </div>

        {/* Bride Section */}
        <div className="flex flex-row-reverse items-center gap-6">
          <div className="relative shrink-0">
            {/* Postage Stamp shape */}
            <div className="bg-white p-2 shadow-lg rotate-[4deg]">
              <AssetPlaceholder label="[stamp-frame-bride.png]" width="120px" height="140px" />
            </div>
          </div>
          
          <div className="flex flex-col text-right text-slate-800">
            <h2 className="text-5xl mb-2" style={{ fontFamily: "var(--font-justwrite)" }}>
              Aziel<br />Yorieza,<br />B.A
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: "var(--font-alegreya)" }}>
              Second daughter of<br />
              Mr. Yopie Kusnandar &amp;<br />
              Mrs. Ina Rostiana Rahardja
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Decorative Bottom Grass Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[#416130] z-0 pointer-events-none" />
    </section>
  );
}
