export const UI_SCALE_CONFIG_FIELD = "uiScale";
export const DEFAULT_UI_SCALE_INDEX = 0;

/** Multipliers corresponding to xs / sm / md / lg / xl (xs = current size, xl = +30%) */
export const UI_SCALE_OPTIONS = [1.0, 1.075, 1.15, 1.225, 1.3];

/** Display labels for the slider ticks */
export const UI_SCALE_LABELS = ["xs", "sm", "md", "lg", "xl"];

/**
 * Parses and clamps a raw persisted value to a valid index (0–4).
 * @param {string | null | undefined} value
 * @returns {0 | 1 | 2 | 3 | 4}
 */
export function normalizeUiScaleIndex(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) return DEFAULT_UI_SCALE_INDEX;
  if (parsed > UI_SCALE_OPTIONS.length - 1) return UI_SCALE_OPTIONS.length - 1;
  return parsed;
}
