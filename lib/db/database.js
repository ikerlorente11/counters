import * as SQLite from "expo-sqlite";
import Constants from "expo-constants";
import { getArchiveTimestamp } from "../counterArchive";
import { normalizeTitle, toSafeInt } from "../counterValidation";
import {
  buildDevelopmentPreviewDataset,
  DEV_PREVIEW_IDS_KEY,
  DEV_PREVIEW_VERSION,
  DEV_PREVIEW_VERSION_KEY,
  LEGACY_DEV_PREVIEW_SEED_KEY,
  LEGACY_DEV_PREVIEW_TITLE,
  parsePreviewCounterIds,
  serializePreviewCounterIds,
} from "../developmentPreview";

const db = SQLite.openDatabaseSync("databaseName");
const isDevelopmentBuild = typeof globalThis !== "undefined" && globalThis.__DEV__ === true;
const isExpoGo = Constants.executionEnvironment === "storeClient" || Constants.appOwnership === "expo";

let isRepairingSchema = false;

const withDbGuard = (operation, fallbackValue) => {
  try {
    return operation();
  } catch (error) {
    if (isMissingArchiveColumnError(error) || isMissingCountersTableError(error)) {
      try {
        repairCountersSchema();
        return operation();
      } catch (retryError) {
        console.error("Database operation failed after schema repair:", retryError);
        return fallbackValue;
      }
    }

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

const isMissingArchiveColumnError = (error) => {
  const errorMessage = `${error}`;
  return errorMessage.includes("no such column: isArchived") || errorMessage.includes("no such column: archivedAt") || errorMessage.includes("no such column: displayOrder");
};

const isMissingCountersTableError = (error) => {
  const errorMessage = `${error}`;
  return errorMessage.includes("no such table: Counters");
};

const isDuplicateColumnError = (error) => {
  const errorMessage = `${error}`;
  return errorMessage.includes("duplicate column name");
};

const repairCountersSchema = () => {
  if (isRepairingSchema) {
    return;
  }

  isRepairingSchema = true;

  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS Counters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          value INTEGER,
          color TEXT,
          bgColor TEXT,
          isArchived INTEGER NOT NULL DEFAULT 0,
          archivedAt TEXT
      );
    `);

    ensureCountersArchiveColumns();
  } finally {
    isRepairingSchema = false;
  }
};

const runWithArchiveSchemaRetry = (operation) => {
  try {
    return operation();
  } catch (error) {
    if (!isMissingArchiveColumnError(error)) {
      throw error;
    }

    ensureCountersArchiveColumns();
    return operation();
  }
};

const hasColumn = (tableName, columnName) => {
  const columns = db.getAllSync(`PRAGMA table_info(${tableName});`);
  return columns.some((column) => column.name === columnName);
};

const ensureCountersArchiveColumns = () => {
  if (!hasColumn("Counters", "isArchived")) {
    try {
      db.execSync("ALTER TABLE Counters ADD COLUMN isArchived INTEGER NOT NULL DEFAULT 0;");
    } catch (error) {
      if (!isDuplicateColumnError(error)) {
        throw error;
      }
    }
  }

  if (!hasColumn("Counters", "archivedAt")) {
    try {
      db.execSync("ALTER TABLE Counters ADD COLUMN archivedAt TEXT;");
    } catch (error) {
      if (!isDuplicateColumnError(error)) {
        throw error;
      }
    }
  }

  if (!hasColumn("Counters", "displayOrder")) {
    try {
      db.execSync("ALTER TABLE Counters ADD COLUMN displayOrder INTEGER DEFAULT 0;");
    } catch (error) {
      if (!isDuplicateColumnError(error)) {
        throw error;
      }
    }
  }
};

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
          bgColor TEXT,
          isArchived INTEGER NOT NULL DEFAULT 0,
          archivedAt TEXT
      );
    `);

    ensureCountersArchiveColumns();

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
 * Synchronizes development preview counters.
 * In development it seeds realistic screenshot data.
 * In production it purges any preview data that might exist from prior dev installs.
 * @returns {boolean}
 */
const syncDevelopmentPreviewData = () => {
  return isDevelopmentBuild ? seedDevelopmentPreviewData() : purgeDevelopmentPreviewData();
};

const seedDevelopmentPreviewData = () => {
  return withDbGuard(() => {
    const storedVersion = db.getFirstSync(
      "SELECT value FROM Config WHERE field = ?",
      [DEV_PREVIEW_VERSION_KEY],
    )?.value;
    const existingPreviewIds = parsePreviewCounterIds(db.getFirstSync(
      "SELECT value FROM Config WHERE field = ?",
      [DEV_PREVIEW_IDS_KEY],
    )?.value);
    const existingPreviewCount = existingPreviewIds.length > 0
      ? db.getAllSync(
        `SELECT id FROM Counters WHERE id IN (${existingPreviewIds.map(() => "?").join(",")})`,
        existingPreviewIds,
      ).length
      : 0;
    const previewDataset = buildDevelopmentPreviewDataset();

    if (!isExpoGo && storedVersion === DEV_PREVIEW_VERSION && existingPreviewCount === previewDataset.length) {
      return false;
    }

    return runInTransaction(() => {
      purgeDevelopmentPreviewDataUnsafe();

      const insertedIds = [];

      for (const counter of previewDataset) {
        const counterId = db.runSync(
          "INSERT INTO Counters (title, value, color, bgColor, displayOrder) VALUES (?, ?, ?, ?, ?)",
          [counter.title, counter.value, counter.color, counter.bgColor, counter.displayOrder],
        ).lastInsertRowId;

        insertedIds.push(counterId);

        for (const entry of counter.history) {
          db.runSync(
            "INSERT INTO CounterValues (date, value, counter_id) VALUES (?, ?, ?)",
            [entry.date, entry.value, counterId],
          );
        }
      }

      db.runSync(
        "INSERT OR REPLACE INTO Config (field, value) VALUES (?, ?)",
        [DEV_PREVIEW_IDS_KEY, serializePreviewCounterIds(insertedIds)],
      );
      db.runSync(
        "INSERT OR REPLACE INTO Config (field, value) VALUES (?, ?)",
        [DEV_PREVIEW_VERSION_KEY, DEV_PREVIEW_VERSION],
      );

      return true;
    });
  }, false);
};

const purgeDevelopmentPreviewData = () => {
  return withDbGuard(() => {
    return runInTransaction(() => {
      return purgeDevelopmentPreviewDataUnsafe();
    });
  }, false);
};

const purgeDevelopmentPreviewDataUnsafe = () => {
  const previewIds = parsePreviewCounterIds(db.getFirstSync(
    "SELECT value FROM Config WHERE field = ?",
    [DEV_PREVIEW_IDS_KEY],
  )?.value);
  const legacySeeded = db.getFirstSync(
    "SELECT value FROM Config WHERE field = ?",
    [LEGACY_DEV_PREVIEW_SEED_KEY],
  )?.value;

  if (previewIds.length > 0) {
    db.runSync(
      `DELETE FROM Counters WHERE id IN (${previewIds.map(() => "?").join(",")})`,
      previewIds,
    );
  }

  if (legacySeeded === "true") {
    db.runSync(
      "DELETE FROM Counters WHERE title = ?",
      [LEGACY_DEV_PREVIEW_TITLE],
    );
  }

  db.runSync(
    "DELETE FROM Config WHERE field IN (?, ?, ?)",
    [DEV_PREVIEW_IDS_KEY, DEV_PREVIEW_VERSION_KEY, LEGACY_DEV_PREVIEW_SEED_KEY],
  );

  return previewIds.length > 0 || legacySeeded === "true";
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
      return runWithArchiveSchemaRetry(() => db.getFirstSync("SELECT * FROM Counters WHERE id = ? AND isArchived = 0", [id]));
    }

    return runWithArchiveSchemaRetry(() => db.getAllSync("SELECT * FROM Counters WHERE isArchived = 0 ORDER BY displayOrder ASC, id ASC;"));
  }, id ? null : []);
};

/**
 * Returns archived counters sorted by latest archive date.
 * @returns {Array<object>}
 */
const getArchivedCounters = () => {
  return withDbGuard(
    () => runWithArchiveSchemaRetry(() => db.getAllSync(
      "SELECT * FROM Counters WHERE isArchived = 1 ORDER BY archivedAt DESC, id DESC;",
    )),
    [],
  );
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

      const updateResult = runWithArchiveSchemaRetry(() => db.runSync(
        "UPDATE Counters SET title = ?, value = ?, color = ?, bgColor = ?, archivedAt = NULL WHERE id = ? AND isArchived = 0;",
        [
          normalizedCounter.title,
          normalizedCounter.value,
          normalizedCounter.color,
          normalizedCounter.bgColor,
          id,
        ],
      ));

      if ((updateResult?.changes ?? 0) === 0) {
        return false;
      }

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
    const archiveResult = runWithArchiveSchemaRetry(() => db.runSync(
      "UPDATE Counters SET isArchived = 1, archivedAt = ? WHERE id = ? AND isArchived = 0",
      [getArchiveTimestamp(), id],
    ));

    return (archiveResult?.changes ?? 0) > 0;
  }, false);
};

/**
 * Restores one archived counter by id.
 * @param {{id: number}} params
 * @returns {boolean}
 */
const restoreCounter = ({ id }) => {
  return withDbGuard(() => {
    const restoreResult = runWithArchiveSchemaRetry(() => db.runSync(
      "UPDATE Counters SET isArchived = 0, archivedAt = NULL WHERE id = ? AND isArchived = 1",
      [id],
    ));

    return (restoreResult?.changes ?? 0) > 0;
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

      const updateResult = runWithArchiveSchemaRetry(() => db.runSync("UPDATE Counters SET value = ? WHERE id = ? AND isArchived = 0;", [safeValue, id]));

      if ((updateResult?.changes ?? 0) === 0) {
        return false;
      }

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

const formatDateParts = (year, month, day) => {
  const safeMonth = month > 9 ? month : `0${month}`;
  const safeDay = day > 9 ? day : `0${day}`;

  return `${year}/${safeMonth}/${safeDay}`;
};

/**
 * Updates the display order of counters based on a new order array.
 * @param {Array<number>} counterIds - Array of counter IDs in the new order
 * @returns {boolean}
 */
/**
 * Resets a single counter value to 0 and records the reset in history.
 * @param {{id: number}} params
 * @returns {boolean}
 */
const resetCounter = ({ id }) => {
  return withDbGuard(() => {
    return runInTransaction(() => {
      const updateResult = runWithArchiveSchemaRetry(() => db.runSync("UPDATE Counters SET value = 0 WHERE id = ? AND isArchived = 0;", [id]));

      if ((updateResult?.changes ?? 0) === 0) {
        return false;
      }

      db.runSync(
        "INSERT OR REPLACE INTO CounterValues (date, value, counter_id) VALUES (?, ?, ?)",
        [currentDate(), 0, id],
      );

      return true;
    });
  }, false);
};

/**
 * Resets all active counters to 0 and records the reset in history for each.
 * @returns {boolean}
 */
const resetAllCounters = () => {
  return withDbGuard(() => {
    return runInTransaction(() => {
      const counters = db.getAllSync("SELECT id FROM Counters WHERE isArchived = 0;");

      if (counters.length === 0) {
        return true;
      }

      const today = currentDate();
      for (const counter of counters) {
        runWithArchiveSchemaRetry(() => db.runSync("UPDATE Counters SET value = 0 WHERE id = ?;", [counter.id]));
        db.runSync(
          "INSERT OR REPLACE INTO CounterValues (date, value, counter_id) VALUES (?, ?, ?)",
          [today, 0, counter.id],
        );
      }

      return true;
    });
  }, false);
};

/**
 * Undoes a same-day reset by removing today's 0 entries and restoring each
 * counter to its most recent historical value before today.
 * @returns {boolean}
 */
const undoResetAllCounters = () => {
  return withDbGuard(() => {
    return runInTransaction(() => {
      const today = currentDate();
      const counters = db.getAllSync("SELECT id FROM Counters WHERE isArchived = 0;");

      for (const counter of counters) {
        db.runSync(
          "DELETE FROM CounterValues WHERE counter_id = ? AND date = ? AND value = 0;",
          [counter.id, today],
        );

        const lastEntry = db.getFirstSync(
          "SELECT value FROM CounterValues WHERE counter_id = ? ORDER BY date DESC LIMIT 1;",
          [counter.id],
        );

        const restoredValue = lastEntry?.value ?? 0;
        runWithArchiveSchemaRetry(() => db.runSync(
          "UPDATE Counters SET value = ? WHERE id = ? AND isArchived = 0;",
          [restoredValue, counter.id],
        ));
      }

      return true;
    });
  }, false);
};

const updateCountersOrder = (counterIds) => {
  return withDbGuard(() => {
    return runInTransaction(() => {
      for (let index = 0; index < counterIds.length; index++) {
        runWithArchiveSchemaRetry(() => db.runSync(
          "UPDATE Counters SET displayOrder = ? WHERE id = ? AND isArchived = 0;",
          [index, counterIds[index]],
        ));
      }
      return true;
    });
  }, false);
};

export {
  createTables,
  syncDevelopmentPreviewData,
  getConfig,
  updateConfig,
  getCounters,
  getArchivedCounters,
  insertCounter,
  updateCounter,
  deleteCounter,
  restoreCounter,
  getCountersValues,
  updateCounterValue,
  updateCountersOrder,
  resetCounter,
  resetAllCounters,
  undoResetAllCounters,
};
