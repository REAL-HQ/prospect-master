import { createFileRoute } from "@tanstack/react-router";
import { usePmStore } from "@/lib/pm-store";
import * as React from "react";
import { Key, Check, ExternalLink, User as UserIcon, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  head: () => ({ meta: [{ title: "Account — ProspectMaster" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const automation = usePmStore((s) => s.automation);
  const setAutomation = usePmStore((s) => s.setAutomation);
  const firecrawlConfigured = usePmStore((s) => s.firecrawlConfigured);
  const setFirecrawlConfigured = usePmStore((s) => s.setFirecrawlConfigured);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500 }}>Account</h1>
      <p className="text-sm text-muted-foreground mt-1">Profile, security, automation, and connectors.</p>

      <ProfileSection />
      <SecuritySection />

      {/* Secrets checklist */}
      <div className="pm-card p-5 mt-4">
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
        </div>
      </div>

      {/* Automation */}
      <div className="pm-card p-5 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} />
          <div className="text-sm font-medium">Automation</div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium">Auto follow-up</div>
            <div className="text-xs text-muted-foreground mt-1 max-w-md">
              When on, scheduled outreach steps send themselves as soon as they come due — no manual sending required.
            </div>
          </div>
          <button
            onClick={() => setAutomation({ autoFollowUp: !automation.autoFollowUp })}
            style={{
              position: "relative",
              width: 42, height: 24, borderRadius: 12,
              background: automation.autoFollowUp ? "#CC0000" : "#D0D0D0",
              transition: "background 0.15s",
              flexShrink: 0,
            }}
            aria-label="Toggle auto follow-up"
          >
            <span style={{ position: "absolute", top: 2, left: automation.autoFollowUp ? 20 : 2, width: 20, height: 20, borderRadius: 10, background: "#fff", transition: "left 0.15s" }} />
          </button>
        </div>

        <div className="mt-4 grid gap-3" style={{ borderTop: "0.5px solid #F0F0F0", paddingTop: 16 }}>
          <div>
            <label className="text-xs text-muted-foreground">Default tags applied to new leads (comma-separated)</label>
            <input
              value={automation.defaultTags.join(", ")}
              onChange={(e) => setAutomation({ defaultTags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              className="w-full mt-1"
              style={{ padding: "9px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 13 }}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field
              label="Default site price ($)"
              value={String(automation.sitePrice)}
              onChange={(v) => setAutomation({ sitePrice: Number(v) || 0 })}
              type="number"
            />
            <Field
              label="Default monthly hosting fee ($)"
              value={String(automation.hostingFee)}
              onChange={(v) => setAutomation({ hostingFee: Number(v) || 0 })}
              type="number"
            />
          </div>
        </div>
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

function ProfileSection() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [originalEmail, setOriginalEmail] = React.useState("");

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u) {
        setName((u.user_metadata as any)?.full_name || (u.user_metadata as any)?.name || "");
        setEmail(u.email || "");
        setOriginalEmail(u.email || "");
      }
      setLoading(false);
    });
  }, []);

  async function save() {
    setSaving(true);
    try {
      const updates: any = { data: { full_name: name } };
      if (email && email !== originalEmail) updates.email = email;
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      if (email !== originalEmail) {
        toast.success("Confirmation email sent to update your address.");
      } else {
        toast.success("Profile updated.");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pm-card p-5 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <UserIcon size={14} />
        <div className="text-sm font-medium">Profile</div>
      </div>
      {loading ? (
        <div className="text-xs text-muted-foreground">Loading…</div>
      ) : (
        <div className="grid gap-3">
          <Field label="Full name" value={name} onChange={setName} placeholder="Your name" />
          <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
          <div>
            <button
              onClick={save}
              disabled={saving}
              className="text-xs px-3 py-2"
              style={{ background: "#CC0000", color: "#fff", borderRadius: 6, opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SecuritySection() {
  const [pw, setPw] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function updatePassword() {
    if (pw.length < 8) return toast.error("Password must be at least 8 characters.");
    if (pw !== confirm) return toast.error("Passwords do not match.");
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;
      toast.success("Password updated.");
      setPw(""); setConfirm("");
    } catch (e: any) {
      toast.error(e.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pm-card p-5 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Lock size={14} />
        <div className="text-sm font-medium">Security</div>
      </div>
      <div className="grid gap-3">
        <Field label="New password" value={pw} onChange={setPw} placeholder="At least 8 characters" type="password" />
        <Field label="Confirm new password" value={confirm} onChange={setConfirm} placeholder="Re-enter password" type="password" />
        <div>
          <button
            onClick={updatePassword}
            disabled={saving}
            className="text-xs px-3 py-2"
            style={{ background: "#CC0000", color: "#fff", borderRadius: 6, opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Updating…" : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
}
