const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2/promise');
const Stripe = require('stripe');

require('dotenv').config();

const app = express();
const port =  process.env.PORT || 4000;
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const pool = mysql.createPool({
    uri: process.env.JAWSDB_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.on('error', err => {
    console.error('Unexpected error on idle MySQL connection', err);
});


app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));
app.use(cors());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 }
}));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

async function query(sql, params) {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, params);
        return results;
    } finally {
        connection.release();
    }
}



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

app.delete('/api/minyan', async (req, res) => {
    const sql = 'DELETE FROM minyan_times'; // Adjust SQL command as needed
    try {
        const result = await query(sql);
        if (result.affectedRows > 0) {
            res.send({ message: 'All Minyan times cleared successfully' });
        } else {
            res.status(404).send({ message: 'No Minyan times found to delete' });
        }
    } catch (err) {
        console.error('Failed to clear Minyan times:', err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('fileInput'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded.' });
    }

    const { originalname, buffer, size } = req.file;

    if (!buffer) {
        return res.status(400).send({ error: 'File data is missing.' });
    }

    // Delete the existing file data
    await query('TRUNCATE TABLE file_uploads');

    const sql = `INSERT INTO file_uploads (original_name, file_data, file_size) VALUES (?, ?, ?)`;
    try {
        await query(sql, [originalname, buffer, size]);
        res.status(201).send({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send({ error: 'Internal server error', detail: error.message });
    }
});

app.get('/api/files', async (req, res) => {
    const sql = 'SELECT original_name, file_data FROM file_uploads LIMIT 1';
    try {
        const rows = await query(sql);  // Removed destructuring based on your function definition
        if (rows.length > 0) {
            const { original_name, file_data } = rows[0];
            console.log("Serving file:", original_name);
            res.setHeader('Content-Disposition', `inline; filename="${original_name}"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(file_data);
        } else {
            console.log('No files available in the database');
            res.status(404).send('No files available');
        }
    } catch (error) {
        console.error('Failed to retrieve file:', error);
        res.status(500).send({ error: 'Internal server error', detail: error.message });
    }
});

app.get('/api/download', async (req, res) => {
    const { original_name } = req.query;
    if (!original_name) {
        return res.status(400).send({ error: 'Filename is required' });
    }

    const sql = 'SELECT file_data FROM file_uploads WHERE original_name = ? LIMIT 1';
    try {
        const rows = await query(sql, [original_name]);
        if (rows.length > 0) {
            const { file_data } = rows[0];
            res.setHeader('Content-Disposition', `attachment; filename="${original_name}"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(file_data);
        } else {
            res.status(404).send('File not found');
        }
    } catch (error) {
        console.error('Failed to download file:', error);
        res.status(500).send({ error: 'Internal server error', detail: error.message });
    }
});


app.delete('/api/files', async (req, res) => {
    const sql = 'TRUNCATE TABLE file_uploads'; // This SQL command will delete all entries in the table
    try {
        const result = await query(sql);
        console.log('All files deleted successfully');
        res.send({ message: 'All files deleted successfully' });
    } catch (err) {
        console.error('Failed to delete file:', err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
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

app.delete('/api/announcement', async (req, res) => {
    const sql = `TRUNCATE TABLE announcements`;
    try {
        await query(sql);
        res.send({ message: 'All announcements cleared successfully' });
    } catch (err) {
        console.error('Failed to clear announcements:', err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
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

app.get('/api/sponsorships', async (req, res) => {
    const sql = `
        SELECT sr.id, s.name AS sponsor_name, sr.comments, ps.title AS sponsorship_type
        FROM sponsorship_records sr
        JOIN sponsors s ON sr.sponsor_id = s.id
        JOIN parnes_sponsorships ps ON sr.sponsorship_id = ps.id
        UNION
        SELECT sr.id, s.name AS sponsor_name, sr.comments, ks.title AS sponsorship_type
        FROM sponsorship_records sr
        JOIN sponsors s ON sr.sponsor_id = s.id
        JOIN kiddush_sponsorships ks ON sr.sponsorship_id = ks.id`;
    try {
        const results = await query(sql);
        if (results && results.length > 0) {
            console.log('Sponsorships found:', results);
            res.json(results);
        } else {
            console.log('No sponsorships found');
            res.status(404).send({ message: 'No sponsorships found' });
        }
    } catch (err) {
        console.error("Failed to retrieve sponsorships:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});


app.get('/api/parnes-sponsorships', async (req, res) => {
    const sql = `SELECT * FROM parnes_sponsorships`;
    try {
        const parnesSponsorships = await query(sql);
        if (parnesSponsorships.length > 0) {
            res.json(parnesSponsorships);
        } else {
            res.status(404).send({ message: 'No parnes sponsorships found' });
        }
    } catch (err) {
        console.error("Failed to retrieve parnes sponsorships:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});

app.get('/api/kiddush-sponsorships', async (req, res) => {
    const sql = `SELECT * FROM kiddush_sponsorships`;
    try {
        const kiddushSponsorships = await query(sql);
        if (kiddushSponsorships.length > 0) {
            res.json(kiddushSponsorships);
        } else {
            res.status(404).send({ message: 'No kiddush sponsorships found' });
        }
    } catch (err) {
        console.error("Failed to retrieve kiddush sponsorships:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});

app.post('/api/sponsorships', async (req, res) => {
    const { sponsor_id, sponsorship_id, amount_paid, comments, sponsorship_type } = req.body;
    let sql = `INSERT INTO sponsorship_records (sponsor_id, sponsorship_id, amount_paid, comments, sponsorship_type)
               VALUES (?, ?, ?, ?, ?)`;
    try {
        const result = await query(sql, [sponsor_id, sponsorship_id, amount_paid, comments, sponsorship_type]);
        res.status(201).send({ id: result.insertId, message: 'Sponsorship added successfully' });
    } catch (err) {
        console.error("Failed to add sponsorship:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});

app.delete('/api/sponsorships/:id', async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM sponsorships WHERE id = ?`;

    try {
        const [result] = await query(sql, [id]);
        if (result.affectedRows > 0) {
            res.send({ message: 'Sponsorship deleted successfully' });
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
    const { title, description, stripeLink } = req.body;
    const sql = `
        UPDATE sponsorships 
        SET title = ?, description = ?, stripe_link = ? 
        WHERE id = ?`;

    try {
        const [result] = await query(sql, [title, description, stripeLink, id]);
        if (result.affectedRows > 0) {
            res.send({ message: 'Sponsorship updated successfully' });
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

        const hashedPasswordFromDb = rows[0].password.trim();
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


app.post('/api/create-payment-intent', async (req, res) => {
    const { amount, description } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,  // amount in the smallest currency unit, e.g., cents for USD
            currency: 'usd',
            description: description,
            payment_method_types: ['card'],
        });

        res.status(201).send({ paymentIntent: paymentIntent.client_secret });
    } catch (err) {
        console.error('Stripe error:', err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});


app.post('/api/initiate-payment', async (req, res) => {
    const { sponsorshipId } = req.body;
    const sql = `SELECT stripe_link FROM sponsorships WHERE id = ?`;

    try {
        const [rows] = await query(sql, [sponsorshipId]);
        if (rows.length > 0) {
            const stripeLink = rows[0].stripe_link;
            res.json({ url: stripeLink });
        } else {
            res.status(404).send({ message: 'Sponsorship not found' });
        }
    } catch (err) {
        console.error("Error initiating payment:", err);
        res.status(500).send({ error: 'Internal server error', detail: err.message });
    }
});

app.post('/api/webhooks', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        // Ensure the webhook is coming from Stripe by verifying the signature
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the incoming event types
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object; // The payment intent that succeeded
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful.`);
            // Here, you could update your database or perform other actions based on the payment success
            break;
        case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object;
            console.log(`Payment for ${paymentIntentFailed.amount} failed.`);
            // Handle payment failure (e.g., notify the user, log the failure, etc.)
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({received: true});
});


async function handleSuccessfulPayment(paymentIntent) {
    // Example: update database and send an email
    try {
        const updateResult = await query('UPDATE donations SET status = ? WHERE stripe_id = ?', ['completed', paymentIntent.id]);
        sendReceiptEmail(paymentIntent);
    } catch (error) {
        console.error('Failed to process successful payment:', error);
    }
}

function sendReceiptEmail(paymentIntent) {
    // Implement email sending logic, possibly using a library like nodemailer
    console.log('Sending receipt email for:', paymentIntent.amount);
}

app.use(express.static(path.join(__dirname, 'Public')));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});


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
    // Send 'index.html' for any other requests.
    res.sendFile(path.join(__dirname, 'Public', 'html', 'index.html'));
});


app.listen(port, () => {
    console.log(`Server running on {port}`);
    console.log('MySQL connection established');
});


