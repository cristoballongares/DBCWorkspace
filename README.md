# DBCWorkspace

DBCWorkspace is an internal training platform for a university ICPC (competitive programming) team. It tracks which problems the team has solved, stores write-ups and editorials, runs timed contest simulations, and keeps a shared notebook of algorithmic topics the team studies from. It's not a general-purpose judge or a public problem archive — it's a closed tool for one team, built around how we actually train.

## The problem

Before this existed, our team's "state" lived in a mix of a Notion doc, a spreadsheet with problem links, and whatever people remembered from the last practice session. Nobody had a clean view of who had solved what, which topics the team was weak in, or how a past contest actually went once the adrenaline wore off. None of that data was queryable, and post-mortems (the "what worked / what failed" reflection ICPC teams are supposed to do after every contest) basically never happened because there was no dedicated place to write them.

The platform exists to fix that: one Postgres database as the source of truth for problems, solutions, contests, and training sessions, with a UI built around the actual training loop — solve problems, write up how you solved them, simulate contests under time pressure, review afterward.

## How it's built

It's a Next.js 14 app using the App Router, with two route groups: `(auth)` for login/invite pages and `(dashboard)` for everything behind the session check in `src/middleware.ts` (which uses `next-auth/middleware`'s `withAuth` and excludes only login, invite, and the auth API routes from the matcher).

**Data model.** The schema (`prisma/schema.prisma`) has six rough clusters: users/invitations, problems/tags/solutions/editorials, contests/submissions/post-mortems/rating snapshots, training calendars/sessions, a topic notebook (`NotebookEntry`), and a `ChangeLog` audit table that every mutation service writes to (`logChange()` in `changelog.service.ts`) so the dashboard can show a real activity feed instead of a static "recent" list.

**Auth is invitation-only.** There's no public sign-up. An admin creates an `Invitation` row with a random token (`crypto.randomBytes(32)`) and a 7-day expiry (`invitation.service.ts`), and the invitee sets their name and password at `/invite/[token]`. Credentials go through `bcryptjs` and NextAuth's `CredentialsProvider` with JWT sessions. This made sense for a 5-10 person team — OAuth would have been overkill, and open registration made no sense for a private team tool.

**The rating system is not Elo.** I wanted something that reflected "how well did you do in this contest" without pretending to model skill over time the way Codeforces rating does. `rating.service.ts` computes, per solved problem in a *finished* contest, a percentile based on solve-time rank among teammates who solved it, multiplied by a difficulty weight (EASY=1, MEDIUM=2, HARD=3), minus 5 points per wrong attempt before the accepted one. A user's score for that contest is the average across the problems they solved, stored as one `RatingSnapshot` row per `(user, contest)`. It only recalculates when a contest's status is set to `FINISHED`, via `recalculateRatingForContest()` inside `updateContest()` — it's not a running Elo ladder, it's closer to a per-contest scorecard.

**Skill radar chart is hand-rolled SVG**, not a charting library. `SkillRadarChart.tsx` computes hexagon vertices with plain trigonometry (`pointAt()`, `polygonPoints()`) for six fixed skill areas defined in `src/lib/skill-areas.ts` (Math, DP, Graphs, Data Structures, Geometry, Number Theory), with a manual `TAG_TO_AREA` lookup mapping problem tags to areas. Tags that aren't in that table (e.g. `two-pointers`, `merge-sort`) just don't count toward any area yet — it's an incomplete mapping I update as new tags show up.

**Practice / contest simulation mode** (`ContestSimulationPanel.tsx`) lets you define "buckets" (tag + difficulty + count, e.g. "5 Graph, Medium, unsolved only"), fetches a random batch via `POST /api/problems/random-batch`, and runs a countdown timer entirely client-side with the session persisted to `localStorage`. There's a "hide tags and shuffle" option, on by default, because showing problems grouped by tag defeats the point of simulating a contest where you don't know what technique a problem needs.

**Solutions and editorials are Markdown + LaTeX**, not a WYSIWYG editor. `MarkdownEditor.tsx` is a plain two-column split: a `<textarea>` on the left, `MarkdownContent` rendering the same string live on the right via `react-markdown` with `remark-gfm`, `remark-math`, `rehype-katex`, and `rehype-highlight`. I originally used a Tiptap rich-text editor and switched off it (see "what didn't go well" below).

**Topics/notebook** (`NotebookEntry`) supports a parent/child hierarchy so subtopics don't flood the top-level list, and links to practice problems through a separate `TopicProblem` join table (independent of the tag system used for the random-batch practice mode). It's seeded from two textbooks — *Competitive Programmer's Handbook* and *Competitive Programming 4* — via `prisma/seed-books.ts`, which currently loads 48 topics across 8 categories with definitions, why-it-matters notes, and a worked C++ example each. `prisma/seed-problems.ts` separately seeds 197 verified problems across 12 topics, pulled from the real Codeforces API (so difficulty ratings are accurate) plus CSES/SPOJ for structures Codeforces doesn't tag on its own (Fenwick tree, sparse table, etc).

**Difficulty is hidden everywhere in the UI** (badge removed from lists, detail pages, practice, and simulations) so you don't see a problem's rating before you've tried it — that's a spoiler. Difficulty *filters* stay, since choosing to filter by difficulty is a deliberate decision, not something revealed about a specific problem.

## Stack, and why

| Choice | Why |
|---|---|
| Next.js 14, App Router | Server Components let list pages (problems, contests) query Prisma directly without a separate API layer for reads; route groups gave a clean way to split public auth pages from the authenticated dashboard. |
| Prisma + PostgreSQL (Neon) | The domain is heavily relational — problems have tags, contests have submissions per problem per user, topics have exercises — so a real relational schema with foreign keys and migrations beat a document store here. Neon because it's serverless Postgres that plays well with Vercel's connection model (`DATABASE_URL` pooled, `DIRECT_URL` direct for migrations). |
| NextAuth (Credentials provider) | JWT sessions, no OAuth app to register anywhere, works with the invitation-only flow instead of fighting it. |
| Zod | Every service that takes a mutation input (`createContestSchema`, `randomBatchSchema`, etc.) validates through a Zod schema in `src/lib/validations/` before touching Prisma. |
| Tailwind CSS | Fast to build a dense, dark, data-heavy UI without hand-writing a component library. Custom design tokens live in `design-system/dbcworkspace/MASTER.md`. |
| react-markdown + remark-math + rehype-katex | Needed real LaTeX rendering for problem statements and solutions (competitive programming write-ups are full of math), without the weight and editing quirks of a WYSIWYG rich-text editor. |
| nuqs | Keeps table filters (problems list) in the URL so a filtered view is shareable/bookmarkable, instead of component state that resets on refresh. |
| Vercel Blob | Simple object storage for images attached to solutions/notebook entries, without standing up S3 for a small team tool. |

## Running it locally

```bash
git clone <this repo>
cd DBCWorkspace
npm install --legacy-peer-deps
```

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL` / `DIRECT_URL` — Postgres connection strings (pooled / direct, see above)
- `AUTH_SECRET` — random secret for signing JWT sessions
- `NEXTAUTH_URL` — `http://localhost:3000` in dev
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token, only needed if you're testing image uploads
- `NEXT_PUBLIC_APP_URL` — used to build the invite link shown to admins

Then:

```bash
npx prisma migrate dev       # applies the 5 migrations in prisma/migrations/
npm run prisma:seed          # creates the first admin user
npm run prisma:seed-books    # loads the 48-topic notebook
npm run prisma:seed-problems # loads the 197-problem practice bank
npm run dev
```

The first admin comes from `prisma/seed.ts` — everyone else gets in through an invitation link the admin generates from `/admin/invitations`.

## What didn't go well

A few honest ones:

- **`fix.js` and `revert.js` are still sitting in the repo root.** They're one-off Node scripts I wrote to bulk-rename component import paths (`@/components/ui/select` → `@/components/ui/Select`, `variant="danger"` → `variant="destructive"`, etc.) after hitting case-sensitivity bugs — my machine is Windows, so a wrong-case import works fine locally and then fails the build on Vercel's Linux filesystem. They did the job but I never deleted them afterward, so they're dead scratch scripts committed to the repo. I'd rather have picked one casing convention for UI components up front and stuck to it.
- **The Vercel build cache bit me on `@prisma/client`.** Vercel caches `node_modules` between deploys, which meant Prisma's client generation step got skipped on a cached install, leaving a stale client that crashed page-data collection during `next build`. Fixed with a `postinstall: prisma generate` hook, but I only found this by reading a fairly opaque build failure — should have added that hook on day one instead of after a broken deploy.
- **I switched editors mid-project.** Solutions/editorials originally used a Tiptap WYSIWYG editor; I replaced it with the Markdown+LaTeX split view because Tiptap's math handling was more friction than it was worth for how math-heavy competitive programming write-ups are. The old files, `RichTextEditor.tsx` and `lib/tiptap/math-extension.ts`, are now empty stubs instead of deleted — file deletion got blocked by tool permissions mid-refactor and I never went back to clean it up. `RichContent.tsx` is dead code for the same reason.
- **Filters silently broke once, and I didn't catch it until the problems list looked wrong.** `TableFilters` used `nuqs`'s `useQueryState` with the default shallow client-side routing, which updates the URL but doesn't re-trigger the Server Component reading `searchParams`. So changing a filter looked like it worked (the URL updated) but the list never actually refetched. Also there was no pagination at all originally — the problems table just rendered every row. Both got fixed in the same pass, but it's a reminder that "the URL changed" isn't the same as "the data changed" with Server Components.
- **The rating formula is something I made up, not something I validated.** Percentile-of-solve-time times a difficulty weight minus an attempt penalty feels reasonable, but I didn't compare it against how real ICPC/Codeforces rating systems handle relative performance, and there's no test suite checking it against known contest outcomes. It's a scorecard, and I'd want to sanity-check the weights against a few real contest results before trusting it for anything beyond "did I do better this week."

## Repository layout

```
src/app/(auth)/         login, invite acceptance
src/app/(dashboard)/    everything behind auth: problems, contests, training, topics, dashboard
src/app/api/            route handlers backing the above (contests, problems, topics, training, invitations)
src/services/           Prisma queries + business logic, one file per domain (contest, rating, skill, dashboard, ...)
src/lib/validations/    Zod schemas per entity
prisma/schema.prisma    data model
prisma/seed*.ts         admin seed, 48-topic notebook seed, 197-problem practice bank seed
```
