"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateSessionName } from "@/lib/translations";
import { formatWhatsAppPhone } from "@/lib/utils";

interface RSVPSubmittedCardProps {
  existingRsvp?: any;
  sessions?: any[];
  handleAddToCalendar: () => void;
  owner?: string;
  contactPhone?: string;
  config?: any;
}

export function RSVPSubmittedCard({
  existingRsvp,
  sessions = [],
  handleAddToCalendar,
  owner,
  contactPhone,
  config = {}
}: RSVPSubmittedCardProps) {
  const { t } = useLanguage();

  const isAttending = existingRsvp?.attendance_status === "attending";
  const selectedSessionIds = existingRsvp?.selected_sessions?.map((s: any) => s.event_session_id || s.id || (typeof s === 'string' ? s : null)).filter(Boolean) || [];
  const matchedSessions = sessions.filter(s => selectedSessionIds.includes(s.id));
  const activeSessions = matchedSessions.length > 0 ? matchedSessions : sessions;

  const handleWhatsAppContact = () => {
    const isBride = owner === "Aziel";
    const groomName = config.groom_first_name || "William";
    const brideName = config.bride_first_name || "Aziel";
    const contactName = isBride ? brideName : groomName;
    const formattedPhone = formatWhatsAppPhone(contactPhone);
    const message = `Hi ${contactName}, I would like to update my RSVP submission.`;
    const url = formattedPhone 
      ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const summaryEventsText = activeSessions.map(s => translateSessionName(s.name, t)).join(" & ");

  return (
    <section className="w-full bg-[#faf9f0] flex flex-col items-center py-[48px] z-20 relative px-6 text-center animate-fade-in">
      <h2 className="text-[64px] text-[#4B4B4B] mb-6 leading-none" style={{ fontFamily: "var(--font-justwrite)" }}>
        {t('rsvpTitle')}
      </h2>

      <div className="w-full max-w-md mx-auto flex flex-col items-center" style={{ fontFamily: "var(--font-alegreya)" }}>
        
        {/* Subtitle */}
        <p className="text-[#4B4B4B] text-[16px] mb-4">
          {t('rsvpAlreadyReceived')}
        </p>

        {/* [ Submitted Data Summary ] */}
        <p className="font-bold text-[#4B4B4B] text-[16px] mb-4">
          {isAttending ? (
            <span>[ {t('attendingSummary')} | {existingRsvp?.confirmed_pax || 1} {t('paxLabel')} {summaryEventsText ? `| ${summaryEventsText}` : ''} ]</span>
          ) : (
            <span>[ {t('notAttendingSummary')} ]</span>
          )}
        </p>

        {/* Notice */}
        <p className="text-slate-600 text-sm mb-6 max-w-xs leading-relaxed">
          {t('forAnyChangesContact')}
        </p>

        {/* Buttons */}
        <div className="w-full max-w-xs flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleWhatsAppContact}
            className="w-full h-[40px] flex items-center justify-center bg-[#3A592F] text-white rounded-xl font-medium hover:bg-[#2c4423] transition shadow-sm"
          >
            {t('contactUs')}
          </button>

          {isAttending && (
            <button
              type="button"
              onClick={handleAddToCalendar}
              className="w-full h-[40px] flex items-center justify-center bg-white border border-[#E5E5E5] text-[#4B4B4B] rounded-xl font-medium hover:bg-slate-50 transition shadow-sm"
            >
              {t('addToCalendar')}
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
