export const DEV_PREVIEW_IDS_KEY = "devPreviewCounterIdsV4";
export const DEV_PREVIEW_VERSION_KEY = "devPreviewDatasetVersion";
export const DEV_PREVIEW_VERSION = "v11";
export const LEGACY_DEV_PREVIEW_SEED_KEY = "devPreviewCounterSeededV2";
export const LEGACY_DEV_PREVIEW_TITLE = "Monthly Check-ins";

const PREVIEW_COUNTER_DEFINITIONS = [
  {
    title: "Hydration Streak",
    color: "#172426",
    bgColor: "#5d8b82",
    baseValue: 6,
    trend: 0.01,
    waveDivisor: 9,
    waveAmplitude: 0.8,
    weeklyPulse: 0.6,
    minValue: 4,
  },
  {
    title: "Move Goal",
    color: "#172033",
    bgColor: "#697fa7",
    baseValue: 9200,
    trend: 10,
    waveDivisor: 10,
    waveAmplitude: 420,
    weeklyPulse: 480,
    minValue: 6000,
  },
  {
    title: "Workout Flow",
    color: "#241b31",
    bgColor: "#866fa2",
    baseValue: 2,
    trend: 0.008,
    waveDivisor: 11,
    waveAmplitude: 0.35,
    weeklyPulse: 0.5,
    minValue: 1,
  },
  {
    title: "Focus Sessions",
    color: "#111827",
    bgColor: "#d0bc86",
    baseValue: 3,
    trend: 0.012,
    waveDivisor: 12,
    waveAmplitude: 0.35,
    weeklyPulse: 0.4,
    minValue: 2,
  },
  {
    title: "Savings Boost",
    color: "#2c1f24",
    bgColor: "#b37e87",
    baseValue: 420,
    trend: 2.7,
    waveDivisor: 12,
    waveAmplitude: 18,
    weeklyPulse: 14,
    minValue: 280,
  },
  {
    title: "Mindful Minutes",
    color: "#1b2a28",
    bgColor: "#6e9b92",
    baseValue: 12,
    trend: 0.05,
    waveDivisor: 13,
    waveAmplitude: 2.2,
    weeklyPulse: 1.4,
    minValue: 8,
  },
  {
    title: "Sleep Quality",
    color: "#1a2430",
    bgColor: "#677d97",
    baseValue: 78,
    trend: 0.06,
    waveDivisor: 14,
    waveAmplitude: 3.8,
    weeklyPulse: 2.2,
    minValue: 68,
  },
  {
    title: "Reading Ritual",
    color: "#111827",
    bgColor: "#cdae84",
    baseValue: 24,
    trend: 0.09,
    waveDivisor: 10,
    waveAmplitude: 2.8,
    weeklyPulse: 2.1,
    minValue: 16,
  },
];

/**
 * Builds representative preview counters for development screenshots.
 * @returns {Array<{title: string, value: number, color: string, bgColor: string, displayOrder: number, history: Array<{date: string, value: number}>}>}
 */
export function buildDevelopmentPreviewDataset() {
  return PREVIEW_COUNTER_DEFINITIONS.map((definition, index) => {
    const history = buildPreviewHistory(definition);

    return {
      title: definition.title,
      value: history[history.length - 1]?.value ?? definition.baseValue,
      color: definition.color,
      bgColor: definition.bgColor,
      displayOrder: index,
      history,
    };
  });
}

/**
 * Serializes preview counter ids for persistence in config.
 * @param {Array<number>} ids
 * @returns {string}
 */
export function serializePreviewCounterIds(ids) {
  return JSON.stringify(ids);
}

/**
 * Parses persisted preview counter ids from config.
 * @param {string | undefined | null} value
 * @returns {Array<number>}
 */
export function parsePreviewCounterIds(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry) => Number.isInteger(entry) && entry > 0);
  } catch {
    return [];
  }
}

function buildPreviewHistory(definition) {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
  const dailyHistory = [];
  let value = definition.baseValue;

  for (let index = 0; index <= 183; index += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    const wave = Math.sin(index / definition.waveDivisor) * definition.waveAmplitude;
    const trend = index * definition.trend;
    const pulse = index % 7 === 0 ? definition.weeklyPulse : index % 13 === 0 ? -definition.weeklyPulse * 0.7 : 0;
    value = Math.max(definition.minValue, Math.round(definition.baseValue + trend + wave + pulse));

    dailyHistory.push({
      date: formatDateParts(date.getFullYear(), date.getMonth() + 1, date.getDate()),
      value,
    });
  }

  return dailyHistory;
}

function formatDateParts(year, month, day) {
  const safeMonth = month > 9 ? month : `0${month}`;
  const safeDay = day > 9 ? day : `0${day}`;

  return `${year}/${safeMonth}/${safeDay}`;
}
