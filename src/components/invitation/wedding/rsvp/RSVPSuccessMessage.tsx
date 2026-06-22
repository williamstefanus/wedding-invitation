"use client";

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
  if (submitState === "idle") return null;

  return (
    <section className="w-full bg-[#faf9f0] flex flex-col items-center py-24 z-20 relative px-6 text-center animate-fade-in min-h-[500px] justify-center">
      <h2 className="text-6xl text-[#416130] mb-6" style={{ fontFamily: "var(--font-justwrite)" }}>
        Thank You
      </h2>
      
      {submitState === "success_updated" && (
        <p className="text-slate-700 text-lg mb-8 max-w-sm" style={{ fontFamily: "var(--font-alegreya)" }}>
          Your RSVP has been updated successfully.
        </p>
      )}
      
      {submitState === "success_attending" && (
        <p className="text-slate-700 text-lg mb-8 max-w-sm" style={{ fontFamily: "var(--font-alegreya)" }}>
          Thank you for confirming your attendance. We look forward to celebrating with you.
        </p>
      )}
      
      {submitState === "success_not_attending" && (
        <p className="text-slate-700 text-lg mb-8 max-w-sm" style={{ fontFamily: "var(--font-alegreya)" }}>
          Thank you for letting us know. Your prayers and blessings mean a lot to us.
        </p>
      )}

      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto" style={{ fontFamily: "var(--font-alegreya)" }}>
        {(submitState === "success_attending" || (submitState === "success_updated" && attending)) && (
          <button 
            onClick={handleAddToCalendar}
            className="w-full py-3 bg-[#4B4B4B] text-white rounded-xl font-medium hover:bg-black transition"
          >
            Add To Google Calendar
          </button>
        )}
        <button 
          onClick={resetForm}
          className="w-full py-3 bg-white border border-[#E5E5E5] text-[#4B4B4B] rounded-xl font-medium hover:bg-slate-50 transition"
        >
          Back To Invitation
        </button>
      </div>
    </section>
  );
}
