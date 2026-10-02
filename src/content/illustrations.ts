import type { ChronicleId } from "../game/types";

interface IllustrationDefinition {
  chronicle: ChronicleId;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const ILLUSTRATIONS = {
  "keeper-office": {
    chronicle: "appointment", src: "/art/keeper-office.webp",
    alt: "An empty wooden chair before a battered desk, household register and oil lamp in a cramped, shadowed office.",
    width: 1200, height: 900,
  },
  "oil-press": {
    chronicle: "oil-press-built", src: "/art/oil-press.webp",
    alt: "A worker tends a worn screw press beside oil containers in a dim stone workshop.",
    width: 1200, height: 900,
  },
  "lamp-examination": {
    chronicle: "lamp-examination", src: "/art/lamp-examination.webp",
    alt: "The pale lining of a wickless lamp, with a narrow seam descending from its base into the chapel wall.",
    width: 1200, height: 900,
  },
  "cistern-find": {
    chronicle: "cistern-find", src: "/art/cistern-find.webp",
    alt: "Pale recovered fragments on cloth beside an exposed cistern stair that descends into darkness.",
    width: 1200, height: 900,
  },
} as const satisfies Record<string, IllustrationDefinition>;
