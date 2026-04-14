export const DEFAULT_LAYOUT_MODE = "list";
export const GRID_LAYOUT_MODE = "grid";

/**
 * Validates and normalizes the persisted layout mode.
 * @param {string | null | undefined} value
 * @returns {"list" | "grid"}
 */
export function normalizeLayoutMode(value) {
  return value === GRID_LAYOUT_MODE ? GRID_LAYOUT_MODE : DEFAULT_LAYOUT_MODE;
}
