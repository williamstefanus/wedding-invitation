"use client";

import React from "react";
import { motion } from "framer-motion";
import { SANGJIT_INVITATION_ASSETS } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

interface SangjitThankYouSectionProps {
  invitation?: any;
}

export function SangjitThankYouSection({ invitation }: SangjitThankYouSectionProps) {
  const { t } = useLanguage();
  const groomName = invitation?.groom?.nickname || invitation?.groom?.name || "William";
  const brideName = invitation?.bride?.nickname || invitation?.bride?.name || "Aziel";
  const year = new Date(invitation?.date || "2026-10-17").getFullYear() || "2026";
  const footerText = `${groomName} & ${brideName} - ${year}`;

  return (
    <section className="relative w-full bg-[#761B33] py-14 px-0 flex flex-col justify-center items-center select-none overflow-hidden z-20 min-h-[40dvh] gap-6">
      
      {/* Top Introductory Body Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[420px] px-6 text-center relative z-10"
      >
        <div style={{ textAlign: 'center', color: 'white', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 400, wordWrap: 'break-word', lineHeight: '22px', paddingLeft: 24, paddingRight: 24 }} className="whitespace-pre-line">
          {t('greatestJoy')}
        </div>
      </motion.div>

      {/* Outer 3-Column Canvas */}
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', minHeight: 220 }}>
        
        {/* Left Floral Column */}
        <div style={{ flex: '1 1 0', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <motion.img
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '250%', maxWidth: 'none', height: 'auto', display: 'block', transformOrigin: 'center', position: 'absolute', right: -48 }}
            src={SANGJIT_INVITATION_ASSETS.sangjitThankYouLeftFloral}
            alt="Left Floral"
          />
        </div>

        {/* Center Text Stack (flex: 1.2 1 0) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          style={{ flex: '1.2 1 0', paddingLeft: 8, paddingRight: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, position: 'relative', zIndex: 10 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
            <div style={{ textAlign: 'center', color: 'white', fontSize: 54.67, fontFamily: 'var(--font-egizio), EgizioEF Condensed, serif', fontWeight: 500, lineHeight: '51.39px', wordWrap: 'break-word' }}>
              {t('thankYou')}
            </div>

            <div style={{ textAlign: 'center', color: 'white', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>
              {t('forYourLoveAndBlessings')}
            </div>
          </div>

          <div style={{ textAlign: 'center', color: 'white', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>
            © {footerText}
          </div>
        </motion.div>

        {/* Right Floral Column */}
        <div style={{ flex: '1 1 0', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <motion.img
            initial={{ opacity: 0, x: 60, rotate: -19 }}
            whileInView={{ opacity: 1, x: 0, rotate: -19 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ width: '200%', maxWidth: 'none', height: 'auto', display: 'block', transformOrigin: 'center', position: 'absolute', left: -32 }}
            src={SANGJIT_INVITATION_ASSETS.sangjitThankYouRightFloral}
            alt="Right Floral"
          />
        </div>

      </div>

    </section>
  );
}
