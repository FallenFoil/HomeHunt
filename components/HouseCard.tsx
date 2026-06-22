"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useT } from "@/components/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STATUS_STYLES, type House } from "@/types/house";

type Props = {
  house: House;
  onEdit: (h: House) => void;
  onDelete: (h: House) => void;
};

const eur = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function HouseCard({ house, onEdit, onDelete }: Props) {
  const t = useT();
  const [imgErr, setImgErr] = useState(false);
  const hasPhoto = !!house.photoUrl && !imgErr;
  const hasListing = !!house.listingUrl;
  const typeLabel = t.typeLabel[house.type];

  return (
    <Card className="group gap-0 py-0">
      <a
        href={hasListing ? house.listingUrl : undefined}
        target={hasListing ? "_blank" : undefined}
        rel={hasListing ? "noopener noreferrer" : undefined}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-muted"
        aria-label={typeLabel}
      >
        {hasPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={house.photoUrl}
            alt={typeLabel}
            className="h-full w-full object-cover transition group-hover:scale-105"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            {t.noPhoto}
          </div>
        )}
        <Badge
          className={`absolute left-3 top-3 ring-1 ring-inset ${STATUS_STYLES[house.status]}`}
        >
          {t.statusLabel[house.status]}
        </Badge>
      </a>

      <CardHeader className="pt-4">
        <CardTitle className="line-clamp-1">
          {hasListing ? (
            <a
              href={house.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {typeLabel}
            </a>
          ) : (
            typeLabel
          )}
        </CardTitle>
        {house.address && (
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {house.address}
          </p>
        )}
        {(house.parish || house.city) && (
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {[house.parish, house.city].filter(Boolean).join(" - ")}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-2 pt-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
          <span className="text-lg font-bold text-foreground">
            {eur.format(house.price)}
          </span>
          <span className="text-muted-foreground">{house.sizeM2} m²</span>
          <span className="text-muted-foreground">T{house.rooms}</span>
          {house.constructionYear && (
            <span className="text-muted-foreground">
              {house.constructionYear}
            </span>
          )}
        </div>

        {house.status === "Rejected" && house.failureReason && (
          <p className="rounded-md bg-destructive/10 px-2 py-1 text-xs text-destructive">
            <span className="font-semibold">{t.rejectionLabel}</span>{" "}
            {house.failureReason}
          </p>
        )}

        {house.notes && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {house.notes}
          </p>
        )}
      </CardContent>

      <CardFooter className="mt-auto gap-2 pb-4 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(house)}
        >
          <Pencil />
          {t.edit}
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => onDelete(house)}
        >
          <Trash2 />
          {t.delete}
        </Button>
      </CardFooter>
    </Card>
  );
}
