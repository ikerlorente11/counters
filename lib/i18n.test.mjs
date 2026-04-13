import test from "node:test";
import assert from "node:assert/strict";
import {
  createTranslator,
  formatPersistedDate,
  parsePersistedDate,
  resolveLanguage,
} from "./i18n.js";

test("resolveLanguage returns Spanish for es locales and English otherwise", () => {
  assert.equal(resolveLanguage("es-ES"), "es");
  assert.equal(resolveLanguage("es-MX"), "es");
  assert.equal(resolveLanguage("en-US"), "en");
  assert.equal(resolveLanguage(undefined), "en");
});

test("createTranslator interpolates translated values", () => {
  const t = createTranslator("es");
  assert.equal(t("detail.showChartRange", { range: "7d" }), "Mostrar rango 7d en la gráfica");
});

test("parsePersistedDate parses persisted ISO values", () => {
  const parsedDate = parsePersistedDate("2025-10-13");
  assert.equal(parsedDate?.toISOString(), "2025-10-13T00:00:00.000Z");
});

test("formatPersistedDate formats dates according to language", () => {
  assert.equal(
    formatPersistedDate("2025-10-13", "en", { year: "numeric", month: "2-digit", day: "2-digit" }),
    "10/13/2025",
  );
  assert.equal(
    formatPersistedDate("2025-10-13", "es", { year: "numeric", month: "2-digit", day: "2-digit" }),
    "13/10/2025",
  );
});