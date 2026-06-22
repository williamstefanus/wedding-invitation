"use client";

import { useState, useTransition } from "react";
import { submitRSVP } from "@/lib/actions/rsvp";

import { RSVPSuccessMessage } from "@/components/invitation/wedding/rsvp/RSVPSuccessMessage";
import { RSVPForm } from "@/components/invitation/wedding/rsvp/RSVPForm";

interface RSVPSectionProps {
  invitation?: any;
  deadline?: string;
}

export function RSVPSection({ invitation, deadline: settingsDeadline }: RSVPSectionProps) {
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
  const deadlineStr = settingsDeadline || invitation?.event_type?.rsvp_edit_deadline_at;
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
    try {
      const sessions = invitation?.event_type?.sessions || [];
      const title = encodeURIComponent("William & Aziel Wedding");
      const details = encodeURIComponent("We joyfully invite you to celebrate our wedding! Please check the digital invitation for full details.");
      
      let location = "";
      let startStr = "";
      let endStr = "";
      
      if (sessions.length > 0) {
        // Sort sessions chronologically
        const sorted = [...sessions].sort((a: any, b: any) => {
          return `${a.date}T${a.start_time}`.localeCompare(`${b.date}T${b.start_time}`);
        });
        
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        
        location = encodeURIComponent(`${first.venue_name}${first.address ? `, ${first.address}` : ''}`);
        
        // Format Google Date YYYYMMDDTHHMMSS
        const formatGoogleDate = (d: string, t: string) => {
          if (!d || !t) return "";
          return `${d.replace(/-/g, '')}T${t.replace(/:/g, '').padEnd(6, '0')}`;
        };
        
        startStr = formatGoogleDate(first.date, first.start_time);
        endStr = formatGoogleDate(last.date, last.end_time);
      }
      
      let url = `https://calendar.google.com/calendar/r/eventedit?text=${title}&details=${details}&ctz=Asia/Jakarta`;
      if (startStr && endStr) {
        url += `&dates=${startStr}/${endStr}`;
      }
      if (location) {
        url += `&location=${location}`;
      }
      
      window.open(url, "_blank");
    } catch (err) {
      window.open("https://calendar.google.com/calendar/r/eventedit?text=William+%26+Aziel+Wedding", "_blank");
    }
  };

  const resetForm = () => {
    setSubmitState("idle");
  };

  if (submitState !== "idle") {
    return (
      <RSVPSuccessMessage 
        submitState={submitState}
        attending={attending}
        handleAddToCalendar={handleAddToCalendar}
        resetForm={resetForm}
      />
    );
  }

  return (
    <RSVPForm 
      isPastDeadline={isPastDeadline}
      isPending={isPending}
      attending={attending}
      setAttending={setAttending}
      events={events}
      setEvents={setEvents}
      sessions={sessions}
      pax={pax}
      setPax={setPax}
      maxPax={maxPax}
      wishes={wishes}
      setWishes={setWishes}
      errorMsg={errorMsg}
      handleSubmit={handleSubmit}
      handleAddToCalendar={handleAddToCalendar}
      existingRsvp={isUpdating}
    />
  );
}
