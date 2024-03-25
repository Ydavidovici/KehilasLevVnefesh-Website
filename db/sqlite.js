const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'minyan.db');

let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
        throw err;
    }
    console.log('Connected to the SQLite database.');

    // Create the minyan_times table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS minyan_times (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        time TEXT NOT NULL
    )`);

    // Create the admins table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`, [], function(err) {
        if (err) {
            console.error('Error creating admins table ' + err.message);
        } else {
            console.log('Admins table is ready or already exists.');

            // Inserting admin credentials (use hashed passwords in production)
            const insert = 'INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)';
            db.run(insert, ["admin1", "password1"]);
            db.run(insert, ["admin2", "password2"]);
        }
    });
});
