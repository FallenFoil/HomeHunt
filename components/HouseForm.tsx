"use client";

import { useEffect, useState } from "react";
import { useT } from "@/components/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PROPERTY_TYPES,
  STATUSES,
  type House,
  type HouseInput,
  type PropertyType,
  type Status,
} from "@/types/house";

type Props = {
  open: boolean;
  initial: House | null;
  onClose: () => void;
  onSubmit: (data: HouseInput, id?: string) => Promise<void>;
};

const EMPTY: HouseInput = {
  type: "Apartment",
  address: "",
  city: "",
  parish: "",
  price: 0,
  sizeM2: 0,
  rooms: 0,
  photoUrl: "",
  listingUrl: "",
  status: "Interested",
  constructionYear: undefined,
  failureReason: "",
  notes: "",
};

export function HouseForm({ open, initial, onClose, onSubmit }: Props) {
  const t = useT();
  const [form, setForm] = useState<HouseInput>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        type: initial.type,
        address: initial.address,
        city: initial.city,
        parish: initial.parish ?? "",
        price: initial.price,
        sizeM2: initial.sizeM2,
        rooms: initial.rooms,
        photoUrl: initial.photoUrl,
        listingUrl: initial.listingUrl,
        status: initial.status,
        constructionYear: initial.constructionYear,
        failureReason: initial.failureReason ?? "",
        notes: initial.notes ?? "",
      });
    } else {
      setForm(EMPTY);
    }
    setError(null);
  }, [open, initial]);

  function set<K extends keyof HouseInput>(key: K, value: HouseInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form, initial?.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle>{initial ? t.editHouse : t.addHouse}</DialogTitle>
          </DialogHeader>

          <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-6 sm:grid-cols-2">
            <Field label={t.fieldType} htmlFor="type" className="sm:col-span-2">
              <Select
                value={form.type}
                onValueChange={(v) => set("type", v as PropertyType)}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((pt) => (
                    <SelectItem key={pt} value={pt}>
                      {t.typeLabel[pt]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label={t.fieldAddress} htmlFor="address">
              <Input
                id="address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder={t.placeholderAddress}
              />
            </Field>

            <Field label={t.fieldCity} htmlFor="city">
              <Input
                id="city"
                required
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder={t.placeholderCity}
              />
            </Field>

            <Field label={t.fieldParish} htmlFor="parish">
              <Input
                id="parish"
                required
                value={form.parish}
                onChange={(e) => set("parish", e.target.value)}
                placeholder={t.placeholderParish}
              />
            </Field>

            <Field label={t.fieldPrice} htmlFor="price">
              <Input
                id="price"
                type="number"
                min={0}
                required
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
              />
            </Field>

            <Field label={t.fieldSize} htmlFor="sizeM2">
              <Input
                id="sizeM2"
                type="number"
                min={0}
                required
                value={form.sizeM2}
                onChange={(e) => set("sizeM2", Number(e.target.value))}
              />
            </Field>

            <Field label={t.fieldRooms} htmlFor="rooms">
              <Input
                id="rooms"
                type="number"
                min={0}
                required
                value={form.rooms}
                onChange={(e) => set("rooms", Number(e.target.value))}
              />
            </Field>

            <Field label={t.fieldYear} htmlFor="constructionYear">
              <Input
                id="constructionYear"
                type="number"
                min={1500}
                max={new Date().getFullYear() + 10}
                value={form.constructionYear ?? ""}
                onChange={(e) =>
                  set(
                    "constructionYear",
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                placeholder={t.placeholderYear}
              />
            </Field>

            <Field label={t.fieldStatus} htmlFor="status">
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v as Status)}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t.statusLabel[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label={t.fieldListingUrl} htmlFor="listingUrl" className="sm:col-span-2">
              <Input
                id="listingUrl"
                type="url"
                value={form.listingUrl}
                onChange={(e) => set("listingUrl", e.target.value)}
                placeholder={t.placeholderListingUrl}
              />
            </Field>

            <Field label={t.fieldPhotoUrl} htmlFor="photoUrl" className="sm:col-span-2">
              <Input
                id="photoUrl"
                type="url"
                value={form.photoUrl}
                onChange={(e) => set("photoUrl", e.target.value)}
                placeholder={t.placeholderPhotoUrl}
              />
              <p className="text-xs text-muted-foreground">{t.photoUrlHint}</p>
            </Field>

            {form.status === "Rejected" && (
              <Field
                label={t.fieldRejectionReason}
                htmlFor="failureReason"
                className="sm:col-span-2"
              >
                <Input
                  id="failureReason"
                  value={form.failureReason ?? ""}
                  onChange={(e) => set("failureReason", e.target.value)}
                  placeholder={t.placeholderRejectionReason}
                />
              </Field>
            )}

            <Field label={t.fieldNotes} htmlFor="notes" className="sm:col-span-2">
              <Textarea
                id="notes"
                rows={3}
                value={form.notes ?? ""}
                onChange={(e) => set("notes", e.target.value)}
                placeholder={t.placeholderNotes}
              />
            </Field>

            {error && (
              <Alert variant="destructive" className="sm:col-span-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? t.saving : initial ? t.saveChanges : t.createHouse}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <Label htmlFor={htmlFor} className="text-xs">
        {label}
      </Label>
      {children}
    </div>
  );
}
