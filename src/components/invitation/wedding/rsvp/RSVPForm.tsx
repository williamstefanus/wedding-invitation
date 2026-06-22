"use client";

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
  return (
    <section className="w-full bg-[#faf9f0] flex flex-col items-center py-20 z-20 relative">
      <h2 className="text-[6rem] text-[#4B4B4B] mb-6 leading-none" style={{ fontFamily: "var(--font-justwrite)" }}>
        RSVP
      </h2>

      <div className="w-full max-w-md mx-auto px-6 flex flex-col gap-6" style={{ fontFamily: "var(--font-alegreya)" }}>
        
        {isPastDeadline && (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-center text-sm leading-relaxed">
            RSVP editing is now closed.<br/>Please contact William / Aziel if you need to make changes.
          </div>
        )}

        {/* Attendance */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[#4B4B4B] text-lg">Will you attend our wedding?</p>
          <div className="flex w-full gap-3">
            <button 
              disabled={isPastDeadline || isPending}
              onClick={() => setAttending(true)}
              className={`flex-1 py-3 border rounded-xl transition ${attending === true ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50`}
            >
              Yes, I will attend
            </button>
            <button 
              disabled={isPastDeadline || isPending}
              onClick={() => {
                setAttending(false);
                setEvents([]);
                setPax(null);
              }}
              className={`flex-1 py-3 border rounded-xl transition ${attending === false ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50`}
            >
              No, I can't attend
            </button>
          </div>
        </div>

        {/* Events */}
        {attending && sessions.length > 0 && (
          <div className="flex flex-col items-center gap-3 animate-fade-up">
            <p className="text-[#4B4B4B] text-lg">Which event(s) will you attend?</p>
            <div className="flex flex-col w-full gap-3">
              {sessions.length === 1 ? (
                <button 
                  disabled={isPastDeadline || isPending}
                  onClick={() => setEvents([sessions[0].id])}
                  className={`w-full py-3 border rounded-xl transition ${events.length === 1 && events[0] === sessions[0].id ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50`}
                >
                  {sessions[0].name}
                </button>
              ) : (
                <>
                  <div className="flex gap-3">
                    <button 
                      disabled={isPastDeadline || isPending}
                      onClick={() => setEvents([sessions[0].id])}
                      className={`flex-1 py-3 border rounded-xl transition ${events.length === 1 && events[0] === sessions[0].id ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50`}
                    >
                      {sessions[0].name}
                    </button>
                    <button 
                      disabled={isPastDeadline || isPending}
                      onClick={() => setEvents([sessions[1].id])}
                      className={`flex-1 py-3 border rounded-xl transition ${events.length === 1 && events[0] === sessions[1].id ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50`}
                    >
                      {sessions[1].name}
                    </button>
                  </div>
                  <button 
                    disabled={isPastDeadline || isPending}
                    onClick={() => setEvents([sessions[0].id, sessions[1].id])}
                    className={`w-full py-3 border rounded-xl transition ${events.length === 2 ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50`}
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
          <div className="flex flex-col items-center gap-3 animate-fade-up">
            <p className="text-[#4B4B4B] text-lg">How many people?</p>
            <div className="flex w-full gap-2 justify-center">
              {Array.from({ length: maxPax }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  disabled={isPastDeadline || isPending}
                  onClick={() => setPax(num)}
                  className={`flex-1 py-3 border rounded-xl transition ${pax === num ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]' : 'bg-white text-[#4B4B4B] border-[#E5E5E5] hover:bg-slate-50'} disabled:opacity-50`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wishes */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[#4B4B4B] text-lg">Send your wish ( Optional )</p>
          <textarea 
            disabled={isPastDeadline || isPending}
            placeholder="Type your message here."
            maxLength={500}
            value={wishes}
            onChange={(e) => setWishes(e.target.value)}
            className="w-full border border-[#E5E5E5] rounded-xl p-4 min-h-[120px] focus:outline-none focus:border-[#4B4B4B] disabled:opacity-50 disabled:bg-slate-50 bg-white text-[#4B4B4B]"
          />
        </div>

        {/* Messages */}
        {errorMsg && <p className="text-red-500 text-center text-sm">{errorMsg}</p>}

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-4">
          {!isPastDeadline && (
            <button 
              disabled={isPending}
              onClick={handleSubmit}
              className="w-full py-4 bg-[#3A592F] text-white rounded-xl hover:bg-[#2b4223] transition disabled:opacity-70"
            >
              {isPending ? "Saving..." : existingRsvp ? "Update RSVP" : "Confirm RSVP"}
            </button>
          )}
          <button 
            onClick={handleAddToCalendar}
            className="w-full py-4 bg-white border border-[#E5E5E5] text-[#4B4B4B] rounded-xl hover:bg-slate-50 transition"
          >
            Add to Google Calendar
          </button>
        </div>

      </div>
    </section>
  );
}
