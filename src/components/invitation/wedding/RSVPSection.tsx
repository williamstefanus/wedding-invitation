"use client";

import { useState, useTransition } from "react";
import { submitRSVP } from "@/lib/actions/rsvp";

interface RSVPSectionProps {
  invitation?: any;
}

export function RSVPSection({ invitation }: RSVPSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "success_attending" | "success_not_attending" | "success_updated">("idle");

  // Existing RSVP data if any
  const existingRsvp = invitation?.rsvp?.[0];
  const selectedSessionIds = existingRsvp?.selected_sessions?.map((s: any) => s.event_session_id) || [];
  const isUpdating = !!existingRsvp;
  
  const [attending, setAttending] = useState<boolean | null>(
    existingRsvp ? existingRsvp.attendance_status === "attending" : null
  );
  
  // Keep track of selected event IDs
  const [events, setEvents] = useState<string[]>(selectedSessionIds);
  const [pax, setPax] = useState<number | null>(existingRsvp?.confirmed_pax || null);
  const [wishes, setWishes] = useState<string>(existingRsvp?.wish_message || "");

  // Deadline logic
  const deadlineStr = invitation?.event_type?.rsvp_edit_deadline_at;
  const deadline = deadlineStr ? new Date(deadlineStr).getTime() : null;
  const isPastDeadline = deadline ? new Date().getTime() > deadline : false;

  const maxPax = invitation?.max_pax || 1;
  // Only show sessions where is_rsvp_option is true
  const sessions = (invitation?.event_type?.sessions || []).filter((s: any) => s.is_rsvp_option === true);

  const handleSubmit = () => {
    setErrorMsg("");

    if (attending === null) {
      setErrorMsg("Please select whether you will attend.");
      return;
    }

    if (attending && events.length === 0) {
      setErrorMsg("Please select at least one event.");
      return;
    }

    if (attending && pax === null) {
      setErrorMsg("Please select the number of people attending.");
      return;
    }

    startTransition(async () => {
      const result = await submitRSVP({
        invitation_id: invitation.id,
        attendance_status: attending ? "attending" : "not_attending",
        confirmed_pax: attending ? (pax || 1) : 0,
        wish_message: wishes,
        selected_session_ids: attending ? events : [],
        event_slug: invitation.event_type.slug,
        code: invitation.invitation_code
      });

      if (result.success) {
        if (isUpdating) {
          setSubmitState("success_updated");
        } else if (attending) {
          setSubmitState("success_attending");
        } else {
          setSubmitState("success_not_attending");
        }
      } else {
        setErrorMsg(result.error || "Failed to submit RSVP.");
      }
    });
  };

  const handleAddToCalendar = () => {
    window.open("https://calendar.google.com/calendar/r/eventedit", "_blank");
  };

  const resetForm = () => {
    setSubmitState("idle");
  };

  if (submitState !== "idle") {
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
              className="w-full py-3 bg-[#416130] text-white rounded-[20px] font-medium hover:bg-[#344d26] transition"
            >
              Add To Google Calendar
            </button>
          )}
          <button 
            onClick={resetForm}
            className="w-full py-3 bg-white border border-slate-300 text-slate-600 rounded-[20px] font-medium hover:bg-slate-50 transition"
          >
            Back To Invitation
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#faf9f0] flex flex-col items-center py-16 z-20 relative">
      <h2 className="text-7xl text-[#416130] mb-8" style={{ fontFamily: "var(--font-justwrite)" }}>
        RSVP
      </h2>

      <div className="w-full max-w-md mx-auto px-4 flex flex-col gap-8" style={{ fontFamily: "var(--font-alegreya)" }}>
        
        {isPastDeadline && (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-center text-sm leading-relaxed">
            RSVP editing is now closed.<br/>Please contact William / Aziel if you need to make changes.
          </div>
        )}

        {/* Attendance */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-slate-800 font-medium text-lg">Will you attend our wedding?</p>
          <div className="flex w-full gap-4">
            <button 
              disabled={isPastDeadline || isPending}
              onClick={() => setAttending(true)}
              className={`flex-1 py-3 border rounded-[20px] transition ${attending === true ? 'bg-[#416130] text-white border-[#416130]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'} disabled:opacity-50`}
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
              className={`flex-1 py-3 border rounded-[20px] transition ${attending === false ? 'bg-[#416130] text-white border-[#416130]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'} disabled:opacity-50`}
            >
              No, I can't attend
            </button>
          </div>
        </div>

        {/* Events */}
        {attending && sessions.length > 0 && (
          <div className="flex flex-col items-center gap-3 animate-fade-up">
            <p className="text-slate-800 font-medium text-lg">Which event(s) will you attend?</p>
            <div className="flex flex-col w-full gap-3">
              {sessions.length === 1 ? (
                <button 
                  disabled={isPastDeadline || isPending}
                  onClick={() => setEvents([sessions[0].id])}
                  className={`w-full py-3 border rounded-[20px] transition ${events.length === 1 && events[0] === sessions[0].id ? 'bg-[#416130] text-white border-[#416130]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'} disabled:opacity-50`}
                >
                  {sessions[0].name}
                </button>
              ) : (
                <>
                  <div className="flex gap-3">
                    <button 
                      disabled={isPastDeadline || isPending}
                      onClick={() => setEvents([sessions[0].id])}
                      className={`flex-1 py-3 border rounded-[20px] transition ${events.length === 1 && events[0] === sessions[0].id ? 'bg-[#416130] text-white border-[#416130]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'} disabled:opacity-50`}
                    >
                      {sessions[0].name}
                    </button>
                    <button 
                      disabled={isPastDeadline || isPending}
                      onClick={() => setEvents([sessions[1].id])}
                      className={`flex-1 py-3 border rounded-[20px] transition ${events.length === 1 && events[0] === sessions[1].id ? 'bg-[#416130] text-white border-[#416130]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'} disabled:opacity-50`}
                    >
                      {sessions[1].name}
                    </button>
                  </div>
                  <button 
                    disabled={isPastDeadline || isPending}
                    onClick={() => setEvents([sessions[0].id, sessions[1].id])}
                    className={`w-full py-3 border rounded-[20px] transition ${events.length === 2 ? 'bg-[#416130] text-white border-[#416130]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'} disabled:opacity-50`}
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
            <p className="text-slate-800 font-medium text-lg">How many people?</p>
            <div className="flex w-full gap-2 justify-center">
              {Array.from({ length: maxPax }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  disabled={isPastDeadline || isPending}
                  onClick={() => setPax(num)}
                  className={`w-12 h-12 flex items-center justify-center border rounded-[16px] transition ${pax === num ? 'bg-[#416130] text-white border-[#416130]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'} disabled:opacity-50`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wishes */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-slate-800 font-medium text-lg">Send your wish (Optional)</p>
          <textarea 
            disabled={isPastDeadline || isPending}
            placeholder="Type your message here ..."
            maxLength={500}
            value={wishes}
            onChange={(e) => setWishes(e.target.value)}
            className="w-full border border-slate-300 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:border-[#416130] disabled:opacity-50 disabled:bg-slate-50 bg-white text-slate-800"
          />
        </div>

        {/* Messages */}
        {errorMsg && <p className="text-red-500 text-center text-sm">{errorMsg}</p>}

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-2">
          {!isPastDeadline && (
            <button 
              disabled={isPending}
              onClick={handleSubmit}
              className="w-full py-4 bg-[#416130] text-white rounded-[20px] font-medium hover:bg-[#344d26] transition disabled:opacity-70"
            >
              {isPending ? "Saving..." : existingRsvp ? "Update RSVP" : "Confirm RSVP"}
            </button>
          )}
          <button 
            onClick={handleAddToCalendar}
            className="w-full py-4 bg-white border border-slate-300 text-slate-600 rounded-[20px] font-medium hover:bg-slate-50 transition"
          >
            Add to Google Calendar
          </button>
        </div>

      </div>
    </section>
  );
}
