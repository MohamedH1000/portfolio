"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Save } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { AdminButton } from "@/components/admin/AdminButton";
import { FormField } from "@/components/admin/FormField";

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

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6" role="status" aria-label="Loading settings">
        {[0, 1, 2].map((i) => (
          <div key={i} className="surface-card space-y-4 rounded-2xl p-5">
            <div className="shimmer h-4 w-28 rounded-full" />
            <div className="shimmer h-10 w-full rounded-xl" />
            <div className="shimmer h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  const usedKeys = new Set(Object.values(GROUPS).flat());
  const ungrouped = settings.filter((s) => !usedKeys.has(s.key));

  return (
    <div className="max-w-3xl space-y-6">
      {Object.entries(GROUPS).map(([group, keys], groupIndex) => {
        const hasChanges = keys.some((k) => edited[k]);
        return (
          <AdminPanel
            key={group}
            index={groupIndex}
            title={group}
            bodyClassName="space-y-5 p-5"
            action={
              <AnimatePresence>
                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 8 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  >
                    <AdminButton
                      onClick={() => saveGroup(group)}
                      loading={saving === group}
                      icon={<Save className="h-4 w-4" />}
                      className="px-3 py-1.5"
                    >
                      Save
                    </AdminButton>
                  </motion.div>
                )}
              </AnimatePresence>
            }
          >
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
                      onChangeEn={(value) => setValue(key, "value_en", value)}
                      onChangeAr={(value) => setValue(key, "value_ar", value)}
                    />
                  ) : (
                    <FormField label={label} htmlFor={`setting-${key}`} className="capitalize">
                      <input
                        id={`setting-${key}`}
                        value={getValue(key, "value_en")}
                        onChange={(e) => setValue(key, "value_en", e.target.value)}
                        className="field"
                      />
                    </FormField>
                  )}
                </div>
              );
            })}
          </AdminPanel>
        );
      })}

      {ungrouped.length > 0 && (
        <AdminPanel
          index={Object.keys(GROUPS).length}
          title="Other Settings"
          bodyClassName="space-y-5 p-5"
        >
          {ungrouped.map((s) => (
            <BilingualInput key={s.id} label={s.key} nameEn={`${s.key}__en`} nameAr={`${s.key}__ar`} valueEn={getValue(s.key, "value_en")} valueAr={getValue(s.key, "value_ar")} />
          ))}
        </AdminPanel>
      )}
    </div>
  );
}

export default SettingsPage;
