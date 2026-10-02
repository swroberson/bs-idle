# Buried Sun

## Game vision and Phase 1 implementation brief

**Title:** Buried Sun  
**Phase 1:** The Outer Ward  
**Status:** Preproduction brief; numerical balance is provisional  
**Platform:** Mobile-first browser game, playable on desktop and installable as a PWA  
**Initial deployment target:** Vercel

## 1. What the game is intended to be

A text-led incremental idle game about maintaining a nearly abandoned settlement beneath an ancient citadel, then uncovering the impossible machinery beneath its ordinary civic life.

The player is appointed Keeper of the Outer Ward. The office combines municipal, religious, and bureaucratic duties whose original meaning has been lost. The first obligation is simple: keep the lamps burning. Feeding inhabitants, attracting households, establishing workshops, and investigating ruins gradually reveal that the Ward rests on the infrastructure of an immensely old technological civilization.

The atmosphere takes inspiration from Gene Wolfe's *The Book of the New Sun*: a world simultaneously ancient and futuristic, inherited rituals, ambiguous history, and technology understood through the language of religion and craft. This is an original setting, with original characters, institutions, and prose. It should evoke those qualities rather than reproduce Wolfe's locations, characters, or sentences.

The central pleasure is discovering that the systems the player has been managing mean something different from what the inhabitants believe. Growth should deepen the mystery, not merely increase numbers.

### Design pillars

- **Mundane responsibility becomes archaeological discovery.** Food, lamps, and ledgers lead naturally to buried conduits and sealed chambers.
- **Allocation matters.** A small population must divide its effort among survival, production, scholarship, and exploration.
- **Language preserves uncertainty.** Even advanced machinery retains local, civic, and sacred names. Reveals supply evidence without explaining everything.
- **Progress works in short visits.** The player can make useful decisions in a few minutes and return to meaningful offline gains.
- **Content and simulation remain separate.** Economy tuning and new discoveries should not require rewriting the engine.

### Longer-term direction

Later phases may extend from the Ward to the Citadel, its foundations, and machinery of much greater consequence. A possible prestige system represents passing Ages: successors inherit institutions, relics, traditions, and distorted accounts of earlier actions. A workshop might become a monastery; a worker might be remembered as a saint.

These are thematic possibilities, not Phase 1 requirements. Phase 1 must work as a complete experience without prestige or a promise of future content.

## 2. Phase 1 objective

Build a complete, playable vertical slice with roughly **30–60 minutes of engaged play** from a fresh save to the first major revelation. Returning later should also be a viable way to progress. This is a balance target to verify through playtesting, not a guaranteed duration.

The opening story is:

1. Maintain the Ward and its lamps.
2. Attract inhabitants and establish workshops.
3. Recover relics and investigate anomalous lamps.
4. Discover buried connections beneath the settlement.
5. Open a chamber and restore part of its machinery.
6. Witness the lamps burning without oil.

**Phase 1 ends with the introduction of Current.** The player understands that the lamps belong to a larger system, but the system's origin and ultimate purpose remain unresolved.

## 3. Opening experience

Start with **5 inhabitants** and modest stores of Food and Oil. Exact starting quantities should be tuned after the first playable build.

Introduce only the information needed for the next decision. Initially, the player can gather food and tend lamps. Keeping the lamps lit produces Authority, representing the legitimacy of the Keeper's office. Authority and adequate provisions enable new households to settle in the Ward.

Reveal construction, research, and expeditions gradually. Do not display the entire content catalog or a technological resource bar on the first screen.

The first useful action should be available immediately. Provide a small manual gathering action or another recovery path so poor early allocations cannot permanently stall the game. Repeated clicking must not be the dominant source of progress.

## 4. Core economy

### Resources

| Resource | Role | Visibility |
|---|---|---|
| Food | Sustains inhabitants and provisions expeditions | Opening |
| Oil | Supports ordinary lamp tending | Opening |
| Coin | Construction, trade, and selected upgrades | Early progression |
| Authority | Civic legitimacy; household and progression requirements | Opening |
| Knowledge | Investigation and research | Scholarship unlock |
| Relics | Scarce finds used in archaeological research and restoration | Exploration unlock |
| Current | Output of the restored buried system | Finale only |

Use Knowledge and Relics as spendable currencies. For Authority, distinguish current spendable stock from lifetime earned totals when a discovery requires evidence of progress. Spending a resource must not erase a milestone already reached.

### Population and jobs

Population is a count of inhabitants, not a consumable currency. Workers assigned to jobs or expeditions come from the same pool. Idle inhabitants still consume food.

| Job | Function |
|---|---|
| Forager | Produces Food; later benefits from Fields |
| Lamplighter | Consumes Oil and produces Authority |
| Laborer | Reduces construction costs within a defined cap |
| Scavenger | Becomes eligible for expeditions that recover Relics |
| Scrivener | Produces Knowledge once scholarship is unlocked |

Workers on expeditions are unavailable for ordinary jobs until they return. Phase 1 uses automatic Coin and Oil production from the corresponding buildings to avoid introducing more jobs than the opening needs.

For the initial version, construction completes immediately when purchased. Apply the Laborer discount to eligible Coin costs only, with a visible maximum discount. Keep scarce Relic and Knowledge requirements intact. All numerical rates and discounts belong in content or balance definitions.

New population arrives through one-time narrative household events, gated by sufficient Authority, provisions, and a population cap. Phase 1 does not need a separate housing system.

### Shortages and recovery

- Never allow resources to fall below zero.
- Oil shortages stop ordinary lamp output and explain why Authority production has paused.
- Food shortages pause household arrivals and reduce productive output; do not kill inhabitants or create an unrecoverable spiral in Phase 1.
- Keep food gathering available during shortages so recovery is always possible.
- Display net rates after consumption, not just gross output.

These rules must apply equally during foreground and offline simulation.

## 5. Buildings

Target **10 buildings**, unlocked in stages. Ordinary economic buildings can have repeatable levels with increasing costs. Story structures are unique installations with explicit upgrade stages.

| Building | Purpose |
|---|---|
| Fields | Improves Food production |
| Oil Press | Produces Oil |
| Market Stall | Produces Coin |
| Lamp House | Improves lamp tending and Authority output |
| Smithy | Unlocks tool improvements and construction upgrades |
| Scrivener's House | Enables and improves Knowledge production |
| Ruined Cistern | Opens the expedition system |
| House of Antiquities | Enables relic cataloging and archaeological investigations |
| Subterranean Works | Enables excavation and access beneath the chapel |
| The Buried Engine | Final restoration structure; produces Current after awakening |

Every building card should show its level or stage, effect, cost, and unmet requirements. Descriptions can imply an unfamiliar origin before mechanics reveal it.

Avoid overtly technological names early. A later name such as “Luminary Junction” is optional and should appear only when the discovery justifies it.

## 6. Research and discoveries

Target **20–30 one-time investigations and upgrades**. Keep the progression readable, with a few useful choices around a clear story spine.

### Ordinary improvements

Examples: Crop Rotation, Better Wicks, Iron Tools, Ledger Keeping, Stoneworking, Improved Presses, Provision Stores, Apprenticed Hands.

These improve production, reduce defined costs, or unlock everyday buildings. Their numbers are provisional.

### Archaeological investigations

Examples: Examine the Old Lamps, Survey the Foundations, Catalog the Relics, Study the Black Metal, Trace the Buried Conduits, Open the Sealed Chamber.

These require relevant buildings, findings, and earlier research as well as resources. Important discoveries should follow recognizable actions, not appear solely because a counter silently crossed a threshold.

### Restoration sequence

The required story chain is:

**Examine the Old Lamps → Survey the Foundations → Trace the Buried Conduits → Open the Sealed Chamber → Study the Buried Engine → Restore the Conduit → Awaken the Junction.**

Other research and expedition discoveries can supply prerequisites along this chain. The final restoration cost should take approximately 10–20 minutes to accumulate at the expected late-game production level, subject to playtesting.

Keep completed research accessible so the player can reread discoveries. Show exact mechanical effects alongside atmospheric prose. Mystery should come from the setting, not unexplained arithmetic.

## 7. Narrative events

Target **10–15 short, one-time events**. Each event has a stable ID, conditions, text, choices, and explicit effects. Persist both triggered events and unresolved choices.

Events introduce households, systems, findings, and the finale. Avoid random events that remove resources or repeatedly interrupt play in this phase.

### Example: A Stranger at the Gate

> A woman and two children arrived before dawn. She says that the western village has been abandoned and asks permission to remain within the Ward.
>
> The Keeper's register has not recorded a new household in eleven years.

**Admit them:** population increases by three, within the cap. Give the player a visible provisioning requirement before admission.

### Example: The Lamplighter's Complaint

> Orso reports that the third lamp consumes no oil.
>
> He attempted to fill its reservoir twice before discovering that it possesses no reservoir at all.

**Examine the lamp:** unlocks the first lamp investigation.

Use these as draft text. The writing should stay restrained, concrete, and occasionally strange. Do not imitate Wolfe's prose line by line or explain every anomaly immediately.

Queue events rather than stacking dialogs. Resource production continues while a choice is pending. An event whose eligibility was reached offline can await the player's response; simulation must not make narrative choices for them.

## 8. Expeditions

Use a list of destinations rather than a map. Assign **1–3 available inhabitants**, pay a displayed provisioning cost, and begin a real-time expedition. Start with one concurrent expedition.

| Destination | Intended role |
|---|---|
| Old Cistern | Introduces scavenging and the first Relics |
| Abandoned Farmstead | Supplies Food and Coin |
| Collapsed Gatehouse | Supplies salvage and evidence of strange materials |
| Barrow Field | Introduces a historical contradiction or unusual relic |
| Ruined Aqueduct | Reveals a connection to buried infrastructure |
| Foundations Beneath the Chapel | Supplies the discovery needed to reach the chamber |

An early expedition can last about **3 minutes** with two workers. Later durations and costs should fit the overall 30–60 minute target.

Use guaranteed first-time story discoveries so progression never depends on a rare drop. Repeat expeditions can supply ordinary resources. Phase 1 does not need combat, equipment, injury, worker death, or procedural destinations.

Complete expeditions automatically when their timers expire, return workers to the available pool, and record rewards in a log. They also complete offline. Do not automatically send workers on another expedition.

## 9. Finale: The Awakening

After the chamber has been opened and the conduit restored, offer a deliberate **Awaken the Junction** action. It triggers a brief staged presentation and the ending event.

> There came a sound beneath the Ward, too deep to be heard so much as felt.
>
> One by one, the lamps along the Processional Way became white.
>
> Orso ran to the Lamp House. Every vessel was empty.
>
> Still the lamps burned.

At this point:

- Reveal Current in the resource display.
- Enable a modest Current output from the Buried Engine.
- Remove Oil consumption from restored lamp tending while preserving Authority output.
- Record Phase 1 completion and preserve the event for rereading.
- Allow continued management, with a clear indication that the available story has ended.

Oil remains available for any other defined uses. Current does not need an expanded technology tree in this phase. The awakening must survive reloads and never replay its rewards.

## 10. Interface and visual direction

Build for iPhone-sized screens first. Use a restrained, text-led presentation with readable typography, muted colors, generous touch targets, and a faint sense of civic records, weathered stone, and fading light.

Suggested sections: **Ward**, **Works**, **Studies**, **Expeditions**, and **Chronicle**. Settings and save controls can sit in a separate menu. Hide sections until their systems unlock.

Keep these facts easy to find:

- Current resources and net production rates.
- Population, assigned workers, expedition workers, and available workers.
- Unread records and unresolved situations, signaled on the relevant navigation tab.
- Purchase costs and the concrete effects of buildings or research.
- Expedition timers, pending events, and recent discoveries.

Avoid dense desktop tables, hover-only explanations, or tiny assignment buttons. Support keyboard navigation, readable contrast, reduced motion, and status cues that do not depend on color alone. Illustration is optional; no art pipeline is required for the first build.

The terminal should fit within the viewport during ordinary play, keeping stores and navigation visible. Prefer focused views and pagination to growing lists. Preserve scrolling as an accessibility fallback for enlarged text, short landscape screens, and unusually long content. Chronicle badges count unread entries and persist across reloads; viewing an entry acknowledges only that entry. Other sections use the same badge language for situations needing attention, such as unresolved choices or empty stores. Do not flag every affordable purchase or suggest the next action. Mechanical costs, effects and unavailable requirements remain explicit; players discover the path themselves.

## 11. Technical architecture

Use **Next.js, React, TypeScript, and Tailwind**. Keep all game state and simulation in the browser. Deploy the initial app to Vercel.

No backend, authentication, database, API, multiplayer, or server simulation is required. PWA installation and offline app-shell support belong in Phase 1. Browser background execution is not relied upon; elapsed-time simulation provides idle progress.

Suggested source layout, under `src/` if the app uses it:

```text
app/
components/
  ResourceBar.tsx
  WorkerPanel.tsx
  BuildingCard.tsx
  ResearchPanel.tsx
  ExpeditionPanel.tsx
  EventDialog.tsx
game/
  types.ts
  simulation.ts
  actions.ts
  save.ts
  modifiers.ts
  requirements.ts
content/
  balance.ts
  buildings.ts
  jobs.ts
  research.ts
  expeditions.ts
  events.ts
```

### Engine requirements

- Represent game changes through explicit, validated actions.
- Use stable content IDs independent of display names.
- Keep simulation independent of React, the DOM, and browser storage.
- Define production, consumption, costs, prerequisites, modifiers, and rewards in data.
- Define the order for additive and multiplicative modifiers in one place.
- Use elapsed time rather than assuming every browser timer fires on schedule.
- Keep resources finite, nonnegative, and bounded where explicit capacities apply.
- Prevent repeated events, rewards, purchases, and expedition completions.
- Avoid simultaneous tabs overwriting one another's progress; a simple single-active-tab policy is sufficient.

## 12. Saves and offline progress

Use a **versioned JSON save in localStorage** initially. Include resources, population, worker assignments, building levels, completed research, discoveries, triggered and pending events, active expeditions, chronicle entries, settings, completion state, and a simulation timestamp.

Persist regularly, after meaningful actions, and when the page becomes hidden where possible. Treat visibility changes as opportunities to reconcile elapsed time. Avoid counting the same interval twice after backgrounding, reloads, or save imports.

### Offline simulation

Set an initial **8-hour production cap**. Use the same economy and shortage rules as foreground play; do not simply multiply the starting net rate if a resource will run out or an expedition will complete during the interval.

Handle relevant time boundaries, including resource depletion and expedition completion. Bounded simulation steps or interval splitting are both acceptable if tested for consistency and performance. Negative elapsed time earns no progress.

Expedition timers follow wall-clock elapsed time even when the production cap is reached. A completed expedition returns its workers and grants its reward once. Returned workers remain idle unless the player assigns them.

Show a return summary with actual time away, simulated production time when capped, net resource changes, completed expeditions, and pending discoveries. Do not automatically choose event responses.

### Save controls

- Export a JSON save file, with a copyable-text fallback suitable for phones.
- Import a save after validating its version, shape, IDs, and numeric values.
- Reject corrupt or unsupported saves with a useful explanation and preserve the current save.
- Provide a confirmed reset action and a path to recovery from a damaged local save.

Saves are specific to the device and browser storage context. Export/import is the initial transfer and backup mechanism; cloud saves are outside Phase 1.

## 13. Implementation milestones

Complete each milestone as a working increment. Placeholder balance is acceptable early; the final build needs a verified path through the full story.

1. **App and persistence:** mobile navigation, typed initial state, versioned saves, import/export/reset, and PWA shell.
2. **Economy:** elapsed-time simulation, Food and Oil consumption, jobs, construction, modifiers, and recoverable shortages.
3. **Opening progression:** initial buildings, population events, progressive interface reveals, and a playable first few minutes.
4. **Research:** data-driven prerequisites, purchases, modifiers, unlocks, and completed discovery records.
5. **Events:** queued one-time events, explicit choices, household arrivals, and a persistent chronicle.
6. **Expeditions:** worker reservation, costs, timers, rewards, guaranteed discoveries, and automatic return.
7. **Offline reconciliation:** capped production, shortage boundaries, expedition completion, and return summaries.
8. **Full content pass:** approximately 10 buildings, 20–30 research items, 10–15 events, and six destinations.
9. **Finale:** chamber-to-junction progression, Current reveal, changed lamp consumption, and a persistent completion state.
10. **Balance and deployment:** fresh-save playthroughs, mobile usability checks, PWA/offline checks, and Vercel deployment.

## 14. Acceptance criteria

Phase 1 is ready when:

- A fresh save reaches the awakening through ordinary play, without debug grants or rare-drop dependence.
- Playtesting supports the approximate 30–60 minute engaged-play target and reveals no long waits without a useful decision.
- Worker allocation creates meaningful tradeoffs without allowing permanent economic failure.
- All costs, effects, shortages, and locked requirements are understandable on a phone.
- Current remains hidden until the finale, and restored lamps stop consuming Oil afterward.
- Reloading preserves progress, unresolved events, expedition state, and the ending.
- Offline and foreground simulations agree for equivalent intervals within defined numerical tolerance, including shortages and expedition returns.
- The 8-hour production cap works, expedition completion is applied once, and background/resume does not duplicate gains.
- Save export/import round-trips correctly; malformed saves cannot overwrite a valid game.
- The deployed game works in iPhone Safari and as a home-screen PWA; after initial caching, its app shell can open without a network connection.
- Type checking, production build, and targeted engine tests pass.

Prioritize tests for time reconciliation, resource depletion, worker accounting, one-time rewards, save validation, and the finale progression. Use a development-only simulation harness to check reachability and rough pacing, followed by actual manual play on mobile.

## 15. Explicitly outside Phase 1

- Prestige and passing Ages.
- Multiple settlements or playable Citadel interiors.
- Combat, character stats, equipment, and elaborate inventories.
- Factions, diplomacy, procedural content, and randomized narrative branches.
- Accounts, cloud saves, leaderboards, multiplayer, and payments.
- A large art pipeline, animated world map, or RPG presentation.
- A substantial use for Current beyond the ending demonstration.

The first release succeeds if managing the Ward is enjoyable and the lamps burning without oil feels like an earned discovery. Expand the world only after that experience works.
