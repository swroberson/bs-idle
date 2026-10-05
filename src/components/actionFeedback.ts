import { BUILDINGS } from "@/content/buildings";
import { EXPEDITIONS } from "@/content/expeditions";
import { RESEARCH } from "@/content/research";
import { JOBS } from "@/content/jobs";
import type { GameAction } from "@/game/types";

export function actionFeedback(action: GameAction): string {
  switch (action.type) {
    case "read-chronicle": case "dismiss-illustrations": case "advance-awakening": return "";
    case "awaken-junction": return "Junction // active";
    case "gather-food": return "Provisions gathered // stores updated";
    case "render-oil": return "Lamp fuel rendered // stores updated";
    case "assign-worker": return `${JOBS[action.job].name} // ${action.delta === 1 ? "assigned" : "released"}`;
    case "build": return `${BUILDINGS[action.building].name} // construction started`;
    case "choose-event": return "Response recorded // Chronicle updated";
    case "research": return `${RESEARCH[action.research].name} // ${action.research === "restore-conduit" ? "restoration started" : "recorded"}`;
    case "start-expedition": return `${EXPEDITIONS[action.destination].name} // ${action.workers} inhabitants dispatched`;
  }
}
