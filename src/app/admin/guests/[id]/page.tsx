import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Phone, Tag, Building } from "lucide-react";
import Link from "next/link";

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

        {/* Invitations & RSVPs */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Invitations</h2>
          
          {guest.invitations.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
              This guest has no active invitations.
            </div>
          ) : (
            guest.invitations.map((inv: any) => {
              const rsvp = Array.isArray(inv.rsvp) ? inv.rsvp[0] : inv.rsvp;
              const assignment = Array.isArray(inv.seating_assignment) ? inv.seating_assignment[0] : inv.seating_assignment;

              return (
                <div key={inv.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className={`px-6 py-4 border-b flex justify-between items-center
                    ${inv.event_type.slug === 'wedding' ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'}
                  `}>
                    <h3 className={`font-bold text-lg 
                      ${inv.event_type.slug === 'wedding' ? 'text-amber-800' : 'text-rose-800'}
                    `}>
                      {inv.event_type.name}
                    </h3>
                    <div className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-sm font-mono font-bold text-slate-600 shadow-sm">
                      {inv.invitation_code}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Max Pax</p>
                        <p className="text-xl font-bold text-slate-700">{inv.max_pax} <span className="text-sm font-medium text-slate-400">pax</span></p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">RSVP Status</p>
                        {rsvp ? (
                          <p className={`text-xl font-bold ${rsvp.attendance_status === 'attending' ? 'text-green-600' : 'text-rose-600'}`}>
                            {rsvp.attendance_status === 'attending' ? `Attending (${rsvp.confirmed_pax} pax)` : 'Declined'}
                          </p>
                        ) : (
                          <p className="text-xl font-bold text-amber-500">Pending</p>
                        )}
                      </div>
                    </div>

                    {rsvp?.wish_message && (
                      <div className="mb-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wish Message</p>
                        <p className="text-slate-600 italic bg-slate-50 p-4 rounded-xl border border-slate-100">"{rsvp.wish_message}"</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Table Assignment</p>
                      {assignment ? (
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold border border-blue-100">
                          {assignment.seating_table.table_name}
                          <span className="text-sm font-medium opacity-75">({assignment.assigned_pax} pax)</span>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-slate-500">Not assigned yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
