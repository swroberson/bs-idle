# Buried Sun

A mobile-first, text-led incremental game about tending a settlement and uncovering its buried machinery. Phase 1 is **The Outer Ward**. Read the [design brief](docs/GAME_DESIGN_PHASE_1.md) and [agent guidance](AGENTS.md) before implementation.

## Local development

Use Node.js **20.19 or newer** and **npm**. Commit `package-lock.json`; use `npm ci` for reproducible installs.

ESLint remains on major 9 because the React plugin bundled by the current Next.js lint configuration is incompatible with ESLint 10. Upgrade them together after compatibility is verified.

Production builds explicitly use Next.js’s Webpack option; Turbopack’s internal worker port is unavailable in the scaffold’s restricted build environment.

```sh
npm ci
npm run dev
```

Open the URL printed by Next.js (usually `http://localhost:3000`). To choose a free port: `npm run dev -- --port 3010`.

```sh
npm run lint       # ESLint and React/Next rules
npm run typecheck  # TypeScript
npm test           # Engine and save tests (Vitest)
npm run check      # All three checks above
npm run build      # Static export + generated offline service worker
npm run preview    # Serve out/ locally on port 3000
```

Use `npm run preview -- --listen 3010` if port 3000 is occupied. Production preview uses a static file server; `next start` is not compatible with this static export. `npm run test:watch` runs tests while developing.

## Architecture

```text
src/app/         Next.js App Router shell and metadata
src/components/  Browser interface and persistence lifecycle
src/game/        Pure types, initial state, validated actions and JSON saves
src/content/     Stable content IDs, prose and provisional balance
public/          Manifest and app icons
scripts/         Build-time generation of the offline app shell
```

The application needs no API, server actions, database, authentication or server simulation. Browser APIs stay in client-side lifecycle code; the game modules remain independent of React and storage.

## Scaffold status

Implemented: Ward/Chronicle navigation, five initial inhabitants, Food/Oil/Authority stores, a cooldown-limited manual gathering action, version-1 JSON saves, text/file import and export, confirmed reset, damaged-save recovery, and single-writer tabs using the Web Locks API. A waiting tab reads the latest save when it acquires the lock after the active tab closes. Browsers without Web Locks are prevented from writing.

The scaffold deliberately has **no automated economy or offline production yet**. Stores remain unchanged while away. `lastSimulatedAt` is reserved for reconciliation; the eight-hour cap is defined in balance data but takes effect only when the economy is implemented. Current and future systems remain hidden. The initial save schema covers only implemented systems; extend it with validation and a migration when adding jobs, buildings, research, events, expeditions or completion.

Next increment: elapsed-time economy, worker assignments, recoverable Food/Oil shortages, and net production rates. Then follow the milestones in the design brief. Test equivalent foreground/offline intervals and depletion boundaries before enabling idle gains.

## Interface

The interface follows the industrial terminal direction in `AGENTS.md`: a single structural frame, persistent store telemetry, rectangular machine controls, and a connected inhabitant register. Chronicle and save maintenance use the same frame. Monospace quantities contrast with narrative serif prose; amber marks readiness and activity, and muted red marks record faults and reset controls. Gathering shows its recovery interval and announces successful storage without reading every countdown tick aloud. Motion respects the device's reduced-motion setting. Only implemented systems appear; the foundation build's automatic net rates are zero.

## Saves

Progress is stored in this browser under `buried-sun.save`. It does not transfer between devices or origins automatically. Open **Save & settings** to download a JSON backup or copy its text, import a file or pasted JSON, and reset with confirmation. Invalid imports leave the existing save intact. If a stored save cannot be loaded, the recovery view retains its raw text for backup before a confirmed replacement.

## PWA and offline shell

Production builds generate `out/sw.js` with a content-hashed cache and precache every exported app asset. Service worker registration is disabled in development. After a successful initial online visit and cache installation, the production shell can reopen offline. Shell updates wait for old tabs to close and never delete localStorage. No remote fonts or runtime asset services are required.

On iPhone Safari, visit the deployed site and use **Share → Add to Home Screen**. Actual iPhone installation, offline reopening and background/resume behavior still require device verification. A desktop browser check is not evidence of those behaviors.

### Scaffold verification

Verified locally on October 1, 2026: lint, TypeScript, 13 engine/save tests, and the production static build. In the Codex browser, checked the 390px phone layout and horizontal overflow at 320, 768, 1024 and 1440px; gathering/reload persistence; rejected malformed text imports; backup round-trip; Chronicle navigation; exclusive tab ownership and automatic transfer of the latest save after tab closure; and cached reopening with the preview server stopped. The browser console was clear during these checks. This verifies the scaffold, not the full Phase 1 experience or real-device Safari behavior.

The terminal UI rework was also verified locally on October 1, 2026: the same validation commands pass, with browser checks for the 390px layout, overflow at 320/768/1024/1440px, visible keyboard focus, gathering feedback and cooldown recovery, reload persistence, malformed import preservation, backup restoration, Chronicle navigation, and cached reopening with the production preview server stopped. The production console showed no warnings or errors during the online checks. iPhone Safari and home-screen PWA checks remain unverified.

## Vercel

`next.config.ts` uses `output: "export"`; `npm run build` writes the site into `out/`. `vercel.json` specifies npm installation, the build command, `out` as the output directory, and a no-cache header for the service worker. This follows [Next.js static export guidance](https://nextjs.org/docs/app/guides/static-exports).

When deployment is requested, connect this Git repository to Vercel and verify a preview before production. No server-side environment secrets are required. **No Vercel project, deployment or production URL has been established or verified by this scaffold.** Record the actual settings and URL here after deployment and device testing.
