import { EVENTS } from "@/content/events";
import { eventChoices, eventRequirements, payCost } from "@/game/requirements";
import { ResourceAmounts } from "./ResourceAmounts";
import { resourceCapacity } from "@/game/storage";
import type { GameAction, GameState, ResourceId } from "@/game/types";

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
      const paid = payCost(state, choice.cost);
      const limited = (Object.entries(choice.rewards) as [ResourceId, number][]).some(([resource, amount]) => resourceCapacity(paid, resource) - paid.resources[resource] < amount);
      return <div className="event-response" key={choice.id}>
        <p className="effect-readout">Cost // <ResourceAmounts amounts={choice.cost} />{Object.keys(choice.rewards).length > 0 && <><br />Receive // <ResourceAmounts amounts={choice.rewards} /></>}</p>
        {limited && <p className="requirements-copy">Rewards stop at store capacity. Excess cannot be stored; earned lifetime Authority still counts.</p>}
        <button className="machine-button" aria-describedby={`event-${id}-${choice.id}-requirements`} disabled={!active || unmet.length > 0} onClick={() => dispatch({ type: "choose-event", event: id, choice: choice.id })}>{choice.label}</button>
        <p id={`event-${id}-${choice.id}-requirements`} className="requirements-copy">{unmet.join(" · ") || "Awaiting authorization / production continues"}</p>
      </div>;
    })}
  </section>;
}
