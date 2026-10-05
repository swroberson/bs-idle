import { WARD_RECORDS } from "./awakening";

export const CHRONICLE = {
  ...WARD_RECORDS,
  appointment: {
    title: "The office of Keeper",
    text: "The register is placed before you. Five names remain beneath the heading ‘Outer Ward.’ Beside it lies a ring of keys, most of them without a known lock. Your first duty is written in a newer hand: keep the lamps burning.",
  },
  "lamp-outage": {
    title: "An unlit stretch",
    text: "An ordinary lamp has gone out. Between the neighboring pools of light, a stretch of the Way is dark. The omission is entered beneath the Keeper's name.",
  },
  "oil-press-built": {
    title: "Oil Press",
    text: "The screw turns easily once cleaned. Oil collects in the vessels beneath it. No one remembers who cut its thread.",
  },
  household: {
    title: "Three more names",
    text: "The woman gives her name as Nera. She places a little bag of seeds beside the register before asking where she should work. Three names are entered beneath the five.",
  },
  stoneworking: {
    title: "Stone set aside",
    text: "At the Smithy, the chipped edges are dressed before the stone is carried out. Pieces that once went to the waste heap are set aside for the next wall. The tally of purchased stone grows shorter.",
  },
  "repair-household": {
    title: "A mended threshold",
    text: "Two more names are entered in the register. The handcart is unloaded beneath the arch. By evening, a chipped stone has been turned and bedded again at the room's entrance. The cooking pot hangs above a small fire inside.",
  },
  "provision-stores": {
    title: "Provisions by the stair",
    text: "Food is measured before it is wrapped. The baskets wait beside the cleared stair, each with its tally tied beneath the handle. Loose handfuls no longer disappear between the stores and the departing party.",
  },
  "apprenticed-hands": {
    title: "Two at the bench",
    text: "One holds the stone while another dresses its edge. They exchange places before their hands grow numb. At the end of the day, fewer carriers have been called away from the other work.",
  },
  "collated-records": {
    title: "Leaves in order",
    text: "The scrivener lays the loose leaves beside their copies. Measurements are gathered together; observations remain in the hands that first wrote them. A strip of cloth marks each bundle. Less of the day is spent looking for a line already written.",
  },
  "shared-table": {
    title: "A table between doors",
    text: "A table is carried beneath the arch. Bowls stand along its uneven edge, with places left for those still at work. The household's request and the provisions issued are entered in the ledger.",
  },
  "spare-oil": {
    title: "Two jars entered",
    text: "The household's jars are opened beside the press. Their oil is measured into the Ward's vessels, and the exchange is entered beneath the day's ordinary purchases. The empty jars are carried home.",
  },
  "lamp-complaint": {
    title: "The third lamp",
    text: "Orso has reported a lamp without a reservoir. An examination has been authorized. He asks that the lamp remain where it is. He does not say why.",
  },
  "lamp-examination": {
    title: "A seam beneath the chapel",
    text: "There is no wick in the third lamp. Its white lining is cold, yet Orso’s shadow falls behind him when he stands before it. A narrow seam descends from the base into the chapel wall.",
  },
  "ledger-keeping": { title: "A separate ledger", text: "The scrivener copies the third lamp's outline onto a fresh leaf. Beneath it she writes a question, then crosses out the question mark." },
  "crop-rotation": { title: "The empty beds", text: "Each third bed is left fallow. In the empty beds, the roots of the neighboring plants turn toward the chapel." },
  "better-wicks": { title: "The unentered saving", text: "The new wicks draw less oil. Orso enters the saving in the ledger and leaves the third lamp's column blank." },
  "cistern-find": { title: "Below the waterline", text: "The party returns with pale fragments wrapped in cloth. The stair continues below the silt. A groove in its wall has the exact width of the seam beneath the third lamp." },
  "farmstead-find": { title: "A table laid for no one", text: "The food stores are dry and intact. Coins lie in a bowl on the table. Every chair faces the inner wall." },
  "relic-catalog": { title: "Six narrow channels", text: "The smallest fragment bears the same pale lining as the lamp. On its broken edge, six narrow channels run side by side. The scrivener declines to call them veins." },
  "foundation-survey": { title: "The downward sockets", text: "The chapel is built across an older opening. The seam passes through its foundations without a joint. Below the lowest course, the surveyors find a row of sockets, each facing down." },
} as const;
