const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 4000;

// Express Middleware
app.use(express.json());
app.use(cors());
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    saveUninitialized: true,
    resave: false,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true }
}));

// Database connection setup
const pool = mysql.createPool({
    host: process.env.DB_HOST_DEV,
    user: process.env.DB_USER_DEV,
    password: process.env.DB_PASS_DEV,
    database: process.env.DB_NAME_DEV,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.on('error', err => {
    console.error('Unexpected error on idle MySQL connection', err);
    process.exit(1);
});

// Helper function for database queries
function query(sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
}

app.post('/api/minyan', async (req, res) => {
    const { name, time, day } = req.body;
    const sql = `INSERT INTO minyan_times (name, time, day) VALUES (?, ?, ?)`;
    try {
        const result = await query(sql, [name, time, day]);
        res.status(201).send({ id: result.insertId });
    } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.get('/api/minyan', async (req, res) => {
    const sql = `SELECT * FROM minyan_times`;
    try {
        const rows = await query(sql);
        res.send(rows);
    } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.put('/api/minyan/:id', async (req, res) => {
    const { id } = req.params;
    const { name, time, day } = req.body;
    const sql = `UPDATE minyan_times SET name = ?, time = ?, day = ? WHERE id = ?`;
    try {
        const result = await query(sql, [name, time, day, id]);
        res.send({ message: 'Minyan time updated', changes: result.affectedRows });
    } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.delete('/api/minyan/:id', async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM minyan_times WHERE id = ?`;
    try {
        const result = await query(sql, [id]);
        res.send({ message: 'Minyan time deleted', changes: result.affectedRows });
    } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
    }
});

const storage = multer.memoryStorage();  // Use memory storage to handle file data in buffer
const upload = multer({ storage: storage });

app.post('/api/files', upload.single('fileInput'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded.' });
    }
    const originalName = req.file.originalname;
    const fileData = req.file.buffer;  // Ensure file data is captured in buffer

    if (!fileData) {
        return res.status(400).send({ error: 'File data is missing.' });
    }

    const sql = `INSERT INTO file_uploads (original_name, file_data) VALUES (?, ?)`;
    try {
        const result = await query(sql, [originalName, fileData]);
        res.status(201).send({ id: result.insertId, message: 'File uploaded successfully' });
    } catch (err) {
        console.error("Error during database operation:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});

app.get('/api/files/:id', async (req, res) => {
    const { id } = req.params;
    const sql = `SELECT original_name, file_data FROM file_uploads WHERE id = ?`;
    try {
        const [row] = await query(sql, [id]);
        if (row) {
            res.setHeader('Content-Type', 'application/pdf'); // Set appropriate content type if known
            res.send(row.file_data);
        } else {
            res.status(404).send({ error: 'File not found' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
    }
});


app.delete('/api/files/:id', async (req, res) => {
    const { id } = req.params;
    const sql = `SELECT original_name FROM file_uploads WHERE id = ?`;
    try {
        const result = await query(sql, [id]);
        if (result.length > 0) {
            // If file is found in the database, proceed to delete it from DB and file system
            const deleteSql = `DELETE FROM file_uploads WHERE id = ?`;
            const deleteResult = await query(deleteSql, [id]);
            const filePath = path.join(__dirname, 'uploads', result[0].original_name);
            fs.unlink(filePath, err => {
                if (err) {
                    console.error("Failed to delete file from file system:", err);
                    return res.status(500).send({ error: 'Failed to delete file from storage.' });
                }
                res.send({ message: 'File deleted successfully', changes: deleteResult.affectedRows });
            });
        } else {
            // If no file is found in the database, check if it exists in the file system and remove it
            const filePath = path.join(__dirname, 'uploads', 'your-default-filename-based-on-id-or-logic');
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, err => {
                    if (err) {
                        console.error("Failed to delete file from file system:", err);
                        return res.status(500).send({ error: 'Failed to delete file from storage.' });
                    }
                    res.send({ message: 'File not found in DB, but deleted from storage.', changes: 0 });
                });
            } else {
                res.status(404).send({ message: 'No file found with the specified ID in DB or storage', changes: 0 });
            }
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.post('/api/announcement', async (req, res) => {
    const { header, text } = req.body;
    const sql = `INSERT INTO announcements (header, text) VALUES (?, ?)`;
    try {
        const result = await query(sql, [header, text]);
        res.status(201).send({ id: result.insertId, message: 'Announcement created successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.get('/api/announcement', async (req, res) => {
    const sql = `SELECT * FROM announcements`;
    try {
        const rows = await query(sql);
        res.send(rows);
    } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.delete('/api/announcement/:id', async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM announcements WHERE id = ?`;
    try {
        const result = await query(sql, [id]);
        res.send({ message: 'Announcement deleted successfully', changes: result.affectedRows });
    } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.post('/api/sponsors', async (req, res) => {
    const { name, sponsored_for, details } = req.body;
    const sql = `INSERT INTO sponsors (name, sponsored_for, details) VALUES (?, ?, ?)`;
    try {
        const result = await query(sql, [name, sponsored_for, details]);
        res.status(201).send({ id: result.insertId, message: 'Sponsor added successfully' });
    } catch (err) {
        console.error("Failed to add sponsor:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});


app.get('/api/sponsors', async (req, res) => {
    const sql = `SELECT * FROM sponsors`;
    try {
        const rows = await query(sql);
        res.send(rows);
    } catch (err) {
        console.error("Failed to retrieve sponsors:", err);
        res.status(500). send({ error: 'Internal server error', detail: err.message });
    }
});


app.delete('/api/sponsors/:id', async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM sponsors WHERE sponsors.sponsor_id = ?`;
    try {
        const result = await query(sql, [id]);
        if (result.affectedRows > 0) {
            res.send({ message: 'Sponsor deleted successfully', changes: result.affectedRows });
        } else {
            res.status(404).send({ message: "No sponsor found with the given ID" });
        }
    } catch (err) {
        console.error("Failed to delete sponsor:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});

app.post('/api/sponsorships', async (req, res) => {
    const { sponsor_id, detail_id, date, amount } = req.body;
    const sql = `INSERT INTO sponsorships (sponsor_id, detail_id, date, amount)
                 VALUES (?, ?, ?, ?)`;
    try {
        const result = await query(sql, [sponsor_id, detail_id, date, amount]);
        res.status(201).send({ id: result.insertId, message: 'Sponsorship added successfully' });
    } catch (err) {
        console.error("Failed to add sponsorship:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});

app.get('/api/sponsorships', async (req, res) => {
    const sql = `SELECT * FROM sponsorships`;
    try {
        const rows = await query(sql);
        res.send(rows);
    } catch (err) {
        console.error("Failed to retrieve sponsorships:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});


app.delete('/api/sponsorships/:id', async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM sponsorships WHERE sponsorship_id = ?`;
    try {
        const result = await query(sql, [id]);
        if (result.affectedRows > 0) {
            res.send({ message: 'Sponsorship deleted successfully', changes: result.affectedRows });
        } else {
            res.status(404).send({ message: "No sponsorship found with the given ID" });
        }
    } catch (err) {
        console.error("Failed to delete sponsorship:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});

app.put('/api/sponsorships/:id', async (req, res) => {
    const { id } = req.params;
    const { sponsor_id, detail_id, amount, date } = req.body; // assuming these are the fields you might want to update
    const sql = `UPDATE sponsorships SET sponsor_id = ?, detail_id = ?, amount = ?, date = ? WHERE sponsorship_id = ?`;

    try {
        const result = await query(sql, [sponsor_id, detail_id, amount, date, id]);
        if (result.affectedRows > 0) {
            res.send({ message: 'Sponsorship updated successfully', changes: result.affectedRows });
        } else {
            res.status(404).send({ message: 'No sponsorship found with the given ID' });
        }
    } catch (err) {
        console.error("Failed to update sponsorship:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});


app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [results] = await pool.query('SELECT password FROM admins WHERE username = ?', [username]);
        if (results.length > 0 && await bcrypt.compare(password, results[0].password)) {
            req.session.isAdmin = true;
            res.redirect('/admin'); // Redirect to the admin panel after successful login
        } else {
            req.session.isAdmin = false;
            res.status(401).send('Invalid credentials'); // Optionally redirect to login page again or show an error
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send('Server error');
    }
});


app.get('/api/admin/users', async (req, res) => {
    console.log("Querying database for admin users...");
    const sql = `SELECT id, username FROM admins`; // Assuming these columns exist
    try {
        const results = await query(sql);
        console.log("Query successful:", results);
        res.json(results);
    } catch (err) {
        console.error("Failed to retrieve admin users:", err);
        res.status(500).send({error: 'Internal server error', detail: err.message});
    }
});
function checkAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin');
    }
}



        app.get('/api/auth/check', (req, res) => {
            if (req.session.isAdmin) {
                res.status(200).json({isAuthenticated: true});
            } else {
                res.status(200).json({isAuthenticated: false});
            }
        });

        app.use(express.static(path.join(__dirname, 'public', 'html')));

        app.get('/admin', checkAdmin, (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'html', 'admin.html'));
        });

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'Public', 'html', 'index.html'));
        });
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
            console.log('MySQL connection established');
        });