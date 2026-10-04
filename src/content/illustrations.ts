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
    alt: "A worn timber screw press with a turning bar mounted on its spindle, beside oil containers in an unoccupied stone workshop.",
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
  smithy: {
    chronicle: "smithy-built", src: "/art/smithy.webp",
    alt: "A garden blade rests across an anvil beside a lit hearth, patched bellows and worn tools in an unoccupied Smithy.",
    width: 1200, height: 900,
  },
  "sealed-chamber": {
    chronicle: "chamber-opened", src: "/art/sealed-chamber.webp",
    alt: "Lifting tackle holds a displaced slab at a dark chamber entrance; lamplight reaches only the nearest cleared floor.",
    width: 1200, height: 900,
  },
  "junction-awakened": {
    chronicle: "junction-awakened", src: "/art/junction-awakened.webp",
    alt: "White flameless wall lamps illuminate an empty stone passage, with empty oil vessels and removed wick holders beside the wall.",
    width: 1200, height: 900,
  },
} as const satisfies Record<string, IllustrationDefinition>;
