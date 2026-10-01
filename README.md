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
npm run simulate:opening # Development-only progression and pacing harness
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

## Opening sequence status

Implemented: Forager/Lamplighter assignments, elapsed-time Food consumption and Oil/Authority production, Fields and Oil Press construction, a one-time household arrival, the lamplighter’s report, and a deliberate lamp examination. Works and Studies appear as they unlock. Costs, unmet requirements, net rates, next obligations, and completed discoveries are visible in the terminal interface. New inhabitants arrive idle.

Foragers retain full output during Food shortages; other productive output falls to 50%. At zero Oil, lamp output follows the available Oil Press flow. Manual provisions gathering and emergency rendering (5 Food → 2 Oil) share a 30-second recovery interval, so poor allocations or spending cannot permanently strand the opening without fuel.

The pure engine splits intervals at depletion boundaries and uses the same rules in foreground and away play. Hidden tabs stop production callbacks; launch/resume reconciles elapsed time, caps a single absence at eight hours, consumes the whole timestamp, and reports net changes. Eligible narrative reports await the player. Saves now use version 2. Existing version-1 records migrate without charging Food for time before the economy existed.

This increment ends at **Examine the Old Lamps**. The remaining research, expeditions, full content, chamber restoration, Current, and Phase 1 finale are still to be built. Current remains hidden. Opening building levels stop at three while later construction balance is developed.

## Interface

The interface follows the industrial terminal direction in `AGENTS.md`: a single structural frame, persistent store telemetry, rectangular machine controls, and a connected inhabitant register. Chronicle and save maintenance use the same frame. Monospace quantities contrast with narrative serif prose; amber marks readiness and activity, and muted red marks record faults and reset controls. Gathering shows its recovery interval and announces successful storage without reading every countdown tick aloud. Motion respects the device's reduced-motion setting. Only implemented systems appear. Store telemetry updates once per second; touch-sized assignment controls, construction, pending reports, and the return summary share the terminal’s structural borders.

## Saves

Version-2 records include assignments, building levels, lifetime Authority, queued/resolved reports, investigations, and the Chronicle. Import validates IDs, finite nonnegative values, worker counts, levels, and consistent one-time records. Version-1 imports migrate automatically. Successful imports reconcile elapsed time; invalid imports preserve the current record.

Progress is stored in this browser under `buried-sun.save`. It does not transfer between devices or origins automatically. Open **Save & settings** to download a JSON backup or copy its text, import a file or pasted JSON, and reset with confirmation. Invalid imports leave the existing save intact. If a stored save cannot be loaded, the recovery view retains its raw text for backup before a confirmed replacement.

## PWA and offline shell

Production builds generate `out/sw.js` with a content-hashed cache and precache every exported app asset. Service worker registration is disabled in development. After a successful initial online visit and cache installation, the production shell can reopen offline. Shell updates wait for old tabs to close and never delete localStorage. No remote fonts or runtime asset services are required.

On iPhone Safari, visit the deployed site and use **Share → Add to Home Screen**. Actual iPhone installation, offline reopening and background/resume behavior still require device verification. A desktop browser check is not evidence of those behaviors.

### Scaffold verification

Verified locally on October 1, 2026: lint, TypeScript, 13 engine/save tests, and the production static build. In the Codex browser, checked the 390px phone layout and horizontal overflow at 320, 768, 1024 and 1440px; gathering/reload persistence; rejected malformed text imports; backup round-trip; Chronicle navigation; exclusive tab ownership and automatic transfer of the latest save after tab closure; and cached reopening with the preview server stopped. The browser console was clear during these checks. This verifies the scaffold, not the full Phase 1 experience or real-device Safari behavior.

The terminal UI rework was also verified locally on October 1, 2026: the same validation commands pass, with browser checks for the 390px layout, overflow at 320/768/1024/1440px, visible keyboard focus, gathering feedback and cooldown recovery, reload persistence, malformed import preservation, backup restoration, Chronicle navigation, and cached reopening with the production preview server stopped. The production console showed no warnings or errors during the online checks. iPhone Safari and home-screen PWA checks remain unverified.

### Opening sequence verification

Verified locally on October 1, 2026: lint, TypeScript, **36 tests**, and production static build/offline-shell generation. Tests cover depleted Food/Oil, recovery, Oil flow at zero stores, short-tick/long-interval equivalence, the eight-hour cap, duplicate reconciliation, worker conservation, building prerequisites/costs, pending choices, one-time effects, migration, and malformed saves.

`npm run simulate:opening` reaches the first discovery from a fresh save with three Foragers and two Lamplighters, no resource grants and no manual gathering. Provisional milestones: Fields at 25 seconds, Oil Press at 75, household at 136, lamplighter’s report at 176, examination at 201. This checks reachability; it does not establish the complete Phase 1 pacing target or enjoyment.

In the Codex browser, completed a fresh opening through ordinary controls at a 390px viewport. Checked zero horizontal overflow at 320/768/1024/1440px, visible keyboard focus, emergency Oil rendering, persisted progress after reload, malformed-import preservation, backup restoration, a 12-hour import reporting exactly eight hours of production, exclusive tab ownership and transfer, and the updated cached shell reopening with the preview server stopped. The production console was clear during online checks. Real iPhone Safari and home-screen PWA behavior remain unverified.

## Vercel

`next.config.ts` uses `output: "export"`; `npm run build` writes the site into `out/`. `vercel.json` selects Vercel’s **Other** hosting preset (`framework: null`), specifies `npm ci`, `npm run build`, `out` as the output directory, and a no-cache header for the service worker. The app still builds with Next.js; Vercel publishes its static export without a runtime server. Using the Next.js hosting preset with an `out` override failed in the cloud because that adapter expected server build manifests there. The Other preset serves the exported files directly. See [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json) and [Next.js static export guidance](https://nextjs.org/docs/app/guides/static-exports).

Production: **[bs-idle.vercel.app](https://bs-idle.vercel.app)**. Deployed and verified on October 1, 2026. The Vercel project is `bs-idle` in `swrobersons-projects`, linked to [swroberson/bs-idle](https://github.com/swroberson/bs-idle). Root directory is `.`, Node.js is 24.x, and `vercel.json` supplies the install/build/output settings above. No game environment variables or server-side secrets are required.

The first live release contains commit `383d396` from `codex/opening-economy`. Its successful preview was promoted to production; [production deployment](https://vercel.com/swrobersons-projects/bs-idle/EK62cRS2bEwxeYUkX7Vj8zDdoEVf). Vercel's automatic production branch is `main`; the opening-economy branch has not been merged into `main`. Pushes to other branches generate previews. Merge the reviewed game changes into `main` before relying on automatic production releases from that branch.

For an explicit release from the current checkout, the following CLI workflow was verified with Vercel CLI 62.1.0 (the older globally installed CLI was rejected). Authenticate with the project owner's Vercel account, connect its GitHub identity, and grant the Vercel GitHub app access to this repository. Local project linkage stays in ignored `.vercel/` files.

```sh
npx --yes vercel@62.1.0 link --project bs-idle --scope swrobersons-projects --yes
npx --yes vercel@62.1.0 deploy --scope swrobersons-projects --yes --target preview
# Inspect and check the preview URL returned above before promotion:
npx --yes vercel@62.1.0 inspect PREVIEW_URL --scope swrobersons-projects
npx --yes vercel@62.1.0 promote PREVIEW_URL --scope swrobersons-projects --yes
```

Verified on production: anonymous HTTP 200 for the app and service worker; `Cache-Control: no-cache` for `sw.js`; working worker assignments, gathering, Food/Oil/Authority progression, and reload persistence; offline-shell readiness; a 390px phone layout without horizontal overflow; and no game-origin console warnings or errors. The manifest was checked on the successful preview. Real iPhone Safari, home-screen installation, offline reopening, and background/resume behavior still require device verification.

If a later release breaks the game, use Vercel's production rollback to a previously verified deployment and check the public URL again. Keep the saved record intact. Older game code must support the player's save version before rollback; export a backup before any intentional save migration. Saves belong to their origin, so localhost and preview progress do not transfer to the production URL automatically.
