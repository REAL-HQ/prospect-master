import { createFileRoute } from "@tanstack/react-router";
import { usePmStore } from "@/lib/pm-store";
import * as React from "react";
import { Key, Check, ExternalLink, User as UserIcon, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  head: () => ({ meta: [{ title: "Account — ProspectMaster" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const ghl = usePmStore((s) => s.ghl);
  const setGhl = usePmStore((s) => s.setGhl);
  const firecrawlConfigured = usePmStore((s) => s.firecrawlConfigured);
  const setFirecrawlConfigured = usePmStore((s) => s.setFirecrawlConfigured);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500 }}>Account</h1>
      <p className="text-sm text-muted-foreground mt-1">Settings, connectors, and integrations.</p>

      {/* Secrets checklist */}
      <div className="pm-card p-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Key size={14} />
          <div className="text-sm font-medium">Secrets checklist</div>
        </div>
        <div className="grid gap-2">
          <SecretRow
            label="FIRECRAWL_API_KEY"
            description="Required for lead verification and Fresh Filings web-presence checks."
            configured={firecrawlConfigured}
            onToggle={setFirecrawlConfigured}
            href="https://firecrawl.dev/app/api-keys"
          />
          <SecretRow
            label="GHL_PIT"
            description="Optional. Private Integration Token for GoHighLevel."
            configured={Boolean(ghl.pit)}
            disabled
          />
          <SecretRow
            label="GHL_LOCATION_ID"
            description="Optional. GHL sub-account location ID."
            configured={Boolean(ghl.locationId)}
            disabled
          />
        </div>
      </div>

      {/* GHL toggle */}
      <div className="pm-card p-5 mt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium">GoHighLevel <span className="text-xs text-muted-foreground font-normal">(Optional)</span></div>
            <div className="text-xs text-muted-foreground mt-1 max-w-md">
              Off by default. When enabled, a "Push to GHL" action appears on the Leads page alongside the built-in CRM. Your built-in CRM remains the primary experience either way.
            </div>
          </div>
          <button
            onClick={() => setGhl({ enabled: !ghl.enabled })}
            style={{
              position: "relative",
              width: 42, height: 24, borderRadius: 12,
              background: ghl.enabled ? "#CC0000" : "#D0D0D0",
              transition: "background 0.15s",
            }}
            aria-label="Toggle GHL"
          >
            <span style={{ position: "absolute", top: 2, left: ghl.enabled ? 20 : 2, width: 20, height: 20, borderRadius: 10, background: "#fff", transition: "left 0.15s" }} />
          </button>
        </div>

        {ghl.enabled && (
          <div className="mt-4 grid gap-3" style={{ borderTop: "0.5px solid #F0F0F0", paddingTop: 16 }}>
            <Field
              label="Private Integration Token (PIT)"
              value={ghl.pit || ""}
              onChange={(v) => setGhl({ pit: v })}
              placeholder="pit-xxxxxxxxxxxxxxxxxxxx"
              type="password"
            />
            <Field
              label="Location ID"
              value={ghl.locationId || ""}
              onChange={(v) => setGhl({ locationId: v })}
              placeholder="abcDEF123XYZ"
            />
            <div>
              <label className="text-xs text-muted-foreground">Default tags (comma-separated)</label>
              <input
                value={ghl.defaultTags.join(", ")}
                onChange={(e) => setGhl({ defaultTags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                className="w-full mt-1"
                style={{ padding: "9px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 13 }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Saved locally. Push uses the GHL Contacts API: upserts contacts, applies tags, and posts a note with the lead's category, rating, and site status.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SecretRow({ label, description, configured, onToggle, href, disabled }: { label: string; description: string; configured: boolean; onToggle?: (v: boolean) => void; href?: string; disabled?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2" style={{ borderTop: "0.5px solid #F0F0F0" }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: configured ? "#CC0000" : "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        {configured && <Check size={12} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium font-mono">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      {href && (
        <a href={href} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1" style={{ color: "#CC0000" }}>
          Get key <ExternalLink size={11} />
        </a>
      )}
      {onToggle && !disabled && (
        <button onClick={() => onToggle(!configured)} className="text-xs px-2 py-1" style={{ border: "0.5px solid #E0E0E0", borderRadius: 6, background: "#fff" }}>
          {configured ? "Mark unset" : "Mark configured"}
        </button>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full mt-1" style={{ padding: "9px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 13 }} />
    </div>
  );
}
