/**
 * Builds a year-end report grouped by year with one line per counter.
 * @param {Array<{id: number, title: string}>} counters
 * @param {Array<{counter_id: number, date: string, value: number}>} counterValues
 * @returns {Array<{year: string, items: Array<{counterId: number, counterTitle: string, value: number, recordedAt: string}>}>}
 */
export function buildYearEndGroupedReport(counters, counterValues) {
  const safeCounters = Array.isArray(counters) ? counters : [];
  const safeCounterValues = Array.isArray(counterValues) ? counterValues : [];
  const countersById = new Map(safeCounters.map((counter) => [counter.id, counter.title]));
  const sortedValues = [...safeCounterValues].sort((left, right) => left.date.localeCompare(right.date));
  const latestValueByCounter = new Map();
  const reportGroups = [];
  let currentYear = null;

  for (const entry of sortedValues) {
    const entryYear = extractYear(entry.date);

    if (!entryYear) {
      continue;
    }

    if (currentYear !== null && entryYear !== currentYear) {
      const yearGroup = getYearEndGroup(currentYear, latestValueByCounter, countersById);
      if (yearGroup) {
        reportGroups.push(yearGroup);
      }
    }

    currentYear = entryYear;
    latestValueByCounter.set(entry.counter_id, {
      value: Number.parseInt(entry.value, 10) || 0,
      recordedAt: entry.date,
    });
  }

  if (currentYear !== null) {
    const finalYearGroup = getYearEndGroup(currentYear, latestValueByCounter, countersById);
    if (finalYearGroup) {
      reportGroups.push(finalYearGroup);
    }
  }

  return reportGroups;
}

/**
 * Creates plain text content for one year section.
 * @param {{year: string, items: Array<{counterTitle: string, value: number}>}} yearGroup
 * @param {(key: string, params?: Record<string, string | number>) => string} t
 * @returns {string}
 */
export function buildYearSectionText(yearGroup, t) {
  if (!yearGroup || !Array.isArray(yearGroup.items) || yearGroup.items.length === 0) {
    return t("report.empty");
  }

  const header = t("report.yearHeader", { year: yearGroup.year });
  const lines = yearGroup.items.map((item) => t("report.itemLine", {
    counter: item.counterTitle,
    value: item.value,
  }));

  return [header, ...lines].join("\n");
}

/**
 * Creates plain text content for the full annual report.
 * @param {Array<{year: string, items: Array<{counterTitle: string, value: number}>}>} reportGroups
 * @param {(key: string, params?: Record<string, string | number>) => string} t
 * @returns {string}
 */
export function buildYearEndReportText(reportGroups, t) {
  if (!reportGroups.length) {
    return t("report.empty");
  }

  return reportGroups.map((group) => buildYearSectionText(group, t)).join("\n\n");
}

/**
 * Toggles a report year inside the expanded years collection.
 * @param {Array<string>} expandedYears
 * @param {string} year
 * @returns {Array<string>}
 */
export function toggleExpandedReportYear(expandedYears, year) {
  const safeExpandedYears = Array.isArray(expandedYears) ? expandedYears : [];

  if (safeExpandedYears.includes(year)) {
    return safeExpandedYears.filter((entry) => entry !== year);
  }

  return [...safeExpandedYears, year];
}

function extractYear(dateValue) {
  if (typeof dateValue !== "string") {
    return null;
  }

  const yearMatch = dateValue.match(/^(\d{4})[-/]/);
  return yearMatch?.[1] ?? null;
}

function getYearEndGroup(year, latestValueByCounter, countersById) {
  const items = [];

  for (const [counterId, latestEntry] of latestValueByCounter.entries()) {
    items.push({
      counterId,
      counterTitle: countersById.get(counterId) ?? `#${counterId}`,
      value: latestEntry.value,
      recordedAt: latestEntry.recordedAt,
    });
  }

  if (!items.length) {
    return null;
  }

  return {
    year,
    items: items.sort((left, right) => right.value - left.value || left.counterTitle.localeCompare(right.counterTitle)),
  };
}