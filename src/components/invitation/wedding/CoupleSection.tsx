import Image from "next/image";
import { motion } from "framer-motion";
import { WEDDING_INVITATION_ASSETS } from "@/lib/constants/weddingInvitationAssets";

export function CoupleSection() {
  return (
    <section className="relative w-full flex flex-col items-center pt-8 pb-32 z-10 overflow-hidden bg-[#faf9f0]">
      
      {/* Background Hill Transition / Sky */}
      <div className="absolute top-0 w-full aspect-[390/359] z-0 pointer-events-none opacity-80">
        <Image src={WEDDING_INVITATION_ASSETS.envelopeGreenHillTransition} alt="Sky Transition" fill className="object-cover object-top" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 1.0 }}
        className="relative w-full max-w-[390px] mx-auto flex flex-col items-center z-10"
      >
        
        {/* Envelope Container */}
        <div className="relative w-full aspect-[390/417] pointer-events-none mt-[15%]">
          
          {/* 1. Envelope Back Panel (White Base with open flap) */}
          <div className="absolute inset-0 z-10">
            <Image src={WEDDING_INVITATION_ASSETS.envelopeBackPanel} alt="Envelope Back" fill className="object-contain object-top" />
          </div>

          {/* 2. Meadow Flap (Green Liner) */}
          <div className="absolute top-[2%] left-1/2 -translate-x-1/2 w-[82%] aspect-[318/320] z-20">
            <Image src={WEDDING_INVITATION_ASSETS.envelopeMeadowFlap} alt="Green Liner" fill className="object-contain object-top" />
          </div>

          {/* 3. Bouquets (Inside the envelope, on top of liner) */}
          <motion.div 
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[-10%] top-[0%] w-[85%] aspect-[295/307] z-30"
          >
            <Image src="/assets/wedding-invitation/floral-bouquet-left.png" alt="Bouquet Left" fill className="object-contain" />
          </motion.div>

        </div>

        {/* 4. Paper Card (Placed IN FRONT of the envelope, overlapping the bottom half) */}
        <div className="relative w-[85%] aspect-[710/982] -mt-[35%] z-40">
          <Image src={WEDDING_INVITATION_ASSETS.envelopePaperCard} alt="Paper Card" fill className="object-contain drop-shadow-xl" />
          
          {/* Card Content Overlay */}
          <div className="absolute inset-0 z-50 flex flex-col justify-start pt-[15%] px-[8%] pb-[10%]">
            
            {/* Groom */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex w-full items-start justify-between gap-1"
            >
              <div className="w-[85px] aspect-[120/140] relative rotate-[-4deg] ml-1 mt-2 shrink-0 drop-shadow-md">
                <div className="absolute inset-[8%] z-10 overflow-hidden bg-slate-200">
                  <Image src={WEDDING_INVITATION_ASSETS.groomPhotoWilliam} fill className="object-cover" alt="William" />
                </div>
                <Image src={WEDDING_INVITATION_ASSETS.stampFrame} fill className="object-contain z-20 drop-shadow-sm" alt="Stamp" />
              </div>

              <div className="flex flex-col text-right mt-1 w-full pl-2">
                <div className="flex flex-col items-end text-[#4B4B4B] text-[2.2rem] leading-[0.8]" style={{ fontFamily: "var(--font-justwrite)" }}>
                  <span>William</span>
                  <span className="-mr-2">Stefanus,</span>
                  <span>S.Kom</span>
                </div>
                <p className="text-[10px] text-[#4B4B4B] mt-3 leading-snug" style={{ fontFamily: "var(--font-alegreya)" }}>
                  First son of Mr. Hadi Stefanus<br/>& Mrs. Lanny Mariana
                </p>
              </div>
            </motion.div>

            {/* Middle */}
            <div className="text-center my-6 text-[#4B4B4B] text-lg" style={{ fontFamily: "var(--font-alegreya)" }}>
              – and –
            </div>

            {/* Bride */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex w-full items-start justify-between gap-1 flex-row-reverse"
            >
              <div className="w-[85px] aspect-[120/140] relative rotate-[4deg] mr-1 mt-2 shrink-0 drop-shadow-md">
                <div className="absolute inset-[8%] z-10 overflow-hidden bg-slate-200">
                  <Image src={WEDDING_INVITATION_ASSETS.bridePhotoAziel} fill className="object-cover object-top" alt="Aziel" />
                </div>
                <Image src={WEDDING_INVITATION_ASSETS.stampFrame} fill className="object-contain z-20 drop-shadow-sm" alt="Stamp" />
              </div>

              <div className="flex flex-col text-left mt-1 w-full pr-2">
                <div className="flex flex-col items-start text-[#4B4B4B] text-[2.2rem] leading-[0.8]" style={{ fontFamily: "var(--font-justwrite)" }}>
                  <span>Aziel</span>
                  <span className="-ml-1">Yorieza,</span>
                  <span>B.A</span>
                </div>
                <p className="text-[10px] text-[#4B4B4B] mt-3 leading-snug" style={{ fontFamily: "var(--font-alegreya)" }}>
                  Second daughter of<br/>Mr. Yopie Kusnandar &<br/>Mrs. Ina Rostiana Rahardja
                </p>
              </div>
            </motion.div>

          </div>
        </div>

        {/* 5. Envelope Front Panel (Overlaps the paper card's very bottom edge, but behind the card? Wait, no. If paper card is pulled out, front panel is usually behind it or overlapping it. Let's place it behind the card, but below the envelope back panel.) */}
        {/* Actually, in Screenshot 1, there is no visible front panel, the paper card covers it. We can omit it or place it behind. */}

        {/* 6. Wax Seal (Overlaps the top edge of the paper card AND the tip of the envelope liner) */}
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: false }}
          transition={{ type: "spring", stiffness: 120, damping: 10, delay: 1.2 }}
          className="absolute top-[41%] left-1/2 -translate-x-1/2 w-[70px] aspect-square z-50 pointer-events-none drop-shadow-md"
        >
          <Image src={WEDDING_INVITATION_ASSETS.waxSealGold} alt="Wax Seal" fill className="object-contain" />
        </motion.div>

      </motion.div>
    </section>
  );
}
