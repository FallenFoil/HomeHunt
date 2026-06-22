import { NextRequest, NextResponse } from "next/server";
import { deleteHouse, getHouse, updateHouse } from "@/lib/db";
import { buildPreviewUrl } from "@/lib/preview";
import { PROPERTY_TYPES, STATUSES, type House } from "@/types/house";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const house = await getHouse(id);
  if (!house) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(house);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "body must be an object" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const patch: Partial<House> = {};
  if (b.type !== undefined) {
    if (typeof b.type !== "string" || !(PROPERTY_TYPES as readonly string[]).includes(b.type)) {
      return NextResponse.json({ error: "invalid type" }, { status: 400 });
    }
    patch.type = b.type as House["type"];
  }
  if (typeof b.address === "string") patch.address = b.address.trim();
  if (typeof b.city === "string") patch.city = b.city.trim();
  if (typeof b.parish === "string") {
    const v = b.parish.trim();
    if (!v) return NextResponse.json({ error: "parish is required" }, { status: 400 });
    patch.parish = v;
  }
  if (typeof b.photoUrl === "string") patch.photoUrl = b.photoUrl.trim();
  if (typeof b.listingUrl === "string") patch.listingUrl = b.listingUrl.trim();
  if (typeof b.failureReason === "string") patch.failureReason = b.failureReason.trim();
  if (typeof b.notes === "string") patch.notes = b.notes.trim();
  if (b.status !== undefined) {
    if (typeof b.status !== "string" || !(STATUSES as readonly string[]).includes(b.status)) {
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }
    patch.status = b.status as House["status"];
  }
  for (const k of ["price", "sizeM2", "rooms"] as const) {
    if (b[k] !== undefined) {
      const n = Number(b[k]);
      if (!Number.isFinite(n) || n < 0) {
        return NextResponse.json({ error: `${k} must be a non-negative number` }, { status: 400 });
      }
      patch[k] = n;
    }
  }

  if (b.constructionYear !== undefined) {
    if (b.constructionYear === null || b.constructionYear === "") {
      patch.constructionYear = undefined;
    } else {
      const y = Number(b.constructionYear);
      const maxYear = new Date().getFullYear() + 10;
      if (!Number.isInteger(y) || y < 1500 || y > maxYear) {
        return NextResponse.json(
          { error: `constructionYear must be an integer between 1500 and ${maxYear}` },
          { status: 400 }
        );
      }
      patch.constructionYear = y;
    }
  }

  if (patch.photoUrl === "") {
    const listingUrl = patch.listingUrl ?? (await getHouse(id))?.listingUrl ?? "";
    patch.photoUrl = buildPreviewUrl(listingUrl);
  }

  const updated = await updateHouse(id, patch);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const ok = await deleteHouse(id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
