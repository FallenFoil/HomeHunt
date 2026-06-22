"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { HouseCard } from "@/components/HouseCard";
import { HouseForm } from "@/components/HouseForm";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useT } from "@/components/LanguageContext";
import { StatusFilter, type Filter } from "@/components/StatusFilter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PROPERTY_TYPES,
  STATUSES,
  type House,
  type HouseInput,
  type PropertyType,
  type Status,
} from "@/types/house";

type SortBy = "price-asc" | "price-desc" | "size-asc" | "size-desc";

export default function Home() {
  const t = useT();
  const [houses, setHouses] = useState<House[] | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [cityFilter, setCityFilter] = useState<string>("All");
  const [parishFilter, setParishFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<PropertyType | "All">("All");
  const [roomsFilter, setRoomsFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortBy>("price-asc");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<House | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<House | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/houses", { cache: "no-store" });
        if (!res.ok) throw new Error(`${t.errorLoad} (${res.status})`);
        const data = (await res.json()) as House[];
        if (!cancelled) setHouses(data);
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : t.errorLoad);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t.errorLoad]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      All: houses?.length ?? 0,
      Interested: 0,
      Contacted: 0,
      Visited: 0,
      Rejected: 0,
    };
    for (const h of houses ?? []) c[h.status as Status]++;
    return c;
  }, [houses]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const h of houses ?? []) if (h.city) set.add(h.city);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [houses]);

  const parishes = useMemo(() => {
    const set = new Set<string>();
    for (const h of houses ?? []) if (h.parish) set.add(h.parish);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [houses]);

  const roomOptions = useMemo(() => {
    const set = new Set<number>();
    for (const h of houses ?? []) set.add(h.rooms);
    return Array.from(set).sort((a, b) => a - b);
  }, [houses]);

  const visible = useMemo(() => {
    if (!houses) return [];
    let list = houses;
    if (filter !== "All") list = list.filter((h) => h.status === filter);
    if (cityFilter !== "All") list = list.filter((h) => h.city === cityFilter);
    if (parishFilter !== "All") list = list.filter((h) => h.parish === parishFilter);
    if (typeFilter !== "All") list = list.filter((h) => h.type === typeFilter);
    if (roomsFilter !== "All") list = list.filter((h) => h.rooms === Number(roomsFilter));
    const [field, dir] = sortBy.split("-") as ["price" | "size", "asc" | "desc"];
    const key = field === "size" ? "sizeM2" : field;
    const sign = dir === "asc" ? 1 : -1;
    list = [...list].sort((a, b) => (a[key] - b[key]) * sign);
    return list;
  }, [houses, filter, cityFilter, parishFilter, typeFilter, roomsFilter, sortBy]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(h: House) {
    setEditing(h);
    setFormOpen(true);
  }

  async function handleSubmit(data: HouseInput, id?: string) {
    const url = id ? `/api/houses/${id}` : "/api/houses";
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? `Request failed (${res.status})`);
    }
    const saved = (await res.json()) as House;
    setHouses((prev) => {
      const list = prev ?? [];
      if (id) return list.map((h) => (h.id === id ? saved : h));
      return [saved, ...list];
    });
    toast.success(id ? t.toastUpdated : t.toastAdded);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const h = pendingDelete;
    setPendingDelete(null);
    const res = await fetch(`/api/houses/${h.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error(t.toastDeleteFailed);
      return;
    }
    setHouses((prev) => (prev ?? []).filter((x) => x.id !== h.id));
    toast.success(t.toastDeleted(t.typeLabel[h.type], h.city));
  }

  const filterLabel = filter === "All" ? t.all : t.statusLabel[filter];

  return (
    <div className="min-h-full bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight">HomeHunt</h1>
            <p className="text-sm text-muted-foreground">{t.appTagline}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button onClick={openCreate}>
              <Plus />
              {t.addHouse}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3">
          <StatusFilter value={filter} counts={counts} onChange={setFilter} />
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Label htmlFor="type-filter" className="text-muted-foreground">
                {t.filterType}
              </Label>
              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v as PropertyType | "All")}
              >
                <SelectTrigger id="type-filter" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t.allTypes}</SelectItem>
                  {PROPERTY_TYPES.map((pt) => (
                    <SelectItem key={pt} value={pt}>
                      {t.typeLabel[pt]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="city-filter" className="text-muted-foreground">
                {t.filterCity}
              </Label>
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger id="city-filter" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t.allCities}</SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="parish-filter" className="text-muted-foreground">
                {t.filterParish}
              </Label>
              <Select value={parishFilter} onValueChange={setParishFilter}>
                <SelectTrigger id="parish-filter" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t.allParishes}</SelectItem>
                  {parishes.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="rooms-filter" className="text-muted-foreground">
                {t.filterRooms}
              </Label>
              <Select value={roomsFilter} onValueChange={setRoomsFilter}>
                <SelectTrigger id="rooms-filter" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t.anyRooms}</SelectItem>
                  {roomOptions.map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      T{r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort-by" className="text-muted-foreground">
                {t.filterSort}
              </Label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                <SelectTrigger id="sort-by" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">{t.sortPriceAsc}</SelectItem>
                  <SelectItem value="price-desc">{t.sortPriceDesc}</SelectItem>
                  <SelectItem value="size-asc">{t.sortSizeAsc}</SelectItem>
                  <SelectItem value="size-desc">{t.sortSizeDesc}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loadError && (
          <Alert variant="destructive">
            <AlertDescription>{loadError}</AlertDescription>
          </Alert>
        )}

        {!loadError && houses === null && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[16/10] w-full rounded-xl" />
            ))}
          </div>
        )}

        {houses && houses.length === 0 && <EmptyState onAdd={openCreate} />}

        {houses && houses.length > 0 && visible.length === 0 && (
          <Card className="border-dashed bg-transparent shadow-none ring-0">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              {t.noHousesInFilter(filterLabel)}
            </CardContent>
          </Card>
        )}

        {visible.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((h) => (
              <HouseCard
                key={h.id}
                house={h}
                onEdit={openEdit}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        )}
      </main>

      <HouseForm
        open={formOpen}
        initial={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete &&
                t.deleteDialogBody(
                  t.typeLabel[pendingDelete.type],
                  pendingDelete.city
                )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  const t = useT();
  return (
    <Card className="border-2 border-dashed bg-transparent shadow-none ring-0">
      <CardContent className="p-12 text-center">
        <h2 className="text-lg font-semibold">{t.emptyTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {t.emptyBody}
        </p>
        <Button onClick={onAdd} className="mt-6">
          <Plus />
          {t.addFirstHouse}
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          {t.availableStatuses}{" "}
          {STATUSES.map((s) => t.statusLabel[s]).join(" · ")}
        </p>
      </CardContent>
    </Card>
  );
}
