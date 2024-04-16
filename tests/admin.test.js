const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

// Mocking the database and file upload handling
jest.mock('../db/sqlite.js', () => {
    return {
        run: jest.fn((sql, params, callback) => callback(null, { lastID: 1, changes: 1 })),
        all: jest.fn((sql, params, callback) => callback(null, [{ id: 1, name: 'Morning Minyan', time: '07:00 AM' }]))
    };
});

const adminRoutes = require('../routes/admin'); // Import routes

const app = express();
app.use(bodyParser.json()); // For parsing application/json
app.use('/admin', adminRoutes);

describe('Admin Routes', () => {
    describe('POST /minyan/add', () => {
        it('should add a minyan time', async () => {
            const res = await request(app)
                .post('/admin/minyan/add')
                .send({ name: 'Evening Minyan', time: '08:00 PM' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id: 1, name: 'Evening Minyan', time: '08:00 PM' });
        });
    });

    describe('GET /minyan/list', () => {
        it('should retrieve all minyan times', async () => {
            const res = await request(app)
                .get('/admin/minyan/list');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id: 1, name: 'Morning Minyan', time: '07:00 AM' }]);
        });
    });

    describe('POST /file/upload', () => {
        beforeAll(() => {
            // Replace multer with an in-memory storage for testing
            app.post('/admin/file/upload', upload.single('fileInput'), (req, res) => {
                if (req.file) {
                    res.status(200).json({ message: `Received file ${req.file.originalname}`, id: 1 });
                } else {
                    res.status(400).send('No file uploaded');
                }
            });
        });

        it('should handle file uploads', async () => {
            const res = await request(app)
                .post('/admin/file/upload')
                .attach('fileInput', Buffer.from('test file data'), 'testfile.txt');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Received file testfile.txt', id: 1 });
        });
    });
});
