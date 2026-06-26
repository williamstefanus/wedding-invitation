import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Phone, Tag, Building } from "lucide-react";
import Link from "next/link";
import { GuestDetailClient } from "./GuestDetailClient";

export const revalidate = 0;

export default async function GuestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const guestId = resolvedParams.id;
  const supabase = await createClient();

  const { data: guest, error } = await supabase
    .from("guests")
    .select(`
      *,
      invitations(
        id,
        invitation_code,
        max_pax,
        is_sent,
        event_type:event_types(name, slug),
        rsvp:rsvps(attendance_status, confirmed_pax, wish_message, submitted_at),
        seating_assignment:seating_assignments(assigned_pax, seating_table:seating_tables(table_name))
      )
    `)
    .eq("id", guestId)
    .single();

  if (error || !guest) {
    return notFound();
  }

  // Fetch event types for the edit modal
  const { data: eventTypes } = await supabase.from("event_types").select("id, name, slug");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 p-4 md:p-8 font-sans">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link href="/admin/guests" className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-600 transition mb-4 font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Guests
        </Link>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{guest.name}</h1>
        <p className="text-slate-500 mt-1">Guest Profile and Details</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Guest Info Card */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 self-start">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Contact Info</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Phone className="w-3 h-3" /> Phone Number
              </p>
              <p className="font-medium text-slate-700">{guest.phone || "No phone provided"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Building className="w-3 h-3" /> Side / Owner
              </p>
              <p className="font-medium text-slate-700">{guest.owner}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Tag className="w-3 h-3" /> Category
              </p>
              <p className="font-medium text-slate-700">{guest.category}</p>
            </div>
            {guest.notes && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">{guest.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Interactive section (edit, invitations, copy, mark as sent) */}
        <GuestDetailClient 
          guest={guest} 
          eventTypes={eventTypes || []} 
        />

      </div>
    </div>
  );
}
