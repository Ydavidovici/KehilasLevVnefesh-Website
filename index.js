const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 4000;

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
app.use(cors()); // Enable CORS for all routes

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}]: ${req.method} ${req.url}`);
    next();
});

const adminRoutes = require('./routes/admin');
app.use('/api', adminRoutes); // Suggestion: Mount under '/api' for clarity and separation

app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).send('Page Not Found');
});

app.get('/', (req, res) => {
    console.log('Serving the main page.');
    res.sendFile(path.join(__dirname, 'Public','html', 'index.html'), (err) => {
        if (err) {
            console.log('Error sending index.html', err);
            res.status(500).send('An error occurred');
        }
    });
});

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
