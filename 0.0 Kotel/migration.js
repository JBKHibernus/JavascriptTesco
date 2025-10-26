import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./boiler_database.db');

db.run(
  'CREATE TABLE IF NOT EXISTS feeding_log (id INTEGER PRIMARY KEY,amount INTEGER,feeded_at TEXT)',
  err => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created or already exists.');
    }
  }
);

// Create boiler_status_log table
db.run(
  `CREATE TABLE IF NOT EXISTS boiler_status_log (id INTEGER PRIMARY KEY, logged_at TEXT, status TEXT)`,
  err => {
    if (err) console.error('Error creating boiler_status_log:', err.message);
    else console.log('boiler_status_log table ready.');
  }
);

// Create boiler_parameters table
db.run(
  `CREATE TABLE IF NOT EXISTS boiler_parameters (id TEXT PRIMARY KEY, value INTEGER)`,
  err => {
    if (err) console.error('Error creating boiler_parameters:', err.message);
    else console.log('boiler_parameters table ready.');
  }
);

// Close database after a short delay to ensure all queries finish
setTimeout(() => db.close(), 100);
