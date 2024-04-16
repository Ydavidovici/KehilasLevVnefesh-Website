const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Use an in-memory database for testing
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) console.error('Error opening database:', err.message);
});

// Re-import or redefine your functions for initializing tables and seeding data here
// It’s a good idea to modularize your functions in `sqlite.js` so you can import them directly
const { initializeTables, seedAdmins } = require('../db/sqlite');

describe('SQLite Database Tests', () => {
    beforeAll((done) => {
        // Ensure tables are created and admins are seeded before any tests run
        db.serialize(() => {
            initializeTables(db);
            seedAdmins(db, done); // Make sure seedAdmins can accept a callback to signal completion
        });
    });

    test('should create tables without error', (done) => {
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='minyan_times'", (err, row) => {
            expect(err).toBeNull();
            expect(row.name).toBe('minyan_times');
            done();
        });
    });

    test('should insert admin users with hashed passwords', (done) => {
        db.get("SELECT * FROM admins WHERE username = 'admin1'", (err, row) => {
            expect(err).toBeNull();
            expect(row).toBeDefined();
            bcrypt.compare('adminPassword1', row.password, (err, result) => {
                expect(result).toBe(true);
                done();
            });
        });
    });

    // Add more tests as needed for other tables and functionalities

    afterAll((done) => {
        // Close the database after all tests
        db.close(done);
    });
});
