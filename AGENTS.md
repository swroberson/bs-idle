# Buried Sun: agent instructions

These instructions apply throughout this repository. Read
`docs/GAME_DESIGN_PHASE_1.md` before implementation.

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

## UI / VISUAL DESIGN DIRECTION

**Buried Sun is a game, not a web application.**

The interface is primarily text-based with restrained iconography, so the UI itself must establish the game's atmosphere and sense of place. Every component should feel like part of an underground industrial system rather than a modern SaaS dashboard.

The target aesthetic is:

> **Industrial excavation terminal + restrained cosmic horror.**

The player should feel as though they are operating, monitoring, and gradually expanding a strange machine deep underground.

### Core Design Rule

When implementing or reviewing UI, ask:

> **Could this component plausibly belong in a modern SaaS dashboard or admin panel?**

If the answer is yes, redesign it.

Avoid generic "web app" conventions unless they are necessary for usability.

---

## Visual Language

The interface should feel:

- Dense
- Mechanical
- Utilitarian
- Subterranean
- Slightly hostile
- Mysterious
- Alive

It should **not** feel:

- Clean and corporate
- Friendly or bubbly
- Like a productivity application
- Like a Tailwind component library demo
- Like a mobile banking app
- Like a conventional admin dashboard
- Excessively retro, pixel-art, or faux-CRT

The goal is not to imitate an old computer terminal. It is to create a fictional industrial interface that happens to be rendered with modern web technology.

---

## Layout

Prefer **one cohesive machine interface** over collections of independent cards.

Use:

- Dividers
- Instrument-panel regions
- Thin structural borders
- Dense information groupings
- Alignment and typography to establish hierarchy
- Persistent status/readout areas
- Panels that appear mechanically connected to one another

Avoid:

- Large rounded cards
- Floating containers
- Excessive whitespace
- Repeated `rounded-xl + shadow + padding` patterns
- Dashboard grids composed entirely of interchangeable cards
- Large conventional navigation bars
- Pill-shaped navigation and controls

Borders should feel structural rather than decorative. Do not place every piece of information inside its own box.

The interface should feel like **one machine**, not a webpage containing several widgets.

---

## Color

Use a highly restrained palette.

The base interface should consist primarily of:

- Near-black backgrounds with subtle green, brown, or mineral undertones
- Bone/off-white primary text
- Muted gray/olive secondary text
- Dark, low-contrast structural borders

Avoid pure black and pure white where possible.

### Accent Color

Reserve a dirty amber/gold tone for important states and for imagery or concepts associated with the Sun.

Amber should be uncommon enough that its appearance attracts attention.

Appropriate uses include:

- Major discoveries
- Important resources
- Active machinery
- Significant progression
- Sun-related systems or narrative events

Do not spread the accent color across every interactive element simply because it is the application's primary color.

Use muted red for genuine warnings, failures, dangerous states, or critical conditions.

Avoid prominent blue UI elements. Blue strongly evokes conventional modern software interfaces and conflicts with the desired atmosphere.

---

## Typography

Typography is a major part of the game's visual identity.

Prefer:

- Condensed or industrial sans-serif typography for interface labels and headings
- Monospace typography for telemetry, quantities, rates, measurements, timers, and machine readouts

Numeric values that change frequently should use tabular figures so the interface remains visually stable.

Example:

```text
DEPTH             1,284 m
STONE             4,218
EXTRACTION       +12.4/s
DRILL TEMP          67%
```

Avoid oversized marketing-style typography.

Most information should resemble **instrumentation**, not webpage content.

---

## Interface Language

Machine/interface copy should be concise, terse, and systematic.

Prefer:

```text
EXTRACTION // ACTIVE
DEPTH // 1,284 M
INSUFFICIENT IRON
UPGRADE // 850 STONE
SIGNAL DETECTED
THERMAL OUTPUT // 67%
```

over:

```text
Your excavation is currently active.
Current Depth: 1,284 meters
You don't have enough iron.
Upgrade Drill
```

Do not overdo faux-military or sci-fi terminology. Labels should remain understandable.

Narrative prose should contrast with machine language.

For example:

```text
SIGNAL DETECTED

Something moved beneath the drill.
```

The machine communicates facts. Narrative text communicates the unknown.

---

## Controls

Controls should resemble machine controls rather than web buttons.

Prefer:

```text
[ EXCAVATE ]
[ OVERDRIVE ]
[ UPGRADE // 850 ]
```

Use:

- Rectangular shapes
- Thin borders
- Minimal or no corner radius
- Compact padding
- Clear pressed/active states
- Small physical movement or illumination on interaction

Avoid:

- Large rounded CTA buttons
- Gradient buttons
- Floating action buttons
- Pill buttons
- Excessive button shadows

Disabled controls should communicate *why* they are unavailable where practical.

Example:

```text
[ UPGRADE // 850 STONE ]
             612 / 850
```

Desktop keyboard shortcuts may be exposed where useful, but the interface must remain fully usable on touch devices.

---

## Iconography

Icons should feel like **symbols or machine glyphs**, not generic application icons.

Prefer simple geometric SVG glyphs with:

- Consistent stroke weight
- Minimal detail
- Angular/geometric construction
- A limited visual vocabulary

Avoid excessive use of generic icon-library imagery such as colorful mining picks, gears, boxes, coins, etc.

If recurring systems need icons, prefer creating a small custom Buried Sun glyph set rather than relying entirely on generic web icons.

Iconography should supplement text, not replace it.

---

## Motion and Feedback

The interface should feel continuously alive even when the player is not actively interacting with it.

Use restrained micro-animation for:

- Resource values ticking upward
- Temporary `+N` resource indicators
- Progress movement
- Machinery activity indicators
- Control presses
- Unlocks
- New signals
- Status changes
- Brief illumination of important regions

Animations should generally be subtle and short.

Avoid:

- Large bouncing animations
- Excessive easing
- Decorative motion with no game meaning
- Confetti
- Generic loading spinners where an in-world activity indicator would work

Motion should communicate:

> **The machinery is operating.**

---

## Progression Through UI

The interface itself is part of the game's progression.

Do not assume every system needs to be visible from the beginning.

Early in the game, the interface may be sparse:

```text
DEPTH // 18 M

STONE
42

[ DIG ]
```

As the player discovers and constructs systems, the interface should become increasingly sophisticated and information-dense.

New:

- Readouts
- Panels
- Resources
- Machinery
- Status indicators
- Controls
- Navigation regions

should appear as they become relevant.

The player should be able to visually compare an early-game screenshot with a late-game screenshot and immediately see that they have built something substantial.

**The UI is effectively the player's base.**

---

## The Buried Sun

Anything directly connected to the titular **Buried Sun** should receive special visual treatment.

Do not casually use its strongest visual motifs throughout ordinary UI.

Sun-related discoveries may introduce:

- Brighter amber
- Increased luminosity
- Unusual glyphs
- Changes in interface behavior
- Subtle palette changes
- Visual anomalies

The visual language may gradually evolve as the player descends.

This should make encounters with the central mystery feel meaningfully different from ordinary resource progression.

---

## Responsive / Mobile Design

Buried Sun must work well on mobile, but **do not solve mobile responsiveness by turning the interface into a conventional stack of rounded cards.**

Instead:

- Collapse machine regions intelligently
- Preserve dense readouts where practical
- Allow panels to become vertically arranged while retaining their structural visual relationships
- Keep primary actions reachable
- Maintain sufficiently large touch targets even when controls visually appear compact
- Prioritize current resources, active processes, and available actions

The mobile version should feel like a **handheld control terminal**, not a responsive SaaS website.

---

## Component Implementation Checklist

Before considering a UI component complete, verify:

1. Does this look like part of a game rather than a website?
2. Does it belong to the same fictional machine as the rest of the interface?
3. Am I using a card because the information genuinely needs a panel, or because cards are convenient?
4. Could hierarchy be communicated with typography, alignment, or dividers instead?
5. Are rounded corners, shadows, and whitespace being used intentionally rather than by default?
6. Does interaction provide immediate game-like feedback?
7. If a number changes frequently, does it look like telemetry?
8. Is accent color being reserved for meaningful information?
9. Does the component still preserve Buried Sun's identity on mobile?
10. Would removing the application's title still leave this recognizably a game interface?

If a component begins drifting toward generic dashboard/SaaS styling, favor **industrial instrumentation, structural layout, and game-state feedback** over additional web-app chrome.

### Guiding Principle

**Do not decorate a web application until it looks like a game. Build the interface as a game from the beginning.**

The player is not browsing information about an excavation.

**They are operating the excavation.**