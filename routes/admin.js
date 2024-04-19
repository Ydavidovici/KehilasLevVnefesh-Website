const express = require('express');
const multer = require('multer');
const { db } = require('../db/sqlite');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Upload middleware using memory storage
const upload = multer();

module.exports = function(app) {
    // Error handling middleware
    app.use('/api', (err, req, res, next) => {
        console.error('Database error:', err.message);
        res.status(500).send({ error: 'Internal server error caused by a database issue' });
    });

    // Create a new Minyan time
    app.post('/api/minyan', async (req, res, next) => {
        const { name, time, day } = req.body;
        const sql = `INSERT INTO minyan_times (name, time, day) VALUES (?, ?, ?)`;
        try {
            const result = await db.run(sql, [name, time, day]);
            res.status(201).send({ id: result.lastID });
        } catch (err) {
            next(err);
        }
    });

    // Get all Minyan times
    app.get('/api/minyan', async (req, res, next) => {
        const sql = `SELECT * FROM minyan_times`;
        try {
            const rows = await db.all(sql);
            res.send(rows);
        } catch (err) {
            next(err);
        }
    });

    // Update a Minyan time
    app.put('/api/minyan/:id', async (req, res, next) => {
        const { id } = req.params;
        const { name, time, day } = req.body;
        const sql = `UPDATE minyan_times SET name = ?, time = ?, day = ? WHERE id = ?`;
        try {
            const result = await db.run(sql, [name, time, day, id]);
            res.send({ message: 'Minyan time updated', changes: result.changes });
        } catch (err) {
            next(err);
        }
    });

    // Delete a Minyan time
    app.delete('/api/minyan/:id', async (req, res, next) => {
        const { id } = req.params;
        const sql = `DELETE FROM minyan_times WHERE id = ?`;
        try {
            const result = await db.run(sql, id);
            res.send({ message: 'Minyan time deleted', changes: result.changes });
        } catch (err) {
            next(err);
        }
    });

    // File upload routes
    app.post('/api/upload', upload.single('fileInput'), async (req, res, next) => {
        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded.' });
        }
        const originalName = req.file.originalname;
        const fileData = req.file.buffer;
        const sql = `INSERT INTO file_uploads (original_name, file_data) VALUES (?, ?)`;
        try {
            const result = await db.run(sql, [originalName, fileData]);
            res.status(201).send({ id: result.lastID, message: 'File uploaded successfully' });
        } catch (err) {
            next(err);
        }
    });

    app.get('/api/files', async (req, res, next) => {
        const sql = `SELECT id, original_name FROM file_uploads`;
        try {
            const rows = await db.all(sql);
            res.send(rows);
        } catch (err) {
            next(err);
        }
    });

    app.delete('/api/files/:id', async (req, res, next) => {
        const { id } = req.params;
        const sql = `DELETE FROM file_uploads WHERE id = ?`;
        try {
            const result = await db.run(sql, id);
            res.send({ message: 'File deleted successfully', changes: result.changes });
        } catch (err) {
            next(err);
        }
    });

    // Announcements API routes
    app.post('/api/announcement', async (req, res, next) => {
        const { header, text } = req.body;
        const sql = `INSERT INTO announcements (header, text) VALUES (?, ?)`;
        try {
            const result = await db.run(sql, [header, text]);
            res.status(201).send({ id: result.lastID, message: 'Announcement created successfully' });
        } catch (err) {
            next(err);
        }
    });

    app.get('/api/announcement', async (req, res, next) => {
        const sql = `SELECT * FROM announcements`;
        try {
            const rows = await db.all(sql);
            res.send(rows);
        } catch (err) {
            next(err);
        }
    });

    app.delete('/api/announcement/:id', async (req, res, next) => {
        const { id } = req.params;
        const sql = `DELETE FROM announcements WHERE id = ?`;
        try {
            const result = await db.run(sql, id);
            res.send({ message: 'Announcement deleted successfully', changes: result.changes });
        } catch (err) {
            next(err);
        }
    });

    // Sponsor API routes
    app.post('/api/sponsors', async (req, res, next) => {
        const { name, sponsored_for, details } = req.body;
        const sql = `INSERT INTO sponsors (name, sponsored_for, details) VALUES (?, ?, ?)`;
        try {
            const result = await db.run(sql, [name, sponsored_for, details]);
            res.status(201).send({ id: result.lastID, message: 'Sponsor added successfully' });
        } catch (err) {
            next(err);
        }
    });

    app.get('/api/sponsors', async (req, res, next) => {
        const sql = `SELECT * FROM sponsors`;
        try {
            const rows = await db.all(sql);
            res.send(rows);
        } catch (err) {
            next(err);
        }
    });

    app.delete('/api/sponsors/:id', async (req, res, next) => {
        const { id } = req.params;
        const sql = `DELETE FROM sponsors WHERE id = ?`;
        try {
            const result = await db.run(sql, id);
            res.send({ message: 'Sponsor deleted successfully', changes: result.changes });
        } catch (err) {
            next(err);
        }
    });
};
