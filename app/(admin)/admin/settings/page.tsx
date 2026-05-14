"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Save } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";

interface Setting {
  id: string;
  key: string;
  value_en: string;
  value_ar: string;
}

const GROUPS: Record<string, string[]> = {
  Hero: ["hero_title_en", "hero_title_ar", "hero_subtitle_en", "hero_subtitle_ar", "hero_description_en", "hero_description_ar", "hero_cta_en", "hero_cta_ar"],
  About: ["about_bio_en", "about_bio_ar"],
  "Social Links": ["social_github", "social_linkedin", "social_twitter"],
  Footer: ["footer_text_en", "footer_text_ar"],
};

export function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [edited, setEdited] = useState<Record<string, { value_en: string; value_ar: string }>>({});

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    setSettings(data.settings ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  function getValue(key: string, field: "value_en" | "value_ar"): string {
    if (edited[key]?.[field] !== undefined) return edited[key][field];
    return settings.find((s) => s.key === key)?.[field] || "";
  }

  function setValue(key: string, field: "value_en" | "value_ar", value: string) {
    setEdited((prev) => ({
      ...prev,
      [key]: { ...prev[key], value_en: prev[key]?.value_en ?? settings.find((s) => s.key === key)?.value_en ?? "", value_ar: prev[key]?.value_ar ?? settings.find((s) => s.key === key)?.value_ar ?? "", [field]: value },
    }));
  }

  async function saveGroup(group: string) {
    setSaving(group);
    const keys = GROUPS[group];
    for (const key of keys) {
      const changes = edited[key];
      if (!changes) continue;
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value_en: changes.value_en, value_ar: changes.value_ar }),
      });
    }
    setEdited((prev) => {
      const next = { ...prev };
      for (const key of keys) delete next[key];
      return next;
    });
    fetchSettings();
    setSaving(null);
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>;

  const usedKeys = new Set(Object.values(GROUPS).flat());
  const ungrouped = settings.filter((s) => !usedKeys.has(s.key));

  return (
    <div className="space-y-6 max-w-3xl">
      {Object.entries(GROUPS).map(([group, keys]) => {
        const hasChanges = keys.some((k) => edited[k]);
        return (
          <div key={group} className="rounded-xl border border-border/30 bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{group}</h2>
              {hasChanges && (
                <button onClick={() => saveGroup(group)} disabled={saving === group} className="flex items-center gap-2 px-3 py-1.5 rounded-lg brand-gradient text-white text-sm font-medium disabled:opacity-50 cursor-pointer">
                  {saving === group ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </button>
              )}
            </div>
            {keys.map((key) => {
              const isSocial = key.startsWith("social_");
              const label = key.replace(/_/g, " ").replace(/^(hero|about|social|footer) /i, "");
              const isBilingual = !isSocial;
              return (
                <div key={key}>
                  {isBilingual ? (
                    <BilingualInput
                      label={label}
                      nameEn={`${key}__en`}
                      nameAr={`${key}__ar`}
                      valueEn={getValue(key, "value_en")}
                      valueAr={getValue(key, "value_ar")}
                    />
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">{label}</label>
                      <input
                        value={getValue(key, "value_en")}
                        onChange={(e) => setValue(key, "value_en", e.target.value)}
                        className="w-full rounded-lg border border-border/40 bg-surface-low px-3 py-2 text-sm focus:border-brand/40 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {ungrouped.length > 0 && (
        <div className="rounded-xl border border-border/30 bg-card p-5 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Other Settings</h2>
          {ungrouped.map((s) => (
            <BilingualInput key={s.id} label={s.key} nameEn={`${s.key}__en`} nameAr={`${s.key}__ar`} valueEn={getValue(s.key, "value_en")} valueAr={getValue(s.key, "value_ar")} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
