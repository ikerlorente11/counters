import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("databaseName");

const createTables = () => {
  // db.execSync("DROP TABLE IF EXISTS `Counters`;");
  // db.execSync("DROP TABLE IF EXISTS `CounterValues`;");
  db.execSync('PRAGMA foreign_keys = ON;');

  db.execSync(
    `
    CREATE TABLE IF NOT EXISTS Counters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        value INTEGER,
        color TEXT,
        bgColor TEXT
      );
      `,
  );

  db.execSync(
    `
    CREATE TABLE IF NOT EXISTS CounterValues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        counter_id INTEGER,
        date TEXT,
        value INTEGER,
        FOREIGN KEY (counter_id) REFERENCES Counters(id) ON DELETE CASCADE,
        UNIQUE (counter_id, date)
    );
      `,
  );
};

const getCounters = (id = null) => {
  if (id) {
    return db.getFirstSync("SELECT * FROM Counters WHERE id =?", [id]);
  }

  return db.getAllSync("SELECT * FROM Counters;");
};

const getCountersValues = (counter = null) => {
  if (counter) {
    return db.getAllSync(
      "SELECT * FROM CounterValues WHERE counter_id =? order by date desc",
      [counter],
    );
  }

  return db.getAllSync("SELECT * FROM CounterValues;");
};

const insertCounter = ({ title, value, color, bgColor }) => {
  const lastId = db.runSync(
    "INSERT INTO Counters (title, value, color, bgColor) VALUES (?, ?, ?, ?)",
    [title, value, color, bgColor],
  ).lastInsertRowId;

  db.runSync(
    "INSERT INTO CounterValues (date, value, counter_id) VALUES (?, ?, ?)",
    [currentDate(), value, lastId],
  );
};

const updateCounter = ({ id, title, value, color, bgColor, valueUpdate }) => {
  db.runSync(
    "UPDATE Counters SET title = ?, value = ?, color = ?, bgColor = ? WHERE id = ?;",
    [title, value, color, bgColor, id],
  );

  if (valueUpdate) {
    db.runSync(
      "INSERT OR REPLACE INTO CounterValues (date, value, counter_id) VALUES (?, ?, ?)",
      [currentDate(), value, id],
    );
  }
};

const updateCounterValue = ({ id, value }) => {
  db.runSync("UPDATE Counters SET value = ? WHERE id = ?;", [value, id]);

  db.runSync(
    "INSERT OR REPLACE INTO CounterValues (date, value, counter_id) VALUES (?, ?, ?)",
    [currentDate(), value, id],
  );
};

const deleteCounter = ({ id }) => {
  db.runSync("DELETE FROM Counters WHERE id =?", [id]);
};

const currentDate = () => {
  const date = new Date();
  const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
  const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  const year = date.getFullYear()
  return `${day}/${month}/${year}`;
};

export {
  createTables,
  getCounters,
  getCountersValues,
  insertCounter,
  updateCounter,
  updateCounterValue,
  deleteCounter,
};
