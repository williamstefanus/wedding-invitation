"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SANGJIT_INVITATION_ASSETS } from "@/lib/constants";
import { submitRSVP } from "@/lib/actions/rsvp";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatWhatsAppPhone } from "@/lib/utils";

interface SangjitRSVPSectionProps {
  invitation?: any;
  deadline?: string;
  contactPhone?: string;
  config?: any;
}

export function SangjitRSVPSection({ invitation, deadline: settingsDeadline, contactPhone, config = {} }: SangjitRSVPSectionProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const rsvpData = invitation?.rsvp;
  const existingRsvp = Array.isArray(rsvpData) ? rsvpData[0] : rsvpData;
  const [hasSubmitted, setHasSubmitted] = useState(!!existingRsvp);
  const [attending, setAttending] = useState<boolean | null>(
    existingRsvp ? existingRsvp.attendance_status === "attending" : null
  );
  const [pax, setPax] = useState<number>(existingRsvp?.confirmed_pax || 1);
  const [wishes, setWishes] = useState(existingRsvp?.wish_message || "");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const deadlineStr = settingsDeadline || invitation?.event_type?.rsvp_edit_deadline_at;
  const deadlineTime = deadlineStr ? new Date(deadlineStr).getTime() : null;
  const isPastDeadline = deadlineTime ? new Date().getTime() > deadlineTime : false;

  const maxPax = invitation?.max_pax || 4;
  const paxOptions = Array.from({ length: Math.min(maxPax, 4) }, (_, i) => i + 1);
  const sessionIds = (invitation?.event_type?.sessions || []).map((s: any) => s.id);

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
          selected_session_ids: attending ? sessionIds : [],
          event_slug: invitation.event_type?.slug || "sangjit",
          code: invitation.invitation_code || ""
        });
        if (res.success) {
          setHasSubmitted(true);
          setIsSuccess(true);
        } else {
          if (res.error && res.error.toLowerCase().includes("already submitted")) {
            setHasSubmitted(true);
          } else {
            setErrorMsg(res.error || "Failed to submit RSVP");
          }
        }
      });
    } else {
      setHasSubmitted(true);
      setIsSuccess(true);
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`${config.groomFirstName || "John"} & ${config.brideFirstName || "Jane"} Sangjit Ceremony`);
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
          sizes="480px"
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
            <img loading="lazy" style={{ width: '100%', height: 'auto', display: 'block', maxWidth: 'none' }} src={SANGJIT_INVITATION_ASSETS.sangjitRsvpFloralHeader} alt="Floral Header" />
          </motion.div>
        </div>

        {hasSubmitted ? (
          <div className="bg-white/95 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] rounded-xl p-6 text-center flex flex-col items-center gap-4 my-4 outline outline-1 outline-[#E5E5E5]">
            <p className="text-[#761B33] font-serif text-base">
              {t('rsvpAlreadyReceived')}
            </p>

            <p className="font-bold text-[#761B33] text-base my-1">
              {attending ? (
                <span>[ {t('attendingSummary')} | {pax} {t('paxLabel')} ]</span>
              ) : (
                <span>[ {t('notAttendingSummary')} ]</span>
              )}
            </p>

            <p className="text-slate-600 text-xs leading-relaxed max-w-xs">
              {t('forAnyChangesContact')}
            </p>

            <div className="flex flex-col gap-2 w-full pt-1">
              <button
                type="button"
                onClick={() => {
                  const groomName = config.groomFirstName || "John";
                  const brideName = config.brideFirstName || "Jane";
                  const contactName = invitation?.guest?.owner === "bride" ? brideName : groomName;
                  const formattedPhone = formatWhatsAppPhone(contactPhone);
                  const message = `Hi ${contactName}, I would like to update my Sangjit RSVP submission.`;
                  const url = formattedPhone 
                    ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
                    : `https://wa.me/?text=${encodeURIComponent(message)}`;
                  window.open(url, "_blank");
                }}
                className="w-full h-10 bg-[#761B33] text-white rounded-[10px] font-sans font-medium text-sm hover:bg-[#5e1528] transition shadow-sm flex items-center justify-center cursor-pointer"
              >
                {t('contactUs')}
              </button>

              {attending && (
                <button
                  type="button"
                  onClick={handleAddToCalendar}
                  className="w-full h-10 bg-white text-[#761B33] outline outline-1 outline-[#E5E5E5] rounded-[10px] font-sans font-medium text-sm hover:bg-slate-50 transition flex items-center justify-center cursor-pointer"
                >
                  {t('addToCalendar')}
                </button>
              )}
            </div>
          </div>
        ) : isPastDeadline ? (
          <div className="bg-amber-50 text-amber-900 p-4 rounded-xl border border-amber-200 text-center text-sm leading-relaxed my-4">
            {t('rsvpClosed')}
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
