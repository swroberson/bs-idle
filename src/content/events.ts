import type { EventDefinition } from "../game/types";

export const EVENTS = {
  household: {
    title: "A Stranger at the Gate",
    text: "A woman and two children arrived before dawn. She says that the western village has been abandoned. The Keeper’s register has not recorded a new household in eleven years.",
    choice: "Admit the household", cost: { food: 30, authority: 10 }, population: 3,
    requirements: { lifetimeAuthority: 12, buildings: { fields: 1 } }, chronicle: "household",
  },
  "lamp-complaint": {
    title: "The Lamplighter’s Complaint",
    text: "Orso reports that the third lamp consumes no oil. He attempted to fill its reservoir twice before discovering that it possesses no reservoir at all.",
    choice: "Authorize an examination", cost: {}, population: 0,
    requirements: { lifetimeAuthority: 35, buildings: { "oil-press": 1 }, chronicle: ["household"] }, chronicle: "lamp-complaint",
  },
  "repair-household": {
    title: "A Handcart at the Arch",
    text: "Two people wait beside a handcart loaded with bedding, a cooking pot and a bundle of worn tools. They have watched stone being carried through the Ward. They ask for a room, and permission to put its broken threshold in order.",
    choice: "Enter the household", cost: { food: 50, authority: 20 }, population: 2,
    requirements: { lifetimeAuthority: 80, buildings: { fields: 2 }, research: ["stoneworking"], chronicle: ["household"] },
    provisionedArrival: true, chronicle: "repair-household",
  },
} as const satisfies Record<string, EventDefinition>;
