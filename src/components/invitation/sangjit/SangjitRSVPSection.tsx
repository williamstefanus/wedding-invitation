"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SANGJIT_INVITATION_ASSETS } from "@/lib/constants";
import { submitRSVP } from "@/lib/actions/rsvp";
import { useLanguage } from "@/contexts/LanguageContext";

interface SangjitRSVPSectionProps {
  invitation?: any;
  deadline?: string;
}

export function SangjitRSVPSection({ invitation }: SangjitRSVPSectionProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [attending, setAttending] = useState<boolean | null>(null);
  const [pax, setPax] = useState<number>(1);
  const [wishes, setWishes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const maxPax = invitation?.max_pax || 4;
  const paxOptions = Array.from({ length: Math.min(maxPax, 4) }, (_, i) => i + 1);

  const handleSubmit = () => {
    setErrorMsg("");
    if (attending === null) {
      setErrorMsg("Please select whether you will attend.");
      return;
    }

    if (invitation?.id) {
      startTransition(async () => {
        const res = await submitRSVP({
          invitation_id: invitation.id,
          attendance_status: attending ? "attending" : "not_attending",
          confirmed_pax: attending ? pax : 0,
          wish_message: wishes,
          selected_session_ids: attending ? ["sangjit_ceremony"] : [],
          event_slug: invitation.event_type?.slug || "sangjit",
          code: invitation.invitation_code || ""
        });
        if (res.success) {
          setIsSuccess(true);
        } else {
          setErrorMsg(res.error || "Failed to submit RSVP");
        }
      });
    } else {
      setIsSuccess(true);
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent("William & Aziel Sangjit Ceremony");
    const details = encodeURIComponent("Join us in celebrating our Sangjit ceremony!");
    const location = encodeURIComponent("Sentosa Seafood, Jl. Aruna No. 30");
    const dates = "20261017T040000Z/20261017T060000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`, "_blank");
  };

  return (
    <section className="relative w-full bg-white py-8 px-6 flex flex-col items-center select-none overflow-hidden z-20">

      {/* Texture Background (sangjitRsvpBackground at 30% opacity) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
        <Image
          src={SANGJIT_INVITATION_ASSETS.sangjitRsvpBackground}
          alt="RSVP Texture"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Main 432px Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-[432px] mx-auto flex flex-col gap-0"
      >

        {/* Header Block */}
        <div style={{ justifyContent: 'flex-start', alignItems: 'center', display: 'flex', position: 'relative', marginBottom: 10, height: 175 }}>
          <div style={{ width: 120, color: '#761B33', fontSize: 48, fontFamily: 'var(--font-egizio), "EgizioEF Condensed", serif', fontWeight: 500, lineHeight: '45.6px', wordWrap: 'break-word', flexShrink: 0 }}>{t('rsvpTitle')}</div>
          <motion.div
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', left: 130, top: 0, width: 320, pointerEvents: 'none', transform: 'rotate(6deg)', transformOrigin: 'top left', zIndex: 10 }}
          >
            <img style={{ width: '100%', height: 'auto', display: 'block', maxWidth: 'none' }} src={SANGJIT_INVITATION_ASSETS.sangjitRsvpFloralHeader} alt="Floral Header" />
          </motion.div>
        </div>

        {isSuccess ? (
          <div className="bg-white/95 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] rounded-xl p-8 text-center flex flex-col gap-3 my-4 outline outline-1 outline-[#E5E5E5]">
            <h3 className="font-serif text-2xl font-bold text-[#761B33]">{t('thankYou')}!</h3>
            <p className="font-sans text-sm text-[#761B33]/85">
              {t('rsvpSuccessSangjit')}
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-3 text-xs font-sans text-[#761B33] underline font-medium cursor-pointer"
            >
              {t('editRSVP')}
            </button>
          </div>
        ) : (
          /* Questions Stack */
          <div className="flex flex-col gap-6 w-full text-left mt-1">

            {/* Question 1: Will you attend our Sangjit? */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#761B33] text-[16px] font-sans font-normal block">
                {t('willYouAttendSangjit')}
              </label>
              <div className="flex items-center gap-1 w-full">
                <button
                  type="button"
                  onClick={() => setAttending(true)}
                  className={`flex-1 h-9 px-4 rounded-[10px] font-['Inter'] font-medium text-[14px] leading-5 shadow-[0px_1px_2px_rgba(0,0,0,0.10)] transition-all cursor-pointer flex items-center justify-center ${attending === true
                    ? "bg-[#761B33] text-[#FAFAFA]"
                    : "bg-white text-[#761B33] outline outline-1 outline-[#E5E5E5] -outline-offset-1 hover:bg-slate-50"
                    }`}
                >
                  {t('yesAttend')}
                </button>
                <button
                  type="button"
                  onClick={() => setAttending(false)}
                  className={`flex-1 h-9 px-4 rounded-[10px] font-['Inter'] font-medium text-[14px] leading-5 shadow-[0px_1px_2px_rgba(0,0,0,0.10)] transition-all cursor-pointer flex items-center justify-center ${attending === false
                    ? "bg-[#761B33] text-[#FAFAFA]"
                    : "bg-white text-[#761B33] outline outline-1 outline-[#E5E5E5] -outline-offset-1 hover:bg-slate-50"
                    }`}
                >
                  {t('noAttend')}
                </button>
              </div>
            </div>

            {/* Question 2: How many people? */}
            {attending !== false && (
              <div className="flex flex-col gap-2 w-full animate-fade-in">
                <label className="text-[#761B33] text-[16px] font-sans font-normal block">
                  {t('howManyPeople')}
                </label>
                <div className="flex items-center gap-1 w-full">
                  {paxOptions.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPax(num)}
                      className={`flex-1 h-9 px-4 rounded-[10px] font-['Inter'] font-medium text-[14px] leading-5 shadow-[0px_1px_2px_rgba(0,0,0,0.10)] transition-all cursor-pointer flex items-center justify-center ${pax === num
                        ? "bg-[#761B33] text-[#FAFAFA]"
                        : "bg-white text-[#761B33] outline outline-1 outline-[#E5E5E5] -outline-offset-1 hover:bg-slate-50"
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 3: Send your wish */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#761B33] text-[16px] font-sans font-normal block">
                {t('sendWish')}
              </label>
              <div className="relative w-full bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.10)] rounded-lg outline outline-1 outline-[#E5E5E5] -outline-offset-1 overflow-hidden">
                <textarea
                  value={wishes}
                  onChange={(e) => setWishes(e.target.value)}
                  placeholder={t('typeWish')}
                  rows={3}
                  className="w-full h-16 p-3 bg-transparent text-slate-800 placeholder-[#737373] font-['Inter'] text-[16px] leading-6 focus:outline-none resize-none block"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-600 text-xs font-sans text-center font-medium">
                {errorMsg}
              </p>
            )}

            {/* Buttons Stack */}
            <div className="flex flex-col gap-1 w-full mt-1">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full h-9 bg-[#761B33] text-[#FAFAFA] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.10)] font-['Inter'] font-medium text-[14px] hover:bg-[#761B33]/90 transition cursor-pointer flex items-center justify-center disabled:opacity-60"
              >
                {isPending ? t('submitting') : t('confirmRSVP')}
              </button>

              <button
                type="button"
                onClick={handleAddToCalendar}
                className="w-full h-9 bg-white text-[#761B33] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.10)] outline outline-1 outline-[#E5E5E5] -outline-offset-1 font-['Inter'] font-medium text-[14px] hover:bg-slate-50 transition cursor-pointer flex items-center justify-center"
              >
                {t('addToCalendar')}
              </button>
            </div>

          </div>
        )}

      </motion.div>

    </section>
  );
}
