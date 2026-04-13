import * as SQLite from "expo-sqlite";
import { normalizeTitle, toSafeInt } from "../counterValidation";

const db = SQLite.openDatabaseSync("databaseName");
const DEV_PREVIEW_COUNTER_SEED_KEY = "devPreviewCounterSeededV2";
const DEV_PREVIEW_COUNTER_TITLE = "Monthly Check-ins";
const isDevelopmentBuild = typeof globalThis !== "undefined" && globalThis.__DEV__ === true;

const withDbGuard = (operation, fallbackValue) => {
  try {
    return operation();
  } catch (error) {
    console.error("Database operation failed:", error);
    return fallbackValue;
  }
};

const runInTransaction = (operation) => {
  db.execSync("BEGIN TRANSACTION;");

  try {
    const result = operation();
    db.execSync("COMMIT;");
    return result;
  } catch (error) {
    db.execSync("ROLLBACK;");
    throw error;
  }
};

const normalizeCounterPayload = ({ title, value, color, bgColor }) => ({
  title: normalizeTitle(title),
  value: toSafeInt(value),
  color,
  bgColor,
});

/**
 * Creates required application tables when they do not exist.
 * @returns {boolean}
 */
const createTables = () => {
  return withDbGuard(() => {
    db.execSync("PRAGMA foreign_keys = ON;");

    db.execSync(`
      CREATE TABLE IF NOT EXISTS Config (
          field TEXT PRIMARY KEY,
          value TEXT
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS Counters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          value INTEGER,
          color TEXT,
          bgColor TEXT
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS CounterValues (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          counter_id INTEGER,
          date TEXT,
          value INTEGER,
          FOREIGN KEY (counter_id) REFERENCES Counters(id) ON DELETE CASCADE,
          UNIQUE (counter_id, date)
      );
    `);

    return true;
  }, false);
};

/**
 * Seeds a single development preview counter with six months of history.
 * This data is never created in production builds.
 * @returns {boolean}
 */
const ensureDevelopmentPreviewCounter = () => {
  if (!isDevelopmentBuild) {
    return false;
  }

  return withDbGuard(() => {
    const existingPreviewCounter = db.getFirstSync(
      "SELECT id FROM Counters WHERE title = ?",
      [DEV_PREVIEW_COUNTER_TITLE],
    );

    const alreadySeeded = db.getFirstSync(
      "SELECT value FROM Config WHERE field = ?",
      [DEV_PREVIEW_COUNTER_SEED_KEY],
    )?.value;

    if (alreadySeeded === "true" && existingPreviewCounter?.id) {
      return false;
    }

    return runInTransaction(() => {
      const previewHistory = buildDevelopmentPreviewHistory();
      const latestValue = previewHistory[previewHistory.length - 1]?.value ?? 0;

      let counterId = existingPreviewCounter?.id;

      if (counterId) {
        db.runSync(
          "UPDATE Counters SET value = ?, color = ?, bgColor = ? WHERE id = ?",
          [latestValue, "#f8fafc", "#0f172a", counterId],
        );
        db.runSync("DELETE FROM CounterValues WHERE counter_id = ?", [counterId]);
      } else {
        counterId = db.runSync(
          "INSERT INTO Counters (title, value, color, bgColor) VALUES (?, ?, ?, ?)",
          [DEV_PREVIEW_COUNTER_TITLE, latestValue, "#f8fafc", "#0f172a"],
        ).lastInsertRowId;
      }

      for (const entry of previewHistory) {
        db.runSync(
          "INSERT INTO CounterValues (date, value, counter_id) VALUES (?, ?, ?)",
          [entry.date, entry.value, counterId],
        );
      }

      db.runSync(
        "INSERT OR REPLACE INTO Config (field, value) VALUES (?, ?)",
        [DEV_PREVIEW_COUNTER_SEED_KEY, "true"],
      );

      return true;
    });
  }, false);
};

// ---CONFIG--- //
/**
 * Gets a single configuration value by field key.
 * @param {string} field
 * @returns {string | undefined}
 */
const getConfig = (field) => {
  return withDbGuard(
    () => db.getFirstSync("SELECT value FROM Config WHERE field =?", [field])?.value,
    undefined,
  );
};

/**
 * Inserts or updates a configuration field.
 * @param {{field: string, value: string}} params
 * @returns {boolean}
 */
const updateConfig = ({ field, value }) => {
  return withDbGuard(() => {
    db.runSync("INSERT OR REPLACE INTO Config (field, value) VALUES (?, ?)", [field, value]);
    return true;
  }, false);
};

// ---COUNTERS--- //
/**
 * Returns all counters or one counter by id.
 * @param {number | null} [id=null]
 * @returns {Array<object> | object | null}
 */
const getCounters = (id = null) => {
  return withDbGuard(() => {
    if (id) {
      return db.getFirstSync("SELECT * FROM Counters WHERE id =?", [id]);
    }

    return db.getAllSync("SELECT * FROM Counters;");
  }, id ? null : []);
};

/**
 * Creates a counter and its first historical value atomically.
 * @param {{title: string, value: number | string, color: string, bgColor: string}} params
 * @returns {number | null}
 */
const insertCounter = ({ title, value, color, bgColor }) => {
  return withDbGuard(() => {
    return runInTransaction(() => {
      const normalizedCounter = normalizeCounterPayload({ title, value, color, bgColor });

      const lastId = db.runSync(
        "INSERT INTO Counters (title, value, color, bgColor) VALUES (?, ?, ?, ?)",
        [
          normalizedCounter.title,
          normalizedCounter.value,
          normalizedCounter.color,
          normalizedCounter.bgColor,
        ],
      ).lastInsertRowId;

      db.runSync("INSERT INTO CounterValues (date, value, counter_id) VALUES (?, ?, ?)", [
        currentDate(),
        normalizedCounter.value,
        lastId,
      ]);

      return lastId;
    });
  }, null);
};

/**
 * Updates a counter and optionally updates the historical value for current date.
 * @param {{id: number, title: string, value: number | string, color: string, bgColor: string, valueUpdate: boolean}} params
 * @returns {boolean}
 */
const updateCounter = ({ id, title, value, color, bgColor, valueUpdate }) => {
  return withDbGuard(() => {
    return runInTransaction(() => {
      const normalizedCounter = normalizeCounterPayload({ title, value, color, bgColor });

      db.runSync(
        "UPDATE Counters SET title = ?, value = ?, color = ?, bgColor = ? WHERE id = ?;",
        [
          normalizedCounter.title,
          normalizedCounter.value,
          normalizedCounter.color,
          normalizedCounter.bgColor,
          id,
        ],
      );

      if (valueUpdate) {
        db.runSync(
          "INSERT OR REPLACE INTO CounterValues (date, value, counter_id) VALUES (?, ?, ?)",
          [currentDate(), normalizedCounter.value, id],
        );
      }

      return true;
    });
  }, false);
};

/**
 * Deletes one counter by id.
 * @param {{id: number}} params
 * @returns {boolean}
 */
const deleteCounter = ({ id }) => {
  return withDbGuard(() => {
    db.runSync("DELETE FROM Counters WHERE id =?", [id]);
    return true;
  }, false);
};

// ---COUNTER VALUES--- //
/**
 * Gets all stored counter values or values for a single counter.
 * @param {number | null} [counter=null]
 * @returns {Array<object>}
 */
const getCountersValues = (counter = null) => {
  return withDbGuard(() => {
    if (counter) {
      return db.getAllSync("SELECT * FROM CounterValues WHERE counter_id =? order by date", [
        counter,
      ]);
    }

    return db.getAllSync("SELECT * FROM CounterValues;");
  }, []);
};

/**
 * Updates current counter value and writes or replaces today's historical point.
 * @param {{id: number, value: number | string}} params
 * @returns {boolean}
 */
const updateCounterValue = ({ id, value }) => {
  return withDbGuard(() => {
    return runInTransaction(() => {
      const safeValue = toSafeInt(value);

      db.runSync("UPDATE Counters SET value = ? WHERE id = ?;", [safeValue, id]);

      db.runSync(
        "INSERT OR REPLACE INTO CounterValues (date, value, counter_id) VALUES (?, ?, ?)",
        [currentDate(), safeValue, id],
      );

      return true;
    });
  }, false);
};

const currentDate = () => {
  const date = new Date();
  return formatDateParts(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

/**
 * Creates representative daily data for the preview counter over six months.
 * @returns {Array<{date: string, value: number}>}
 */
function buildDevelopmentPreviewHistory() {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
  const dailyHistory = [];
  let value = 18;

  for (let index = 0; index <= 183; index += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    const wave = Math.sin(index / 9) * 2.4;
    const trend = index * 0.12;
    const weeklyPulse = index % 7 === 0 ? 1.2 : index % 11 === 0 ? -1.1 : 0;
    value = Math.max(4, Math.round(18 + trend + wave + weeklyPulse));

    dailyHistory.push({
      date: formatDateParts(date.getFullYear(), date.getMonth() + 1, date.getDate()),
      value,
    });
  }

  return dailyHistory;
}

/**
 * Formats date parts to the persisted YYYY/MM/DD shape.
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {string}
 */
function formatDateParts(year, month, day) {
  const safeMonth = month > 9 ? month : `0${month}`;
  const safeDay = day > 9 ? day : `0${day}`;

  return `${year}/${safeMonth}/${safeDay}`;
}

export {
  createTables,
  ensureDevelopmentPreviewCounter,
  getConfig,
  updateConfig,
  getCounters,
  insertCounter,
  updateCounter,
  deleteCounter,
  getCountersValues,
  updateCounterValue,
};
