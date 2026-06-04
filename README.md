# Bibbit

A real-time communication platform for caregivers and the individuals they support.

Bibbit gives communicators a customizable button board to express their needs and feelings. When a button is pressed, it logs an event and alerts the caregiver's dashboard in real time. Caregivers can acknowledge the message directly from the feed, and the communicator sees that response immediately on their board.

---

## The Problem

Many individuals who rely on augmentative and alternative communication (AAC) use physical or digital button boards to express themselves. The gap this fills: there was no lightweight, real-time layer that connected a button press to a caregiver notification and acknowledgment loop — without requiring expensive proprietary hardware or complex setup.

---

## Architecture

### Why Next.js App Router + Server Actions

Rather than building a separate API layer, all server-side logic lives in Next.js Server Actions. This keeps the data layer close to the components that use it, reduces round-trip overhead, and means there's no additional service to deploy or maintain. Server actions also act as a natural validation boundary — inputs are validated with Zod before they touch the database.

### Why Supabase

Two reasons: Postgres-backed storage with a clean ORM story via Prisma, and first-class realtime subscriptions over WebSocket. The realtime layer is what makes the caregiver dashboard and the communicator's acknowledgment banner work without polling.

### Why no global state library

The app's state is shallow enough that React's built-in `useState` and `useEffect` handle it cleanly. Supabase's realtime subscriptions replace what would otherwise require a polling loop or a dedicated state manager for live data. If the app grows to support multiple communicators with shared caregiver teams, a context layer or Zustand store would be the natural next step.

### Database design decision: event snapshots

When a button is pressed, the resulting `Event` record stores a snapshot of the button's label, category, and image at the time of the press — not just a foreign key to the button. This means the event history stays accurate even if a button is later renamed, recolored, or deleted. It's a small schema decision that avoids a class of data integrity bugs.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL via Prisma ORM |
| Auth + Realtime | Supabase |
| Validation | Zod |
| Charts | Recharts |
| Drag and Drop | @dnd-kit |
| Text-to-Speech | Web Speech Synthesis API (native browser) |

---

## What's Built

- **Auth** — email/password signup and login via Supabase; profile creation on signup
- **Communicator management** — caregivers can create communicators and assign avatar identities
- **Button board** — communicators tap buttons that log events, trigger TTS, and broadcast to the caregiver feed in real time
- **Board editor** — caregivers can add, reorder (drag and drop), and delete buttons
- **Live dashboard** — real-time event feed with hover-to-acknowledge; three acknowledgment types that trigger a response banner on the communicator's board
- **Analytics** — frequency line chart (7/30/90 day), feeling vs. need donut chart, day-of-week stacked bar chart
- **Insights** — heuristic-based text summaries of communication patterns
- **Performance** — chart components are lazy-loaded via `next/dynamic` with `ssr: false` to keep the initial bundle lean
- **Error handling** — `error.tsx` boundaries at every route segment with retry
- **Loading states** — `loading.tsx` skeletons at every route segment

---

## What's Planned

- **Real AI insights** — replace the heuristic insight engine with a language model call (Claude API) that receives the event history and returns natural language analysis
- **Push notifications** — caregivers should receive a mobile alert when a button is pressed, not just a web feed update
- **Offline resilience** — button presses should queue locally if the network drops and sync on reconnect
- **Row-level security** — Supabase RLS policies to enforce that caregivers can only access their own communicators' data at the database level
- **Testing** — integration tests on server actions (`logEvent`, `acknowledgeEvent`) are the highest-value coverage; E2E test for the full press → feed → acknowledge loop
- **Mobile layout** — the board page is used on tablets and phones; it needs touch-optimized button sizing and layout

---

## Running Locally

### Prerequisites

- Node.js 18+
- A Supabase project with the schema applied (see `prisma/schema.prisma`)

### Environment variables

Create a `.env.local` file at the project root:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Install and run

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Status

This is an MVP in active development. Core flows (board interaction, live feed, acknowledgments, analytics) are functional. See the "What's Planned" section for what comes next.
