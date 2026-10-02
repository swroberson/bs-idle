export const EVENTS = {
  household: {
    title: "A Stranger at the Gate",
    text: "A woman and two children arrived before dawn. She says that the western village has been abandoned. The Keeper’s register has not recorded a new household in eleven years.",
    choice: "Admit the household", cost: { food: 30, authority: 10 }, population: 3,
    lifetimeAuthority: 12, requiredBuilding: "fields", chronicle: "household",
  },
  "lamp-complaint": {
    title: "The Lamplighter’s Complaint",
    text: "Orso reports that the third lamp consumes no oil. He filled its reservoir twice before discovering that it possesses no reservoir at all.",
    choice: "Authorize an examination", cost: {}, population: 0,
    lifetimeAuthority: 35, requiredBuilding: "oil-press", chronicle: "lamp-complaint",
  },
} as const;
