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
npm run simulate:opening # Development-only opening progression harness
npm run simulate:foundations # Fresh-save path through the foundation survey
npm run simulate:awakening # Full story path, lean and expanded economies
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

## Progression status

Implemented: Forager/Lamplighter assignments, elapsed-time Food consumption and Oil/Authority production, Fields and Oil Press construction, a one-time household arrival, the lamplighter’s report, and a deliberate lamp examination. Works and Studies appear as they unlock. Costs, unmet requirements, net rates, and completed discoveries are visible in the terminal interface. New inhabitants arrive idle.

Foragers retain full output during Food shortages; other productive output falls to 50%. At zero Oil, lamp output follows the available Oil Press flow. Manual provisions gathering and emergency rendering (5 Food → 2 Oil) share a 30-second recovery interval, so poor allocations or spending cannot permanently strand the opening without fuel.

The pure engine splits intervals at depletion boundaries and uses the same rules in foreground and away play. Hidden tabs stop production callbacks; launch/resume reconciles elapsed time, caps a single absence at eight hours, consumes the whole timestamp, and reports net changes. Eligible narrative reports await the player. Saves now use version 5, including the awakening and presentation acknowledgement. Existing version-1 records migrate without charging Food for time before the economy existed. Version-2 opening records preserve their economy timestamp and migrate new stores, buildings, jobs, and expedition records with empty defaults.

Scholarship and expeditions extend play through **Survey the Foundations**. Ledger Keeping unlocks automatic Coin production at the Market Stall and Knowledge production by assigned Scriveners. The Ruined Cistern opens two destinations: Old Cistern (three minutes, Relics) and Abandoned Farmstead (four minutes, Food/Coin). Send 1–3 idle inhabitants; each costs 10 Food. Party size scales ordinary rewards. One party may be away at a time; all inhabitants continue consuming Food. Workers return idle and rewards arrive automatically in foreground and away play, with a guaranteed first finding recorded once.

Build the House of Antiquities after the first cistern return, Catalog the Relics, and Survey the Foundations. Crop Rotation (+25% Food output) and Better Wicks (−25% Oil consumption) offer optional improvements. Modifiers multiply after base worker/building output is added. Completed investigations remain readable; the expedition log retains the latest 20 returns while discoveries remain permanent. Resource instruments and destinations appear as their systems unlock.

The approved continuation now reaches **Awaken the Junction**: an aqueduct return supplies measurements for tracing; Subterranean Works and a chapel expedition permit chamber opening; an inspection platform supports engine study; and deliberate repair precedes activation. The catalog now contains ten buildings, thirteen studies, six destinations, two queued-choice events, and twenty-eight Chronicle records. Lamp House, Smithy, tool/press improvements, Gatehouse salvage, and Barrow Field are optional. Ordinary buildings stop at three levels; story installations are unique.

Activation commits the ending once, introduces Current (+0.02/s, halved during Food shortages), and removes Oil demand from restored civic lamp tending while retaining Authority output and its existing shortage rules. Fuel stores are preserved. The three ending passages save their acknowledgement separately from Chronicle reading, resume after reload, and do not repeat effects. The story-complete readout remains visible while management continues. Current is hidden and produces nothing before deliberate activation.

This completes the approved story spine, not all Phase 1 acceptance work. The original 20–30 studies and 10–15 events targets, Laborer/Scavenger role design, a normal-speed fresh-save mobile playthrough, balance/enjoyment assessment, and actual iPhone/PWA checks remain outstanding. The new local increment has not been deployed.

## Interface

The interface is one viewport-sized terminal with persistent store telemetry and bottom navigation. Ward controls and the inhabitant register share its structure; Chronicle shows one entry per page, and Records separates export, import and replacement operations. Short screens use condensed layouts, with scrolling retained for enlarged text, long content and errors. Rectangular controls, geometric ward seals, monospace readouts and serif narrative prose establish the industrial/civic atmosphere. Muted green marks machinery activity, amber signals unread records, and muted red marks shortages and record faults. No objective prompts, next-step hints or purchase recommendations appear. Actions describe the work without forecasting unlocks. Study results and effects appear after completion; expedition rewards and findings appear after return. Costs, timers, worker commitments and ordinary production rates remain explicit. Gathering announces successful storage without reading each countdown tick aloud. Motion respects reduced-motion settings. Only unlocked systems appear; resource instruments show actual net rates. Works, Studies, and destinations show one selected entry at a time with direct selection and pagination; expedition return history has its own paginated view. Lengthy findings and short/enlarged-text screens retain scrolling. Empty Oil stops raising a lamp-fuel warning after awakening.

Chronicle always opens to the latest entry, regardless of unread status; previous entries remain available through pagination. Chronicle badges count unread entries. Viewing a record in a visible, active tab marks only that entry read, persists the acknowledgement and clears its badge across reloads. Existing saves without `readChronicle` migrate with their entries unread; new backups persist acknowledgement. Ward badges signal pending events and empty Food/Oil stores; expedition badges signal undismissed party returns, and Records badges signal storage/offline-shell faults. Routine purchases and cooldowns receive no badges.

The inhabitant register provides 44px plus/minus controls for unlocked roles. Assigned and Available totals derive from the shared population pool; actions cannot over-assign or release nonexistent workers. Assignments save after each action and survive reload and import/export. Version-1 scaffold allocations in `workers` migrate into economy `jobs`, preserving the shared worker pool. Earlier saves without assignments start with everyone available. Scholarship remains hidden until unlocked. Small mobile screens prioritize allocation controls over the Ward's introductory scene.

Resource counters use the shared compact formatter in `src/components/formatNumber.ts`: k (thousands), m (millions), b (billions), t (trillions) and q (quadrillions). Values truncate to at most one decimal, so 2,165 displays as 2.1k without overstating available stores. Full amounts remain in saves and calculations. Tap or keyboard-activate any resource readout for its exact count; screen readers also receive the exact value. The full readout is the touch target, and the exact-count dialog supports Escape and returns focus to its counter. Rates sit beside resource labels so six-character quantities have the full cell width without enlarging the resource strip.

## Illustrated discoveries

Four selected accomplishments have Dark Chronicle illustrations: a fresh Keeper's
office, first Oil Press construction, completed lamp examination, and first Old
Cistern return. A focused reveal shows the record's image and caption while
production continues. Continue dismisses one reveal; Leave remaining in Chronicle
files the currently queued illustrations without marking their records read.
The same artwork and caption remain available through Chronicle pagination.

Return reports appear before queued art. Reveals open only in the visible tab
that owns the save, and wait for any exact-resource dialog to close. Keyboard
dismissal uses Escape, focus returns to the prior control, and enlarged text or
short screens retain a scroll fallback. A failed image leaves its written caption
and dismissal controls usable. The four local WebP assets total about 614 KB and
are included in the offline cache. See [art prompts and review](docs/ART.md).

## Saves

Version-5 records include awakening/completion and three-stage presentation acknowledgement alongside assignments, building levels, lifetime Authority, queued/resolved reports, investigations, the Chronicle, illustration dismissals, an active expedition, visited destinations, and bounded return history. Import validates IDs, finite nonnegative values, shared worker counts, levels, timer durations, research prerequisites, and consistent one-time records. Version-1 through version-4 imports migrate automatically. Version-4 migration preserves existing stores, active timers, read records, pending illustrations and timestamps, adding unawakened defaults and zero hidden Current. Validation rejects inconsistent repairs, ending records, stage indices, Current, and new IDs smuggled into legacy versions. Earned illustrations in earlier saves are archived without retroactive popups; an existing Oil Press gains an already-read construction record while prior unread entries remain unchanged. Version-4 and version-5 saves retain pending reveals through reload and import/export. Successful imports reconcile elapsed time; invalid imports preserve the current record.

Progress is stored in this browser under `buried-sun.save`. It does not transfer between devices or origins automatically. Open **Records** to download a JSON backup or copy its text, import a file or pasted JSON, and reset with confirmation. Invalid imports leave the existing save intact. If a stored save cannot be loaded, the recovery view retains its raw text for backup before a confirmed replacement.

## PWA and offline shell

Production builds generate `out/sw.js` with a content-hashed cache and precache every exported app asset. Service worker registration is disabled in development. After a successful initial online visit and cache installation, the production shell can reopen offline. Shell updates wait for old tabs to close and never delete localStorage. No remote fonts or runtime asset services are required.

On iPhone Safari, visit the deployed site and use **Share → Add to Home Screen**. Actual iPhone installation, offline reopening and background/resume behavior still require device verification. A desktop browser check is not evidence of those behaviors.

### Illustrated-unlock verification

Verified locally on October 2, 2026: lint, TypeScript, **129 tests**, production
static export, and inclusion of all four images in the generated service-worker
cache. New tests cover accomplishment order, failed/repeated actions, individual
and queue-snapshot dismissal, first offline returns, persistence, versions 1–3
migration, inconsistent/malformed records, and local WebP size/format.

An isolated Chromium production preview verified actual Oil Press construction,
all four reveals and decoded images, foreground production during a reveal,
return-report precedence, queue skipping, separate Chronicle acknowledgement,
legacy import and malformed-import preservation, read-only tabs, native keyboard
focus and Escape, pending/dismissed reloads, and phone/desktop widths of
320/390/768/1024/1440px. A 320×400 screen with 200% text retained reachable dialog
controls through scrolling without page-width overflow. Simulated visibility
events verified hidden-page gating. All four image responses were present in the
cache, and the game/illustrated Chronicle reopened with network access disabled.
Deliberate image failures preserved captions and controls; a simulated storage
fault left the pending reveal intact and backups reachable. An expedition return
waited for both an open resource dialog and its return report without stacking
modals. Ordinary production checks had no console errors or page exceptions.
Real iPhone Safari, home-screen installation and PWA resume remain unverified.

### Scaffold verification

Verified locally on October 1, 2026: lint, TypeScript, 13 engine/save tests, and the production static build. In the Codex browser, checked the 390px phone layout and horizontal overflow at 320, 768, 1024 and 1440px; gathering/reload persistence; rejected malformed text imports; backup round-trip; Chronicle navigation; exclusive tab ownership and automatic transfer of the latest save after tab closure; and cached reopening with the preview server stopped. The browser console was clear during these checks. This verifies the scaffold, not the full Phase 1 experience or real-device Safari behavior.

The terminal UI rework was also verified locally on October 1, 2026: the same validation commands pass, with browser checks for the 390px layout, overflow at 320/768/1024/1440px, visible keyboard focus, gathering feedback and cooldown recovery, reload persistence, malformed import preservation, backup restoration, Chronicle navigation, and cached reopening with the production preview server stopped. The production console showed no warnings or errors during the online checks. iPhone Safari and home-screen PWA checks remain unverified.

### Opening sequence verification

Verified locally on October 1, 2026: lint, TypeScript, **36 tests**, and production static build/offline-shell generation. Tests cover depleted Food/Oil, recovery, Oil flow at zero stores, short-tick/long-interval equivalence, the eight-hour cap, duplicate reconciliation, worker conservation, building prerequisites/costs, pending choices, one-time effects, migration, and malformed saves.

`npm run simulate:opening` reaches the first discovery from a fresh save with three Foragers and two Lamplighters, no resource grants and no manual gathering. Provisional milestones: Fields at 25 seconds, Oil Press at 75, household at 136, lamplighter’s report at 176, examination at 201. This checks reachability; it does not establish the complete Phase 1 pacing target or enjoyment.

In the Codex browser, completed a fresh opening through ordinary controls at a 390px viewport. Checked zero horizontal overflow at 320/768/1024/1440px, visible keyboard focus, emergency Oil rendering, persisted progress after reload, malformed-import preservation, backup restoration, a 12-hour import reporting exactly eight hours of production, exclusive tab ownership and transfer, and the updated cached shell reopening with the preview server stopped. The production console was clear during online checks. Real iPhone Safari and home-screen PWA behavior remain unverified.

### Scholarship and expedition verification

Verified locally on October 2, 2026: lint, TypeScript, **53 tests**, and the static production build. New tests cover scholarship gates/modifiers, worker reservation, invalid party sizes and costs, repeat returns and one-time findings, foreground/offline equivalence through an expedition Food reward, timers beyond the production cap, bounded return history, version-2 migration, and inconsistent saves.

`npm run simulate:foundations` reaches the survey from a fresh save without grants or manual gathering. Provisional milestones: Ledger Keeping at 343 seconds, Market Stall at 455, Scrivener’s House at 576, cistern departure at 726, House of Antiquities/catalog at 975, and foundation survey at 1,175 (about 19½ minutes). The harness uses three Foragers, two Lamplighters, one Scrivener, and two expedition inhabitants. Optional improvements are not purchased. This is a reachability check, not a verified full Phase 1 pacing or enjoyment result.

In the Codex browser, played a fresh opening through the lamp examination at a 390px viewport, then exercised the new stage through its controls using timestamp-adjusted backups to represent away intervals. Verified version-2 migration, an unsupported import preserving an active party, active-timer reload persistence, idle-worker reservation limits, offline return rewards and findings, the foundation survey, and persisted survey completion. The expanded terminal had no horizontal overflow at 320/768/1024/1440px; navigation targets remained 48px tall. The production console showed no warnings or errors during online checks. The cached game reopened with the static preview server stopped.

The new increment is local and has not been deployed. A full fresh-save playthrough at normal speed, balance/enjoyment assessment, and real iPhone Safari/home-screen PWA behavior remain unverified.

### UI integration verification

Verified locally on October 2, 2026 after resolving the UI/gameplay rebase: lint, TypeScript, **104 tests**, and the production static build. Migration tests preserve version-1 UI allocations, exact stores and read entries while retaining version-2/3 gameplay validation. Browser checks on an isolated preview covered real net rates, worker allocation limits, construction, pending-event badges, latest-entry Chronicle opening with older unread entries, compact counts, and exact-count dialog Escape/focus return. Ordinary Ward and Chronicle views fit at 320×568 and 390×844 without page or panel scrolling. The production console was clear. Longer gameplay lists retain an overflow fallback; real iPhone Safari/PWA behavior remains unverified.

### Awakening verification

Verified locally on October 2, 2026: lint, TypeScript, **139 tests**, static production export, and the generated 42-URL offline shell. Tests cover the required spine without optional branches, one-time awakening, independent passage acknowledgement, malformed completion/import records, versions 1–4 migration, civic modifiers, guaranteed/repeated new expedition returns, worker conservation, foreground/offline agreement through Food depletion, Current production caps, and duplicate reconciliation.

`npm run simulate:awakening` reaches activation without grants or manual gathering at **2,333 seconds (38 minutes 53 seconds)** with Market level three and **3,576 seconds (59 minutes 36 seconds)** at level one. Both use eight inhabitants, three Foragers, one Lamplighter, two Scriveners after the survey, and two expedition inhabitants. Neither visits optional story destinations nor buys the new optional civic buildings/studies. Restore the Conduit costs a provisional 150 Coin, 120 Knowledge, two Relics, and 40 Authority, tuned from the draft's initial reserve using these measured routes. Harness time does not establish enjoyment or normal human play duration.

An isolated Chromium production preview verified actual activation through the Studies control, all three passages, production during presentation, passage resumption after reload, focused keyboard Enter/Escape advancement, independent Chronicle acknowledgement, preserved population, malformed-import preservation, continued management, and a read-only second tab. Direct selection and Previous/Next catalog controls worked. Catalogs and the ending had no horizontal page overflow at 320/390/768/1024/1440px; expanded Ward and long records retain vertical scrolling. A 320×400 screen at 200% text retained reachable ending controls. Away reports preceded a pending ending, and pending artwork appeared after it with at most one open dialog. Cached completion/Chronicle reopened with networking disabled. The production console had no warnings or errors.

A full normal-speed mobile playthrough, Safari/home-screen installation, real-device background/resume, and deployment of this increment remain unverified. Browser checks used the ordinary controls with timestamp-aligned harness backups to reach the new story stage; they do not substitute for fresh-save human playtesting.

## Vercel

`next.config.ts` uses `output: "export"`; `npm run build` writes the site into `out/`. `vercel.json` selects Vercel’s **Other** hosting preset (`framework: null`), specifies `npm ci`, `npm run build`, `out` as the output directory, and a no-cache header for the service worker. The app still builds with Next.js; Vercel publishes its static export without a runtime server. Using the Next.js hosting preset with an `out` override failed in the cloud because that adapter expected server build manifests there. The Other preset serves the exported files directly. See [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json) and [Next.js static export guidance](https://nextjs.org/docs/app/guides/static-exports).

Production: **[bs-idle.vercel.app](https://bs-idle.vercel.app)**. Deployed and verified on October 1, 2026. The Vercel project is `bs-idle` in `swrobersons-projects`, linked to [swroberson/bs-idle](https://github.com/swroberson/bs-idle). Root directory is `.`, Node.js is 24.x, and `vercel.json` supplies the install/build/output settings above. No game environment variables or server-side secrets are required.

The first live release contains commit `383d396` from `codex/opening-economy`. Its successful preview was promoted to production; [production deployment](https://vercel.com/swrobersons-projects/bs-idle/EK62cRS2bEwxeYUkX7Vj8zDdoEVf). Vercel's automatic production branch is `main`; the opening-economy branch was subsequently merged through PR #2. Pushes to other branches generate previews.

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
