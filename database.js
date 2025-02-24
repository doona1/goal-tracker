const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./goalTracker.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create tables for goals and problems
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal TEXT NOT NULL,
      deadline TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS problems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER,
      problem TEXT NOT NULL,
      FOREIGN KEY(goal_id) REFERENCES goals(id)
    )
  `);
});

module.exports = db;
