const DAY_WINDOW_BY_RANGE = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "6m": 183,
};

/**
 * Returns counter values limited to the selected history range.
 * @param {Array<unknown>} counterValues
 * @param {string} range
 * @returns {Array<unknown>}
 */
export const getCounterValuesForRange = (counterValues, range) => {
  const safeCounterValues = Array.isArray(counterValues) ? counterValues : [];

  if (range === "all") {
    return safeCounterValues;
  }

  const dayWindow = DAY_WINDOW_BY_RANGE[range] ?? DAY_WINDOW_BY_RANGE["7d"];
  return safeCounterValues.slice(-dayWindow);
};

export const COUNTER_CHART_FILTERS = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "6m", label: "6m" },
  { key: "all", label: "All" },
];