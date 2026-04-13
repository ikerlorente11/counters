import test from "node:test";
import assert from "node:assert/strict";
import { buildYearEndGroupedReport, buildYearEndReportText, buildYearSectionText } from "./reporting.js";

test("buildYearEndGroupedReport returns counters grouped by year-end snapshot", () => {
  const counters = [
    { id: 1, title: "Water" },
    { id: 2, title: "Books" },
  ];
  const values = [
    { counter_id: 1, date: "2024/01/03", value: 4 },
    { counter_id: 2, date: "2024/02/10", value: 10 },
    { counter_id: 1, date: "2024/12/31", value: 12 },
    { counter_id: 2, date: "2025/03/09", value: 14 },
    { counter_id: 1, date: "2025/12/20", value: 18 },
  ];

  assert.deepEqual(buildYearEndGroupedReport(counters, values), [
    {
      year: "2024",
      items: [
        { counterId: 1, counterTitle: "Water", value: 12, recordedAt: "2024/12/31" },
        { counterId: 2, counterTitle: "Books", value: 10, recordedAt: "2024/02/10" },
      ],
    },
    {
      year: "2025",
      items: [
        { counterId: 1, counterTitle: "Water", value: 18, recordedAt: "2025/12/20" },
        { counterId: 2, counterTitle: "Books", value: 14, recordedAt: "2025/03/09" },
      ],
    },
  ]);
});

test("buildYearSectionText renders header and item lines", () => {
  const text = buildYearSectionText({
    year: "2025",
    items: [
      { counterTitle: "Water", value: 18 },
      { counterTitle: "Books", value: 14 },
    ],
  }, (key, params) => {
    if (key === "report.yearHeader") {
      return params.year;
    }
    if (key === "report.itemLine") {
      return `${params.counter}: ${params.value}`;
    }

    return key;
  });

  assert.equal(text, "2025\nWater: 18\nBooks: 14");
});

test("buildYearEndReportText joins all sections", () => {
  const text = buildYearEndReportText([
    {
      year: "2025",
      items: [{ counterTitle: "Water", value: 18 }],
    },
    {
      year: "2026",
      items: [{ counterTitle: "Books", value: 20 }],
    },
  ], (key, params) => {
    if (key === "report.yearHeader") {
      return params.year;
    }
    if (key === "report.itemLine") {
      return `${params.counter}: ${params.value}`;
    }

    return key;
  });

  assert.equal(text, "2025\nWater: 18\n\n2026\nBooks: 20");
});