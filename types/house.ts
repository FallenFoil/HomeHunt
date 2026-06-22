export const STATUSES = [
  "Interested",
  "Contacted",
  "Visited",
  "Rejected",
] as const;

export type Status = (typeof STATUSES)[number];

export const PROPERTY_TYPES = ["Apartment", "House"] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export type House = {
  id: string;
  type: PropertyType;
  address: string;
  city: string;
  parish: string;
  price: number;
  sizeM2: number;
  rooms: number;
  photoUrl: string;
  listingUrl: string;
  status: Status;
  constructionYear?: number;
  failureReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type HouseInput = Omit<House, "id" | "createdAt" | "updatedAt">;

export const STATUS_STYLES: Record<Status, string> = {
  Interested: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Contacted: "bg-sky-100 text-sky-800 ring-sky-200",
  Visited: "bg-violet-100 text-violet-800 ring-violet-200",
  Rejected: "bg-rose-100 text-rose-800 ring-rose-200",
};

export const STATUS_CHIP_STYLES: Record<Status, string> = {
  Interested: "data-[active=true]:bg-emerald-600 data-[active=true]:text-white",
  Contacted: "data-[active=true]:bg-sky-600 data-[active=true]:text-white",
  Visited: "data-[active=true]:bg-violet-600 data-[active=true]:text-white",
  Rejected: "data-[active=true]:bg-rose-600 data-[active=true]:text-white",
};
