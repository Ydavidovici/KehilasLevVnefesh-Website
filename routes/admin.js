const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db/sqlite'); // Adjust the path as necessary
const router = express.Router();

// Middleware to check admin authentication
function checkAdminAuth(req, res, next) {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.status(403).send("Access denied");
  }
}

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM admins WHERE username = ?';

  db.get(query, [username], (err, user) => {
    if (err) {
      res.status(500).send("Internal server error");
      return;
    }
    if (!user) {
      res.status(401).send("Invalid credentials");
      return;
    }

    // Compare submitted password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.adminLoggedIn = true;
        req.session.adminUsername = username; // Optionally store the admin username in the session
        res.redirect('/admin');
      } else {
        res.status(401).send("Invalid credentials");
      }
    });
  });
});

// Protect admin routes using the middleware
router.get('/', checkAdminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin.html'));
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log("Error logging out:", err);
      return res.redirect('/admin'); // Handle errors, maybe redirect to a safe page
    }
    res.clearCookie('connect.sid'); // Adjust according to your session cookie name
    res.redirect('/');
  });
});

module.exports = router;
