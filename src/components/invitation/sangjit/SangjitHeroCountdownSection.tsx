"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SANGJIT_INVITATION_ASSETS } from "@/constants/sangjitInvitationAssets";
import { useLanguage } from "@/contexts/LanguageContext";

interface SangjitHeroCountdownSectionProps {
  targetDateStr?: string;
}

export function SangjitHeroCountdownSection({
  targetDateStr = "2026-10-17T00:00:00",
}: SangjitHeroCountdownSectionProps) {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const target = new Date(targetDateStr);

    const updateTime = () => {
      const now = new Date().getTime();
      const difference = target.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  const formatDigits = (num: number) => {
    return String(num).padStart(2, "0").split("");
  };

  const daysDigits = formatDigits(timeLeft.days);
  const hoursDigits = formatDigits(timeLeft.hours);
  const minsDigits = formatDigits(timeLeft.minutes);

  return (
    <section className="relative w-full bg-[#761B33] flex flex-col items-center select-none overflow-hidden z-20">
      {/* Upper Hero Area (White + Watercolor Background) */}
      <div className="relative w-full bg-[#FFFDF9] flex flex-col items-center pt-10 pb-0 px-0 overflow-hidden flex-1 justify-center">
        {/* Texture */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-90">
          <Image
            src={SANGJIT_INVITATION_ASSETS.sangjitWatercolorBackground}
            alt="Texture"
            fill
            priority
            className="object-cover object-top"
          />
        </div>

        {/* Emblem & Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center w-full"
        >
          <div className="relative w-[200px] h-[180px] sm:w-[240px] sm:h-[216px] flex justify-center mb-3">
            <Image
              src={SANGJIT_INVITATION_ASSETS.sangjitOpeningEmblem}
              alt="Emblem"
              fill
              priority
              className="object-contain"
            />
          </div>

          <div className="flex flex-col items-center text-center text-[#761B33] mb-4 px-6">
            <span className="text-[24px] sm:text-[28px] font-serif tracking-wider mb-1">
              The Sangjit of
            </span>
            <span className="text-[52px] font-serif font-bold tracking-tight leading-none">
              Aziel &amp; William
            </span>
          </div>
        </motion.div>

        {/* Middle Prominent Floral Wave Separator */}
        <div className="relative z-20 w-full -mb-1 pointer-events-none leading-none flex-shrink-0">
          <Image
            src={SANGJIT_INVITATION_ASSETS.sangjitBottomFloralWave}
            alt="Floral Wave"
            width={600}
            height={260}
            priority
            unoptimized
            className="w-full h-auto block object-cover object-bottom"
          />
        </div>
      </div>

      {/* Lower Countdown Area (Solid Maroon Background) */}
      <div className="relative z-30 w-full bg-[#761B33] px-6 flex flex-col items-center pb-6 pt-6 gap-5 flex-shrink-0 -mt-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center w-full gap-5"
        >
          {/* Ceremony Date Heading */}
          <h3 className="text-[#FFFFFF] font-serif text-[36px] sm:text-[30px] tracking-wide text-center leading-tight">
            Saturday, 17 October 2026
          </h3>

          {/* Clean White Rounded Countdown Card with Top Cream Tab */}
          <div className="relative w-full max-w-[360px] bg-white rounded-[22px] shadow-2xl flex items-center justify-around border border-white/20 mt-1" style={{ paddingTop: 20, paddingBottom: 16, paddingLeft: 12, paddingRight: 12 }}>
            {/* Top Left Cream Tab Accent */}
            <div className="absolute -top-3.5 left-6 w-20 h-4 bg-[#FFF8EF] rounded-t-md border-t border-x border-[#761B33]/15 shadow-sm" />

            {/* Days */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="flex gap-1">
                {daysDigits.map((digit, idx) => (
                  <div
                    key={idx}
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    className="bg-[#761B33] text-white text-[22px] sm:text-[26px] font-normal w-[28px] sm:w-[32px] h-[44px] sm:h-[50px] rounded-lg flex items-center justify-center shadow-inner"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <span className="text-[#761B33] font-sans font-normal text-[14px] uppercase tracking-wider mt-1">
                {language === "id" ? "HARI" : "DAYS"}
              </span>
            </div>

            {/* Colon */}
            <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }} className="text-[#761B33] font-normal text-[24px] -mt-5 z-10">:</span>

            {/* Hours */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="flex gap-1">
                {hoursDigits.map((digit, idx) => (
                  <div
                    key={idx}
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    className="bg-[#761B33] text-white text-[22px] sm:text-[26px] font-normal w-[28px] sm:w-[32px] h-[44px] sm:h-[50px] rounded-lg flex items-center justify-center shadow-inner"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <span className="text-[#761B33] font-sans font-normal text-[14px] uppercase tracking-wider mt-1">
                {language === "id" ? "JAM" : "HOURS"}
              </span>
            </div>

            {/* Colon */}
            <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }} className="text-[#761B33] font-normal text-[24px] -mt-5 z-10">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="flex gap-1">
                {minsDigits.map((digit, idx) => (
                  <div
                    key={idx}
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    className="bg-[#761B33] text-white text-[22px] sm:text-[26px] font-normal w-[28px] sm:w-[32px] h-[44px] sm:h-[50px] rounded-lg flex items-center justify-center shadow-inner"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <span className="text-[#761B33] font-sans font-normal text-[14px] uppercase tracking-wider mt-1">
                {language === "id" ? "MENIT" : "MINS"}
              </span>
            </div>
          </div>

          {/* Bible Verse FooterTextBlock */}
          <div className="flex flex-col items-center text-center gap-2 mt-4 max-w-[380px] z-30">
            <div className="text-white font-sans text-[16px] font-normal leading-relaxed">
              And over all these virtues put on love,<br />which binds them all together in perfect unity.
            </div>
            <b className="text-white font-sans text-[16px] font-bold">
              Colossians 3:14
            </b>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
