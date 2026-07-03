"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SANGJIT_INVITATION_ASSETS } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

interface SangjitOpeningScreenProps {
  guestName?: string | null;
  isOpen?: boolean;
  onOpen?: () => void;
  config?: any;
}

export function SangjitOpeningScreen({
  guestName,
  isOpen = false,
  onOpen,
  config = {}
}: SangjitOpeningScreenProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 1 }}
      animate={{ opacity: isOpen ? 0 : 1 }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
      className="fixed inset-0 z-50 w-full max-w-[480px] mx-auto bg-[#FFFDF9] flex flex-col justify-between items-center select-none overflow-hidden"
      style={{
        pointerEvents: isOpen ? "none" : "auto",
      }}
    >
      {/* Background watercolor mountain texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src={SANGJIT_INVITATION_ASSETS.sangjitWatercolorBackground}
          alt="Texture"
          fill
          priority
          className="object-cover object-top opacity-90"
        />
      </div>

      {/* Top spacing spacer */}
      <div className="h-8 sm:h-10 w-full flex-shrink-0" />

      {/* Main Center Content Area */}
      <div className="relative z-10 flex flex-col items-center px-6 w-full my-auto gap-8 sm:gap-10">
        {/* Opening Emblem (Double Happiness) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={language ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.0, delay: 0.1 }}
          className="relative w-[320px] h-[320px] flex justify-center flex-shrink-0"
        >
          <Image
            src={SANGJIT_INVITATION_ASSETS.sangjitOpeningEmblem}
            alt="Sangjit Emblem"
            fill
            priority
            className="object-contain"
          />
        </motion.div>

        {/* Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={language ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 1.0, delay: 0.3 }}
          className="flex flex-col items-center text-center text-[#761B33]"
        >
          <span className="text-[26px] sm:text-[32px] font-serif tracking-wider mb-1">
            {t('theSangjitOf')}
          </span>
          <span className="text-[52px] font-serif font-bold tracking-tight leading-none">
            {config.bride_first_name || "Aziel"} &amp; {config.groom_first_name || "William"}
          </span>
        </motion.div>

        {/* Guest Greeting & Open Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={language ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 1.0, delay: 0.5 }}
          className="w-full flex flex-col items-center gap-5 mt-2"
        >
          <div className="flex flex-col items-center text-center text-[#761B33]">
            <p className="text-[14px] font-sans font-medium tracking-wide opacity-90">
              {t('dear')}
            </p>
            <p className="text-[24px] font-serif font-bold mt-1 border-b border-[#761B33]/40 pb-1 px-6 min-w-[180px]">
              {guestName || ""}
            </p>
          </div>

          <motion.button
            whileHover={language ? { scale: 1.04 } : undefined}
            whileTap={language ? { scale: 0.96 } : undefined}
            onClick={language ? onOpen : undefined}
            disabled={!language}
            className={`w-[220px] h-[44px] bg-[#761B33] text-[#FAFAFA] rounded-[10px] shadow-lg font-sans font-medium text-[15px] tracking-wider transition-all flex items-center justify-center ${
              language
                ? "hover:bg-[#8A203C] cursor-pointer"
                : "opacity-60 grayscale cursor-not-allowed"
            }`}
          >
            {t('openInvitation')}
          </motion.button>
        </motion.div>
      </div>

      {/* Prominent Large Bottom Footer Flower Piece */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={language ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="relative z-20 w-[114%] pointer-events-none leading-none mt-auto flex-shrink-0 -mb-4"
      >
        <Image
          src={SANGJIT_INVITATION_ASSETS.sangjitBottomFloralWave}
          alt="Footer Floral Wave"
          width={600}
          height={260}
          priority
          className="w-full h-auto block object-contain object-bottom"
        />
      </motion.div>

      {/* Language Selection Modal Overlay */}
      <AnimatePresence>
        {!language && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 pointer-events-auto"
          >
            <div className="bg-[#FFFDF9] rounded-2xl shadow-2xl p-4 flex gap-3 w-[240px] justify-center border border-[#761B33]/20">
              <button
                onClick={() => setLanguage("en")}
                className="flex-1 flex flex-col items-center gap-2 p-2 border border-[#761B33]/15 rounded-xl hover:bg-[#761B33]/5 transition overflow-hidden"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden shadow-md flex-shrink-0 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" className="w-full h-full object-cover">
                     <clipPath id="s_en_sj">
                        <path d="M0,0 v60 h60 v-60 z"/>
                      </clipPath>
                      <clipPath id="t_en_sj">
                        <path d="M30,30 h30 v30 z v-30 h-30 z h-30 v-30 z v30 h30 z"/>
                      </clipPath>
                      <g clipPath="url(#s_en_sj)">
                        <path d="M0,0 v60 h60 v-60 z" fill="#012169"/>
                        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#fff" strokeWidth="6"/>
                        <path d="M0,0 L60,60 M60,0 L0,60" clipPath="url(#t_en_sj)" stroke="#C8102E" strokeWidth="4"/>
                        <path d="M30,0 v60 M0,30 h60" stroke="#fff" strokeWidth="10"/>
                        <path d="M30,0 v60 M0,30 h60" stroke="#C8102E" strokeWidth="6"/>
                      </g>
                  </svg>
                </div>
                <span className="text-[#761B33] font-serif text-[24px] font-medium tracking-tight leading-none">English</span>
              </button>
              <button
                onClick={() => setLanguage("id")}
                className="flex-1 flex flex-col items-center gap-2 p-2 border border-[#761B33]/15 rounded-xl hover:bg-[#761B33]/5 transition overflow-hidden"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden shadow-md flex-shrink-0 border border-gray-100 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" className="w-full h-full object-cover">
                    <rect width="60" height="30" fill="#ce1126"/>
                    <rect y="30" width="60" height="30" fill="#fff"/>
                  </svg>
                </div>
                <span className="text-[#761B33] font-serif text-[24px] font-medium tracking-tight leading-none">Indonesian</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
