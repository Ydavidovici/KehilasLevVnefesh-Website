const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const dbPath = path.join(__dirname, 'minyan.db');

// Function definitions first
function initializeTables(db) {
    db.run(`CREATE TABLE IF NOT EXISTS minyan_times (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        time TEXT NOT NULL
    )`, errorHandler);

    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`, errorHandler);

    // New table for file uploads
    db.run(`CREATE TABLE IF NOT EXISTS file_uploads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        originalname TEXT NOT NULL,
        mimetype TEXT NOT NULL,
        destination TEXT NOT NULL,
        filename TEXT NOT NULL,
        path TEXT NOT NULL,
        size INTEGER NOT NULL
    )`, errorHandler);
}

function seedAdmins(db) {
    const insert = `INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)`;
    // Example admin passwords, ensure you replace these with secure values
    bcrypt.hash('adminPassword1', 10, (err, hash) => {
        if (err) return console.error('Error hashing password:', err);
        db.run(insert, ["admin1", hash]);
    });
    bcrypt.hash('adminPassword2', 10, (err, hash) => {
        if (err) return console.error('Error hashing password:', err);
        db.run(insert, ["admin2", hash]);
    });
}

function errorHandler(err) {
    if (err) console.error('SQLite Error:', err.message);
}

// Single db variable declaration and initialization
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
    initializeTables(db); // Pass the db instance to these functions
    seedAdmins(db);
});

module.exports = db;
