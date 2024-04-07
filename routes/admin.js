const express = require('express');
const multer = require('multer');
const router = express.Router();
const db = require('../db/sqlite.js'); // Adjust path as needed

// Set up multer
const upload = multer({ dest: 'uploads/' }); // This will save files to an 'uploads' directory

// Route for adding minyan times
router.post('/minyan/add', (req, res) => {
  const { name, time } = req.body;
  console.log(`Attempting to add new minyan: ${name} at ${time}`); // Log attempt
  const sql = 'INSERT INTO minyan_times (name, time) VALUES (?, ?)';
  db.run(sql, [name, time], function(err) {
    if (err) {
      console.error('Error adding minyan time:', err.message);
      res.status(500).send('Error adding minyan time');
      return;
    }
    console.log(`Added new minyan: ${name} at ${time}, ID: ${this.lastID}`); // Confirm addition
    res.json({ id: this.lastID, name, time }); // Send back the new record
  });
});

// Route for listing minyan times
router.get('/minyan/list', (req, res) => {
  console.log('Fetching minyan times...'); // Log fetching attempt
  const sql = 'SELECT * FROM minyan_times';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching minyan times:', err.message);
      res.status(500).send('Error fetching minyan times');
      return;
    }
    console.log('Fetched minyan times:', rows); // Log fetched times
    res.json(rows); // Send back the fetched times
  });
});

// New route for file upload
router.post('/file/upload', upload.single('fileInput'), (req, res) => {
  const file = req.file;
  console.log(`Received file ${file.originalname}`); // Log file receipt

  // Save the file information to your database
  const sql = 'INSERT INTO file_uploads (originalname, mimetype, destination, filename, path, size) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [file.originalname, file.mimetype, file.destination, file.filename, file.path, file.size], function(err) {
    if (err) {
      console.error('Error saving file to database:', err.message);
      res.status(500).send('Error saving file to database');
      return;
    }
    console.log(`Saved file ${file.originalname} to database, ID: ${this.lastID}`); // Confirm save
    res.json({ message: `Received file ${file.originalname}`, id: this.lastID }); // Send back a confirmation message
  });
});

module.exports = router;
