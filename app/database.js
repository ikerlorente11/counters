import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("databaseName");

const createTables = () => {
  //   db.execSync("DROP TABLE IF EXISTS `Counters`;");
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
};

const getCounters = (id = null) => {
  if (id) {
    return db.getFirstSync("SELECT * FROM Counters WHERE id =?", [id]);
  }

  return db.getAllSync("SELECT * FROM Counters;");
};

const insertCounter = ({ title, value, color, bgColor }) => {
  db.runSync(
    "INSERT INTO Counters (title, value, color, bgColor) VALUES (?, ?, ?, ?)",
    [title, value, color, bgColor],
  );
};

const updateCounter = ({ id, title, value, color, bgColor }) => {
  db.runSync(
    "UPDATE Counters SET title = ?, value = ?, color = ?, bgColor = ? WHERE id = ?;",
    [title, value, color, bgColor, id],
  );
};

const updateCounterValue = ({ id, value }) => {
  db.runSync("UPDATE Counters SET value = ? WHERE id = ?;", [value, id]);
};

const deleteCounter = ({ id }) => {
  db.runSync("DELETE FROM Counters WHERE id =?", [id]);
};

export {
  createTables,
  getCounters,
  insertCounter,
  updateCounter,
  updateCounterValue,
  deleteCounter,
};
