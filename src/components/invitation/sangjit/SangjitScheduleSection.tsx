"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SANGJIT_INVITATION_ASSETS } from "@/lib/constants";

interface SangjitScheduleSectionProps {
  session?: {
    title?: string;
    date?: string;
    time?: string;
    venue?: string;
    address?: string;
    map_url?: string;
  };
  invitation?: any;
}

export function SangjitScheduleSection({ session, invitation }: SangjitScheduleSectionProps) {
  const timeStr = session?.time || invitation?.time || "11:00 - 13:00";
  const venueStr = session?.venue || invitation?.venue || "Sentosa Seafood";
  const addressStr = session?.address || invitation?.address || "Jl. Aruna No. 30";
  const mapUrl = session?.map_url || invitation?.map_url || "https://maps.google.com/?q=Sentosa+Seafood+Aruna";

  // Format date dynamically or fallback to prompt spec
  let displayDate = session?.date || "Saturday,\n17 October 2026";
  if (!session?.date && invitation?.date) {
    try {
      const d = new Date(invitation.date);
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString("en-US", { month: "long" });
      const year = d.getFullYear();
      displayDate = `${dayName},\n${dayNum} ${monthName} ${year}`;
    } catch (e) { }
  }

  return (
    <section className="relative w-full bg-white py-0 px-6 flex flex-col items-center select-none overflow-hidden z-20 -mt-1">

      {/* Top Maroon Wave Transition */}
      <div style={{ position: 'relative', width: 'calc(100% + 48px)', marginLeft: -24, marginRight: -24, marginTop: -2, aspectRatio: '480/128', zIndex: 10, pointerEvents: 'none', flexShrink: 0 }}>
        <Image
          src={SANGJIT_INVITATION_ASSETS.sangjitMaroonWaveDivider}
          alt="Wave Divider"
          fill
          unoptimized
          className="object-cover object-center"
        />
      </div>

      {/* Background Texture (sangjitScheduleBackground at 30% opacity) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
        <Image
          src={SANGJIT_INVITATION_ASSETS.sangjitScheduleBackground}
          alt="Schedule Texture"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Main Container matching exact user JSX styling */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', maxWidth: 480, paddingLeft: 0, paddingRight: 0, paddingTop: 48, paddingBottom: 48, background: 'transparent', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', position: 'relative', zIndex: 10 }}
      >

        {/* Row Container */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>

          {/* Phoenix Illustration Container */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%', maxWidth: 300, position: 'relative', transform: 'rotate(6deg)', transformOrigin: 'top left', flexShrink: 0, marginLeft: -48
            }}
          >
            <img
              style={{ width: '100%', height: 'auto', display: 'block', maxWidth: 'none' }}
              src={SANGJIT_INVITATION_ASSETS.sangjitPhoenixIllustration}
              alt="Phoenix Illustration"
            />
          </motion.div>

          {/* Right Detail Stack (-44px gap overlap) */}
          <div style={{ flex: '1 1 0', paddingTop: 24, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 24, zIndex: 10, marginLeft: -44 }}>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>

              {/* Date */}
              <div style={{ width: 120, textAlign: 'center', color: '#761B33', fontSize: 36, fontFamily: 'var(--font-egizio), EgizioEF Condensed, serif', fontWeight: 500, lineHeight: '34.20px', wordWrap: 'break-word', whiteSpace: 'pre-line' }}>
                {displayDate}
              </div>

              {/* Time */}
              <div style={{ width: '100%', textAlign: 'center', color: '#761B33', fontSize: 16, fontFamily: 'Montserrat, sans-serif', fontWeight: 400, lineHeight: '14.56px', wordWrap: 'break-word' }}>
                {timeStr}
              </div>

              {/* Venue & Address */}
              <div style={{ width: '100%', textAlign: 'center' }}>
                <span style={{ color: '#761B33', fontSize: 16, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, wordWrap: 'break-word' }}>
                  {venueStr}<br />
                </span>
                <span style={{ color: '#761B33', fontSize: 16, fontFamily: 'Montserrat, sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>
                  {addressStr}
                </span>
              </div>

            </div>

            {/* Google Maps Button (hugs content on one line) */}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: 'fit-content', height: 36, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, background: 'white', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.10)', borderRadius: 10, outline: '1px solid #761B33', outlineOffset: -1, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 10, textDecoration: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <div style={{ color: '#761B33', fontSize: 14, fontFamily: 'Inter', fontWeight: 500, lineHeight: '20px', whiteSpace: 'nowrap' }}>
                Open in Google Maps
              </div>
            </a>

          </div>

        </div>

      </motion.div>

    </section>
  );
}
