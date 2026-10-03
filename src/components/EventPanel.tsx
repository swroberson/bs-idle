import { EVENTS } from "@/content/events";
import { costText, eventChoices, eventRequirements } from "@/game/requirements";
import type { GameAction, GameState } from "@/game/types";

export function EventPanel({ state, active, dispatch }: { state: GameState; active: boolean; dispatch: (action: GameAction) => void }) {
  const id = state.pendingEvents[0];
  if (!id) return null;
  const event = EVENTS[id];
  return <section className="signal-region" aria-labelledby="event-heading">
    <p className="machine-label activity-text" role="status">New report / awaiting your response</p>
    <h2 id="event-heading">{event.title}</h2>
    <p className="narrative">{event.text}</p>
    {event.population > 0 && <p className="effect-readout">+{event.population} inhabitants / new workers arrive unassigned.</p>}
    {eventChoices(id).map(choice => {
      const unmet = eventRequirements(state, id, choice.id);
      return <div className="event-response" key={choice.id}>
        <p className="effect-readout">Cost // {costText(choice.cost)}{Object.keys(choice.rewards).length > 0 && <><br />Receive // {costText(choice.rewards)}</>}</p>
        <button className="machine-button" aria-describedby={`event-${id}-${choice.id}-requirements`} disabled={!active || unmet.length > 0} onClick={() => dispatch({ type: "choose-event", event: id, choice: choice.id })}>{choice.label}</button>
        <p id={`event-${id}-${choice.id}-requirements`} className="requirements-copy">{unmet.join(" · ") || "Awaiting authorization / production continues"}</p>
      </div>;
    })}
  </section>;
}
