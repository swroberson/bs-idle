import type { ResourceId } from "@/game/types";

// Distinct silhouettes stay legible in one color at small instrument sizes.
const glyphs: Record<ResourceId, { shape: string; detail: string }> = {
  food: {
    shape: "M12 3C8 3 8 7 12 9C16 7 16 3 12 3ZM4 7C4 12 7 14 12 14C12 9 9 7 4 7ZM20 7C20 12 17 14 12 14C12 9 15 7 20 7ZM4 13C4 18 7 20 12 20C12 15 9 13 4 13ZM20 13C20 18 17 20 12 20C12 15 15 13 20 13Z",
    detail: "M12 9V22",
  },
  oil: {
    shape: "M12 2C10 6 5 10 5 15A7 7 0 0 0 19 15C19 10 14 6 12 2Z",
    detail: "M9 14C8 16 9 18 11 18",
  },
  authority: {
    shape: "M5 3H19V14H5ZM7 14V22L12 19L17 22V14",
    detail: "M9 8H15M12 5V11",
  },
  coin: {
    shape: "M22 12A10 10 0 1 1 2 12A10 10 0 1 1 22 12ZM9 9V15H15V9Z",
    detail: "M12 4V6M12 18V20M4 12H6M18 12H20",
  },
  knowledge: {
    shape: "M12 6C9 3 5 3 2 4V19C6 18 9 19 12 21C15 19 18 18 22 19V4C19 3 15 3 12 6Z",
    detail: "M12 6V21M5 8L9 9M5 12L9 13M15 9L19 8M15 13L19 12",
  },
  relics: {
    shape: "M9 2L21 6L18 14L14 12L15 17L8 22L3 13Z",
    detail: "M9 2L8 10L3 13M8 10L14 12M8 10L10 17L8 22",
  },
  current: {
    shape: "M12 7L17 12L12 17L7 12Z",
    detail: "M12 1V4M12 20V23M1 12H4M20 12H23M4 4L6 6M18 18L20 20M20 4L18 6M6 18L4 20",
  },
};

export function ResourceIcon({ resource }: { resource: ResourceId }) {
  const glyph = glyphs[resource];
  return <svg className={`resource-icon resource-icon-${resource}`} data-resource={resource} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={glyph.shape} fill="currentColor" fillOpacity=".12" fillRule="evenodd" />
    <path d={glyph.detail} />
  </svg>;
}
