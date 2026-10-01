# Buried Sun: agent instructions

These instructions apply throughout this repository. Read
`docs/GAME_DESIGN_PHASE_1.md` before implementation; if the brief is stored at
the repository root, read `GAME_DESIGN_PHASE_1.md` there instead.

## Project goal

Buried Sun is a mobile-first, text-led incremental idle game inspired by the
ancient/futuristic atmosphere of Gene Wolfe's *The Book of the New Sun*, using
an original setting, characters, and prose.

Phase 1, **The Outer Ward**, is a complete vertical slice targeting roughly
30–60 minutes of engaged play. The player maintains a settlement, investigates
its lamps, and restores buried machinery. The finale reveals Current and
lamps that burn without Oil.

## Agreed stack

- Next.js with the App Router.
- React and TypeScript.
- Tailwind CSS for styling.
- Browser-local game state and simulation.
- Versioned JSON saves in localStorage initially.
- PWA installation and offline app-shell support.
- Vercel for hosting and deployment.

Keep the initial app compatible with static hosting. Next.js is the app
framework; the game must not require server execution to play. Do not introduce
API routes, server actions, a database, authentication, or server-side game
simulation. Avoid dependencies that require a persistent server.

Do not change the stack or hosting provider without an explicit user request.
Do not substitute Sites hosting for Vercel.

## Architecture

Separate the simulation engine, content definitions, and interface:

```text
app/          Application shell and routes
components/   React interface
game/         Types, simulation, actions, saves, modifiers, requirements
content/      Balance, buildings, jobs, research, expeditions, events
```

These directories may live under `src/`. Follow an existing repository's
conventions rather than reorganizing it unnecessarily.

- Keep simulation independent of React, the DOM, and browser storage.
- Access browser APIs only in browser-safe code paths.
- Use explicit, validated actions to change game state.
- Use stable content IDs, independent of display names.
- Keep rates, costs, prerequisites, rewards, and modifiers in content data.
- Keep resources finite and nonnegative, and workers correctly accounted for.
- Ensure discoveries, events, and expedition rewards are applied once.
- Prevent concurrent tabs from overwriting progress; a single-active-tab policy
  is sufficient for Phase 1.

## Persistence and idle progress

The game runs on the player's device. Do not rely on background timers or a
server to keep the economy advancing.

- Reconcile elapsed time on launch and resume using the same economy rules as
  foreground play.
- Cap offline production at eight hours initially.
- Account for shortages and expedition completion during an interval; do not
  blindly multiply the starting production rate by elapsed time.
- Expedition timers use actual elapsed time even beyond the production cap.
- Never double-count elapsed intervals or automatically choose event responses.
- Save regularly, after meaningful actions, and when the page becomes hidden
  where possible.
- Provide validated JSON import/export and confirmed reset controls.
- Preserve the existing save when an import is malformed or unsupported.
- Provide a useful return summary and a copyable-text export fallback for phones.

Saves are device/browser-specific. Cloud saves and accounts are outside Phase 1.

## Mobile and PWA requirements

Design for iPhone-sized screens first, while supporting desktop use.

- Use readable typography, generous touch targets, and clear net resource rates.
- Avoid hover-only interactions, dense desktop layouts, and color-only cues.
- Support keyboard navigation and reduced motion.
- Reveal systems progressively; hide Current until the finale.
- Provide a web app manifest, suitable icons, and offline app-shell caching.
- After an initial online visit, the cached game must be able to open offline.
- Keep service-worker updates compatible with saved progress; never erase a save
  as part of an app update.

## Deployment plan

Use a Git-backed Vercel project for the initial release. No database, backend
service, or server-side environment secrets are required by the game.

1. Establish the repository's package manager, commit its lockfile, and use it
   consistently.
2. Document the actual install, development, validation, and production-build
   commands in the README.
3. Keep a production build compatible with the selected Next.js static-output
   configuration. Configure Vercel to match the actual build output.
4. Use Vercel preview deployments to review changes when the project is connected.
5. Verify the deployed game in iPhone Safari and as a home-screen PWA, including
   offline reopening and background/resume behavior.
6. Document the verified deployment setup and production URL once available.

Do not invent a repository URL, Vercel project, deployment URL, or successful
deployment. Creating this repository guidance does not itself request a live
deployment; deploy when the user requests it.

## Validation

Before delivering implementation changes, run the repository's applicable
type checks and production build. Add targeted engine tests for meaningful
behavior, especially:

- Foreground/offline consistency and the offline cap.
- Resource depletion and recovery.
- Worker reservation and expedition return.
- One-time events and rewards.
- Save validation and import/export round trips.
- Finale reachability and persisted completion.

Use a development-only simulation harness for progression and rough balance,
then manually play a fresh save on mobile. Automated checks do not establish
that the game is enjoyable or that Safari/PWA behavior works.

## Scope boundaries

Do not add prestige, passing Ages, multiple settlements, Citadel exploration,
combat, equipment, factions, procedural content, cloud saves, multiplayer,
leaderboards, payments, or a large art pipeline in Phase 1.

Build the smallest complete experience described in the design brief. Economy
numbers are provisional and should be tuned through playtesting. Preserve the
restrained, archaeological atmosphere without obscuring mechanical costs or
effects.
