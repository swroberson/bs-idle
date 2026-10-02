import { EVENTS } from "@/content/events";
import { costText, eventRequirements } from "@/game/requirements";
import type { GameAction, GameState } from "@/game/types";

export function EventPanel({ state, active, dispatch }: { state: GameState; active: boolean; dispatch: (action: GameAction) => void }) {
  const id = state.pendingEvents[0];
  if (!id) return null;
  const event = EVENTS[id];
  const unmet = eventRequirements(state, id);
  return <section className="signal-region" aria-labelledby="event-heading">
    <p className="machine-label activity-text" role="status">New report / awaiting your response</p>
    <h2 id="event-heading">{event.title}</h2>
    <p className="narrative">{event.text}</p>
    <p className="effect-readout">{event.population > 0 ? `+${event.population} inhabitants / new workers arrive unassigned. Cost: ${costText(event.cost)}.` : costText(event.cost)}</p>
    <button className="machine-button" aria-describedby="event-requirements" disabled={!active || unmet.length > 0} onClick={() => dispatch({ type: "choose-event", event: id })}>{event.choice}</button>
    <p id="event-requirements" className="requirements-copy">{unmet.join(" · ") || "Awaiting authorization / production continues"}</p>
  </section>;
}
