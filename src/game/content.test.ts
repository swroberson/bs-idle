import { expect, it } from "vitest";
import { BUILDINGS } from "../content/buildings";
import { RESEARCH } from "../content/research";
import { EXPEDITIONS } from "../content/expeditions";
import { JOBS } from "../content/jobs";
import { CHRONICLE } from "../content/chronicle";
import type { ContentRequirements } from "./types";

it("resolves all content prerequisites and uses distinct one-time Chronicle records", () => {
  const records: string[] = [];
  for (const content of [...Object.values(JOBS), ...Object.values(BUILDINGS), ...Object.values(RESEARCH), ...Object.values(EXPEDITIONS)]) {
    const requirements: ContentRequirements = content.requirements;
    for (const id of Object.keys(requirements.buildings ?? {})) expect(Object.hasOwn(BUILDINGS, id)).toBe(true);
    for (const id of requirements.research ?? []) expect(Object.hasOwn(RESEARCH, id)).toBe(true);
    for (const id of requirements.expeditions ?? []) expect(Object.hasOwn(EXPEDITIONS, id)).toBe(true);
    for (const id of requirements.chronicle ?? []) expect(Object.hasOwn(CHRONICLE, id)).toBe(true);
    if ("chronicle" in content) {
      expect(Object.hasOwn(CHRONICLE, content.chronicle)).toBe(true);
      records.push(content.chronicle);
    }
  }
  expect(new Set(records).size).toBe(records.length);
});
