const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();
const { db, initializeTables,seedAdmins } = require('./db/sqlite');
const app = express();
const port = process.env.PORT || 4000;
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const setupAdminRoutes = require('./routes/admin');  // Make sure the path is correct

// Use environment variables for sensitive information
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret', // Use a secret from .env
  resave: false,
  saveUninitialized: false,
  cookie: { secure: 'auto' } // Adjust for HTTPS in production
}));

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}]: ${req.method} ${req.url}`);
    next();
});

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'index.html'), (err) => {
        if (err) {
            console.log('Error sending index.html', err);
            res.status(500).send('An error occurred');
        }
    });
});

setupAdminRoutes(app)


const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

initializeTables(db, (err) => {
  if (err) {
    console.error('Error initializing tables:', err.message);
    return;
  }
  console.log('Tables initialized successfully');
});

seedAdmins(db, (err) => {
  if (err) {
    console.error('Error seeding admins:', err.message);
    return;
  }
  console.log('Admins seeded successfully');
});

module.exports = app;
