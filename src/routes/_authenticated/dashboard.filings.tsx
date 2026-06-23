import { createFileRoute } from "@tanstack/react-router";
import { usePmStore, type WebPresence, type FilingStatus } from "@/lib/pm-store";
import * as React from "react";
import Papa from "papaparse";
import { Upload, Loader2, Trash2, ShieldCheck, ArrowRight, FilePlus, Globe } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/filings")({
  head: () => ({ meta: [{ title: "Fresh Filings — ProspectMaster" }] }),
  component: FilingsPage,
});

type Mapping = { businessName: string; entityNumber: string; filingDate: string; city: string; zip: string; registeredAgent: string };
const REQUIRED = ["businessName"] as const;
const FIELDS: { key: keyof Mapping; label: string; required?: boolean }[] = [
  { key: "businessName", label: "Business Name", required: true },
  { key: "entityNumber", label: "Entity Number" },
  { key: "filingDate", label: "Filing Date" },
  { key: "city", label: "City" },
  { key: "zip", label: "Zip" },
  { key: "registeredAgent", label: "Registered Agent" },
];

function guessMapping(headers: string[]): Mapping {
  const lower = headers.map((h) => h.toLowerCase());
  const find = (...needles: string[]) => {
    for (const n of needles) {
      const i = lower.findIndex((h) => h.includes(n));
      if (i >= 0) return headers[i];
    }
    return "";
  };
  return {
    businessName: find("business name", "entity name", "name"),
    entityNumber: find("entity number", "entity id", "filing number", "number"),
    filingDate: find("filing date", "registered", "date"),
    city: find("city"),
    zip: find("zip", "postal"),
    registeredAgent: find("agent"),
  };
}

function FilingsPage() {
  const filings = usePmStore((s) => s.filings);
  const importFilings = usePmStore((s) => s.importFilings);
  const checkFilingPresence = usePmStore((s) => s.checkFilingPresence);
  const checkFilingNext = usePmStore((s) => s.checkFilingNext);
  const convertFilingsToLeads = usePmStore((s) => s.convertFilingsToLeads);
  const deleteFilings = usePmStore((s) => s.deleteFilings);

  const [importStep, setImportStep] = React.useState<"idle" | "map" | "preview">("idle");
  const [headers, setHeaders] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = React.useState<Mapping>({ businessName: "", entityNumber: "", filingDate: "", city: "", zip: "", registeredAgent: "" });

  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = React.useState<"ALL" | FilingStatus>("ALL");
  const [filterPresence, setFilterPresence] = React.useState<"ALL" | WebPresence>("ALL");
  const [search, setSearch] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const fileInput = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const heads = results.meta.fields || [];
        setHeaders(heads);
        setRows(results.data);
        setMapping(guessMapping(heads));
        setImportStep("map");
      },
    });
  };

  const commitImport = () => {
    const mapped = rows.map((r) => ({
      businessName: r[mapping.businessName] || "",
      entityNumber: mapping.entityNumber ? r[mapping.entityNumber] : undefined,
      filingDate: mapping.filingDate ? r[mapping.filingDate] : new Date().toISOString().slice(0, 10),
      city: mapping.city ? r[mapping.city] : "",
      zip: mapping.zip ? r[mapping.zip] : undefined,
      registeredAgent: mapping.registeredAgent ? r[mapping.registeredAgent] : undefined,
      raw: r,
    })).filter((r) => r.businessName.trim());
    importFilings(mapped);
    setImportStep("idle");
    setRows([]); setHeaders([]);
    if (fileInput.current) fileInput.current.value = "";
  };

  const filtered = React.useMemo(() => {
    return filings.filter((f) => {
      if (filterStatus !== "ALL" && f.status !== filterStatus) return false;
      if (filterPresence !== "ALL" && f.webPresence !== filterPresence) return false;
      if (search && !f.businessName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filings, filterStatus, filterPresence, search]);

  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectVisible = () => setSelected(new Set(filtered.map((f) => f.id)));
  const clearSel = () => setSelected(new Set());

  const handleCheck = async () => {
    setBusy(true);
    if (selected.size > 0) await checkFilingPresence(Array.from(selected));
    else await checkFilingNext(25);
    setBusy(false);
    clearSel();
  };

  const handleConvert = () => {
    if (selected.size === 0) return;
    if (!confirm(`Convert ${selected.size} filings into leads?`)) return;
    convertFilingsToLeads(Array.from(selected));
    clearSel();
  };

  const handleDelete = () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} filings?`)) return;
    deleteFilings(Array.from(selected));
    clearSel();
  };

  const counts = {
    total: filings.length,
    unknown: filings.filter((f) => f.webPresence === "unknown").length,
    no_website: filings.filter((f) => f.webPresence === "no_website").length,
    converted: filings.filter((f) => f.status === "converted").length,
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500 }}>Fresh filings</h1>
      <p className="text-sm text-muted-foreground mt-1">Newly registered businesses are leads before they exist anywhere else.</p>

      <div className="mt-6 grid grid-cols-4 gap-3">
        <Stat label="Total filings" value={counts.total} />
        <Stat label="Unchecked" value={counts.unknown} />
        <Stat label="Confirmed no-site" value={counts.no_website} accent />
        <Stat label="Converted to leads" value={counts.converted} />
      </div>

      {/* Import card */}
      {importStep === "idle" && (
        <div className="pm-card p-5 mt-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm font-medium flex items-center gap-2"><FilePlus size={14} /> Import a filings CSV</div>
            <div className="text-xs text-muted-foreground mt-1">Upload a Secretary of State filing list. We'll map columns and check web presence.</div>
          </div>
          <div className="flex gap-2">
            <input ref={fileInput} type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" id="filing-csv" />
            <label htmlFor="filing-csv" className="pm-btn-red cursor-pointer">
              <Upload size={14} /> Upload CSV
            </label>
          </div>
        </div>
      )}

      {importStep === "map" && (
        <div className="pm-card p-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Map columns ({rows.length} rows detected)</div>
            <button onClick={() => setImportStep("idle")} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground">{f.label}{f.required ? " *" : ""}</label>
                <select value={mapping[f.key]} onChange={(e) => setMapping((m) => ({ ...m, [f.key]: e.target.value }))} className="w-full mt-1" style={{ padding: "8px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 13, background: "#fff" }}>
                  <option value="">— skip —</option>
                  {headers.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setImportStep("preview")} disabled={!REQUIRED.every((k) => mapping[k])} className="pm-btn-red" style={{ opacity: !REQUIRED.every((k) => mapping[k]) ? 0.5 : 1 }}>
              Preview <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {importStep === "preview" && (
        <div className="pm-card p-5 mt-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Preview (first 5 of {rows.length})</div>
            <button onClick={() => setImportStep("map")} className="text-xs text-muted-foreground hover:text-foreground">Back to mapping</button>
          </div>
          <table className="w-full text-xs">
            <thead style={{ background: "#FAFAFA" }}>
              <tr>{FIELDS.map((f) => <th key={f.key} className="p-2 text-left">{f.label}</th>)}</tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((r, i) => (
                <tr key={i} style={{ borderTop: "0.5px solid #F0F0F0" }}>
                  {FIELDS.map((f) => <td key={f.key} className="p-2">{mapping[f.key] ? r[mapping[f.key]] || "—" : "—"}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={commitImport} className="pm-btn-red">Import {rows.length} filings</button>
          </div>
        </div>
      )}

      {/* Filters & bulk actions */}
      <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search filings…" className="text-xs" style={{ padding: "6px 10px", border: "0.5px solid #E0E0E0", borderRadius: 20, background: "#fff", minWidth: 200 }} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)} className="text-xs" style={{ padding: "6px 10px", border: "0.5px solid #E0E0E0", borderRadius: 20, background: "#fff" }}>
            <option value="ALL">All statuses</option>
            <option value="new">New</option>
            <option value="checked">Checked</option>
            <option value="converted">Converted</option>
            <option value="skipped">Skipped</option>
          </select>
          <select value={filterPresence} onChange={(e) => setFilterPresence(e.target.value as typeof filterPresence)} className="text-xs" style={{ padding: "6px 10px", border: "0.5px solid #E0E0E0", borderRadius: 20, background: "#fff" }}>
            <option value="ALL">All web presence</option>
            <option value="unknown">Unknown</option>
            <option value="no_website">No website</option>
            <option value="social_only">Social only</option>
            <option value="has_website">Has website</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap" style={{ padding: 10, background: "#FAFAFA", border: "0.5px solid #E8E8E8", borderRadius: 8 }}>
        <span className="text-xs text-muted-foreground">{selected.size} selected</span>
        <button onClick={selectVisible} className="text-xs underline text-muted-foreground">Select all visible</button>
        {selected.size > 0 && <button onClick={clearSel} className="text-xs underline text-muted-foreground">Clear</button>}
        <div className="flex-1" />
        <button onClick={handleCheck} disabled={busy} className="text-xs flex items-center gap-1.5 px-3 py-1.5" style={{ border: "0.5px solid #E0E0E0", borderRadius: 6, background: "#fff" }}>
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Globe size={12} />} {selected.size > 0 ? "Check Selected" : "Check Next 25"}
        </button>
        <button onClick={handleConvert} disabled={selected.size === 0} className="text-xs flex items-center gap-1.5 px-3 py-1.5" style={{ border: "0.5px solid #CC0000", color: "#CC0000", borderRadius: 6, background: "#fff", opacity: selected.size === 0 ? 0.5 : 1 }}>
          <ShieldCheck size={12} /> Convert to Leads
        </button>
        <button onClick={handleDelete} disabled={selected.size === 0} className="text-xs flex items-center gap-1.5 px-3 py-1.5" style={{ border: "0.5px solid #E0E0E0", borderRadius: 6, background: "#fff", color: "#888", opacity: selected.size === 0 ? 0.5 : 1 }}>
          <Trash2 size={12} /> Delete
        </button>
      </div>

      <div className="mt-3 pm-card overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No filings here. Upload a CSV above.</div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: "#FAFAFA", fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <tr>
                <th className="p-3 w-8"></th>
                <th className="text-left p-3">Business</th>
                <th className="text-left p-3">Filed</th>
                <th className="text-left p-3">City</th>
                <th className="text-left p-3">Agent</th>
                <th className="text-left p-3">Web Presence</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} style={{ borderTop: "0.5px solid #F0F0F0" }}>
                  <td className="p-3"><input type="checkbox" checked={selected.has(f.id)} onChange={() => toggle(f.id)} /></td>
                  <td className="p-3">
                    <div className="font-medium text-sm">{f.businessName}</div>
                    {f.entityNumber && <div className="text-xs text-muted-foreground">{f.entityNumber}</div>}
                  </td>
                  <td className="p-3 text-xs">{f.filingDate}</td>
                  <td className="p-3 text-xs">{f.city}</td>
                  <td className="p-3 text-xs">{f.registeredAgent || "—"}</td>
                  <td className="p-3"><PresenceBadge p={f.webPresence} /></td>
                  <td className="p-3 text-xs capitalize">{f.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function PresenceBadge({ p }: { p: WebPresence }) {
  const map: Record<WebPresence, { bg: string; fg: string; label: string }> = {
    unknown: { bg: "#F0F0F0", fg: "#888", label: "unknown" },
    no_website: { bg: "#CC0000", fg: "#fff", label: "no website" },
    social_only: { bg: "#FFF4D6", fg: "#B36B00", label: "social only" },
    has_website: { bg: "#EEF0F2", fg: "#666", label: "has website" },
  };
  const c = map[p];
  return <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 7px", borderRadius: 10, background: c.bg, color: c.fg }}>{c.label}</span>;
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="pm-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: accent ? "#CC0000" : undefined }}>{value}</div>
    </div>
  );
}
