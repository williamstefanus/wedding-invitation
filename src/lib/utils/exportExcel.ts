import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], filename: string) {
  // Format the data into a flat structure suitable for Excel
  const formattedData = data.map(item => {
    let rsvpData = null;
    if (item.rsvp) {
      if (Array.isArray(item.rsvp)) {
        if (item.rsvp.length > 0) rsvpData = item.rsvp[0];
      } else {
        rsvpData = item.rsvp;
      }
    }
    const isPending = !rsvpData;
    
    return {
      "Guest Name": item.guest?.name || "-",
      "Event Type": item.event_type?.name || "-",
      "Owner": item.guest?.owner || "-",
      "Category": item.guest?.category || "-",
      "Status": isPending ? "Pending" : (rsvpData?.attendance_status === "attending" ? "Attending" : "Declined"),
      "Confirmed Pax": isPending ? 0 : (rsvpData?.confirmed_pax || 0),
      "Max Pax": item.max_pax || 0,
      "Submission Time": isPending ? "-" : new Date(rsvpData?.submitted_at).toLocaleString(),
      "Table Assignment": item.seating_assignment?.[0]?.seating_table?.table_name || "Unassigned",
      "Wishes": isPending ? "-" : (rsvpData?.wish_message || "-"),
      "Invitation Code": item.invitation_code
    };
  });

  // Create a new workbook and a worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  
  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "RSVPs");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
