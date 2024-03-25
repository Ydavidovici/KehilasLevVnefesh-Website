const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// Session middleware for authentication
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // should be true in production if using HTTPS
}));

// Body parsing Middleware
app.use(bodyParser.json());

// Static files Middleware
app.use(express.static('public'));

// General request logging for debugging
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// Import routes
const adminRoutes = require('./routes/admin'); // Correctly using admin routes

// Use routes
app.use('/admin', adminRoutes); // Admin routes might include login, logout, and possibly other admin functions

// Root endpoint serving the main page
app.get('/', (req, res) => {
    console.log('Serving the main page.');
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Starting the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
