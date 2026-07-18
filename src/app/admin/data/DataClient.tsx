"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileDown, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { exportToExcel } from "@/lib/utils";
import { generateExportData, bulkImportGuestsAndInvitations } from "@/lib/actions/importExport";
import { Box, Flex, Grid, Card, Heading, Text, Button, Badge, Table, Callout } from "@radix-ui/themes";

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
    const validOwners = ["groom", "bride"];
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
    <Box className="knotice-app" p={{ initial: "4", md: "7" }}>
      <Flex direction="column" gap="4" style={{ maxWidth: 1180, margin: "0 auto" }}>
        
        <Box mb="2">
          <Heading size="7" weight="bold" color="gray" style={{ color: "var(--slate-12)" }}>Data Management</Heading>
          <Text color="gray" size="2">Bulk import guests or export system data.</Text>
        </Box>

        {statusMsg && (
          <Callout.Root color={statusMsg.type === 'success' ? 'green' : 'red'} mb="4">
            <Callout.Icon>
              {statusMsg.type === 'success' ? <CheckCircle2 width={18} /> : <XCircle width={18} />}
            </Callout.Icon>
            <Callout.Text>
              {statusMsg.text}
            </Callout.Text>
          </Callout.Root>
        )}

        <Grid columns={{ initial: "1", lg: "2" }} gap="6" mb="6">
          
          {/* EXPORT SECTION */}
          <Card size="3">
            <Flex align="center" gap="3" mb="5">
              <Flex align="center" justify="center" style={{ width: 48, height: 48, backgroundColor: "var(--emerald-3)", color: "var(--emerald-11)", borderRadius: "var(--radius-3)" }}>
                <FileDown width={24} height={24} />
              </Flex>
              <Box>
                <Heading size="4">Export Data</Heading>
                <Text size="2" color="gray">Download system data as Excel files.</Text>
              </Box>
            </Flex>

            <Flex direction="column" gap="3">
              {[
                { type: "guests", label: "Guest List", desc: "All guests and details" },
                { type: "invitations", label: "Invitation List", desc: "Codes and event mapping" },
                { type: "rsvp", label: "RSVP List", desc: "Attendance and wishes" },
                { type: "attendance", label: "Attendance Summary", desc: "Pax summary by event" },
                { type: "seating", label: "Seating Plan", desc: "Table assignments" },
              ].map((exp) => (
                <Flex key={exp.type} align="center" justify="between" p="3" style={{ border: "1px solid var(--gray-5)", borderRadius: "var(--radius-3)" }}>
                  <Box>
                    <Text as="div" weight="bold" size="2">{exp.label}</Text>
                    <Text as="div" size="1" color="gray">{exp.desc}</Text>
                  </Box>
                  <Button 
                    variant="soft" 
                    color="green" 
                    onClick={() => handleExport(exp.type, exp.label)}
                    disabled={isExporting === exp.type}
                  >
                    {isExporting === exp.type ? <Loader2 className="w-4 h-4 animate-spin" /> : "Download"}
                  </Button>
                </Flex>
              ))}
            </Flex>
          </Card>

          {/* IMPORT SECTION */}
          <Card size="3" style={{ display: "flex", flexDirection: "column" }}>
            <Flex align="center" gap="3" mb="5">
              <Flex align="center" justify="center" style={{ width: 48, height: 48, backgroundColor: "var(--blue-3)", color: "var(--blue-11)", borderRadius: "var(--radius-3)" }}>
                <UploadCloud width={24} height={24} />
              </Flex>
              <Box>
                <Heading size="4">Import Data</Heading>
                <Text size="2" color="gray">Upload CSV or XLSX to bulk create guests.</Text>
              </Box>
            </Flex>

            <Box 
              onClick={() => fileInputRef.current?.click()}
              style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", border: "2px dashed var(--gray-5)", borderRadius: "var(--radius-3)", backgroundColor: "var(--gray-2)", cursor: "pointer", textAlign: "center" }}
            >
              <UploadCloud width={40} height={40} color="var(--gray-8)" style={{ marginBottom: "12px" }} />
              <Heading size="3" mb="1">Click to upload file</Heading>
              <Text as="p" size="2" color="gray" mb="4">Supported formats: .csv, .xlsx</Text>
              <Text as="p" size="1" color="gray">Expected Columns: Name, Phone, Owner, Category, Wedding Pax, Sangjit Pax</Text>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: "none" }}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileUpload}
              />
            </Box>
          </Card>

        </Grid>

        {/* PREVIEW SECTION */}
        {parsedData && (
          <Card size="3">
            <Flex direction={{ initial: "column", sm: "row" }} justify="between" align={{ initial: "start", sm: "center" }} gap="4" mb="4">
              <Box>
                <Heading size="4">Import Preview</Heading>
                <Flex gap="4" mt="2">
                  <Flex align="center" gap="1">
                    <CheckCircle2 width={14} height={14} color="var(--green-9)" />
                    <Text size="2" color="green" weight="medium">{validCount} Valid</Text>
                  </Flex>
                  <Flex align="center" gap="1">
                    <AlertCircle width={14} height={14} color="var(--amber-9)" />
                    <Text size="2" color="amber" weight="medium">{warningCount} Skipped</Text>
                  </Flex>
                  <Flex align="center" gap="1">
                    <XCircle width={14} height={14} color="var(--red-9)" />
                    <Text size="2" color="red" weight="medium">{errorCount} Errors</Text>
                  </Flex>
                </Flex>
              </Box>
              <Flex gap="3">
                <Button 
                  variant="surface"
                  color="gray"
                  onClick={() => setParsedData(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCommitImport}
                  disabled={isImporting || validCount === 0}
                >
                  {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Import"}
                </Button>
              </Flex>
            </Flex>

            <Box style={{ overflowX: "auto" }}>
              <Table.Root variant="ghost" size="2">
                <Table.Header>
                  <Table.Row style={{ height: "64px", verticalAlign: "middle" }}>
                    <Table.ColumnHeaderCell style={{ verticalAlign: "middle" }}>Row</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ verticalAlign: "middle" }}>Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ verticalAlign: "middle" }}>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ verticalAlign: "middle" }}>Owner</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ verticalAlign: "middle" }}>Category</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center" style={{ verticalAlign: "middle" }}>Wedding Pax</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center" style={{ verticalAlign: "middle" }}>Sangjit Pax</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ verticalAlign: "middle" }}>Message</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {parsedData.map((row) => (
                    <Table.Row key={row.index} style={{ height: "64px", verticalAlign: "middle", backgroundColor: row.status === "error" ? "var(--red-2)" : row.status === "warning" ? "var(--amber-2)" : "transparent" }}>
                      <Table.Cell style={{ verticalAlign: "middle" }}>
                        <Text color="gray">{row.index}</Text>
                      </Table.Cell>
                      <Table.Cell style={{ verticalAlign: "middle" }}>
                        {row.status === "valid" && <Badge size="2" color="green" variant="soft">Valid</Badge>}
                        {row.status === "warning" && <Badge size="2" color="amber" variant="soft">Skipped</Badge>}
                        {row.status === "error" && <Badge size="2" color="red" variant="soft">Error</Badge>}
                      </Table.Cell>
                      <Table.Cell style={{ verticalAlign: "middle" }}>
                        <Text weight="medium">{row.name || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell style={{ verticalAlign: "middle" }}>
                        <Text color="gray">{row.owner || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell style={{ verticalAlign: "middle" }}>
                        <Text color="gray">{row.category || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell align="center" style={{ verticalAlign: "middle" }}>
                        <Text color="gray">{row.weddingPax}</Text>
                      </Table.Cell>
                      <Table.Cell align="center" style={{ verticalAlign: "middle" }}>
                        <Text color="gray">{row.sangjitPax}</Text>
                      </Table.Cell>
                      <Table.Cell style={{ verticalAlign: "middle" }}>
                        <Text size="2" color={row.status === "error" ? "red" : row.status === "warning" ? "amber" : "green"}>
                          {row.message}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Card>
        )}

      </Flex>
    </Box>
  );
}
