import { Fragment, type ReactNode } from "react";
import { RESOURCES } from "@/content/resources";
import type { Cost, ResourceId } from "@/game/types";
import { ResourceIcon } from "./ResourceIcon";

export function ResourceLabel({ resource }: { resource: ResourceId }) {
  return <span className="resource-identity"><ResourceIcon resource={resource} />{RESOURCES[resource].name}</span>;
}

export function ResourceAmount({ resource, children }: { resource: ResourceId; children: ReactNode }) {
  return <span className="resource-amount" title={RESOURCES[resource].name}>
    <ResourceIcon resource={resource} /><span>{children}<span className="sr-only"> {RESOURCES[resource].name}</span></span>
  </span>;
}

/** Keep exact costs; compact truncation is only for the live store readouts. */
export function ResourceAmounts({ amounts, empty = "No cost" }: { amounts: Cost; empty?: string }) {
  const entries = Object.entries(amounts) as [ResourceId, number][];
  if (!entries.length) return <>{empty}</>;
  return <span className="resource-amounts">{entries.map(([resource, amount], index) => <Fragment key={resource}>
    {index > 0 && <span className="resource-separator" aria-hidden="true"> / </span>}
    {index > 0 && <span className="sr-only"> / </span>}
    <ResourceAmount resource={resource}>{amount}</ResourceAmount>
  </Fragment>)}</span>;
}
