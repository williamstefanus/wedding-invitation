"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ThankYouSectionProps {
  names?: string;
}

export function ThankYouSection({ names }: ThankYouSectionProps) {
  const displayNames = names || "William & Aziel";

  return (
    <section 
      className="relative w-full flex flex-col items-center pt-0 pb-16 z-10 overflow-hidden text-center"
      style={{
        background: "linear-gradient(to bottom, #E8E8E8 0%, #E8E8E8 35%, #F7E392 35%, #F7E392 100%)"
      }}
    >
      
      {/* Meadow Hills - Normal Document Flow to dictate height naturally */}
      <div className="relative w-full z-10 pointer-events-none mt-10">
        <Image 
          src="/images/footer-meadow-hills.png"
          alt="Meadow Hills"
          width={390}
          height={300}
          className="w-full h-auto object-cover object-top"
        />

        {/* Floral Bouquets absolutely positioned relative to the hills */}
        <div className="absolute top-[0px] left-[-30px] z-20 w-[180px] h-[240px]">
          <Image 
            src="/images/floral-bouquet-left.png" 
            fill 
            className="object-contain object-left-top" 
            alt="Floral Left" 
          />
        </div>

        {/* Right Floral Bouquet anchored to the hills */}
        <div className="absolute bottom-[-30px] right-[-30px] z-20 w-[160px] h-[200px]">
          <Image 
            src="/images/floral-bouquet-right.png" 
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
        className="relative z-30 w-full max-w-[390px] mx-auto px-6 flex flex-col items-center mt-12 text-[#4B4B4B]"
      >
        <p className="text-[14px] mb-6 leading-relaxed px-4" style={{ fontFamily: "var(--font-alegreya)" }}>
          It would be our greatest joy to have your presence<br />
          as we celebrate this special moment together.
        </p>

        <h2 className="text-[4rem] mb-4 leading-none whitespace-nowrap" style={{ fontFamily: "var(--font-justwrite)" }}>
          Thank You
        </h2>
        
        <p className="text-[16px] mb-12" style={{ fontFamily: "var(--font-alegreya)" }}>
          for your love and blessings
        </p>

        <p className="text-[13px] tracking-wide" style={{ fontFamily: "var(--font-alegreya)" }}>
          {displayNames} - 2026
        </p>
      </motion.div>
    </section>
  );
}
