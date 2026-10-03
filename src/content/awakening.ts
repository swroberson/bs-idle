// Approved local observations. These records do not explain the larger system.
export const AWAKENING = {
  name: "Awaken the Junction",
  description: "Remove the oil fittings from the marked lamps. Draw the movable stone forward to its tested stop with the repaired joint seated. Observe the chamber and the lamps above.",
  requirements: { research: ["restore-conduit", "study-engine"], buildings: { "buried-engine": 1 } },
  currentPerSecond: .02,
  passages: [
    { title: "Beneath the Ward", text: "The oil fittings are lifted from the marked lamps. The remaining oil is poured back into the stores, and the empty vessels are set beside the wall.\n\nThe stone reaches its stop. The sound comes through the platform before anyone hears it. Dust moves along the joint. The lifting rope hangs slack." },
    { title: "The Processional Way", text: "Orso is waiting beside the first stripped fixture. Its pale lining becomes white. Farther along the passage, another lamp answers it, then another. The vessels stand beside the wall. There is no flame." },
    { title: "The entry in the ledger", text: "Orso puts his hand beneath one of the lamps. His shadow falls on the stone. He takes up an empty vessel and turns it in his hand, then sets it down again. In the oil column, the scrivener writes nothing. The lamps continue to burn." },
  ],
} as const;

export const WARD_RECORDS = {
  "gatehouse-find": { title: "The piece inside the stone", text: "The party brings back bent iron and a broken block. A strip of black material passes through the block without a fastening. They could free the stone from the rubble, but not the strip from the stone." },
  "barrow-find": { title: "The unmarked object", text: "Beneath the fallen bank, the party finds a shallow cup with no foot. It lies on its side and holds a little dry earth. There is no mark on it. In the House of Antiquities, it will not sit flat on any shelf." },
  "aqueduct-find": { title: "Beneath the channel bed", text: "The watercourse rests on a smooth black length wider than the channel above it. At a break in the stone, a narrower length leaves its side and passes under the chapel wall. The party copies the edges and their distances onto the survey sheet. Neither end is visible." },
  "chapel-find": { title: "The edge of the closure", text: "Below the sockets, the party uncovers the edge of a slab fitted into the black surface. A shallow recess remains clear beside it. The catch inside moves under a wooden probe. The slab itself does not move." },
  "conduit-trace": { title: "A break in the line", text: "The measurements meet beneath the chapel. Where rubble has shifted, the narrow black length ends short of its next section. Pale material shows on both broken faces. The scrivener draws the gap at its measured width and leaves the rest of the page empty." },
  "subterranean-works-built": { title: "Work beneath the chapel", text: "Timber holds the loose courses apart. A rope passes over the new beam, and the spoil is carried up in baskets. The lower stair is narrow enough that those descending must wait for those coming back." },
  "chamber-opened": { title: "The room beyond the slab", text: "The slab comes forward by the breadth of a hand, then turns on a point below the floor. Behind it, the black surface continues into darkness. A raised length runs along one wall. The loose end recorded in the tracing lies beside it. Only the nearest floor has been cleared." },
  "engine-works-built": { title: "A platform in the chamber", text: "The platform ends before the far wall can be seen. On it, a lamp, a wooden gauge, and a folded cloth are placed within reach. The exposed work has been entered in the ledger under a new heading: Buried Engine." },
  "engine-study": { title: "Two movements", text: "The joining piece sits between the broken faces when lifted into line. Its pale edges meet theirs. Beside it, a narrow stone can be drawn forward only a finger's breadth; in that position, the piece cannot be lowered. With the stone returned, it can. The two movements are entered separately in the ledger.\n\nAbove, Orso lifts the vessel from one of the wall lamps. Beneath its holder is the pale surface drawn in the third lamp's record. A narrow seam enters the base. He replaces the vessel and records which other fixtures have the same lining." },
  "conduit-restored": { title: "The joint holds", text: "The support takes the weight. When the lifting rope slackens, the pale edges remain together. A fine line is still visible between them. Orso checks the ordinary lamps above and returns with his usual tally of oil.\n\nOrso marks the fixtures along the Processional Way that have the same lining. Their oil vessels and wick holders are left in place. The third lamp remains where it was." },
  "lamp-house-built": { title: "The measured vessels", text: "The vessels are set in a row. Orso marks the level of oil in each before carrying them out. He returns the empties to the same places." },
  "smithy-built": { title: "Tools awaiting repair", text: "The bellows are patched. A garden blade lies across the anvil, and a basket of worn tools waits beneath the bench." },
  "iron-tools": { title: "The refitted edges", text: "The garden blades are straightened and their edges refitted. They cut cleanly through the old beds." },
  "improved-presses": { title: "A measured turn", text: "The bearings are refitted. A full turn of the press yields more oil from the same work." },
  "black-metal-study": { title: "The unmarked strip", text: "The strip has the same dark surface as the recovered fragments, but no pale lining is exposed. Filing marks remain on the stone beside it. There is no corresponding mark on the strip. Both are drawn as they were brought in." },
  "junction-awakened": { title: "The lamps continue to burn", text: AWAKENING.passages.map(passage => passage.text).join("\n\n") },
} as const;
