"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { WEDDING_INVITATION_ASSETS } from "@/lib/constants";

interface ThankYouSectionProps {
  names?: string;
}

export function ThankYouSection({ names }: ThankYouSectionProps) {
  const { t } = useLanguage();
  const displayNames = names || "John & Jane";

  return (
    <section 
      className="relative w-full flex flex-col items-center pt-0 pb-16 z-10 overflow-hidden text-center bg-[#F7E392]"
    >
      
      {/* Tall Grass background filling the top section */}
      <div className="absolute top-0 left-0 w-full pointer-events-none opacity-100 z-0">
        <Image src={WEDDING_INVITATION_ASSETS.tallGrassDivider} alt="Tall Grass" width={750} height={579} className="w-full h-auto object-contain object-top" />
      </div>

      {/* Meadow Hills - Normal Document Flow to dictate height naturally */}
      <div className="relative w-full z-10 pointer-events-none mt-[25dvh]">
        <Image 
          src="/images/wedding/footer-meadow-hills.webp"
          alt="Meadow Hills"
          width={390}
          height={300}
          className="w-full h-auto object-cover object-top"
        />

        {/* Left Floral Bouquet anchored to the left and overlapping the hills */}
        <div className="absolute top-[-100px] left-[-140px] z-20 w-[360px] h-[480px]">
          <Image 
            src="/images/wedding/floral-bouquet-left.png" 
            fill 
            className="object-contain object-left-top" 
            alt="Floral Left" 
          />
        </div>

        {/* Right Floral Bouquet anchored to the hills */}
        <div className="absolute bottom-[0px] right-[-20px] z-20 w-[200px] h-[260px]">
          <Image 
            src="/images/wedding/floral-bouquet-right.png" 
            fill 
            className="object-contain object-right-bottom" 
            alt="Floral Right" 
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-30 w-full max-w-[390px] mx-auto px-6 flex flex-col items-center flex-1 justify-center mt-6 text-[#4B4B4B]"
      >
        <p className="text-[14px] mb-6 leading-relaxed px-4 whitespace-pre-line" style={{ fontFamily: "var(--font-alegreya)" }}>
          {t('greatestJoy')}
        </p>

        <h2 className="text-[4rem] mb-4 leading-none whitespace-nowrap" style={{ fontFamily: "var(--font-justwrite)" }}>
          {t('thankYou')}
        </h2>
        
        <p className="text-[14px] mb-12" style={{ fontFamily: "var(--font-alegreya)" }}>
          {t('forYourLove')}
        </p>

        <p className="text-[11px] tracking-wide mt-2 opacity-60" style={{ fontFamily: "var(--font-alegreya)" }}>
          &copy; {displayNames} 2026
        </p>
      </motion.div>
    </section>
  );
}
