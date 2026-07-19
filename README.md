# Wedding Invitation & Admin Dashboard

This is a comprehensive wedding invitation platform featuring dynamic public invitation pages, a multi-event RSVP system, and a full-featured admin dashboard.

## Features

- **Dynamic Public Invitations**: Custom links for guests (`/invite/wedding/[code]`).
- **Multi-Event RSVP System**: Guests can RSVP for the Wedding Celebration and Sangjit Ceremony. Deadlines restrict edits automatically.
- **Admin Dashboard**: Manage guests, invitations, RSVPs, seating, and global settings from one interface.
- **Event-Day Usher Portal (`/usher`)**: Touch-friendly, PIN-protected interface for reception staff to manage guest check-ins, view capped attendance headcount, highlight VIP guests, and inspect read-only floor maps.
- **Interactive Seating Floor Plan**: Visual 2D table mapping (`FloorPlanView`) with occupancy tracking, unassignment tools, and over-capacity alerts.
- **Bulk Data Management**: Multi-select checkboxes for bulk deleting or resetting guests and RSVPs.
- **Import/Export Data**: Bulk import guests via CSV/Excel and export invitation data.
- **Global Settings Management**: Update couple names, venues, maps URLs, RSVP deadlines, gallery images, and Usher PIN codes without code changes.

## Architecture & Project Structure

- **Modular UI Pattern**: The Admin dashboard UI uses a stateful orchestrator pattern (e.g. `GuestClient.tsx`) acting as a container for smaller pure UI components built using **Radix UI Themes**, located in `src/components/admin/[module]/`.
- **Dedicated Usher Application**: The `/usher` portal operates independently with dedicated server actions (`src/lib/actions/usher.ts`) and touch-optimized components (`UsherClient.tsx`, `UsherGuestCard.tsx`).
- **Centralized Constants**: All application constants and asset mapping references are grouped neatly inside `src/lib/constants/`.
- **Utility Scripts**: Standalone maintenance and data inspection scripts live in `scripts/` (e.g. `testCheck.mjs`).
- **Authentication**: Admin route protection is handled via Next.js Proxy (`src/lib/supabase/proxy.ts`), which validates JWT cookies (`admin_auth_token`). Admin credentials and roles are configured via the database in the `settings` table (under `wedding_config` -> `adminUsers`).
- **Data Model Invariants**:
  - A **Guest** is the master record.
  - A guest **must** have at least one invitation (wedding, sangjit, or both). Standalone guests are strictly prohibited.
  - There is a unique constraint on `(guest_id, event_type)` in the database.
  - Public routes (`/invite/wedding/[code]`, `/invite/sangjit/[code]`) rigorously enforce event-type matching to prevent accessing one event with another event's code.

---

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (if running Supabase locally)
- A Supabase Project (Local or Remote)

### 2. Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key # For admin actions bypassing RLS
JWT_SECRET=your_secure_random_string # Used for signing admin JWT cookies
```

### 3. Supabase Setup & Database Initialization

Run the following commands to set up your database schema and seed it with initial data.

**If using Local Supabase:**
```bash
supabase start
supabase db reset
```

**If using a Remote Supabase Project:**
Link your project and push migrations:
```bash
supabase link --project-ref your-project-ref
supabase db push
# Then run the SQL from supabase/seed.sql manually in the Supabase SQL Editor to populate initial data.
```

**Storage Bucket Setup:**
You must manually create a storage bucket in your Supabase Dashboard:
1. Name the bucket `gallery`.
2. Ensure it is set to **Public**.

### 4. Asset Placement

Before running the project, place your visual design assets into the `/public` folder:
- `/public/images/`: General invitation images (`hero_background.png`, `floral_envelope.png`, `wax_seal.png`, etc.).
- `/public/images/sangjit-invitation/`: Watercolor backgrounds, floral emblems, and wax seals for the Sangjit invitation.
- `/public/images/sangjit-screen/`: Screen reference screenshots used for layout styling.
- `/public/audio/`: `bgm.mp3` (Background music for the public invitation).

### 5. Local Development Commands

To lint, build, and run the project locally, use the following exact commands:

```bash
# Install dependencies
npm install

# Run ESLint to verify code quality
npm run lint

# Run TypeScript type check
npx tsc --noEmit

# Run production build
npm run build

# Start local development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).
- Admin Dashboard: `http://localhost:3000/admin`
- Usher Reception Portal: `http://localhost:3000/usher` (Default PIN: `123456`)

---

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Add the following Environment Variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
4. Click **Deploy**. Vercel will automatically run `npm run build` and launch the application.

---

## Known Limitations and MVP Scope

- **Basic JWT Auth**: The admin dashboard (`/admin`) currently relies on JWT cookies evaluated in the Next.js Middleware proxy (`src/lib/supabase/proxy.ts`). Admin users are stored in the `settings` JSON blob rather than a dedicated RBAC relational table to minimize setup friction for short-lived events.
- **Local Media Storage constraints**: The gallery image uploader requires a pre-existing `gallery` public bucket.

## Future Scope

The following features are slated for future development:
- **Add full RSVP history/audit log**: Track exactly when and how guests modified their RSVPs.
