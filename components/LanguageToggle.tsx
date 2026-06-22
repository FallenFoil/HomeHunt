"use client";

import { Flag } from "@/components/Flag";
import { useLanguage } from "@/components/LanguageContext";
import { Switch } from "@/components/ui/switch";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const isPT = language === "pt";

  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex items-center gap-1 text-xs font-medium transition ${
          !isPT ? "text-foreground" : "text-muted-foreground/60"
        }`}
      >
        <Flag language="en" />
        {t.languageLabel.en}
      </span>
      <Switch
        checked={isPT}
        onCheckedChange={(v) => setLanguage(v ? "pt" : "en")}
        aria-label="Language"
      />
      <span
        className={`flex items-center gap-1 text-xs font-medium transition ${
          isPT ? "text-foreground" : "text-muted-foreground/60"
        }`}
      >
        <Flag language="pt" />
        {t.languageLabel.pt}
      </span>
    </div>
  );
}
