# Opening economy implementation

Build a fresh-save opening that runs from allocating the five inhabitants to examining an anomalous lamp. Keep the static Next.js app, local saves, single-tab ownership, and connected terminal interface.

## Decisions

- Use a pure elapsed-time engine with exact Food/Oil depletion boundaries. Foraging remains productive during shortages; other output is reduced. Oil supply limits lamp output.
- Opening buildings and investigation use Food and Authority. Coin, additional jobs, and later content remain for the next increment.
- Reconcile before actions, on launch/resume, and before saving. Production is capped at eight hours per absence; advance the timestamp through the whole absence.
- Version-1 saves migrate to version 2 at the current time without retroactive food consumption. Events are queued and choices require player input.
- Balance is provisional. Use deterministic tests and a development-only progression harness, then inspect a fresh opening in a phone-sized browser.

## Ordered slices

1. Workers, pure economy, validated saves, and live readouts.
2. Fields/Oil Press purchases, household choice, and lamp investigation.
3. Return summary, progression harness, browser checks, and documentation.

## Risks

- Shortages must not oscillate depending on timer frequency: account for simultaneous Oil production and lamp demand at zero stores.
- Background callbacks must not repeatedly bypass the offline cap: hidden tabs stop ticking until reconciliation.
- New save fields must be strictly validated, including one-time event/chronicle consistency.
- Browser checks do not establish real iPhone Safari or home-screen behavior.
