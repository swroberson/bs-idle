# Scavenging and civic batch — October 3, 2026

User requested Scavengers and the first civic-content batch now, deferring human
playtesting and tuning. This extends the existing Phase 1 plan.

## Staffing contract

- Scavengers unlock with the Ruined Cistern. Assignment reserves inhabitants
  for archaeological dispatch, producing no passive resources.
- Old Cistern, Barrow Field, Ruined Aqueduct and Chapel Foundations draw all
  1–3 party members from assigned Scavengers. Dispatch subtracts the assignments
  and reserves the same workers in the existing active party. No double count.
- Farmstead and Gatehouse continue using idle inhabitants. Return always leaves
  workers idle; repeated archaeological dispatch requires reassignment.
- Existing active parties and histories keep their original shape and timers.
  Version 7 adds zero Scavengers and an empty civic-response record to versions
  1–6, preserving stores, previous assignments and presentation acknowledgements.
- Guaranteed findings, rewards, timers, one party and eight-hour production cap
  retain their existing rules. Dispatch requirements expose staffing, not rewards.

## Three optional studies

| ID | Work | Prerequisites | Cost | Completed effect |
|---|---|---|---|---|
| `provision-stores` | Measure and wrap provisions beside the cistern stair | Cistern + Scrivener's House | 20 Coin / 12 Knowledge | Expedition Food ×0.8, round whole party cost up once |
| `apprenticed-hands` | Pair stone carriers at the Smithy and tally their work | Smithy + Stoneworking | 25 Coin / 20 Knowledge | Laborer Coin reduction 7.5% each, existing 20% cap; still multiplies with Stoneworking |
| `collated-records` | Collate loose observational leaves with their copies | House of Antiquities + Catalog the Relics | 20 Coin / 24 Knowledge | Scrivener Knowledge ×1.25, existing shortage factor applies |

Before completion, describe only the work and cost. After completion, show
results and exact effects. No new storage capacity, speed or background jobs.

## Two one-time civic situations

- `shared-table`, after Provision Stores and the first household: a household
  asks for provisions for a shared meal. Full meal: 30 Food → 10 Authority;
  smaller meal: 10 Food → 3 Authority. Food must be available; neither response
  changes population. Record the actual response and earned lifetime Authority.
- `spare-oil`, after Apprenticed Hands, the Oil Press and the first household:
  a household offers two spare jars of oil. Exchange 20 Food → 10 Oil, or
  purchase 12 Coin → 10 Oil.
  Neither response changes population or future production.

Each report queues once, waits without automatic selection, displays both
costs/effects, persists unresolved state and stores the selected response.
The Chronicle retains neutral local prose plus the selected response and its
transaction. No named backstory, major history, new mystery or interpretation.

## Delivery and verification

- [x] Scavenger engine/dispatch/UI and version-7 compatibility.
- [x] Three studies with capped/rounded modifiers and completed-result display.
- [x] Two explicit alternative-response events and persisted Chronicle outcomes.
- [x] Targeted tests for worker conservation, legacy active-party returns,
  one-time findings, caps/rounding, shortage/offline consistency, response
  rejection/persistence, legacy-ID restrictions and full story reachability.
- [x] `npm run check`, `npm run build`, production-browser phone controls,
  reload/import preservation, keyboard use and cached reopening.
- [x] Update main checklist, README and narrative continuity inventory.
- [x] October 3 combined production deployment (`c36ee64`), live controls,
  version-4 → version-7 save preservation and replacement offline cache.

Human playtesting, tuning and real iPhone/PWA acceptance remain deferred.
