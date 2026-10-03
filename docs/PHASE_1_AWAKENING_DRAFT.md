# Phase 1: from the foundation survey to the awakening

**Status:** APPROVED — October 2, 2026. User explicitly approved this sequence
for implementation. Costs and rates remain provisional balance values.

**Scope:** the remaining Outer Ward investigation spine, supporting destinations,
and ending. This is an authoring draft, not the complete Phase 1 content pass.

**Authority:** [design brief](GAME_DESIGN_PHASE_1.md),
[narrative bible](NARRATIVE_BIBLE.md), and [agent instructions](../AGENTS.md).

The user requested the next authoring step after the Phase 1 audit, then replied
“approved!” to the completed draft and its implementation approval question.
The local observations, lamp relationship, repair sequence, and ending are now
approved. Existing content IDs retain their present meanings. Runtime status is
recorded in the narrative bible and README; this file preserves the authoring spec.

## 1. Objective and boundaries

Carry the player from `survey-foundations` to a deliberate awakening through
physical comparison, access work, inspection, and repair. The reward is local:
the Ward's restored lamps burn without Oil, Current becomes visible, and the
Keeper's original duty can be performed differently. The larger system remains
unexplained.

Assumptions for this draft:

- The existing opening and six implemented studies remain intact.
- The aqueduct and chapel expeditions provide required evidence. Gatehouse and
  Barrow Field are optional; their findings are never assumed in the main prose.
- Ordinary improvements, including the Smithy and Lamp House, remain optional.
  The story does not require an economic upgrade merely to make the prose work.
- No new person, faction, historical event, succession, or stellar diagnosis is
  needed. Orso remains an observer and lamplighter.
- Barrow Field supplies an unusual relic, using the brief's permitted alternative
  to a historical contradiction. Its provenance is left open.
- No new illustration is required. Existing Dark Chronicle art remains usable.

**Always:** show exact costs, party commitments, timers, and unmet requirements;
record findings once; preserve optional branches and surrounding mysteries.
**Approval recorded:** the user accepted these discoveries, repair method,
lamp relationship, and ending wording, including the physical choices in
section 6. Further consequential lore changes still require approval. **Never:** confirm the vessel, propulsion, ancestral arrival,
dying sun, the literal Buried Sun, or a reason for Orso's caution. Do not display
this dependency map as objectives, hints, or unlock previews.

## 2. Evidence and prerequisite map

The candidate stable IDs below were retained as the implemented runtime IDs.
First-return findings are tracked by completed destination, independently of
whether the player has read the Chronicle entry. Reading and illustration
dismissal never gate progress.

| Step | Candidate ID / kind | Required evidence or work | What completion establishes |
|---|---|---|---|
| Survey the Foundations | `survey-foundations` / existing study | Existing lamp examination and relic catalog | Older opening, continuous seam, downward-facing sockets. |
| Ruined Aqueduct | `ruined-aqueduct` / expedition | Completed survey; existing Ruined Cistern access | Another exposed length of the same material and a branch toward the chapel. |
| Trace the Buried Conduits | `trace-conduits` / study | Survey + first aqueduct return | Measurements connect the branch with the surveyed opening; a gap in the connection is recorded. |
| Subterranean Works | `subterranean-works` / unique building | Completed tracing | Shoring, lifting tackle, and a safe approach beneath the chapel. |
| Foundations Beneath the Chapel | `chapel-foundations` / expedition | Tracing + Subterranean Works | The party finds the edge of a fitted closure and its accessible catch. |
| Open the Sealed Chamber | `open-chamber` / study | First chapel return + tracing + Subterranean Works | The closure opens; workers can enter a limited part of the chamber. |
| The Buried Engine | `buried-engine` / unique installation | Chamber opened | A working platform and supports permit inspection of an exposed assembly. No output yet. |
| Study the Buried Engine | `study-engine` / study | Open chamber + engine installation | A loose joining piece and a separate movable stone are identified through local tests. |
| Restore the Conduit | `restore-conduit` / study | Engine study + installation | The joining piece is reseated and supported; the connection is repaired, without awakening. |
| Awaken the Junction | `awaken-junction` / deliberate action | Conduit restored + engine study + installation | Local response, restored lamps without Oil, Current, and permanent Phase 1 completion. |

There is no dependency back from awakening to an expedition, household, optional
upgrade, read record, or new resource. Current cannot pay for its own discovery.
Subterranean Works is safe-access construction, not the act that opens the
chamber. The engine installation is supporting work on existing machinery, not
the purchase of a newly manufactured ancient engine.

## 3. Expeditions

Retain one concurrent party and 1–3 available inhabitants. All party members
remain in the shared population and consume Food. Returns are automatic;
workers return idle. Ordinary rewards below are **per worker**. Findings are
guaranteed on the first return only, regardless of party size. Reward values and
findings appear after return, not in destination descriptions.

| Destination / proposed gate | Time | Food per worker | Reward per worker, after return | First-return record |
|---|---:|---:|---|---|
| Collapsed Gatehouse / `catalog-relics` | 3 min | 12 | 15 Coin | `gatehouse-find` |
| Barrow Field / first Gatehouse return | 4 min | 15 | 1 Relic | `barrow-find` |
| Ruined Aqueduct / `survey-foundations` | 4 min | 15 | 1 Relic | `aqueduct-find` |
| Foundations Beneath the Chapel / `subterranean-works` + `trace-conduits` | 5 min | 15 | 1 Relic | `chapel-find` |

### Collapsed Gatehouse — optional salvage branch

**Before dispatch:**

> The upper arch has fallen across the passage. Loose iron and dressed stone
> lie among the blocks. Clear a working space beneath the remaining vault.

**First-return finding — The piece inside the stone:**

> The party brings back bent iron and a broken block. A strip of black material
> passes through the block without a fastening. They could free the stone from
> the rubble, but not the strip from the stone.

This supports optional `study-black-metal`, described below. It does not
establish an alloy, construction date, weapon, or component of a vessel.

### Barrow Field — optional relic branch

**Before dispatch:**

> Low mounds stand among the old boundary stones. Examine the exposed earth
> where a bank has fallen away.

**First-return finding — The unmarked object:**

> Beneath the fallen bank, the party finds a shallow cup with no foot. It lies
> on its side and holds a little dry earth. There is no mark on it. In the House
> of Antiquities, it will not sit flat on any shelf.

No burial is disturbed or identified. No civilization, date, occupant, ritual,
ancestral passage, or cause of abandonment is asserted. The cup's inconvenient
shape is allowed to remain an observation; it does not become a required key.
Relic spending represents the use of recovered objects generally, not a promise
that this particular cup is destroyed or explains the engine.

### Ruined Aqueduct — required comparison

**Before dispatch:**

> Follow the dry channel to the place where its lining has fallen. Measure the
> exposed work beneath the channel bed.

**First-return finding — Beneath the channel bed:**

> The watercourse rests on a smooth black length wider than the channel above
> it. At a break in the stone, a narrower length leaves its side and passes
> under the chapel wall. The party copies the edges and their distances onto
> the survey sheet. Neither end is visible.

The party records a fragment, not a map of the buried system. The aqueduct's
ordinary watercourse and the older material underneath remain distinguishable.

### Foundations Beneath the Chapel — required access evidence

**Before dispatch:**

> Descend by the newly shored stair. Clear the rubble beside the older opening
> and record the surfaces beyond the last course of masonry.

**First-return finding — The edge of the closure:**

> Below the sockets, the party uncovers the edge of a slab fitted into the
> black surface. A shallow recess remains clear beside it. The catch inside
> moves under a wooden probe. The slab itself does not move.

This supplies a specific way to attempt opening. No key from the Keeper's
appointment, secret password, ancient instruction, or historical motive is
invented. The downward sockets stay observable without being assigned a purpose.

## 4. Studies, installation work, and discovery prose

Studies and construction retain the existing immediate-purchase model. The
description states the work being attempted; finding text and completed effects
appear only after success. No active job is reserved for an instantaneous
purchase. Expedition commitments remain separate and explicit.

All costs are provisional. Authority is spendable civic standing; paying it
does not mean feeding legitimacy into a machine. Relics pay for material
comparison and fitting work without declaring every recovered object a spare
part. Do not add Stone, Iron, or a crafting inventory.

| Work | Exact proposed cost | Completed mechanical effect / record |
|---|---|---|
| Trace the Buried Conduits | 15 Coin, 16 Knowledge, 1 Relic | Tracing recorded; Chronicle `conduit-trace`. |
| Subterranean Works | 30 Coin, 30 Food, 20 Authority | Safe access established; Chronicle `subterranean-works-built`. Unique installation. |
| Open the Sealed Chamber | 20 Coin, 20 Knowledge, 1 Relic | Chamber opened; Chronicle `chamber-opened`. |
| The Buried Engine | 25 Coin, 8 Knowledge | Inspection platform installed; Chronicle `engine-works-built`. Unique installation; 0 Current/s. |
| Study the Buried Engine | 24 Knowledge, 1 Relic | Local tests recorded; Chronicle `engine-study`. |
| Restore the Conduit | 150 Coin, 120 Knowledge, 2 Relics, 40 Authority | Connection restored; Chronicle `conduit-restored`. No Current or lamp conversion yet. |
| Awaken the Junction | No resource cost | Atomic awakening and ending record `junction-awakened`; effects in section 6. |

### Trace the Buried Conduits

**Before purchase:**

> Compare the aqueduct measurements with the chapel survey. Clear short
> sections along the measured line and record each exposed joint.

**Finding — A break in the line:**

> The measurements meet beneath the chapel. Where rubble has shifted, the
> narrow black length ends short of its next section. Pale material shows on
> both broken faces. The scrivener draws the gap at its measured width and
> leaves the rest of the page empty.

This earns the local word *conduit*. It does not establish what is carried,
where it originates, or how far the unseen lengths extend.

### Subterranean Works

**Before construction:**

> Shore the stair beneath the chapel and set lifting tackle beside the older
> opening. Keep the descent clear for a small party.

**Construction record — Work beneath the chapel:**

> Timber holds the loose courses apart. A rope passes over the new beam, and
> the spoil is carried up in baskets. The lower stair is narrow enough that
> those descending must wait for those coming back.

Ordinary materials and work support access. The shoring does not explain the
older structure or assign a sacred purpose to the chapel.

### Open the Sealed Chamber

**Before purchase:**

> Brace the fitted slab. Hold its catch clear and draw the slab outward with
> the lifting tackle.

**Finding — The room beyond the slab:**

> The slab comes forward by the breadth of a hand, then turns on a point below
> the floor. Behind it, the black surface continues into darkness. A raised
> length runs along one wall. The loose end recorded in the tracing lies beside
> it. Only the nearest floor has been cleared.

Opening exposes a bounded working area, not the whole chamber. Darkness need
not hide a scripted danger. A catch is a practical observation, not proof that
someone intentionally imprisoned or suppressed the machinery.

### The Buried Engine

**Before construction:**

> Lay a working platform inside the chamber. Support the loose length and
> place lamps where its exposed surfaces can be examined.

**Construction record — A platform in the chamber:**

> The platform ends before the far wall can be seen. On it, a lamp, a wooden
> gauge, and a folded cloth are placed within reach. The exposed work has been
> entered in the ledger under a new heading: Buried Engine.

The heading is a local working name, not knowledge of the assembly's original
purpose or identity with the titular Sun. These inspection lamps use ordinary
fuel in the fiction; no extra hidden resource charge is applied.

### Study the Buried Engine

**Before purchase:**

> Compare the loose joining piece with the exposed ends. Test the nearby
> movable stone without forcing it beyond its present stop.

**Finding — Two movements:**

> The joining piece sits between the broken faces when lifted into line. Its
> pale edges meet theirs. Beside it, a narrow stone can be drawn forward only
> a finger's breadth; in that position, the piece cannot be lowered. With the
> stone returned, it can. The two movements are entered separately in the ledger.

The tests establish a fit and a repeatable local constraint. They do not teach
electricity, reveal a power source, or make the scrivener an ancient engineer.
The piece is found at the chamber's exposed break; optional Gatehouse or Barrow
finds are not secretly required to account for its presence.

### Restore the Conduit

**Before purchase:**

> Lift the joining piece into its measured position. Secure its support and
> prepare the movable stone for a separate test.

**Finding — The joint holds:**

> The support takes the weight. When the lifting rope slackens, the pale edges
> remain together. A fine line is still visible between them. Orso checks the
> ordinary lamps above and returns with his usual tally of oil.

The repair succeeds. The resource change and ending do not happen at this step;
the ordinary tally supplies the contrast without assuming completed Better Wicks.

## 5. Supporting civic work and optional branches

These proposals provide decisions while the main restoration stock accumulates.
They are not gates on the story. This section deliberately does not manufacture
enough entries to satisfy the eventual 20–30 study / 10–15 event targets. A
separate complete-content and balance pass remains necessary.

| Candidate ID / work | Gate | Cost | Before action | Completed result |
|---|---|---|---|---|
| `lamp-house` / building, max 3 levels | Oil Press + `ledger-keeping` | Base 20 Coin, 15 Authority; growth ×1.7 | Set a bench and measured vessels beside the lamp stores. | +0.025 Authority/s per Lamplighter per level, added before shortage effects; Oil demand unchanged. |
| `smithy` / unique building | Market Stall + `ledger-keeping` | 25 Coin, 15 Food | Clear a hearth and set an anvil for repairing the Ward's tools. | Repair workspace established. |
| `iron-tools` / study | Smithy | 15 Coin, 12 Knowledge | Refit the garden tools and compare their work with the old edges. | All Forager Food output ×1.20, multiplying with Crop Rotation. |
| `improved-presses` / study | Smithy + Oil Press | 20 Coin, 16 Knowledge | Refit the press bearings and measure a full turn under load. | Oil Press output ×1.25. |
| `study-black-metal` / study | House of Antiquities + first Gatehouse return | 12 Knowledge, 1 Relic | Compare the embedded strip with the cistern fragments. | Material comparison recorded; no production bonus or required unlock. |

For `study-black-metal`, the completed record is:

> The strip has the same dark surface as the recovered fragments, but no pale
> lining is exposed. Filing marks remain on the stone beside it. There is no
> corresponding mark on the strip. Both are drawn as they were brought in.

This does not assert indestructibility or a universal material. The optional
study's lack of an economic bonus is stated after completion, not presented as
a promised later payoff before purchase.

Lamp House and Smithy completion records can describe ordinary work only:

> The vessels are set in a row. Orso marks the level of oil in each before
> carrying them out. He returns the empties to the same places.

> The bellows are patched. A garden blade lies across the anvil, and a basket
> of worn tools waits beneath the bench.

Iron Tools and Improved Presses records report their observed results without
new lore: straightened garden edges cut cleanly; the refitted press yields more
oil from the same work. These studies improve the named outputs, not expedition
speed, chamber access, or a hidden chance of success.

Laborer discounts, Scavenger role semantics, additional household events, and
the remaining ordinary studies need their own content/mechanical design pass.
The required route here uses existing assignments and eight inhabitants; it
must not depend on those unimplemented roles or additional population.

## 6. The lamp relationship and deliberate awakening

### Approved physical continuity — Q08 / CL03–CL05 / CL08 / CL15

The oil-burning civic fixtures on the Processional Way are old wall-mounted
casings with later oil vessels and wick holders fitted inside them. Inspection
after the engine study finds pale inner surfaces and a connection entering
their bases. These match the third lamp's observed lining and seam.

As part of the awakening action, Orso lifts the removable vessels and wick
holders from those fixtures. Any remaining oil is returned to the lamp stores;
the empty vessels are set nearby. Moving existing fuel between vessels does not
grant or consume resource stock. The third lamp stays in place and is not
dismantled, filled, or fitted with a wick.
The new work establishes neither why that lamp was different nor why Orso
previously protected it. Other handheld/workshop lamps may still use Oil.

Add the following paragraph to the **completed engine-study record**, after the
chamber tests; the comparison is information learned after study, not a preview:

> Above, Orso lifts the vessel from one of the wall lamps. Beneath its holder
> is the pale surface drawn in the third lamp's record. A narrow seam enters
> the base. He replaces the vessel and records which other fixtures have the
> same lining.

Add the following paragraph to the **completed conduit-restored record**:

> Orso marks the fixtures along the Processional Way that have the same lining.
> Their oil vessels and wick holders are left in place. The third lamp remains
> where it was.

This is an approved local continuity choice, not an established technological
explanation. The Processional Way is an inhabited passage under the Keeper's
care; no map, relation to a hull, or whole-Citadel footprint is established.

### Action and exact consequences

**Control:** `AWAKEN THE JUNCTION`

**Before action:**

> Remove the oil fittings from the marked lamps. Draw the movable stone forward
> to its tested stop with the repaired joint seated. Observe the chamber and
> the lamps above.

Display completed-study/installation requirements and the zero resource cost.
Do not forecast Current, an Oil saving, a white light, or another story stage.
The action does not move workers between roles, dispatch a party, or consume
Oil. Its effect occurs once on explicit activation, never on a timer or import.

**Committed effects, at the action timestamp:**

- Persist awakening/completion and add `junction-awakened` once.
- Reveal Current and enable **+0.02 Current/s** from the Buried Engine;
  ordinary Food-shortage scaling applies, so **+0.01/s** while Food is empty.
- Set Oil demand from the game's Lamplighter job to **0/s**. Preserve existing
  Authority output and improvements, including the Food-shortage reduction.
- Scope that job to maintaining the restored civic fixtures; it does not imply
  that every light in the setting changes or that maintenance ceases.
- Preserve Food, Oil, Coin, Authority, Knowledge, and Relic balances after the
  action. Current starts at zero and accumulates from this moment onward.
- Keep existing buildings, assignments, and expeditions running. Oil remains
  stored and producible; Current has no spend or technology tree in Phase 1.

Until awakening, the marked fixtures retain their oil fittings and the existing
Oil/Authority rules continue. Removal occurs within the atomic awakening action,
not during an indefinite interval between restoration and activation. There is
no simulated period of darkness or untracked outage.

### Staged ending — one permanent record

The stages are passages of one Chronicle record. They reveal no extra rewards
when advanced and impose no mandatory timed wait. Production continues; a short
screen or enlarged text can scroll. A reload preserves the committed result and
allows any unviewed presentation to resume; rereading never repeats effects.

**I — Beneath the Ward**

> The oil fittings are lifted from the marked lamps. The remaining oil is
> poured back into the stores, and the empty vessels are set beside the wall.
>
> The stone reaches its stop. The sound comes through the platform before
> anyone hears it. Dust moves along the joint. The lifting rope hangs slack.

**II — The Processional Way**

> Orso is waiting beside the first stripped fixture. Its pale lining becomes
> white. Farther along the passage, another lamp answers it, then another.
> The vessels stand beside the wall. There is no flame.

**III — The entry in the ledger**

> Orso puts his hand beneath one of the lamps. His shadow falls on the stone.
> He takes up an empty vessel and turns it in his hand, then sets it down again.
> In the oil column, the scrivener writes nothing. The lamps continue to burn.

After the last passage, show completed mechanical facts, separate from prose:

```text
JUNCTION // ACTIVE
CURRENT // +0.02/S
RESTORED LAMPS // 0 OIL/S
AUTHORITY // EXISTING OUTPUT RETAINED
OUTER WARD // STORY COMPLETE
[ RETURN TO WARD ]
```

Current and Authority values must reflect the actual current shortage and
assignment state, not always display the full-output examples above. The ending
does not declare the Ward permanently safe, abolish hunger, or offer a next
chapter objective. Ordinary management and optional records remain available.

## 7. Pacing, staffing, and resource checks

The existing `npm run simulate:foundations` passed on October 2, 2026 and reached
the survey at **1,175 seconds (19 minutes 35 seconds)** without grants or manual
gathering. That was the measured baseline at drafting. The full implementation
harness results below now cover awakening; manual playtesting remains outstanding.

Required aqueduct and chapel trips take nine minutes in total, with economic
production continuing. The main path after the survey spends **240 Coin,
188 Knowledge, 5 Relics, 60 Authority**, and **30 Food
for access + 30 Food per expedition worker across the two required trips**.
These totals exclude optional upgrades and include the restoration reserve.
The two expeditions yield 4 Relics with two-worker parties. Depending on stores
at the survey, repeat recovery trips are required; there is no rare-drop gate.

An eight-inhabitant example uses three Foragers, one Lamplighter, two Scriveners,
and two idle inhabitants for expeditions. With level-one Fields, Food output is
0.48/s against 0.20/s consumption. Level-one Oil Press produces 0.10/s against
0.075/s lamp demand. This staffing can sustain itself without optional studies;
the tradeoff is lower Authority output while a second Scrivener is working.
Reassignment remains the player's choice. This is an arithmetic feasibility
check, not a simulated route or a recommendation shown to the player.

From empty stores, the proposed restoration reserve takes:

| Output available | Time for its restoration cost |
|---|---:|
| Market level 1: 0.10 Coin/s | 25 min for 150 Coin |
| Market level 2: 0.20 Coin/s | 12 min 30 sec for 150 Coin |
| Market level 3: 0.30 Coin/s | 8 min 20 sec for 150 Coin |
| One Scrivener: 0.08 Knowledge/s | 25 min for 120 Knowledge |
| Two Scriveners: 0.16 Knowledge/s | 12 min 30 sec for 120 Knowledge |

Rates assume no Food shortage; concurrent accumulation uses the slowest needed
resource, not the sum of these durations. Existing stores and expedition salvage
can shorten the wait. Market levels are optional progression accelerators, not
hidden story gates. Their upgrade costs and time must count in the full harness.
Tune the reserve if normal routes exceed 60 minutes or reach it with nothing
meaningful left to decide. Do not claim the 10–20 minute final accumulation
target or overall 30–60 minute target has been established by this arithmetic.

Implementation balance pass: the original 180 Coin / 72 Knowledge repair cost
produced a 64 minute 36 second lean route and a short final accumulation in the
expanded economy. The full harness justified shifting the provisional cost to
150 Coin / 120 Knowledge. Measured routes now awaken at 59 minutes 36 seconds
(Market 1) and 38 minutes 53 seconds (Market 3), without grants, manual gathering,
optional story branches, or added population. The latter's study-to-restoration
interval is 9 minutes 27 seconds, roughly the lower edge of the 10–20 minute
target; actual accumulation depends on stores already earned during exploration.
Manual balance and enjoyment testing remain necessary.

## 8. Implementation boundary and acceptance checks

This document belongs in `docs/`. On approval, content definitions belong in
`src/content/`, pure actions/simulation/save validation in `src/game/`, and
presentation in `src/components/`. Follow existing stable kebab-case IDs,
content-defined numbers, immediate purchases, and guarded action conventions.
Do not add a backend, dependency, resource inventory, or illustration pipeline.

Use one stored completion source of truth and consistent prerequisites. Validate
the ending record, repaired conduit, chamber access, installed engine, and
Current together; invalid imports must preserve the player's current save.
Choose and document the actual next save version during implementation. Version-4
migration preserves stores, worker assignments, read records, pending art,
expedition timers, and timestamps; old saves start unawakened with zero hidden
Current. Completion and presentation acknowledgement are separate so interrupting
a reveal cannot undo or duplicate the ending.

After approval, acceptance checks must establish:

- A fresh save reaches awakening without debug grants, optional findings, new
  household events, or random success. Test both the lean route and upgraded
  economy; manual phone play determines pacing and enjoyment.
- Every observation follows its recorded action. Optional Gatehouse/Barrow
  records are never assumed by the required route. No read acknowledgement gates
  progression. Study and Chronicle text remain identical where duplicated.
- Chapel access cannot skip tracing or shoring; chamber opening cannot be
  purchased from an expedition timer alone. Study precedes restoration;
  restoration precedes the deliberate awakening.
- Current remains hidden and produces nothing before awakening. The restored
  lamp job retains Authority at zero Oil afterward, including shortage rules.
- Awake/asleep economies reconcile consistently across foreground, offline,
  depletion, and expedition-return boundaries. Away time never awakens the
  junction. The eight-hour production cap remains intact.
- Awakening, imports, reloads, repeated clicks, and presentation replay never
  duplicate the ending or grant retroactive Current. The save-owning visible tab
  alone accepts actions; queued return reports and art cannot stack ending modals.
- Native keyboard controls, reduced motion, readable requirements, persistent
  telemetry, latest-entry Chronicle behavior, and small-phone scroll fallbacks
  work with the enlarged content catalog and ending.
- Production export and offline caching continue working. Real iPhone Safari,
  home-screen installation, offline reopening, and background/resume still need
  device checks; desktop checks do not substitute for them.

Existing verification commands are `npm run check`, `npm run build`, and
`npm run simulate:foundations`. Add a development-only full-route harness when
the approved content exists; it is not a player-facing objective system.

## 9. Continuity review and approval scope

| Bible reference | Treatment in this draft |
|---|---|
| C07–C08 / required Phase 1 spine | Civic duty leads through deliberate investigation to the local awakening. |
| C01–C06 / later reveals | No arrival, vessel, stellar diagnosis, departure, succession, or new history appears in the proposed records. |
| C09–C10 | Observations remain local; the world is not reduced to a solved mechanism. |
| CL01 / appointment keys | No key is assigned a convenient ancient lock. |
| CL03–CL05 / third lamp | No reservoir or wick is added; lamp stays in place; its earlier light and Orso's motive stay open. |
| CL06–CL07 / gesture and roots | No explanation, payoff, or prerequisite is added. |
| CL09–CL12 / fragments, channels, sockets | Physical comparison earns progress; channels and downward sockets do not acquire a cosmic meaning or system diagram. |
| CL10 / farmstead | Optional and independent; neither the chairs nor abandonment is explained. |
| CL15 / awakening | Local white lamps, an observable underground response, and oil-independent operation; no global conversion or literal Sun is asserted. |
| Q01 / titular Sun | Still open. Buried Engine remains a local name. |
| Q03 / geography | Only local relations necessary for access and observation; no vessel footprint is chosen. |
| Q08 / remaining evidence and lamps | Explicitly approved in sections 2–6 and implemented; further consequential changes require review. |

The user's approval accepts the local evidence, the removable
oil fittings on restored civic lamps, the chamber's fit/test/repair sequence,
the optional unusual relic, and the ending wording. Numerical costs and rates
remain balance values subject to harness and playtesting. It does not approve
answers to the remaining mysteries or later chapters.

The narrative bible records the accepted observations and lamp relationship
with the user's approval basis. All surrounding unresolved interpretations are
retained. Approval does not make the provisional costs permanent balance.
