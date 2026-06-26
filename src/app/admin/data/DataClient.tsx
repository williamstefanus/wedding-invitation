"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileDown, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { exportToExcel } from "@/lib/utils";
import { generateExportData, bulkImportGuestsAndInvitations } from "@/lib/actions/importExport";

interface DataClientProps {
  existingIdentifiers: { name: string; phone: string | null }[];
}

type ValidationStatus = "valid" | "warning" | "error";

interface ParsedRow {
  index: number;
  name: string;
  phone: string;
  owner: string;
  category: string;
  weddingPax: number;
  sangjitPax: number;
  notes: string;
  status: ValidationStatus;
  message: string;
}

export function DataClient({ existingIdentifiers }: DataClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isPending, startTransition] = useTransition();
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const [parsedData, setParsedData] = useState<ParsedRow[] | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // EXPORT LOGIC
  const handleExport = async (type: string, filename: string) => {
    setIsExporting(type);
    try {
      const res = await generateExportData(type);
      if (res.success && res.data) {
        exportToExcel(res.data, filename);
        showStatus('success', `Exported ${filename} successfully.`);
      } else {
        showStatus('error', "Export failed: " + res.error);
      }
    } catch (e: any) {
      showStatus('error', "Error generating export: " + e.message);
    } finally {
      setIsExporting(null);
    }
  };

  // IMPORT LOGIC (Parsing)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
      showStatus('error', "Invalid file format. Please upload a CSV or Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        validateAndSetData(data);
      } catch (err) {
        showStatus('error', "Failed to parse file. Ensure it is a valid CSV or XLSX.");
      }
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

  const validateAndSetData = (rawData: any[]) => {
    const processed: ParsedRow[] = [];
    const validOwners = ["William", "Aziel"];
    const validCategories = ["Relatives", "Friends", "Church"];

    rawData.forEach((row, idx) => {
      // Normalize keys by removing spaces and making lowercase for loose matching
      const getVal = (possibleKeys: string[]) => {
        const key = Object.keys(row).find(k => possibleKeys.includes(k.toLowerCase().replace(/[^a-z0-9]/g, '')));
        return key ? row[key] : undefined;
      };

      const name = String(getVal(["name", "guestname"]) || "").trim();
      const phone = String(getVal(["phone", "phonenumber", "contact"]) || "").trim();
      const owner = String(getVal(["owner", "side"]) || "").trim();
      const category = String(getVal(["category", "group"]) || "").trim();
      const weddingPaxRaw = getVal(["weddingpax", "wedding", "weddingcapacity"]);
      const sangjitPaxRaw = getVal(["sangjitpax", "sangjit", "sangjitcapacity"]);
      const notes = String(getVal(["notes", "remark"]) || "").trim();

      const weddingPax = parseInt(weddingPaxRaw) || 0;
      const sangjitPax = parseInt(sangjitPaxRaw) || 0;

      let status: ValidationStatus = "valid";
      let message = "Ready to import";

      // 1. Strict Errors
      if (!name) {
        status = "error";
        message = "Name is required.";
      } else if (!validOwners.includes(owner)) {
        status = "error";
        message = `Invalid Owner: '${owner}'. Must be William or Aziel.`;
      } else if (!validCategories.includes(category)) {
        status = "error";
        message = `Invalid Category: '${category}'. Must be Relatives, Friends, or Church.`;
      } else if (weddingPax < 0 || sangjitPax < 0) {
        status = "error";
        message = "Pax cannot be negative.";
      } 
      // 2. Duplicate Warnings (Skip logic)
      else {
        const isDuplicateName = existingIdentifiers.some(id => id.name.toLowerCase() === name.toLowerCase());
        const isDuplicatePhone = phone && existingIdentifiers.some(id => id.phone === phone);

        if (isDuplicateName || isDuplicatePhone) {
          status = "warning";
          message = "Duplicate detected. This row will be SKIPPED.";
        }
      }

      processed.push({
        index: idx + 1,
        name,
        phone,
        owner,
        category,
        weddingPax,
        sangjitPax,
        notes,
        status,
        message
      });
    });

    setParsedData(processed);
  };

  const handleCommitImport = async () => {
    if (!parsedData) return;

    // Filter out errors and warnings (skipped)
    const validRows = parsedData.filter(r => r.status === "valid");

    if (validRows.length === 0) {
      showStatus('error', "No valid rows to import.");
      return;
    }

    setIsImporting(true);
    
    const res = await bulkImportGuestsAndInvitations(validRows);
    
    setIsImporting(false);

    if (res.success) {
      showStatus('success', `Successfully imported ${res.count} guests!`);
      setParsedData(null);
      
      // Refresh router to update any prefetched data
      startTransition(() => {
        router.refresh();
      });
    } else {
      showStatus('error', "Import failed: " + res.error);
    }
  };

  const validCount = parsedData?.filter(r => r.status === "valid").length || 0;
  const warningCount = parsedData?.filter(r => r.status === "warning").length || 0;
  const errorCount = parsedData?.filter(r => r.status === "error").length || 0;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 font-sans">
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Data Management</h1>
        <p className="text-slate-500 mt-1">Bulk import guests or export system data.</p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl mb-6 font-bold flex items-center gap-2 shadow-sm transition-all duration-300 ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>{statusMsg.type === 'success' ? '✓' : '✕'}</span>
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* EXPORT SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <FileDown className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Export Data</h2>
              <p className="text-sm text-slate-500">Download system data as Excel files.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {[
              { type: "guests", label: "Guest List", desc: "All guests and details" },
              { type: "invitations", label: "Invitation List", desc: "Codes and event mapping" },
              { type: "rsvp", label: "RSVP List", desc: "Attendance and wishes" },
              { type: "attendance", label: "Attendance Summary", desc: "Pax summary by event" },
              { type: "seating", label: "Seating Plan", desc: "Table assignments" },
            ].map((exp) => (
              <div key={exp.type} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-emerald-200 transition">
                <div>
                  <p className="font-bold text-slate-700">{exp.label}</p>
                  <p className="text-xs text-slate-400">{exp.desc}</p>
                </div>
                <button 
                  onClick={() => handleExport(exp.type, exp.label)}
                  disabled={isExporting === exp.type}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-emerald-600 text-sm font-bold rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isExporting === exp.type ? <Loader2 className="w-4 h-4 animate-spin" /> : "Download"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* IMPORT SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-xl">
              <UploadCloud className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Import Data</h2>
              <p className="text-sm text-slate-500">Upload CSV or XLSX to bulk create guests.</p>
            </div>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 transition-colors rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer text-center"
          >
            <UploadCloud className="w-10 h-10 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-700 mb-1">Click to upload file</h3>
            <p className="text-sm text-slate-500 max-w-xs">Supported formats: .csv, .xlsx</p>
            <p className="text-xs text-slate-400 mt-4">Expected Columns: Name, Phone, Owner, Category, Wedding Pax, Sangjit Pax</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileUpload}
            />
          </div>
        </div>

      </div>

      {/* PREVIEW SECTION */}
      {parsedData && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-up">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Import Preview</h2>
              <div className="flex gap-4 mt-2 text-sm font-medium">
                <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {validCount} Valid</span>
                <span className="text-amber-500 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {warningCount} Skipped</span>
                <span className="text-red-500 flex items-center gap-1"><XCircle className="w-4 h-4"/> {errorCount} Errors</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setParsedData(null)}
                className="px-6 py-2 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleCommitImport}
                disabled={isImporting || validCount === 0}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center gap-2"
              >
                {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Import"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Row</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Owner</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium text-center">Wedding Pax</th>
                  <th className="px-6 py-4 font-medium text-center">Sangjit Pax</th>
                  <th className="px-6 py-4 font-medium">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedData.map((row) => (
                  <tr key={row.index} className={row.status === "error" ? "bg-red-50" : row.status === "warning" ? "bg-amber-50" : "hover:bg-slate-50"}>
                    <td className="px-6 py-4 text-slate-500">{row.index}</td>
                    <td className="px-6 py-4">
                      {row.status === "valid" && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">Valid</span>}
                      {row.status === "warning" && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold uppercase">Skipped</span>}
                      {row.status === "error" && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase">Error</span>}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{row.name || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{row.owner || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{row.category || "-"}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{row.weddingPax}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{row.sangjitPax}</td>
                    <td className={`px-6 py-4 ${row.status === "error" ? "text-red-600" : row.status === "warning" ? "text-amber-600" : "text-green-600"}`}>
                      {row.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
