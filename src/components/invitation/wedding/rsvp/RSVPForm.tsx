"use client";
import { useLanguage } from "@/contexts/LanguageContext";

interface RSVPFormProps {
  isPastDeadline: boolean;
  isPending: boolean;
  attending: boolean | null;
  setAttending: (val: boolean | null) => void;
  events: string[];
  setEvents: (events: string[]) => void;
  sessions: any[];
  pax: number | null;
  setPax: (pax: number | null) => void;
  maxPax: number;
  wishes: string;
  setWishes: (wishes: string) => void;
  errorMsg: string;
  handleSubmit: () => void;
  handleAddToCalendar: () => void;
  existingRsvp: boolean;
}

export function RSVPForm({
  isPastDeadline,
  isPending,
  attending,
  setAttending,
  events,
  setEvents,
  sessions,
  pax,
  setPax,
  maxPax,
  wishes,
  setWishes,
  errorMsg,
  handleSubmit,
  handleAddToCalendar,
  existingRsvp
}: RSVPFormProps) {
  const { t } = useLanguage();
  return (
    <section className="w-full snap-start min-h-[100dvh] bg-[#faf9f0] flex flex-col justify-center items-center py-[48px] z-20 relative">
      <h2 className="text-[64px] text-[#4B4B4B] mb-6 leading-none" style={{ fontFamily: "var(--font-justwrite)" }}>
        {t('rsvpTitle')}
      </h2>

      <div className="w-full max-w-md mx-auto px-6 flex flex-col gap-6" style={{ fontFamily: "var(--font-alegreya)" }}>
        
        {isPastDeadline && (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-center text-sm leading-relaxed whitespace-pre-line">
            {t('rsvpClosed')}
          </div>
        )}

        {/* Attendance */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[#4B4B4B] text-[16px]">{t('willYouAttend')}</p>
          <div className="flex w-full gap-2">
            <button 
              disabled={isPastDeadline || isPending}
              onClick={() => setAttending(true)}
              className={`flex-1 flex items-center justify-center h-[36px] border rounded-xl transition ${attending === true ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50 text-sm`}
            >
              {t('yesAttend')}
            </button>
            <button 
              disabled={isPastDeadline || isPending}
              onClick={() => {
                setAttending(false);
                setEvents([]);
                setPax(null);
              }}
              className={`flex-1 flex items-center justify-center h-[36px] border rounded-xl transition ${attending === false ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50 text-sm`}
            >
              {t('noAttend')}
            </button>
          </div>
        </div>

        {/* Events */}
        {attending && sessions.length > 0 && (
          <div className="flex flex-col items-center gap-2 animate-fade-up">
            <p className="text-[#4B4B4B] text-[16px]">{t('whichEvents')}</p>
            <div className="flex flex-col w-full gap-2">
              {sessions.length === 1 ? (
                <button 
                  disabled={isPastDeadline || isPending}
                  onClick={() => setEvents([sessions[0].id])}
                  className={`w-full flex items-center justify-center h-[36px] border rounded-xl transition ${events.length === 1 && events[0] === sessions[0].id ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50`}
                >
                  {sessions[0].name}
                </button>
              ) : (
                <>
                  <div className="flex gap-2">
                    <button 
                      disabled={isPastDeadline || isPending}
                      onClick={() => setEvents([sessions[0].id])}
                      className={`flex-1 flex items-center justify-center h-[36px] border rounded-xl transition ${events.length === 1 && events[0] === sessions[0].id ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50`}
                    >
                      {sessions[0].name}
                    </button>
                    <button 
                      disabled={isPastDeadline || isPending}
                      onClick={() => setEvents([sessions[1].id])}
                      className={`flex-1 flex items-center justify-center h-[36px] border rounded-xl transition ${events.length === 1 && events[0] === sessions[1].id ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50`}
                    >
                      {sessions[1].name}
                    </button>
                  </div>
                  <button 
                    disabled={isPastDeadline || isPending}
                    onClick={() => setEvents([sessions[0].id, sessions[1].id])}
                    className={`w-full flex items-center justify-center h-[36px] border rounded-xl transition ${events.length === 2 ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50`}
                  >
                    {sessions[0].name} & {sessions[1].name}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Pax */}
        {attending && (
          <div className="flex flex-col items-center gap-2 animate-fade-up">
            <p className="text-[#4B4B4B] text-[16px]">{t('howManyPeople')}</p>
            <div className="flex w-full gap-2 justify-center">
              {Array.from({ length: maxPax }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  disabled={isPastDeadline || isPending}
                  onClick={() => setPax(num)}
                  className={`flex-1 flex items-center justify-center h-[36px] border rounded-xl transition ${pax === num ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wishes */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[#4B4B4B] text-[16px]">{t('sendWish')}</p>
          <textarea 
            disabled={isPastDeadline || isPending}
            placeholder={t('typeWish')}
            maxLength={500}
            value={wishes}
            onChange={(e) => setWishes(e.target.value)}
            className="w-full border border-[#E5E5E5] rounded-xl p-4 min-h-[120px] focus:outline-none focus:border-[#4B4B4B] disabled:opacity-50 disabled:bg-slate-50 bg-white text-[#4B4B4B]"
          />
        </div>

        {/* Messages */}
        {errorMsg && <p className="text-red-500 text-center text-sm">{errorMsg}</p>}

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-4">
          {!isPastDeadline && (
            <button 
              disabled={isPending}
              onClick={handleSubmit}
              className="w-full h-[36px] flex items-center justify-center bg-[#3A592F] text-white rounded-xl hover:bg-[#2b4223] transition disabled:opacity-70"
            >
              {isPending ? t('saving') : existingRsvp ? t('updateRSVP') : t('confirmRSVP')}
            </button>
          )}
          <button 
            onClick={handleAddToCalendar}
            className="w-full h-[36px] flex items-center justify-center bg-white border border-[#E5E5E5] text-[#4B4B4B] rounded-xl hover:bg-slate-50 transition"
          >
            {t('addToCalendar')}
          </button>
        </div>

      </div>
    </section>
  );
}
