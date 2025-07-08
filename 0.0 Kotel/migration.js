import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./boiler_database.db');

db.run('CREATE TABLE IF NOT EXISTS feeding_log (id INTEGER PRIMARY KEY,amount INTEGER,feeded_at TEXT)', (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created or already exists.');
    };
});

db.close();