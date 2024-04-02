const sqlite3 = require('sqlite3').verbose();

describe('SQLite database tests', () => {
    let db;

    beforeAll(done => {
        // Initialize in-memory database
        db = new sqlite3.Database(':memory:', done);

        // Create tables
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS minyan_times (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                time TEXT NOT NULL
            )`, done);
        });
    });

    afterAll(() => {
        // Close the database connection
        db.close();
    });

    it('should insert a new minyan time', done => {
        // This test might need an increased timeout
        const sql = `INSERT INTO minyan_times (name, time) VALUES (?, ?)`;
        db.run(sql, ['Test Minyan', '08:00'], function(err) {
            expect(err).toBeNull();
            expect(this.lastID).toBeDefined();
            done(); // Signal Jest that the test is complete
        });
    }, 10000); // Increased timeout if needed
});
