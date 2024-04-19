const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS
    }
});

// Use the transporter to send an email
transporter.sendMail({...}, function(err, info) {
    if (err) {
        console.error('Email send error:', err);
    } else {
        console.log('Email sent:', info.response);
    }
});


module.exports = { sendEmail };
