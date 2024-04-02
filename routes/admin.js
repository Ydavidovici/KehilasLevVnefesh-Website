const express = require('express');
const router = express.Router();
const db = require('../db/sqlite.js'); // Adjust path as needed

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


router.get('/minyan/list', (req, res) => {
  console.log('Fetching minyan times...'); // Log fetching attempt
  const sql = 'SELECT * FROM minyan_times';
  db.all(sql, [], (err, rows) => {
      if (err) {
          console.error('Error fetching minyan times:', err.message);
          res.status(500).send('Error fetching minyan times');
          return;
      }
      console.log(`Fetched ${rows.length} minyan times`); // Log number of times fetched
      res.json(rows); // Send back the list of minyan times
  });
});



module.exports = router;
