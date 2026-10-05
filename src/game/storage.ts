import { BALANCE } from "../content/balance";
import { BUILDINGS } from "../content/buildings";
import type { BuildingDefinition, BuildingId, GameState, ResourceId } from "./types";

export function resourceCapacity(state: GameState, id: ResourceId): number {
  // Relics are deliberate expedition finds; Current is the post-finale readout.
  if (id === "relics" || id === "current") return Number.MAX_SAFE_INTEGER;
  return (Object.keys(BUILDINGS) as BuildingId[]).reduce<number>((capacity, buildingId) => {
    const building: BuildingDefinition = BUILDINGS[buildingId];
    return capacity + (building.storagePerLevel?.[id] ?? 0) * state.buildings[buildingId];
  }, BALANCE.storageCapacity[id]);
}

export function storedAmount(state: GameState, id: ResourceId, change: number): number {
  // Old saves may exceed today's capacity. Spend/consume that surplus normally,
  // but never confiscate it or add to it while the store is over capacity.
  const ceiling = Math.max(state.resources[id], resourceCapacity(state, id));
  return Math.min(ceiling, Math.max(0, state.resources[id] + change));
}
