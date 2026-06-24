"use client";
import { useLanguage } from "@/contexts/LanguageContext";

interface RSVPSuccessMessageProps {
  submitState: "idle" | "success_attending" | "success_not_attending" | "success_updated";
  attending: boolean | null;
  handleAddToCalendar: () => void;
  resetForm: () => void;
}

export function RSVPSuccessMessage({
  submitState,
  attending,
  handleAddToCalendar,
  resetForm
}: RSVPSuccessMessageProps) {
  const { t } = useLanguage();

  if (submitState === "idle") return null;

  return (
    <section className="w-full snap-start min-h-[100dvh] bg-[#faf9f0] flex flex-col items-center justify-center py-24 z-20 relative px-6 text-center animate-fade-in">
      <h2 className="text-6xl text-[#416130] mb-6" style={{ fontFamily: "var(--font-justwrite)" }}>
        {t('thankYou')}
      </h2>
      
      {submitState === "success_updated" && (
        <p className="text-slate-700 text-lg mb-8 max-w-sm" style={{ fontFamily: "var(--font-alegreya)" }}>
          {t('rsvpSuccessUpdated')}
        </p>
      )}
      
      {submitState === "success_attending" && (
        <p className="text-slate-700 text-lg mb-8 max-w-sm" style={{ fontFamily: "var(--font-alegreya)" }}>
          {t('rsvpSuccessAttending')}
        </p>
      )}
      
      {submitState === "success_not_attending" && (
        <p className="text-slate-700 text-lg mb-8 max-w-sm" style={{ fontFamily: "var(--font-alegreya)" }}>
          {t('rsvpSuccessNotAttending')}
        </p>
      )}

      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto" style={{ fontFamily: "var(--font-alegreya)" }}>
        {(submitState === "success_attending" || (submitState === "success_updated" && attending)) && (
          <button 
            onClick={handleAddToCalendar}
            className="w-full flex items-center justify-center h-[36px] bg-[#4B4B4B] text-white rounded-xl font-medium hover:bg-black transition"
          >
            {t('addToCalendar')}
          </button>
        )}
        <button 
          onClick={resetForm}
          className="w-full flex items-center justify-center h-[36px] bg-white border border-[#E5E5E5] text-[#4B4B4B] rounded-xl font-medium hover:bg-slate-50 transition"
        >
          {t('backToInvitation')}
        </button>
      </div>
    </section>
  );
}
