# Illustrated unlocks

Implement the user-approved four-image batch: Keeper's office at a fresh start,
Oil Press on first construction, completed lamp examination, and the first Old
Cistern expedition return. Preserve Dark Chronicle art and situated knowledge.

## Decisions

- A single native reveal dialog shows a Chronicle title, illustration, caption,
  and Continue. Production continues. Queue multiple records in Chronicle order;
  provide Leave remaining in Chronicle for the current queue snapshot.
- Archive the same images and captions in paginated Chronicle records. Add the
  one-time `oil-press-built` construction record. Illustration dismissal and
  Chronicle reading remain separate acknowledgements.
- Save version 4 persists validated dismissal IDs. Migrate versions 1–3 with
  earned art dismissed and any backfilled Oil Press record read, avoiding a
  popup backlog while preserving existing unread entries.
- Reveal only in the visible save-owning tab, after any return summary, and
  without stacking over the exact-resource dialog. Suppress Chronicle reading
  while a reveal is pending or the resource dialog obscures it.
- Ship four uncropped 1200×900 WebP files, each below 300 KB, through the existing
  static export and offline cache. No runtime image service or new dependency.

## Delivery order

1. Generate/review the office style anchor; match the other three illustrations.
2. Implement accomplishment records, dismissal actions, migration, and tests.
3. Integrate accessible reveals and illustrated Chronicle records.
4. Verify phone layouts, accessibility, replay, migration, failed images, and
offline caching; document prompts and evidence.

## Verification

Run `npm run check` and `npm run build`. Use an isolated browser on the local
production preview, including fresh saves and timestamp-adjusted exported saves
for away intervals. Real-device iPhone Safari/PWA validation remains separate.

---

# Phase 1 completion plan — proposed October 2, 2026

The illustrated-unlock checklist above is complete; retain its verification
history and outstanding device follow-up. This plan follows the implemented
awakening spine. It proposes further work; it does not approve new lore or
change gameplay. Tasks are tracked in `tasks/todo.md`.

## Intended experience

The Ward should grow through civic decisions, and staffing should create
tradeoffs among food, lamps, construction, scholarship and expeditions. The
player should have useful work during archaeological waits. A fresh human
playthrough should support the brief's 30–60 minute target, with an earned
awakening and understandable costs. Existing mysteries stay unresolved.

Work initially toward the lower content targets: at least 20 studies and ten
one-time queued events, using the existing ten buildings and six destinations.
There are currently thirteen studies and two queued events. Research records,
expedition returns and the ending remain separate from the queued-event count.
Count targets do not justify repetitive bonuses or mandatory interruptions.

## Ordered playable increments

1. **Construction staffing:** specify and implement Laborers, followed by
   Stoneworking. Laborers reduce eligible Coin construction costs only, within
   a content-defined combined cap. Define stacking and rounding before coding.
   Staffing must sacrifice other work; Knowledge and Relic requirements stay
   intact. Show the currently applied discount and its cap without advertising
   future roles or unlocks. Proposed role gate: the existing Smithy.
2. **A growing Ward:** author one additional ordinary household situation and
   implement its explicit provisioning/population choice. New inhabitants add
   capacity and Food upkeep. Admission remains deliberate and recovery remains
   possible. Avoid new named backstories or world history. Expand the event
   response model only as required for the first real alternative; waiting for
   supplies must not automatically make a choice or repeat a reward.
3. **Scavenging work:** define the Scavenger's concrete staffing/dispatch rule
   and implement it in the existing shared population pool. Give the assignment
   an understandable purpose, avoiding a redundant idle-worker label. Preserve
   guaranteed first findings, old active parties, one concurrent expedition,
   and idle return. Decide eligibility for supply trips versus archaeological
   trips before coding; do not silently retrofit unsupported roles into saves.
4. **First supporting-content batch:** draft and deliver two or three additional
   studies and two civic events together around the now-playable staffing
   decisions. Candidates include Apprenticed Hands, Provision Stores and a
   scholarship improvement. These are names from the brief or proposals, not
   approved effects. Favor options that change allocation or spending choices;
   distinguish them from existing Food/Oil multipliers. No new storage system
   or expedition-speed mechanic is assumed by the names.
5. **Remaining content batches:** fill the rest of the seven-study/eight-event
   shortfall in small groups, accounting for Stoneworking and the household
   already delivered. Place civic work around early growth, scholarship,
   exploration and restoration. Each item needs an authored purpose, exact
   effects, prerequisites, costs and a continuity check. Keep the required
   investigation path valid without optional discoveries. Review human play
   between batches; revise weak items before adding another layer.
6. **Balance and mobile acceptance:** play an ordinary fresh save through the
   ending, record waits/decisions/allocations, then tune the complete economy.
   Exercise short visits and absence as well as continuous play. Keep resource
   readouts/navigation persistent while expanded staffing and pending choices
   remain manageable on a phone. Verify real iPhone Safari, installation,
   offline reopening and background/resume. Deploy only when requested.

The immediate next deliverable is a concrete Laborer/Stoneworking specification
with cost examples and an additional-household draft; implement construction
staffing as the first complete, tested slice. Further content should respond to
how that slice plays.

## Verification and checkpoints

Each code slice needs targeted behavior tests, applicable save migrations,
`npm run check`, `npm run build`, and a production-browser phone-width check.
Laborer tests cover discount caps/rounding/reassignment and scarce costs;
population/event tests cover cap/upkeep/unresolved choices/one-time effects;
Scavenger tests cover reservation, legacy active parties and idle return.

After increments 1–3, rerun full reachability with optional-workforce and lean
routes. After each content batch, verify first-use prerequisites, offline event
queuing, save consistency and phone navigation; human play should assess
whether another useful decision exists during waits. After the full pass,
validate the brief's acceptance criteria using the final content and balance.
Harness time remains reachability evidence, not a claim about human enjoyment.

## Risks and open decisions

- More population or discounts can erase restoration pacing. Measure marginal
  gains and food/staffing costs; tune after adding the relevant content.
- A Scavenger role can duplicate the existing expedition mechanism. Set its
  shared-pool contract before implementing it.
- Ten events can become ten interruptions. Use restrained in-panel situations,
  explicit actions, and useful consequences; do not turn every finding into a
  choice dialog merely to raise the count.
- Additional staffing can exceed the current Ward viewport. Use focused views
  or pagination, with scrolling retained for long content and enlarged text.
- Exact role gates, discount values, study effects and event content are still
  proposals. New consequential lore requires explicit approval under AGENTS;
  routine civic detail can elaborate established life without inventing history.
- Real-device validation requires an iPhone; it must not be marked complete by
  Chromium checks. Deployment is a separate requested action.
