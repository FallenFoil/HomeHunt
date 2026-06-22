import { NextRequest, NextResponse } from "next/server";
import { createHouse, listHouses } from "@/lib/db";
import { buildPreviewUrl } from "@/lib/preview";
import { PROPERTY_TYPES, STATUSES, type HouseInput } from "@/types/house";

export async function GET() {
  const houses = await listHouses();
  return NextResponse.json(houses);
}

function validate(body: unknown): { ok: true; value: HouseInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "body must be an object" };
  const b = body as Record<string, unknown>;

  const type = typeof b.type === "string" ? b.type : "";
  const address = typeof b.address === "string" ? b.address.trim() : "";
  const city = typeof b.city === "string" ? b.city.trim() : "";
  const parish = typeof b.parish === "string" ? b.parish.trim() : "";
  const status = typeof b.status === "string" ? b.status : "";
  if (!(PROPERTY_TYPES as readonly string[]).includes(type)) {
    return { ok: false, error: `type must be one of ${PROPERTY_TYPES.join(", ")}` };
  }
  if (!city) return { ok: false, error: "city is required" };
  if (!parish) return { ok: false, error: "parish is required" };
  if (!(STATUSES as readonly string[]).includes(status)) {
    return { ok: false, error: `status must be one of ${STATUSES.join(", ")}` };
  }

  const price = Number(b.price);
  const sizeM2 = Number(b.sizeM2);
  const rooms = Number(b.rooms);
  if (!Number.isFinite(price) || price < 0) return { ok: false, error: "price must be a non-negative number" };
  if (!Number.isFinite(sizeM2) || sizeM2 < 0) return { ok: false, error: "sizeM2 must be a non-negative number" };
  if (!Number.isFinite(rooms) || rooms < 0) return { ok: false, error: "rooms must be a non-negative number" };

  let constructionYear: number | undefined;
  if (b.constructionYear !== undefined && b.constructionYear !== null && b.constructionYear !== "") {
    const y = Number(b.constructionYear);
    const maxYear = new Date().getFullYear() + 10;
    if (!Number.isInteger(y) || y < 1500 || y > maxYear) {
      return { ok: false, error: `constructionYear must be an integer between 1500 and ${maxYear}` };
    }
    constructionYear = y;
  }

  return {
    ok: true,
    value: {
      type: type as HouseInput["type"],
      address,
      city,
      parish,
      price,
      sizeM2,
      rooms,
      photoUrl: typeof b.photoUrl === "string" ? b.photoUrl.trim() : "",
      listingUrl: typeof b.listingUrl === "string" ? b.listingUrl.trim() : "",
      status: status as HouseInput["status"],
      constructionYear,
      failureReason: typeof b.failureReason === "string" ? b.failureReason.trim() : undefined,
      notes: typeof b.notes === "string" ? b.notes.trim() : undefined,
    },
  };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const result = validate(body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  const photoUrl =
    result.value.photoUrl || buildPreviewUrl(result.value.listingUrl);
  const house = await createHouse({ ...result.value, photoUrl });
  return NextResponse.json(house, { status: 201 });
}
