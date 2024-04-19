const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(process.env.DB_PATH);


let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

// Function definitions
function initializeTables(db) {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS minyan_times (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                day TEXT NOT NULL,
                name TEXT NOT NULL,
                time TEXT NOT NULL
            )
        `, errorHandler);

        db.run(`
            CREATE TABLE IF NOT EXISTS admins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `, errorHandler);

        db.run(`
            CREATE TABLE IF NOT EXISTS file_uploads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                original_name TEXT NOT NULL,
                file_data BLOB NOT NULL,
                upload_date TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `, errorHandler);

        db.run(`
            CREATE TABLE IF NOT EXISTS announcements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                header TEXT NOT NULL,
                text TEXT NOT NULL
            )
        `, errorHandler);

        db.run(`
            CREATE TABLE IF NOT EXISTS sponsorship_types (
                type_id INTEGER PRIMARY KEY AUTOINCREMENT,
                type_name TEXT NOT NULL,
                description TEXT
            )
        `, errorHandler);

        db.run(`
            CREATE TABLE IF NOT EXISTS sponsorship_details (
                detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
                type_id INTEGER NOT NULL,
                detail_name TEXT NOT NULL,
                description TEXT,
                FOREIGN KEY (type_id) REFERENCES sponsorship_types(type_id)
            )
        `, errorHandler);

        db.run(`
            CREATE TABLE IF NOT EXISTS sponsors (
                sponsor_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                contact_info TEXT
            )
        `, errorHandler);

        db.run(`
            CREATE TABLE IF NOT EXISTS sponsorships (
                sponsorship_id INTEGER PRIMARY KEY AUTOINCREMENT,
                sponsor_id INTEGER NOT NULL,
                detail_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                amount DECIMAL,
                FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id),
                FOREIGN KEY (detail_id) REFERENCES sponsorship_details(detail_id)
            )
        `, errorHandler, () => {
            console.log("All tables initialized successfully");
        });
    });
}



function seedAdmins(db, callback) {
    const insert = `INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)`;
    bcrypt.hash('adminPassword1', 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return callback(err);
        }
        db.run(insert, ["admin1", hash], () => {
            bcrypt.hash('adminPassword2', 10, (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return callback(err);
                }
                db.run(insert, ["admin2", hash], callback);
            });
        });
    });
}

function errorHandler(err) {
    if (err) console.error('SQLite Error:', err.message);
}


if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath)); // Create the directory if it doesn't exist
}

module.exports = { db, initializeTables, seedAdmins };
