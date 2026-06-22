"use client";

import { useT } from "@/components/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { STATUSES, type Status } from "@/types/house";

export type Filter = "All" | Status;

type Props = {
  value: Filter;
  counts: Record<Filter, number>;
  onChange: (v: Filter) => void;
};

const ALL_OPTIONS: Filter[] = ["All", ...STATUSES];

export function StatusFilter({ value, counts, onChange }: Props) {
  const t = useT();
  const label = (opt: Filter) => (opt === "All" ? t.all : t.statusLabel[opt]);
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as Filter)}
      variant="outline"
      className="flex-wrap"
    >
      {ALL_OPTIONS.map((opt) => (
        <ToggleGroupItem key={opt} value={opt} aria-label={label(opt)} className="gap-2">
          <span>{label(opt)}</span>
          <Badge variant="secondary" className="px-1.5">
            {counts[opt] ?? 0}
          </Badge>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
