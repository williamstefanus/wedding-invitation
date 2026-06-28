"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SANGJIT_INVITATION_ASSETS } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

interface SangjitGiftSectionProps {
  bank?: string;
  account?: string;
  name?: string;
  invitation?: any;
}

export function SangjitGiftSection({ bank, account, name, invitation }: SangjitGiftSectionProps) {
  const { t } = useLanguage();
  const [showGift, setShowGift] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayBank = bank || invitation?.gift_bank_name || "Bank Central Asia (BCA)";
  const displayAccount = account || invitation?.gift_account_number || "1234567890";
  const displayName = name || invitation?.gift_account_holder || "William Stefanus";

  const handleCopy = () => {
    navigator.clipboard.writeText(displayAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full bg-white flex flex-col items-center select-none overflow-hidden z-20 pb-12">

      {/* Background Texture (sangjitGiftBackground at 30% opacity) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
        <Image
          src={SANGJIT_INVITATION_ASSETS.sangjitGiftBackground}
          alt="Gift Texture"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Top Wave (responsive maxWidth 480px) */}
      <img
        style={{ width: '100%', maxWidth: 480, height: 'auto', maxHeight: 128, objectFit: 'cover', objectPosition: 'top', position: 'relative', zIndex: 10 }}
        src={SANGJIT_INVITATION_ASSETS.sangjitGiftTopWave}
        alt="Top Wave"
      />

      {/* Main Row Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', maxWidth: 480, paddingLeft: 24, paddingRight: 24, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', position: 'relative', zIndex: 10, marginTop: -10, gap: 0 }}
      >

        {/* Left Floral Image (fluid responsive width up to 187px) */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '43%', maxWidth: 187, flexShrink: 0, pointerEvents: 'none' }}
        >
          <img
            style={{ width: '100%', height: 'auto', display: 'block' }}
            src={SANGJIT_INVITATION_ASSETS.sangjitGiftLeftFloral}
            alt="Left Floral"
          />
        </motion.div>

        {/* Right Detail Stack */}
        <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 18, paddingTop: 10 }}>

          {/* Heading & Paragraph Block */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 14 }}>
            <div style={{ width: '100%', textAlign: 'center', color: '#761B33', fontSize: 48, fontFamily: 'var(--font-egizio), EgizioEF Condensed, serif', fontWeight: 500, lineHeight: '45.6px', wordWrap: 'break-word' }}>
              {t('giftTitle')}
            </div>

            <div style={{ width: '100%', maxWidth: 248, textAlign: 'center', color: '#761B33', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 400, wordWrap: 'break-word', whiteSpace: 'pre-line' }}>
              {t('giftMessage')}
            </div>
          </div>

          {/* Send Gift / Done Toggle Button */}
          <button
            type="button"
            onClick={() => setShowGift(!showGift)}
            style={{ width: '100%', maxWidth: 248, height: 32, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, background: showGift ? 'white' : '#761B33', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.10)', borderRadius: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10, cursor: 'pointer', border: showGift ? '1px solid #E5E5E5' : 'none' }}
          >
            <div style={{ justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
              <div style={{ color: showGift ? '#761B33' : 'white', fontSize: 14, fontFamily: 'Inter', fontWeight: 500, lineHeight: '20px', wordWrap: 'break-word' }}>
                {showGift ? t('done') : t('sendGift')}
              </div>
            </div>
          </button>

          {/* Revealed Bank Card */}
          {showGift && (
            <div style={{ width: '100%', maxWidth: 248, paddingTop: 16, paddingBottom: 16, background: '#FFF9ED', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.10)', borderRadius: 14, outline: '1px solid #E5E5E5', outlineOffset: -1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }} className="animate-fade-in">

              <div style={{ width: '100%', paddingLeft: 16, paddingRight: 16, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', textAlign: 'center', color: '#761B33', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>
                  {displayBank}
                </div>

                <div style={{ width: '100%', textAlign: 'center', color: '#761B33', fontSize: 16, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: '20px', wordWrap: 'break-word', userSelect: 'all' }}>
                  {displayAccount}
                </div>

                <div style={{ width: '100%', textAlign: 'center', color: '#761B33', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>
                  a/n {displayName}
                </div>
              </div>

              <div style={{ width: '100%', paddingLeft: 16, paddingRight: 16, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{ width: '100%', height: 32, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, background: 'white', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.10)', borderRadius: 10, outline: '1px solid #E5E5E5', outlineOffset: -1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10, cursor: 'pointer', border: 'none' }}
                >
                  <div style={{ justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
                    <div style={{ color: '#761B33', fontSize: 14, fontFamily: 'Inter', fontWeight: 500, lineHeight: '20px', wordWrap: 'break-word' }}>
                      {copied ? t('copied') : t('clickToCopyShort')}
                    </div>
                  </div>
                </button>
              </div>

            </div>
          )}

        </div>

      </motion.div>

    </section>
  );
}
