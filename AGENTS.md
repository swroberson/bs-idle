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

### Attention and viewport

Keep ordinary play within the viewport, with persistent resource readouts and
navigation. Use focused views and pagination instead of ever-growing lists.
Retain scrolling as a fallback for enlarged text, very short screens, and long
content; never clip essential controls to enforce a no-scroll layout.

Chronicle always opens to the latest entry, with older entries available through
pagination, regardless of which entries are unread.
Chronicle tabs display a count of unread entries. Persist acknowledgement in
the save and clear only the entry actually viewed in a visible, active tab.
Use the same badge convention wherever attention is required: pending choices,
new records, empty stores, or record faults. Do not badge ordinary affordable
purchases or routine cooldown completion as recommended next actions.

Do not show objectives, next-step hints, recommended actions, or tutorial
prompts. Let players discover what to do. Keep exact costs, effects, timers,
and unmet requirements understandable; mystery belongs in the world and prose.

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

## Art Direction

*Buried Sun* is primarily a text-led game. Illustration is used sparingly to give the player glimpses into the physical world: the opening of a new save, the discovery of a building or location, the appearance of a new kind of worker, a significant investigation, or a major narrative revelation.

Illustrations should feel valuable because they are uncommon. Do not add decorative art merely to fill space.

### Core visual identity: Dark Chronicle

The visual style is **Dark Chronicle**: grounded historical realism presented with heavy chiaroscuro, deep shadow, restrained color, and an atmosphere of age, enclosure, neglect, and imperfect understanding.

The world should feel:

- Ancient rather than conventionally medieval.
- Material and tactile: stone, soot, timber, iron, leather, wool, parchment, oil, smoke, mud, dust, and worn tools.
- Dimly illuminated by lamps, candles, furnaces, or narrow sources of natural light.
- Inhabited and functional rather than picturesque.
- Claustrophobic more often than expansive.
- Strange without looking overtly fantastical.
- Monumental in fragments, never through explanatory establishing shots.

Avoid bright fantasy concept art, picturesque medieval villages, sunny pastoral landscapes, heroic compositions, clean high-fantasy architecture, or generic grimdark spectacle.

### The art does not know more than the characters

This is the most important rule.

**An illustration may depict only what an inhabitant of the world could perceive. It must not visually explain the true nature of the setting to the player.**

The Citadel and its associated structures descend from incomprehensibly old technological infrastructure. The inhabitants do not understand this. Their language and worldview interpret inherited systems as architecture, craft, civic institutions, religion, ruins, and tradition.

Therefore, never depict the Citadel as a recognizable spaceship, space station, technological megastructure, or other comprehensible science-fiction object.

Do not create diagrams, exterior establishing shots, cutaways, aerial views, or other omniscient perspectives that reveal how the Citadel works or what it originally was.

The player should gradually suspect what the world is. The illustrations must not confirm more than the narrative has earned.

### Depict fragments, not answers

When something is ancient, enormous, or technologically incomprehensible, **do not depict it in its entirety**.

Show fragments.

Examples:

- A smooth black wall disappearing beyond the frame.
- An enormous curved surface exposed beneath ordinary masonry.
- A conduit whose scale and material make its purpose unclear.
- A doorway built for proportions that make no obvious human sense.
- A geometric seam visible behind centuries of plaster.
- Workers standing beside a tiny exposed portion of a much larger mechanism.
- Strange light emerging from somewhere the composition does not reveal.
- Human scaffolding attached to something whose boundaries cannot be seen.

Let darkness, architecture, cropping, fog, depth, obstruction, and the edge of the frame conceal the rest.

**A good Buried Sun illustration reveals one thing while concealing something larger.**

### No conventional science-fiction vocabulary

Ancient technology should not look like modern or cinematic science fiction.

Avoid:

- Holograms.
- Computer terminals.
- Screens and control panels.
- Visible circuit boards.
- Neon strips.
- Recognizable electrical equipment.
- Spaceship corridors.
- Reactor cores.
- Sci-fi doors.
- Clearly mechanical robots.
- Familiar industrial machinery presented as futuristic technology.

An ancient technological object should initially be difficult to distinguish from architecture, infrastructure, ritual objects, or inexplicable material.

A conduit may simply be a smooth black cylinder passing through stone. A machine may resemble a wall until part of it moves. An ancient lamp may look like an ordinary civic fixture until someone discovers that it has no reservoir.

### Composition and scale

Prefer **intimate, human-scale viewpoints**.

The viewer should usually feel physically present in a room, workshop, passage, excavation, courtyard, or other bounded space.

Favor:

- Cramped interiors.
- Low ceilings and vaults.
- Narrow passages.
- Enclosed courtyards.
- Workshops.
- Offices.
- Cellars.
- Excavations.
- Shafts.
- Partial architectural views.
- Foreground objects that establish human scale.

Avoid clean horizons and enormous panoramic vistas.

If monumental scale appears, communicate it through contrast with human-scale objects and by allowing the structure to leave the frame. Do not pull the camera backward merely to show the whole thing.

### Light and color

Darkness should be structural, not a dark filter placed over an otherwise bright scene.

Most of the image may be genuinely difficult to see. Important subjects emerge from localized illumination while surrounding architecture disappears into shadow.

Primary light sources should usually be:

- Oil lamps.
- Candles.
- Hearths.
- Furnaces.
- Torches.
- Narrow openings.
- Reflected or indirect daylight.

Use a restrained palette dominated by soot black, charcoal, weathered stone, dirty brown, dull iron, parchment, aged timber, and muted cloth.

Warm amber firelight against cold darkness is appropriate.

Unfamiliar light should be rare and narratively meaningful. As ancient systems awaken, pale or otherwise unnatural illumination can become a visual signal that something fundamental has changed.

Do not casually use glowing technology before the story earns it.

### Human life should remain legible

The ancient world is mysterious. **Human activity is not.**

Human-made objects and practices should be understandable and materially believable: ledgers, tools, ropes, baskets, presses, anvils, shelves, seals, keys, lamps, barrels, scaffolds, simple furniture, patched clothing, and hand-built structures.

This contrast is important.

The inhabitants construct understandable things **on, inside, and around things they do not understand**.

A wooden shelf might be attached to an impossibly smooth ancient wall. A stone workshop might incorporate an unknown structural member as though it were simply a column. Generations of repairs may obscure the boundary between human construction and inherited infrastructure.

Do not make every scene strange. Ordinary life must be convincing enough that anomalies matter.

### People

Avoid conventional RPG character portraits and heroic poses.

When illustrating a worker type, show the person **performing their role in an environment**.

A Smith should be working at an anvil rather than posing with a hammer. A Lamplighter should be tending a lamp. A Scrivener should be hunched over records. A Scavenger should be examining or recovering something.

People should generally appear small relative to their environment. Clothing should be practical, worn, layered, and grounded in the material culture of the Ward.

Characters are inhabitants, laborers, clerks, craftspeople, and custodians, not fantasy heroes.

### Buildings and locations

Building unlock art should communicate **use before spectacle**.

Show how the place functions: its tools, surfaces, stored materials, signs of labor, lighting, and relationship to the surrounding Ward.

Avoid isolated "beauty shots" of buildings.

The player should feel as though they have been permitted to see a particular corner of the Ward rather than being shown a concept-art model of a structure.

### Opening image and the Keeper

The player is the **Keeper of the Outer Ward**, an inherited office combining mundane civic, religious, and bureaucratic responsibilities whose original purpose is no longer understood.

Do not portray the Keeper as a powerful magistrate, noble, military commander, wizard, or senior imperial official.

The Keeper's world should initially feel small.

The visual model for the opening is a cramped, shabby office containing:

- A battered desk.
- An old household register.
- An empty chair representing the player's place.
- An oil lamp.
- Keys, seals, ink, and a small number of records.
- Worn shelves and practical storage.
- Stone and ancient structural material incorporated without explanation.
- A narrow glimpse into the dark Outer Ward beyond.

The empty chair is preferable to depicting the Keeper directly. It places the player in the role without defining the Keeper's appearance.

The initial impression should be approximately:

**You have inherited an old office, an older register, a nearly abandoned Ward, and a duty to keep its lamps burning.**

Nothing in the opening illustration should announce that this responsibility will eventually lead to the discovery of ancient technological infrastructure.

### Unlock illustration categories

Use these general approaches:

**Buildings:** intimate environmental views showing the building in use.

**Workers:** environmental portraits showing the worker performing their job.

**Research and discoveries:** close observational compositions emphasizing the object, fragment, document, excavation, or anomaly being studied.

**Expeditions and locations:** partial glimpses emphasizing arrival and immediate surroundings rather than comprehensive geography.

**Ancient machinery:** fragments only. Use darkness and cropping aggressively.

**Major revelations:** allow stronger visual contrast and unfamiliar illumination, but preserve ambiguity. A revelation should answer the current question without explaining the entire setting.

### Image-generation guidance

When prompting an image model, explicitly reinforce the following concepts where relevant:

> dark historical realism, heavy chiaroscuro, localized oil-lamp or fire illumination, deep surrounding darkness, weathered tactile materials, cramped or enclosed composition, restrained desaturated palette, ancient inhabited environment, human-scale viewpoint, subtle unexplained architectural anomalies, monumental structures disappearing beyond the frame, grounded clothing and tools, no overt fantasy spectacle, no recognizable science-fiction technology, no panoramic establishing view

Do not rely on the phrase "dark fantasy" alone. Image models frequently interpret it as conventional fantasy art and introduce castles, armor, magical symbols, dramatic skylines, or other inappropriate imagery. Describe the physical scene and lighting explicitly.

### Final test

Before accepting an illustration, ask:

1. Could this image plausibly be seen by someone physically present in the scene?
2. Does it depict ordinary human life convincingly?
3. Does it avoid explaining ancient technology that the characters do not understand?
4. Does darkness conceal meaningful parts of the environment rather than merely tinting the image?
5. Is the composition intimate rather than unnecessarily panoramic?
6. Does anything look generically high-fantasy or conventionally science-fictional?
7. If something strange appears, is it subtle enough that an inhabitant might accept it as part of the world?
8. Does the image reveal something while leaving a larger question unanswered?

If an image fails these tests, revise it before adding it to the game.