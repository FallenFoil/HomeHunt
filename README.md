# HomeHunt

A small, self-hosted tracker for houses and apartments you're chasing. Save listings you're interested in, mark the ones you've contacted, visited, or rejected, and keep notes (including *why* a listing fell through) in one place.

Built for the Portuguese rental/sale market in mind (T-style room labels, parishes, idealista.pt URLs) but works for any locale. UI is bilingual — English and Portuguese.

## Features

- **Track listings** with type (Apartment / House), address, city, parish, price (€), size (m²), rooms, construction year, listing URL, photo, and free-form notes.
- **Statuses**: Interested, Contacted, Visited, Rejected — with a dedicated "why was it rejected?" field on rejected entries.
- **Filter** by status, type, city, parish, and rooms; **sort** by price or size.
- **Auto-screenshot** of the listing URL via [thum.io](https://www.thum.io/) when you don't provide a photo URL.
- **Bilingual UI** (EN / PT) with a toggle in the header.
- **No external database** — data is stored in a local JSON file (`database/database.json`).

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, standalone output, React Compiler enabled)
- React 19
- TypeScript
- Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) (Radix primitives, lucide icons, Sonner toasts)
- File-backed JSON store — no DB server required

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build (standalone)
npm run start   # serve the production build
npm run lint    # eslint
```

## Data storage

Houses are persisted to `database/database.json` (gitignored). The file is created on the first write; you can also seed it manually:

```json
{ "houses": [] }
```

Each entry includes `id`, `createdAt`, and `updatedAt` (managed by the server). Concurrent writes are serialized through an in-process queue, so this is safe for a single-instance deployment but not for horizontal scaling.

## API

All endpoints return JSON.

| Method | Path                  | Description                       |
| ------ | --------------------- | --------------------------------- |
| GET    | `/api/houses`         | List all houses                   |
| POST   | `/api/houses`         | Create a house                    |
| GET    | `/api/houses/:id`     | Get one house                     |
| PUT    | `/api/houses/:id`     | Update a house (partial patch)    |
| DELETE | `/api/houses/:id`     | Delete a house                    |

Required fields on create: `type` (`Apartment` | `House`), `city`, `parish`, `status` (`Interested` | `Contacted` | `Visited` | `Rejected`), and non-negative numeric `price`, `sizeM2`, `rooms`. If `photoUrl` is omitted, a thum.io preview URL is generated from `listingUrl`.

## Docker

A multi-stage `Dockerfile` is included. It builds the standalone Next.js output and runs as a non-root user on port 3000. The image bundles `database/database.json` at build time — mount a volume over `/app/database` to persist data across container restarts.

```bash
docker build -t homehunt .
docker run -p 3000:3000 -v $(pwd)/database:/app/database homehunt
```

## Project layout

```
app/                     # App Router routes (page + /api/houses)
components/              # React components (HouseCard, HouseForm, filters, i18n)
components/ui/           # shadcn/ui primitives
lib/db.ts                # JSON-file CRUD with serialized writes
lib/i18n.ts              # EN / PT dictionaries
lib/preview.ts           # thum.io URL builder
types/house.ts           # House types, statuses, property types
database/database.json   # local data (gitignored)
```
