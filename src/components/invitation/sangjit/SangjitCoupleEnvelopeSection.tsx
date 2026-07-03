"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SANGJIT_INVITATION_ASSETS } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

interface SangjitCoupleEnvelopeSectionProps {
  invitation?: any;
  config?: any;
}

export function SangjitCoupleEnvelopeSection({ invitation, config = {} }: SangjitCoupleEnvelopeSectionProps) {
  const { t } = useLanguage();
  const formatName = (first?: string, last?: string, title?: string, fb?: string) => {
    if (!first && !last) return fb;
    let s = `${first || ""} ${last || ""}`.trim();
    if (title) s += `, ${title}`;
    const idx = s.indexOf(' ');
    return idx !== -1 ? `${s.slice(0, idx)}\n${s.slice(idx + 1)}` : s;
  };

  const brideName = formatName(config.bride_first_name, config.bride_last_name, config.bride_title, "Aziel\nYorieza, B.A");
  const brideParents = config.bride_order_title ? `${config.bride_order_title}\n${config.bride_parents}` : t('secondDaughterOf');
  const groomName = formatName(config.groom_first_name, config.groom_last_name, config.groom_title, "William\nStefanus, S.Kom");
  const groomParents = config.groom_order_title ? `${config.groom_order_title}\n${config.groom_parents}` : t('firstSonOf');

  return (
    <section className="relative w-full bg-[#761B33] pt-8 pb-2 px-6 overflow-hidden flex flex-col items-center select-none z-20">
      
      {/* Main Composition Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        style={{ position: 'relative', width: '100%', maxWidth: 410, margin: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 }}
      >
        
        {/* Envelope Shell Frame */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '410/417', zIndex: 0 }}>
          <Image
            src={SANGJIT_INVITATION_ASSETS.sangjitEnvelopeBackPanel}
            alt="Envelope Back"
            fill
            priority
            className="object-contain"
          />

          {/* Inner Pattern Lining */}
          <div
            style={{
              position: 'absolute',
              top: '6.5%',
              left: '8.2%',
              right: '8.2%',
              aspectRatio: '343/345.7',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          >
            <Image
              src={SANGJIT_INVITATION_ASSETS.sangjitEnvelopeInnerPattern}
              alt="Lining Pattern"
              fill
              unoptimized
              className="object-contain object-top"
            />
          </div>
        </div>

        {/* Cream Paper Card Stacking Wrapper */}
        <div
          style={{
            position: 'relative',
            zIndex: 20,
            width: '80%',
            marginTop: '-44%',
            marginBottom: 24
          }}
        >
          {/* Right Upper Background Floral (behind cream paper card zIndex: 5) */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', right: '-32%', top: '-15%', width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}
          >
            <Image
              src={SANGJIT_INVITATION_ASSETS.sangjitEnvelopeRightBackgroundFloral}
              alt="Right Upper Floral"
              fill
              className="object-contain object-top-right"
            />
          </motion.div>

          {/* Actual Paper Card Box (zIndex: 10) */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              backgroundColor: '#FFFDF8',
              borderRadius: 8,
              boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
              paddingTop: 38,
              paddingBottom: 40,
              paddingLeft: 20,
              paddingRight: 20,
              border: '1px solid rgba(118, 27, 51, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {/* Red Wax Seal attached to top center edge */}
            <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', width: 58, height: 54, zIndex: 40, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.3))' }}>
              <Image
                src={SANGJIT_INVITATION_ASSETS.sangjitWaxSeal}
                alt="Wax Seal"
                fill
                className="object-contain"
              />
            </div>

            {/* Left Climbing Floral Arrangement */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={{ position: 'absolute', left: '-28%', bottom: '-10%', width: '150%', aspectRatio: '1/1', zIndex: 30, pointerEvents: 'none', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
            >
              <Image
                src={SANGJIT_INVITATION_ASSETS.sangjitEnvelopeLeftFloral}
                alt="Left Floral"
                fill
                className="object-contain object-bottom-left"
              />
            </motion.div>

            {/* Right Lower Foreground Floral */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              style={{ position: 'absolute', right: '-32%', bottom: '-13%', width: '128%', height: '128%', aspectRatio: '1/1', zIndex: 30, pointerEvents: 'none', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
            >
              <Image
                src={SANGJIT_INVITATION_ASSETS.sangjitEnvelopeRightForegroundFloral}
                alt="Right Lower Floral"
                fill
                className="object-contain object-bottom-right"
              />
            </motion.div>

            {/* Typography Content */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', zIndex: 20 }}>
              
              {/* Bride Block */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <h3 style={{ fontFamily: 'var(--font-egizio), EgizioEF Condensed, serif', fontSize: 40, color: '#761B33', fontWeight: 500, lineHeight: 1, margin: 0, whiteSpace: 'pre-line' }}>
                  {brideName}
                </h3>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#761B33', lineHeight: '18px', margin: 0, whiteSpace: 'pre-line', opacity: 0.9 }}>
                  {brideParents}
                </p>
              </div>

              {/* Separator */}
              <div style={{ margin: '14px 0', fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: '#761B33', opacity: 0.8 }}>
                {t('and')}
              </div>

              {/* Groom Block */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <h3 style={{ fontFamily: 'var(--font-egizio), EgizioEF Condensed, serif', fontSize: 40, color: '#761B33', fontWeight: 500, lineHeight: 1, margin: 0, whiteSpace: 'pre-line' }}>
                  {groomName}
                </h3>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#761B33', lineHeight: '18px', margin: 0, whiteSpace: 'pre-line', opacity: 0.9 }}>
                  {groomParents}
                </p>
              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </section>
  );
}
