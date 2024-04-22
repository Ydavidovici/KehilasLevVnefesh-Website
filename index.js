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
const port = 4000;

app.use(express.json());
app.use(cors());

app.use(session({
    secret: 'your_secret_key',  // Secret key to sign the session ID cookie
    resave: false,              // Forces the session to be saved back to the session store
    saveUninitialized: true,    // Forces a session that is "uninitialized" to be saved to the store
    cookie: {
        secure: false,          // Set to true if you have HTTPS enabled
        httpOnly: true,         // Minimizes risk of XSS attacks
        maxAge: 1000 * 60 * 60  // Cookie expires after 1 hour
    }
}));

async function query(sql, params) {
    try {
        const [results, ] = await pool.query(sql, params);
        return results;
    } catch (error) {
        console.error('Query error:', error);
        throw error;  // Rethrowing the error to handle it in the calling function
    }
}

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

app.use((req, res, next) => {
    console.log('Request received');
    if (req.someConditionFails) {
        res.status(401).send('Unauthorized'); // This would stop the request prematurely
    } else {
        next(); // Ensure next() is called correctly
    }
});


app.post('/api/minyan', async (req, res) => {
    const { name, time, day } = req.body;
    const sql = `INSERT INTO minyan_times (name, time, day) VALUES (?, ?, ?)`;
    try {
        const result = await query(sql, [name, time, day]);
        res.status(201).send({ id: result.insertId, message: 'Minyan time added successfully' });
    } catch (err) {
        console.error("Database error during insert:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
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

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) // Appending extension
    }
});
const upload = multer({ storage: storage });

// POST route for file upload
app.post('/api/upload', upload.single('fileInput'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded.' });
    }

    const { originalname, filename, path: filePath, size } = req.file;

    const sql = `INSERT INTO file_uploads (original_name, file_path, file_size) VALUES (?, ?, ?)`;
    try {
        await pool.query(sql, [originalname, filePath, size]);
        res.status(201).send({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send({ error: 'Internal server error', detail: error.message });
    }
});

app.get('/api/files', async (req, res) => {
    const sql = 'SELECT id, original_name, file_path, file_size, upload_date FROM file_uploads';
    try {
        const [results, ] = await pool.query(sql);
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).send({ message: 'No files found' });
        }
    } catch (error) {
        console.error('Failed to retrieve files:', error);
        res.status(500).send({ error: 'Internal server error', detail: error.message });
    }
});

app.get('/api/files/:id', async (req, res) => {
    const sql = 'SELECT * FROM file_uploads WHERE id = ?';
    try {
        const [results, ] = await pool.query(sql, [req.params.id]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send({ message: 'File not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve file:', error);
        res.status(500).send({ error: 'Internal server error', detail: error.message });
    }
});


app.get('/api/download/:id', async (req, res) => {
    const sql = 'SELECT file_path, original_name FROM file_uploads WHERE id = ?';
    try {
        const [results, ] = await pool.query(sql, [req.params.id]);
        if (results.length > 0) {
            const { file_path, original_name } = results[0];
            res.download(file_path, original_name);
        } else {
            res.status(404).send({ message: 'File not found' });
        }
    } catch (error) {
        console.error('Failed to download file:', error);
        res.status(500).send({ error: 'Internal server error', detail: error.message });
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

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const [rows] = await pool.execute('SELECT password FROM admins WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'No such user found' });
        }

        const hashedPasswordFromDb = rows[0].password;
        const passwordMatch = await bcrypt.compare(password, hashedPasswordFromDb);
        if (passwordMatch) {
            req.session.user = { username };
            req.session.isAuthenticated = true;
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/login');  // Redirect to login page after successful logout
    });
});

app.get('/api/admin/users', checkAdmin, (req, res) => {
    res.json([{ id: 1, username: 'admin' }]);
});

app.get('/api/auth/check', (req, res) => {
    if (req.session.isAuthenticated) {
        res.status(200).json({ isAuthenticated: true });
    } else {
        res.status(200).json({ isAuthenticated: false });
    }
});

app.use(express.static(path.join(__dirname, 'Public')));

function checkAdmin(req, res, next) {
    if (req.session.isAuthenticated) {
        console.log('logging in')
        next();
    } else {
        res.redirect('/login');  // Redirect users to login page if not authenticated
    }
}

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'login.html'));
});

app.get('/minyan-times', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'minyan-times.html'));
});

app.get('/donate', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'Donate.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'contact.html'));
});

app.get('/failure', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'failure.html'));
});

app.get('/sucess', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'success.html'));
});

app.get('/admin', checkAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'admin.html'));
});

app.get('/minyan-times.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'minyan-times.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'admin.html'));
});

app.get('/donate.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'donate.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'login.html'));
});

app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'sucess.html'));
});

app.get('/failure.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'failure.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'contact.html'));
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'index.html'));
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('MySQL connection established');
});