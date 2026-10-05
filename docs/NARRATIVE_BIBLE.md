# Buried Sun: Narrative Bible

**Edition:** 1.8 — October 4, 2026

**Audience:** authors and agents; contains end-of-story spoilers  
**Status:** approved story foundations, provisional chapter outline, and an audit of existing content

This is the shared narrative authority for Buried Sun. Read it before writing
story text, descriptions, lore, or illustration prompts. Its purpose is to make
independent contributions belong to the same story without filling every gap
with an invented explanation.

The full story follows successive Keepers restoring an ancient vessel so their
civilization can leave a dying solar system. The first Keeper begins with five
inhabitants and a duty to keep the lamps burning. Restoration takes generations;
the people who make a future possible will not necessarily live to inhabit it.
The story ends at departure, not arrival.

## 1. How to use this document

### Status and authority

| Label | Meaning | Authoring rule |
|---|---|---|
| **CANON** | Approved author-level truth or retained Phase 1 story requirement. | Preserve unless the user explicitly revises it. It is not automatically known to characters. |
| **PROPOSAL** | A suggested structure, interpretation, or future beat. | May be developed as a clearly labeled proposal; do not present it as settled history or ship it as a major revelation without approval. |
| **BELIEF** | What a character, institution, or record claims. | Attribute the claim. It may be incomplete; do not assume it is false either. |
| **EXISTING** | What current repository prose or behavior establishes on screen. | Preserve continuity when extending it, but do not promote its unexplained implications to canon. Flag revisions explicitly. |
| **MYSTERY** | Uncertainty is part of the intended experience; no eventual answer is promised or required. The authors need not select a hidden solution. | Preserve observations and room for interpretation. Do not turn it into a solved clue just to complete the lore. |
| **OPEN** | An author decision has not been made about material that may need definition for future writing. | Resolve only what continuity or the approved plot requires. Do not supply an answer implicitly through prose, art, terminology, or prerequisites. |

Distinguish a plot fact that needs an author decision, a known truth withheld
from characters, and an enduring mystery for which no final explanation is
needed. These are all legitimate states. An unexplained observation is not
automatically unfinished writing, and preserving ambiguity does not require
inventing a private answer first. An actual contradiction in established facts
still needs attention; lack of an explanation does not.

The user's explicit narrative decisions establish canon. This bible records
them; [the Phase 1 design brief](GAME_DESIGN_PHASE_1.md) governs the retained
opening arc and game requirements; [AGENTS.md](../AGENTS.md) governs scope and
presentation. Code establishes what is currently implemented, not what must
remain true forever. If these disagree, record the discrepancy and seek a
decision where necessary rather than inventing a reconciliation.

This edition preserves the existing narrative spine while treating supporting
details as revisable. Listing a source detail below is not blanket approval of
its implied explanation. The chapter outline is provisional even though the
story's destination is approved.

### Source map and implementation boundary

- [Chronicle](../src/content/chronicle.ts): opening and persistent narrative records.
- [Events](../src/content/events.ts): household arrivals, lamp complaint and civic transactions.
- [Research](../src/content/research.ts): seventeen implemented investigations/improvements; several repeat Chronicle text.
- [Expeditions](../src/content/expeditions.ts): six destinations and their record references.
- [Buildings](../src/content/buildings.ts), [jobs](../src/content/jobs.ts), and [resources](../src/content/resources.ts): descriptions and local terminology.
- [Ward scene](../src/components/WardPanel.tsx): the road toward the Citadel; [app metadata](../src/app/layout.tsx): public premise.
- [Initial state](../src/game/state.ts), [event progression](../src/game/progression.ts), [actions](../src/game/actions.ts), [requirements](../src/game/requirements.ts), and [expedition completion](../src/game/expeditions.ts): actual order and triggers.

**EXISTING:** the playable Outer Ward now reaches the deliberate
`awaken-junction` action, recorded as `junction-awakened`. Current and Oil-free
restored lamp tending follow activation, while management continues. There are
currently ten buildings, seventeen research entries, five queued-choice events,
six expedition destinations, and thirty-five Chronicle entries. The remaining
Phase 1 content-count targets, playtesting, and real-device checks are separate
from this implemented story endpoint.

Document references such as `C01`, `CL01`, and `Q01` below are editorial IDs, not
save IDs or runtime content IDs. Later chapters do not authorize new gameplay,
prestige, aging, character death, Citadel exploration, or save migrations in
Phase 1. The bible is an authoring reference, not a player-facing chapter menu
or objective list; do not bundle its spoilers into the app or public metadata.

## 2. Approved foundations and world history

### Author-level truths

| ID | CANON | Consequence for writing |
|---|---|---|
| C01 | The Citadel is an ancient vessel that brought the inhabitants' ancestors to this solar system. | It was capable of a prior interstellar passage. Its makers, origin, propulsion, and original mission are not yet decided. |
| C02 | Generations of settlement and adaptation obscured its nature. People understand inherited structures through architecture, craft, civic duties, and ritual. | Do not give early inhabitants modern spacecraft terminology or assume a secret group retained the truth. |
| C03 | The sun is approaching its end. At the opening, inhabitants perceive worsening conditions without understanding the stellar cause. | Decline is real, but its particular symptoms, timetable, and scientific mechanism remain open. Avoid equating a dying sun with a necessarily cooling or dimming star. |
| C04 | The restored Citadel can carry civilization to another solar system. It cannot restore this solar system's habitability. | The escape is the Citadel itself travelling, not a portal or a fleet launched from a stationary Citadel. Do not introduce a way to repair the sun. |
| C05 | Renewal is worthwhile and costly. The central cost is sustaining an undertaking whose future extends beyond individual lifetimes. | The larger reveal should not negate the value of saving the Ward by declaring all restoration a mistake. Specific additional sacrifices are not approved. |
| C06 | Restoration spans successive Keepers. The story ends with departure; arrival is beyond its bounds. | No immortal opening Keeper, confirmed arrival epilogue, or playable voyage is established. The succession method and exact generations remain open. |
| C07 | The opening Keeper inherits a modest office combining civic, religious, and bureaucratic duties. Maintaining the Ward and its lamps leads to archaeological investigation. | Begin with concrete responsibility, not a chosen savior, admiral, or person who knows the vessel's mission. |
| C08 | The Outer Ward arc ends with a deliberate awakening, lamps burning without Oil, and the introduction of Current. | The finale proves a local connection to a larger system; it does not reveal the vessel, ancestral voyage, or stellar diagnosis. |
| C09 | Prose and illustrations respect situated knowledge. | Author truth is not permission for omniscient exposition, spacecraft imagery, or explanatory cutaways. |
| C10 | Mystery persists throughout the story and beyond departure. Not every eerie detail has an explanation, assigned meaning, or eventual payoff. | Leave room for players to imagine what is true and untrue. Authors need not decide every answer, and agents must not manufacture closure for the sake of completeness. |

### Mystery as a lasting part of the world

The story can resolve the Keeper's undertaking while leaving much of the world
unresolved. Discovering that the Citadel can travel does not explain every room,
custom, object, disappearance, or strange observation within it. Departure is a
conclusion to the undertaking, not a final interpretation of the setting.

Use three different treatments as appropriate:

- **Necessary discoveries:** establish enough to support the approved actions
  and consequences, such as restoring the lamps and eventually departing. A
  working understanding need not be a complete technical or historical account.
- **Withheld truths:** where an answer is established for continuity, keep it
  private unless an approved discovery earns its disclosure. An answer in this
  bible is not a promise that the player will ever receive it.
- **Enduring mysteries and atmosphere:** preserve suggestive observations,
  incomplete accounts, ordinary human opacity, and strangeness without requiring
  a cause, message, symbolic meaning, or future explanation. It is acceptable
  for authors as well as players to be uncertain.

Give the player concrete things to observe and space to interpret them. Do not
append explanations of what a detail "really means," enumerate every possible
theory in the text, or validate one through an authoritative voice merely to
close the question. Player speculation may remain unconfirmed or mistaken.
Different interpretations can fit the same evidence without the narrative
choosing between them.

Consistency means remembering what was seen and what was claimed, not making
every account agree or reducing every anomaly to one master explanation. An
ambiguous account may remain ambiguous to the authors where no plot dependency
requires a settled truth. Keep established observations stable, attribute
claims, and preserve clear costs and effects. Do not use mystery to disguise
accidental continuity errors or unclear gameplay.

The setting, people, institutions, and prose are original. The influence of
Gene Wolfe's work is atmospheric and structural, not a source of names, plot
answers, quotations, or imported cosmology.

### Relative historical chronology

| Order | Status | What may be asserted | What is not established |
|---|---|---|---|
| Before the prior voyage | OPEN | The vessel had an origin. | Builders, home system, mission, age, earlier passengers, and reason for leaving. |
| Ancestral arrival | CANON — C01 | The vessel brought the inhabitants' ancestors to this system. | Arrival date, landing conditions, whether damage occurred, and whether settlement was intended to be permanent. |
| Settlement and adaptation | CANON — C02 | Generations inhabited and adapted the structure; its travelling nature became obscured. | A single collapse, deliberate suppression, universal amnesia, or a particular lost language. |
| Before the opening | CANON / EXISTING | The Ward is nearly abandoned; the office survives. Existing prose says no new household was recorded for eleven years. | Why particular households left, the identity or fate of the previous Keeper, and the scale of decline elsewhere. The eleven-year detail remains revisable. |
| Opening Keeper | CANON — C07–C08 | Civic maintenance leads through investigation to the local awakening. | An exact calendar, the Keeper's age, and how long the fiction spans. The 30–60 minute play target is not an in-world duration. |
| Restoration across generations | CANON — C05–C06 | Successors continue work beyond the founders' lifetimes. | Generation count, succession dates, blood relationships, and which chapter contains each handover. |
| Departure | CANON — C04, C06 | The restored Citadel departs toward another solar system. | Exact destination, journey duration, travel mechanism, passengers' fate, and arrival. |

### Duties, systems, and beliefs

- **CANON:** keeping ordinary lamps lit supports the Keeper's civic standing.
  Authority represents legitimacy, not a supernatural energy source.
- **CANON:** the lamp investigation leads to buried connections and restoration.
  This establishes a relationship between civic maintenance and inherited
  machinery, not a technical explanation for every surviving ritual.
- **EXISTING:** household registers, an observation ledger, keys, and custodial
  work organize the Ward. Their original vessel-era equivalents are **OPEN**.
  Do not declare the register a passenger manifest or the Keeper a hereditary
  captain without approval.
- **BELIEF:** the Citadel is understood as an enduring inhabited place. Its
  architecture and local names are meaningful descriptions within that worldview,
  not evidence that inhabitants are foolish or dishonest.
- **BELIEF:** Nera reports that the western village has been abandoned. The
  report does not establish its cause or connect it to the farmstead expedition.
- **OPEN:** the name "Buried Sun" has no approved literal referent. It is not yet
  canonically a reactor, captive star, artificial intelligence, deity, or engine.

## 3. Provisional chapter outline

**PROPOSAL throughout this section:** the six functions below organize the
approved arc. Only the retained Outer Ward spine and final departure are fixed;
the titles after Chapter 1, evidence, boundaries, and generational transitions
need approval before implementation. No new named people, factions, or technical
systems are established here.

### Chapter 1 — The Outer Ward

- **Opening:** a nearly abandoned Ward, five inhabitants, and an inherited duty
  to keep the lamps burning.
- **Human stakes:** feeding people, sustaining ordinary work, admitting a
  household, and making the office useful to those living around it.
- **Player-caused change:** establish production and record-keeping, investigate
  the anomalous lamp, recover material evidence, and restore a local connection.
- **Discovery:** ordinary civic fixtures belong to machinery older than the
  inhabitants' understanding of them.
- **Ending:** the deliberate awakening changes how the Ward's lamps operate.
  Current appears; continuing management remains possible.
- **Carried forward:** the system's extent and purpose, the source of its power,
  and the meaning of the inherited duty. No vessel or dying-sun revelation.

### Chapter 2 — The Connected Citadel

- **Opening:** local restoration has demonstrated that the Ward is connected
  to something larger, but has not explained it.
- **Human stakes:** extending dependable services while remaining responsible
  for people who already rely on the restored works.
- **Player-caused change:** proposed investigations connect previously isolated
  observations and make further inhabited systems usable.
- **Discovery:** the connections are organized rather than coincidental; what
  appear to be separate civic structures have related functions.
- **Ending:** sufficient evidence exists to investigate the Citadel's earlier
  history. Exact evidence and the people preserving it remain open.
- **Carried forward:** what this arrangement was designed to do and why its
  inhabitants no longer understand it. Connectivity alone does not prove travel.

### Chapter 3 — The First Passage

- **Opening:** the shared system raises questions that local tradition cannot
  fully answer.
- **Human stakes:** revising an account of home on which people have built
  identities and duties, while continuing to maintain that home.
- **Player-caused change:** recover and compare independent evidence of a prior
  passage; do not resolve the chapter through an unearned explanatory monologue.
- **Discovery:** ancestors arrived aboard the Citadel. The inhabited structure
  is a vessel; arrival here was an event, not the beginning of all history.
- **Ending:** the possibility of another departure becomes thinkable. Past
  travel does not yet prove that travel is possible in its present condition.
- **Carried forward:** what renewed travel requires, why it might be necessary,
  and what could be reached. The precise original mission can remain unanswered.

### Chapter 4 — The Failing Sun

- **Opening:** a vessel is known to exist; worsening conditions still lack a
  sufficient explanation.
- **Human stakes:** choosing a long undertaking while people have immediate
  needs and may not live to see its result.
- **Player-caused change:** support observations and comparisons that distinguish
  a systemic stellar decline from local failures; establish the need to depart.
- **Discovery:** restoring inhabited systems cannot save the solar system.
  Exact instruments, evidence, timescale, and destination research are open.
- **Ending:** departure becomes the purpose of restoration, rather than merely
  a recovered historical possibility.
- **Carried forward:** whether the work can be sustained across lifetimes and
  how successors can verify what they inherit.

### Chapter 5 — The Inheritance

- **Opening:** the undertaking is larger than any individual Keeper's working
  life. Earlier chapters may already include succession; it is not reserved here.
- **Human stakes:** leaving people capable of continuing the work, alongside
  records and functioning institutions that do not depend on one person's memory.
- **Player-caused change:** successive Keepers advance restoration and preserve
  the means to test inherited accounts. Specific projects remain open.
- **Discovery:** proposed historical comparisons expose differences between
  what happened and what later people remember. Each distortion requires its
  own approved underlying fact and transmission history.
- **Ending:** the inherited undertaking reaches readiness for final departure
  preparations, with the cost of lifetimes already spent legible to the player.
- **Carried forward:** what must be completed before leaving, what the community
  can carry, and how it recognizes work whose authors are gone. No capacity
  shortage, forced abandonment, or institutional betrayal is assumed.

### Chapter 6 — Departure

- **Opening:** accumulated restoration makes departure attainable rather than
  merely imaginable. The final outstanding work is not yet specified.
- **Human stakes:** acting on an inherited responsibility whose destination the
  departed generations will never see.
- **Player-caused change:** complete the necessary preparations and cause the
  Citadel to leave; the ending must follow the work, not an unrelated rescue.
- **Discovery:** the structure can travel again. Departure fulfills the approved
  promise without explaining every remnant of its original history.
- **Ending:** the Citadel departs toward another solar system. No arrival scene
  or confirmation of the descendants' eventual fate.
- **Carried forward beyond the story:** the voyage and the future made possible.
  Exact final imagery remains open and subject to the art restrictions.

### Knowledge and reveal limits

Players may suspect truths before the text confirms them. These limits govern
what content establishes, not what a perceptive player may infer. Character
knowledge is local: a Keeper's discovery does not mean every inhabitant learns
it immediately. Reading a Chronicle entry is a UI acknowledgement, not a new
historical event.

| Stage | Author knowledge | Character evidence or understanding | What player-facing content may confirm |
|---|---|---|---|
| Opening | C01–C09 | Local duties and worsening conditions; no stellar diagnosis. Specific symptoms are still open. | Small civic responsibilities and an inherited environment. |
| Lamp through survey | C01–C09 | An unusual lamp, material matches, and an older opening under the chapel. | A physically investigable connection; no account of the whole Citadel. |
| Phase 1 awakening | C01–C09 | Restored lamps function without Oil; local machinery responds. | Current and a working connection to a larger system, whose purpose remains unresolved. |
| Proposed Chapter 2 | C01–C09 | Corroborated connections across inhabited systems. | Organized infrastructure, not yet the ancestral voyage. |
| Proposed Chapter 3 | C01–C09 | Evidence of prior arrival. | The Citadel is the vessel that brought the ancestors. |
| Proposed Chapter 4 | C01–C09 | Evidence supports the stellar diagnosis and the limits of restoration. | Leaving is necessary; repairing this solar system is not an option. |
| Proposed Chapters 5–6 | C01–C09; later details only if approved | Knowledge must be transmitted or recovered by successors. | Generational restoration and eventual departure; no arrival outcome. |

**Generational continuity rule:** the established chronology does not change
when a later record changes. When deliberately distorting a known fact, record
that fact, who knew it, how the account survived, and what changed. Decide only
as needed whether a successor can detect the difference. For genuinely
unsettled history, track the surviving claims and their sources without
inventing a definitive original account. No particular forgotten fact, saint,
dynasty, or rewritten institutional history has been approved yet.

## 4. The Outer Ward in detail

### Dramatic structure and invariants

The arc moves from maintenance, to observation, to comparison, to intervention.
Food, Oil, and a household give the Keeper reasons to care before the discovery
becomes larger than the job. Scholarship and expeditions provide evidence;
restoration produces an observable change. The opening remains worthwhile on
its own rather than serving only as a prologue to the vessel reveal.

- Keep the required chain: **Examine the Old Lamps → Survey the Foundations →
  Trace the Buried Conduits → Open the Sealed Chamber → Study the Buried Engine →
  Restore the Conduit → Awaken the Junction.**
- Cataloging and expeditions supply evidence along this chain. Optional economic
  improvements must not silently become mandatory narrative prerequisites.
- Costs, effects, and unavailable requirements remain explicit; the uncertainty
  concerns the world, not the rules. Do not expose this outline as objectives.
- Events wait for a response. Completed expeditions can record findings offline,
  but elapsed time never authorizes a story choice or awakening.
- One-time discoveries stay one-time on repeat expeditions and after reloads.
  Repeated resource collection is not another first encounter.

### Implemented beats and causal links

Content IDs below are current runtime IDs. Numeric gates are included only
where useful to explain order; the source definitions remain authoritative for
balance. A trigger is a game condition, not evidence of an occult meaning in a
number.

| Beat and status | Trigger and record | Narrative change and permitted interpretation |
|---|---|---|
| Appointment — EXISTING, retained spine | Fresh state includes Chronicle `appointment`; five inhabitants. | A register, unknown-lock keys, and the written duty establish an inherited, modest office. Neither the keys nor the register explains the vessel. |
| Establish food and lamp work — EXISTING, retained spine | Assign `forager` and `lamplighter`; construct `fields` and `oil-press` as requirements allow. First Oil Press construction adds Chronicle `oil-press-built` and its illustration. | The Keeper meets material needs and earns civic standing. Oil collects in ordinary vessels; warm soil and the old press remain observations, not proof of a named system. |
| Admit the household — EXISTING, retained spine | Event `household` queues with Fields and 12 lifetime Authority. Player admission requires provisions/Authority and population room; it adds Chronicle `household` and three inhabitants. | Nera and two children join; the register goes from five to eight names. Her seeds connect ordinary human knowledge to cultivation. No family history or cause of the village's abandonment is established. |
| Hear the complaint — EXISTING, retained spine | Event `lamp-complaint` requires Oil Press, 35 lifetime Authority, and resolved Chronicle `household` in `queueEvents`. Authorization adds Chronicle `lamp-complaint`. | Orso reports the third lamp's missing reservoir. It warrants examination, not a conclusion about travel. His unexplained reluctance remains open. |
| Examine the lamp — EXISTING, retained spine | Research `examine-old-lamps` follows Chronicle `lamp-complaint`; adds `lamp-examination`. | No wick, a cold white lining, a shadow, and a seam into the chapel wall give concrete observations. The source of any pre-awakening illumination is not established. |
| Separate observations — EXISTING | Research `ledger-keeping` follows examination; adds Chronicle `ledger-keeping` and unlocks economic/scholarly development. | Measurement becomes repeatable work. The crossed-out question mark has no approved hidden message. |
| Establish scholarship and access — EXISTING | `market-stall` and `scrivener-house` follow their research/building requirements. `ruined-cistern` requires Scrivener's House and lamp examination. | Trade supports dedicated work, and clearing the stair makes recovery possible. An unnamed scrivener already appears in ledger prose; a workforce unlock does not prove nobody could write earlier. |
| Improve ordinary work — EXISTING, optional | `crop-rotation` and `better-wicks` require Scrivener's House, produce their same-named Chronicle records, and can occur in either order. | Nera's notes and Orso's records anchor improvements in lived work. Do not require the roots or wicks records to understand the main mystery. |
| Recover cistern fragments — EXISTING, required | Send inhabitants to `old-cistern` after clearing `ruined-cistern`; first return adds `cistern-find`. | Pale fragments and a groove matching the lamp seam create a basis for comparison. No bodily, alien, or specific electrical explanation is established. |
| Visit the farmstead — EXISTING, optional | `abandoned-farmstead` requires the cistern building and completed `old-cistern`; first return adds `farmstead-find`. | Intact stores, coins, a doorless house, and inward-facing chairs are observations. The chairs' cause and the inhabitants' fate are unknown, and this is not established as Nera's home. |
| Catalog recovered objects — EXISTING, required | Build `antiquities-house` after `old-cistern`; research `catalog-relics` requires both and adds `relic-catalog`. | Matching lining and six channels strengthen the physical connection. The scrivener's refusal to call them veins does not establish living machinery. |
| Survey foundations — EXISTING, continuation point | Research `survey-foundations` requires `examine-old-lamps`, `catalog-relics`, and `antiquities-house`; adds `foundation-survey`. | The chapel crosses an older opening; the seam continues through it and sockets face down. There is a reason to trace the connection farther. The chamber has not yet been opened. |

The early implemented sequence guarantees the household record before the lamp
complaint, and ledger work before the cistern expedition. After the cistern
return, the farmstead and archaeological catalog are separate available paths.
Do not write either as depending on the other. Research discovery text is
duplicated in Chronicle entries; a future approved wording revision must update
both representations consistently.

### Ordinary construction and another household — October 2, 2026

The user requested Laborers and Stoneworking, followed by another household
before further catalog expansion. Stoneworking and the household remain optional civic developments in Chapter 1. The October 4 revision makes Laborer crews part of ordinary construction from initial Works, without adding a new narrative prerequisite or changing the archaeological spine.

- `laborer` now becomes assignable alongside initial Works (October 4 crew revision), replacing the earlier Smithy gate and capped Coin discount. Its work remains preparing stone and carrying materials. Buildings and conduit restoration record their established results only after the crew completes the work. Stoneworking keeps its Coin saving; Apprenticed Hands improves crew speed. These are game rules, not evidence of an unfamiliar system. No new building, worker ancestry, history or mystery interpretation is added.
- `stoneworking` requires the Smithy and Scrivener's House. Its matching study
  and Chronicle text records dressing chipped stone and setting reusable pieces
  aside. It does not interpret inherited materials or anomalous architecture.
- Event/Chronicle `repair-household` follows completed Stoneworking, expanded
  Fields and the first household record, with standing, provisions and register
  capacity gates. Two unnamed people arrive with bedding, a cooking pot and
  worn tools, asking for a room and permission to repair its threshold. Admission
  adds two idle inhabitants; the record describes ordinary masonry and a fire.
  Their previous home, relationships, ages and histories are unspecified. The
  event does not depend on an expedition or introduce a revelation.

These incidental details elaborate established Ward life. They do not change
clue meanings, the retained story chronology, author-level truths or reveal
limits. The first household still precedes Orso's complaint; the later household
may precede or follow optional expeditions and is unnecessary for the awakening.

### Scavenging and civic work — October 3, 2026

The user requested Scavengers and the first civic batch before human playtesting
and tuning. These optional Chapter 1 developments elaborate established Ward
life and do not change the archaeological evidence or reveal sequence. Exact
mechanics are recorded in [the batch specification](../tasks/scavenging-civic.md).

- `scavenger` unlocks when the cistern stair is cleared. Assignment prepares
  inhabitants for archaeological dispatch; it establishes no guild, history,
  ancestry or expertise beyond the work shown. Supply/salvage parties retain
  ordinary idle inhabitants, and all returned workers are idle.
- `provision-stores` measures and wraps food at the existing stair. Its record
  concerns missing handfuls and a better tally, not a new storage institution.
- `apprenticed-hands` pairs existing workers at the stone bench; apprenticeship
  means ordinary shared work. It establishes no school or named apprentice.
- `collated-records` bundles observational leaves and copies, preserving their
  original hands. It gives no new interpretation of relics or old measurements.
- `shared-table` follows Provision Stores and the first household record. An
  unnamed household borrows a table and bowls for a shared meal beneath the
  arch. Both responses issue Food and support civic standing. The record stays
  neutral about the size of the meal; the selected transaction is retained
  separately. No feast tradition, new arrival or named family is established.
- `spare-oil` follows Apprenticed Hands, Oil Press and the first household
  record. An unnamed household exchanges spare ordinary lamp oil for Food or
  Coin. Two jars are measured into the Ward stores. Even after awakening this
  does not imply restored civic lamps consume Oil; household/workshop lamps
  remain ordinary, as already permitted by Q08. No origin of the oil is given.

These studies/events are independent of optional sibling discoveries and never
required for restoration. Both reports await explicit response and remain
readable in the Chronicle. The first household still precedes Orso's complaint;
no clue disposition, larger history, character backstory or mystery is settled.

### Implemented continuation — approved October 2, 2026

The user explicitly approved the [survey-to-awakening draft](PHASE_1_AWAKENING_DRAFT.md)
for implementation. The following local observations are accepted; their wider
interpretations remain open. Provisional numerical balance is not canon.

| Beat / runtime ID | Required action and evidence | What is established; reveal limits |
|---|---|---|
| Aqueduct return / `ruined-aqueduct` → `aqueduct-find` | Survey the foundations, then dispatch a party through existing expedition access. | Older black material lies beneath a watercourse; a branch passes beneath the chapel. Ends remain unseen; no complete network map. |
| Trace / `trace-conduits` → `conduit-trace` | Survey + aqueduct return, followed by deliberate measurement/clearance. | Measurements join; a gap and pale broken faces are recorded. Extent, contents, and power source stay unknown. |
| Subterranean Works / `subterranean-works` → `subterranean-works-built` | Tracing, then shoring and tackle construction. | Safe local access through ordinary labor. This does not open the chamber automatically. |
| Chapel return / `chapel-foundations` → `chapel-find` | Works + tracing, then dispatch. | A fitted slab and accessible movable catch below the sockets. Socket purpose remains unknown. |
| Open / `open-chamber` → `chamber-opened` | Chapel return + Works + tracing; brace the slab and operate its catch. | Workers reach only the nearest cleared part of a dark chamber. No sabotage, prison, hidden intelligence, or whole-system purpose. |
| Engine installation / `buried-engine` → `engine-works-built` | Open chamber, then install an inspection platform and supports. | Buried Engine is a local ledger heading. The machinery already exists; building purchases working access, not a newly manufactured engine. |
| Study / `study-engine` → `engine-study` | Chamber open + inspection platform; compare a loose joining piece and test a movable stone. | Local fit and repeatable movement constraint. Orso compares inner lamp surfaces without secret expertise. |
| Restore / `restore-conduit` → `conduit-restored` | Completed study + engine installation; seat and support the joining piece. | Repaired local connection. Ordinary oil fittings remain in place until deliberate awakening; no early Current. |
| Awaken / `awaken-junction` → `junction-awakened` | Completed restoration + study + engine installation; explicit action. | Remove marked fixtures' oil fittings, then draw the tested stone to its stop. Local response and white lamps without flame; Current appears and Lamplighter Oil demand becomes zero. |
| Retain the ending | Completion and ending record committed once; three presentation passages acknowledged independently. | Continued management; rereading and reload never repeat effects. No later chapter, vessel, voyage, or stellar diagnosis. |

**Accepted lamp relationship (Q08):** marked civic fixtures along the
Processional Way are older wall casings with subsequently fitted oil vessels
and wick holders. Orso observes matching pale linings and seams after study.
Activation removes those fittings and returns any remaining fuel to the stores
without a resource refund or consumption. White light comes from the restored
fixtures; other handheld/workshop lamps may still use Oil. Lamplighter now
represents tending the restored civic fixtures, with Authority retained and
ordinary Food-shortage rules still applying. The third lamp stays where it is
and is not dismantled, moved, filled, or given a wick. Its prior light, lack of
fittings, and Orso's caution are not explained by this observation.

**Optional, independent branches:** `collapsed-gatehouse` → `gatehouse-find`
follows relic cataloging. Salvaged stone contains an embedded dark strip;
`study-black-metal` → `black-metal-study` compares it with cistern fragments
without asserting an alloy, indestructibility, or original use. `barrow-field`
→ `barrow-find` follows the gatehouse return and supplies a footless unmarked
cup found beneath an exposed bank. No burial, occupant, dating, ritual, or
historical contradiction is established. Its shape and provenance may remain
unexplained; it is not a required repair part or key.

Lamp House, Smithy, Iron Tools, and Improved Presses support ordinary work and
remain optional. None of their records is required by the main sequence. The
Buried Engine is not identified with the titular Buried Sun or propulsion.
The Processional Way supplies only a local inhabited passage; no vessel
footprint or comprehensive Ward geography is approved by this work.

## 5. Continuity reference

### People and roles

| Person or role | Established basis | Limits and unresolved material |
|---|---|---|
| Keeper of the Outer Ward | CANON: inherited civic/religious/bureaucratic office; opening player role. EXISTING: register and keys in `appointment`. | Appearance, name, gender, age, predecessor, appointment authority, family, and succession method are open. An inherited office need not be hereditary. |
| Orso | EXISTING: lamplighter who reports the anomaly, requests restraint, and records wick savings; also appears in the brief's draft finale. | Preserve his role when extending current text. His age, past, reasons for reluctance, and knowledge beyond observations are open. Do not make him a hidden engineer or carry him unchanged across generations. |
| Nera | EXISTING: arriving woman with two children, seeds, and planting notes; `household` and `crop-rotation`. | No surnames, children's names, special ancestry, or later descendants are established. Her report about the western village is not a technical diagnosis. |
| Two children | EXISTING: arrive with Nera and account for two of the three new names. | Ages, genders, work, adulthood, and future Keeper roles are open. Population arithmetic is not characterization. |
| The scrivener | EXISTING: an unnamed woman in ledger/catalog prose; `scrivener` is also an assignable job. | Name, history, and whether every reference denotes one continuous individual are open. Do not infer secret biological knowledge from her word choice. |
| Initial five inhabitants | CANON opening count; individual identities are not enumerated. | Do not claim a roster or decide whether the player is included in that count. Worker accounting does not settle narrative identity. |
| The later household | EXISTING: two unnamed people, a handcart, bedding, cooking pot and worn tools; `repair-household`. | No prior home, family relationship, ages, trade specialization or consequential backstory is established. |
| Later Keepers | CANON succession across generations. | No names, bloodline, dates, number, or complete character arcs are approved. |

### Places and physical continuity

| Place | What is established | Limits |
|---|---|---|
| Outer Ward and Keeper's office | CANON: nearly abandoned settlement beneath an ancient Citadel; a modest inherited office. EXISTING: five registered inhabitants at opening. | Its exact footprint relative to the vessel and surrounding ground is open. Do not assume every associated location can depart. |
| Citadel | CANON to authors: the ancestral vessel. EXISTING Ward scene: a road climbs toward it and windows disappear at dusk. | Road and windows describe a situated view, not hull geometry or a flight-capable exterior silhouette. |
| Chapel and foundations | EXISTING: lamp seam enters the chapel wall; chapel spans an older opening with downward-facing sockets. | Dedication, ritual, layout, and original function are open. A religious use does not imply a conspiracy. |
| Third lamp | EXISTING: anomalous fixture associated with the chapel wall. | Exact position, whether movable, illumination mechanism, and Orso's reason for protecting it need resolution. |
| Fields / old gardens | EXISTING `fields`, `forager`, and `crop-rotation`: cultivation, warm soil, and unusual root direction. | Spatial relation to the vessel, source of warmth, and cause of root behavior are open. |
| Oil Press / Market Stall | EXISTING `oil-press`, `market-stall`: an old screw press; a counter beneath an arch and worn coins. | No lost inventor, emperor, currency dynasty, or extraordinary machinery is established. |
| Scrivener's House / House of Antiquities | EXISTING `scrivener-house`, `antiquities-house`: shelves and dedicated space for recovered objects. | Book count/capacity does not establish a destroyed great library; separating objects does not establish a cult. |
| Ruined Cistern / Old Cistern | EXISTING building `ruined-cistern` enables expedition `old-cistern`; stair, ring, silt, and recovered fragments connect their descriptions. | Treat as the access works and expedition associated with the cistern, not two invented distant sites. Precise geometry remains open. |
| Abandoned Farmstead | EXISTING `abandoned-farmstead` / `farmstead-find`: beyond the cistern road, planted fruit trees, no door, intact stores, coins, inward-facing chairs. | Do not identify it as the western village, specify its abandonment cause, or infer a vanished family. |
| Western village | BELIEF: Nera says it has been abandoned. | Name, location, cause, and relation to other destinations are open. |
| Processional Way / Lamp House | Approved local passage with marked restored civic fixtures; optional Lamp House organizes oil tending. | No comprehensive layout or vessel relation. The ending does not require construction of the optional Lamp House. |
| Chamber / Subterranean Works / Buried Engine | Implemented local shoring, fitted closure, inspection platform, joining piece, and tested movable stone. | Only a fragment is exposed; no comprehensive map, propulsion identification, or architectural cutaway. |

### Terminology

| Term | Approved usage or source meaning | Do not infer |
|---|---|---|
| Food, Oil, Coin | Ordinary provisions, lamp fuel, and trade resources. | Magical properties or a new resource's existence. |
| Authority | Civic legitimacy of the Keeper's office; current stock differs mechanically from lifetime earned. | A literal consumable substance or supernatural command. |
| Knowledge | Recorded observations and investigation effort. | Universal understanding of every author's truth. |
| Relics | Recovered older objects used in investigation. | Religious power, biological origin, or a single material for all finds. |
| Current | Finale resource associated with functioning restored machinery. | Early UI visibility, a scientific account of its production, or knowledge of propulsion. |
| Conduit, engine, junction | Local descriptive language permitted by the Phase 1 investigation sequence. | Modern technical specifications or the purpose of the entire vessel. |
| Buried Engine | Phase 1's restoration structure. | Identity with the titular Buried Sun, the original vessel's main engine, or its sole power source. |
| Buried Sun | Title and central imagery, reserved for significant treatment. | An approved literal object or explanation; see Q01. |
| Keeper / succession | An inherited responsibility continued by successive people. | Hereditary monarchy, prestige resets, or an immortal player character. |
| Chronicle / register / ledger | Player record, household record, and observational record; distinguish their purposes in prose. | That app storage and interface behavior are literal ancient computers. |
| Phase / chapter / Age | Phase 1 is the current implementation scope; chapters are proposed narrative divisions. | One chapter per generation or an approved passing-Ages mechanic. |

The terminal interface is a presentation language. Its machine readouts do not
establish that inhabitants possess screens, software, or recognizable modern
control panels. Public descriptions should retain the existing modest premise
of civic duty and buried things.

## 6. Clue and mystery ledger; prose audit

This ledger records observations and protects their treatment; it is not a
list of puzzles that must all be solved. The user's mystery direction permits
supporting details to remain unexplained indefinitely, including to the
authors. Preserve that uncertainty by default where no approved story beat
depends on an answer. A later explanation that establishes consequential lore
still needs approval. "Candidate" revisions below do not authorize rewriting
current prose in this documentation change.

| ID / first appearance | Observed detail | Established connection or interpretive limits | Treatment; payoff only where required |
|---|---|---|---|
| CL01 — Chronicle `appointment` | Old register, five names, keys without known locks, duty in a newer hand. | Inherited responsibility and incomplete local knowledge. No approved secret manifest or master key. | Retain the civic framing. Any specific lock or historical writer requires a later decision. |
| CL02 — event/Chronicle `household` | Eleven years without a new household; seeds and three names. | Civic decline followed by an actual return of people and useful knowledge. | Immediate payoff is admission and cultivation, including `crop-rotation`; no dynasty or prophecy is established. |
| CL03 — event `lamp-complaint` | Orso attempted to fill a reservoir twice, then found no reservoir. | A physical anomaly motivates examination; the attempted filling does not establish a reservoir. | **Continuity repair implemented:** the former "filled" wording was replaced with "attempted to fill," matching the brief. No hallucination, deceit, or changing anatomy is established. |
| CL04 — Chronicle `lamp-complaint`; research `examine-old-lamps`; `better-wicks` | Orso wants the lamp left in place; will not bring it closer to others; it must remain untouched. | Caution is observable. His reason can remain unknowable; no secret expertise is canon. | **MYSTERY:** no explanation of his reluctance is required. Keep physical actions consistent if later writing moves or examines the lamp. |
| CL05 — research `examine-old-lamps` / Chronicle `lamp-examination` | Cold white lining, no wick, Orso's shadow, seam entering the wall. | The lamp differs from ordinary oil fixtures and has a physical connection. | The connection leads to survey/restoration. Pre-awakening light source and exact optics remain open; do not invent reserve power or make this the completed awakening. |
| CL06 — research/Chronicle `ledger-keeping` | The scrivener crosses out a question mark. | A gesture whose motive is not given. | **MYSTERY:** may remain ordinary human opacity or something the player wonders about. No answer is required; do not confirm censorship or forbidden knowledge without approval. |
| CL07 — building `fields`; research/Chronicle `crop-rotation` | Warm soil; roots turn toward the chapel. | Warmth and root direction are observations, not an established common cause. | **MYSTERY:** retain without requiring a payoff or private solution. Do not confirm living machinery, influence over plants, or a biological engine merely to explain the detail. |
| CL08 — research/Chronicle `better-wicks` | Ordinary lamps use less Oil; the third lamp's column stays blank. | Separates ordinary improvements from an unresolved exception. | Supports the eventual oil-independent-lamp contrast; does not independently explain the exception. |
| CL09 — building `ruined-cistern`; expedition `old-cistern` / Chronicle `cistern-find` | Uncorroded ring, newly exposed stair, pale fragments, groove matching seam width. | Accessible material can be compared with the lamp; the ring's condition has no assigned technical explanation. | Fragments feed `catalog-relics`; retain physical comparison. Corrosion resistance and lower stair destination remain open. |
| CL10 — expedition `abandoned-farmstead` / Chronicle `farmstead-find` | Doorless house, dry stores, coins, chairs facing inward. | Abandonment with unexplained arrangement; not proof of an atrocity or ritual. | **MYSTERY:** the player may never learn what happened here. No hidden solution or connection to Nera's village or the vessel reveal is required. |
| CL11 — research `catalog-relics` / Chronicle `relic-catalog` | Matching lining, six channels, refusal to call them veins. | Material correspondence supports survey. Number and word choice do not prove biology or symbolism. | Payoff is the next physical investigation; anatomy, channel functions, and the scrivener's motive are open. |
| CL12 — research `survey-foundations` / Chronicle `foundation-survey` | Older opening, continuous seam, sockets facing down. | A connected structure predates the chapel's current masonry. | Required continuation is conduit tracing. Socket purpose and exact orientation in a larger structure remain open. |
| CL13 — buildings `oil-press`, `market-stall`, `scrivener-house`, `antiquities-house` | Forgotten screw-maker, worn coin face, many shelves, objects not called tools. | Candidate ordinary signs of age and imperfect classification. | No major payoff assigned. Do not promote each description into a lost ruler, hidden library, or taboo. Ordinary work must remain believable. |
| CL14 — Ward scene | Road climbs toward the Citadel; its windows disappear at dusk. | Human-scale view of a nearby inhabited structure in failing light. | Atmospheric framing, not proof of active concealment. Vessel footprint and Ward relationship are open. |
| CL15 — approved `junction-awakened` | Platform transmits a low sound; pale linings become white; empty oil vessels stand nearby; no flame. | Restored local civic lamps operate without Oil. | Implemented Phase 1 payoff; no global conversion or launch sequence. |
| CL16 — `aqueduct-find` / `conduit-trace` | Cropped black lengths, local branch, measured gap and pale faces. | Actionable local connection; neither end of the aqueduct length is seen. | Supports access and repair without selecting a power source or unseen system layout. |
| CL17 — `chapel-find` / `chamber-opened` | Downward sockets, fitted slab, movable catch, nearest floor. | A repeatable physical access method. | No purpose assigned to sockets, no historical reason for closure. |
| CL18 — `engine-study` / `conduit-restored` | Joining piece fits broken faces; movable stone constrains lowering; support holds the repaired joint. | Practical observations permit a local test. | No modern technical account, propulsion, or titular Sun identification. |
| CL19 — `engine-study` / `junction-awakened` | Ordinary civic fixtures contain pale inner surfaces and seams beneath removable oil fittings. | Approved local lamp relationship supports the Oil-free demonstration. | Does not explain the third lamp's earlier illumination, different fittings, or Orso's motive. |
| CL20 — `gatehouse-find` / `black-metal-study` | Embedded dark strip; marks on nearby stone, none corresponding on the strip. | Optional material comparison only. | No indestructibility, chronology, original role, or required repair use. |
| CL21 — `barrow-find` | Unmarked footless cup, dry earth, will not sit flat. | Optional unusual relic. | MYSTERY: no burial, history, ritual, provenance, or required payoff assigned. |

### Audit conclusions

- **Continuity repair implemented:** CL03 now says "attempted to fill," resolving
  the wording discrepancy without an unreliable-narrator explanation. CL04 needs
  consistent physical handling if the lamp is moved or examined; Orso's motive
  need not be explained.
- **Mysteries preserved:** roots, chairs, the question mark, anatomical
  language, and Orso's motive must not accumulate definitive explanations from
  different writers. Lack of a payoff is not a defect. Material matches can
  support investigation while their other implications remain unsettled.
- **Progression checked:** every current Chronicle entry has a source in the
  implemented-beat table. Household admission precedes the complaint; optional
  studies and farmstead discovery are not prerequisites of the survey.
- **Reveal boundary checked:** existing lamp/material clues support suspicion,
  not confirmation of travel or the dying sun. No current narrative explicitly
  supplies either later revelation. The newly approved background of perceived
  environmental decline still needs a restrained, approved expression in prose.
- **Geography remains unresolved:** the design's settlement beneath the Citadel
  and the road toward it do not tell us which terrain, structures, or inhabitants
  are aboard the vessel at departure. Do not silently answer through a map.
- **Release boundary checked:** the awakening is the implemented story endpoint;
  the overall Phase 1 content and real-device acceptance checks remain incomplete. The existing `currentObjective` helper in
  `src/game/objective.ts` is not the narrative authority and must not justify
  restoring player-facing hints prohibited by AGENTS.md.

## 7. Open author decisions

This is not a completion checklist for all lore. Resolve only the portions
needed to support upcoming actions or preserve continuity; the rest may remain
unknown permanently. No technical or historical account must be exhaustive.
New proposals should reference the affected question and observations.

| ID | Decision still needed | Needed before |
|---|---|---|
| Q01 | What does "Buried Sun" literally refer to, if anything? How does it relate to the Phase 1 Buried Engine? | Naming or depicting a central source, or promising its identity through a clue. |
| Q02 | Who built the vessel, why the ancestors travelled, and why they settled here. | Only when writing a claim that establishes one of these answers. Chapter 3 can establish arrival without explaining builders, mission, or motives. |
| Q03 | Vessel footprint; relation of Ward, gardens, chapel, and surrounding settlements to it; what can travel. | Maps, cross-district continuity, evacuation logistics, or departure composition. |
| Q04 | How knowledge was lost or transformed and what evidence survives. | Specific missing records, historical contradictions, hidden custodians, or institutional histories. |
| Q05 | Sun type, decline mechanism, observable symptoms, and time available for generational restoration. | New decline prose, scientific diagnosis, deadlines, or calendar dates. No real-world mechanism has been selected. |
| Q06 | Chapter boundaries, number of generations, succession practice, and recurring character arcs. | Naming successors, aging characters, placing handovers, or designing time-passage mechanics. |
| Q07 | Whether a future action needs additional facts about a Phase 1 observation. Orso's motive, roots, chairs, and gestures may remain mysteries. | Only when an approved action depends on an answer or new writing proposes to establish a cause. Their continued presence does not require resolution. See CL03–CL12. |
| Q08 | Local survey-to-awakening evidence and the marked civic lamp relationship are now approved and implemented. Barrow Field uses the unusual-relic alternative; no historical contradiction is selected. | Later changes that add consequential facts still need approval. The wider system and surrounding mysteries remain open. |
| Q09 | What makes renewed travel feasible, how a destination is chosen, and what the final preparations require. | Later restoration systems and departure prerequisites. Do not assume faster-than-light travel, stasis, or a known refuge. |
| Q10 | Additional costs beyond lifetimes, representation of those left behind if any, and the departure scene. | Sacrifice plots or a final script. Limited rescue capacity and forced abandonment are not approved premises. |

## 8. Rules for future narrative work

### Permitted elaboration and approval

Agents may write incidental prose consistent with established facts: the use of
an ordinary tool in an established workshop, concise reporting of an already
approved result, or suggestive sensory detail that establishes no consequential
new world rule, history, or promised solution. Unresolved atmosphere is allowed;
it does not need a separate approval for every detail or an invented hidden
cause. Restrained writing also leaves ordinary work ordinary, so strangeness
retains its force. Recurring or consequential observations belong in the ledger
so later agents preserve them without automatically explaining them.

Explicit user approval is required before new major history, consequential
character backstory, system purposes, revelations, or endings become canon or
player-facing content. That includes explanations smuggled into item names,
building descriptions, illustration prompts, or mechanical prerequisites.
Approval already given in the conversation should be recorded and used; do not
ask the user to approve the same fact again.

When work actually depends on an unanswered author decision, draft a labeled
proposal stating the affected canon, chapter, observation, and content IDs.
Do not stop to demand a hidden answer for an enduring mystery. Continue work
within its established observations and limits. Do not silently choose an
explanation, claim a mysterious detail always had a planned solution, or rewrite
unrelated prose to make an invention appear settled.

For an approved change, update the relevant truth, chapter, knowledge boundary,
continuity entry, and clue disposition together. Add a dated revision-log entry
stating the approval basis and whether code/prose has actually been updated.
Retain a note about superseded facts where needed to explain existing content.
Do not renumber runtime IDs because a title or interpretation changed.

### Narrative and art checks

Before delivering a narrative change:

1. Identify its chapter/beat, triggering action, existing content IDs, and
   status. Confirm that any named person can be present at that time.
2. Check knowledge locally: what was observed, who learned it, what records are
   available, and what can be confirmed at this stage. For optional content,
   do not assume the player completed a sibling branch.
3. Check cause and effect: a discovery follows an action or evidence, not an
   unexplained author announcement. Distinguish a claim from its underlying truth.
4. Distinguish evidence needed for a discovery from unresolved atmosphere.
   Preserve recurring observations in the ledger without demanding an answer
   or a payoff. Check whether new prose accidentally settles a mystery or
   promises a solution the story does not intend to provide.
5. Keep duplicated research/Chronicle prose consistent, preserve one-time
   discoveries, and retain readable records of completed findings.
6. Use the approved Dark Chronicle pixel art direction: detailed pixel clusters,
   realistic proportions, intimate human viewpoints, tactile ordinary work,
   localized illumination, and cropped fragments. The dark-doorway Keeper's
   Office is the style reference; see `docs/ART.md` for the October 4 change.
   Illustrations show workstations, tools and discoveries without people,
   hands, other body parts or silhouettes. Unoccupied framing adds atmosphere
   without establishing a disappearance or changing the inhabitants' presence.
   Author knowledge of the vessel never licenses recognizable spacecraft art,
   omniscient establishing shots, cutaways, or contemporary sci-fi equipment.
   Later visual changes require explicit direction; chapter advancement alone
   does not override AGENTS.md's art restrictions.
7. Verify that costs/effects remain clear, no tutorial objectives have been
   introduced, and full-story planning has not expanded Phase 1's scope.
   Before an action, describe the activity without forecasting unlocks or
   findings. Study results and effects appear after completion; expedition
   rewards and findings appear after return. Costs, timers, worker commitments,
   requirements, and ordinary production rates remain explicit.
8. Record new approvals and actual continuity conflicts. Do not label an
   incomplete outline as a finished script, or treat enduring uncertainty as
   missing work. The ending should leave room for interpretation as well as
   fulfill the approved undertaking.

### Next authoring pass

[Survey-to-awakening authoring spec](PHASE_1_AWAKENING_DRAFT.md) was explicitly
approved by the user and implemented. Future authoring should preserve these
local observations, review the remaining Phase 1 catalog needs, and leave the
surrounding mysteries open.

Later passes can develop chapter evidence and human arcs, answering relevant
portions of Q02/Q04–Q06 only when a scene or transition depends on them. Neither
the opening nor the full story needs to settle all of these questions. Further
consequential lore still requires approval; this order for collaborative
authoring does not authorize implementing open answers or rewriting existing
narrative automatically.

## 9. Revision log

| Date | Revision and approval basis | Implementation status |
|---|---|---|
| 2026-10-02 | Edition 1 records the user's approved planning decisions: full arc with detailed opening; costly renewal; Citadel as travelling ancestral vessel; failing sun perceived initially through decline; generational restoration ending at departure; existing spine retained with revisable details. The user requested this bible and agent guidance. | Documentation and AGENTS.md only. Six chapter functions remain proposals. No supporting clue explanations, new major backstories, runtime content, or gameplay changes approved by this entry. |
| 2026-10-02 | Edition 1.1 records the user's clarification that mystery must remain alive throughout the story and that players may never learn the meaning or explanation of eerie details. Adds C10 and MYSTERY treatment; removes the requirement to assign every oddity a purpose, payoff, or private solution. | Documentation and AGENTS.md only. Preserves established plot facts and required discoveries; supporting mysteries remain unresolved by default. No explanations or player-facing prose changed. |
| 2026-10-02 | User approved implementation of the illustrated-unlock plan: office, first Oil Press construction, lamp examination and first cistern discovery. Adds the incidental `oil-press-built` caption to record an established building's operation. | Four Dark Chronicle illustrations, accomplishment reveals, and Chronicle replay implemented. Existing office/lamp/cistern captions reused. Lamp artwork corrected to avoid depicting an oil reservoir. Art and prompts documented in `docs/ART.md`; no major lore, chronology, mysteries or reveal limits changed. |
| 2026-10-02 | User requested removal of messages forecasting what studies, expeditions, and other actions unlock, preserving suspense while accumulating their costs. | Study effects appear after completion; construction no longer previews new roles or systems; the lamp-report choice does not name its unlock; expedition rewards and findings appear after return. Existing findings, progression, costs, timers, and ordinary production rates are preserved. No new lore or revelations added. |
| 2026-10-02 | User approved the narrative audit's three consistency fixes: the reservoir wording, Knowledge terminology, and Chronicle inventory. | Event `lamp-complaint` now says "attempted to fill," matching the brief and repairing CL03; the Knowledge description no longer places observations in the household register; the inventory now counts twelve Chronicle entries. No triggers, chronology, clues, reveal limits, or unresolved environmental symptoms changed. |
| 2026-10-02 | Edition 1.2: user replied “approved!” to the completed survey-to-awakening draft and its implementation approval question. Accepts local access/repair evidence, removable oil fittings in older civic lamps, the optional Barrow relic, and staged awakening wording. | Implemented ten buildings, thirteen studies, six destinations, and the deliberate awakening with Current, Oil-free restored lamp tending, version-5 persistence and independent presentation acknowledgements. Costs tuned provisionally through the full harness. No vessel/stellar/ancestral reveal, new major history, or explanations of enduring mysteries. |
| 2026-10-02 | Edition 1.3: user requested Laborers + Stoneworking followed by another household event, grounded in Ward life and preserving the larger mysteries. | Implemented the capped construction job, optional stone reuse study and two-person household choice/record. Adds incidental ordinary work and belongings only; no major history, character backstory, system purpose, revelation, ending or clue interpretation changed. Fourteen studies, three events and thirty Chronicle records. |
| 2026-10-03 | Edition 1.4: user requested Scavenger implementation and the first civic studies/events batch, deferring human playtesting/tuning. | Implemented archaeological staffing, Provision Stores, Apprenticed Hands, Collated Records, shared-table and spare-oil choices, and version-7 persistence. Incidental food packing, paired stonework, copied leaves, a shared meal and ordinary oil exchange only; no new major history, backstory, system purpose, revelation or clue explanation. Seventeen studies, five events and thirty-five Chronicle records. |
| 2026-10-04 | Edition 1.5: user approved the detailed pixel Keeper's Office, requested darkness outside its doorway, then directed applying that style to the other illustrations and correcting the Oil Press handle connection. | Replaced all four illustration assets with detailed pixel art retaining realistic proportions, rich amber lighting, enclosed viewpoints and established contents. Press turning bar now connects to the screw hub beneath the fixed beam. Updated AGENTS.md and docs/ART.md. Captions, chronology, clues, mysteries, reveal limits, gameplay and saves unchanged. |
| 2026-10-04 | Edition 1.6: user approved the proposed Smithy, Sealed Chamber and Awakening art batch, then requested no people in the pictures, only workstations and discoveries. | Added three illustrations bound to existing accomplished Chronicle records; removed the Oil Press worker and cistern hand. All seven images omit figures and body parts. The finale uses neutral white light; its art follows the existing staged passages. Existing captions, local lamp relationship, clue chronology, mysteries, mechanical rewards and saves are preserved. Unoccupied compositions imply no disappearance or change to the settlement's population. |
| 2026-10-04 | Edition 1.7: user requested a Sealed Chamber picture revision after comparing its odd closure with the discovery text. | Revised the fitted slab's profile and surround, simplified ordinary tackle to a rope sling, quieted the ancient black material and reduced the bench-like interior shape. No exposed pivot mechanism, people, new explanation or later platform. Caption, access sequence, clues, mysteries, reveal limits and gameplay unchanged. Exact edit prompts in docs/ART_CHAMBER_REVISION.md. |
| 2026-10-04 | Edition 1.8: user approved trying assigned construction crews and introducing Laborers alongside the initial construction mechanic. | Replaced the instantaneous worker discount with one adjustable, pausable construction project, early Laborer availability, crew-based conduit restoration and version-8 persistence. Existing supplies, discoveries and illustrations are committed at their appropriate start/completion boundaries; awakening remains deliberate. Existing prose, household chronology, clues and reveal limits are preserved. Apprenticed Hands changes work speed; Stoneworking retains its Coin saving. No major lore or new interpretation. |
