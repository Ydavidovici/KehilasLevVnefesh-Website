// admin.test.js

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
jest.mock('../db/sqlite', () => ({
    db: {
        run: jest.fn(),
        all: jest.fn(),
        get: jest.fn()
    }
}));
const { db } = require('../db/sqlite');
const adminRoutes = require('./admin');

const app = express();
app.use(bodyParser.json());
adminRoutes(app); // Assuming adminRoutes is a function that takes app as an argument

describe('Admin API Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Minyan times tests
    describe('Minyan Times', () => {
        test('POST /api/minyan - success', async () => {
            const minyanData = { name: 'Evening Minyan', time: '20:00', day: 'Friday' };
            db.run.mockImplementation((sql, params, callback) => callback(null, { lastID: 1 }));
            const response = await request(app).post('/api/minyan').send(minyanData);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id: 1 });
            expect(db.run).toHaveBeenCalledWith(expect.any(String), [minyanData.name, minyanData.time, minyanData.day], expect.any(Function));
        });

        test('GET /api/minyan - success', async () => {
            db.all.mockResolvedValue([{ id: 1, name: 'Morning Minyan', time: '07:00', day: 'Monday' }]);
            const response = await request(app).get('/api/minyan');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 1, name: 'Morning Minyan', time: '07:00', day: 'Monday' }]);
            expect(db.all).toHaveBeenCalledWith(expect.any(String));
        });

        test('PUT /api/minyan/:id - success', async () => {
            const updatedMinyanData = { name: 'Updated Minyan', time: '09:00', day: 'Saturday' };
            db.run.mockImplementation((sql, params, callback) => callback(null, { changes: 1 }));
            const response = await request(app).put('/api/minyan/1').send(updatedMinyanData);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Minyan time updated', changes: 1 });
            expect(db.run).toHaveBeenCalledWith(expect.any(String), [updatedMinyanData.name, updatedMinyanData.time, updatedMinyanData.day, 1], expect.any(Function));
        });

        test('DELETE /api/minyan/:id - success', async () => {
            db.run.mockImplementation((sql, params, callback) => callback(null, { changes: 1 }));
            const response = await request(app).delete('/api/minyan/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Minyan time deleted', changes: 1 });
            expect(db.run).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
        });
    });

    // File upload tests
    describe('File Uploads', () => {
        test('POST /api/upload - success', async () => {
            const fileData = { originalname: 'test.pdf', buffer: Buffer.from('test file') };
            db.run.mockImplementation((sql, params, callback) => callback(null, { lastID: 1 }));
            const response = await request(app).post('/api/upload').attach('fileInput', fileData.buffer, 'test.pdf');
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id: 1, message: 'File uploaded successfully' });
            expect(db.run).toHaveBeenCalledWith(expect.any(String), [fileData.originalname, fileData.buffer], expect.any(Function));
        });

        test('GET /api/files - success', async () => {
            db.all.mockResolvedValue([{ id: 1, original_name: 'document.pdf' }]);
            const response = await request(app).get('/api/files');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 1, original_name: 'document.pdf' }]);
            expect(db.all).toHaveBeenCalledWith(expect.any(String));
        });

        test('DELETE /api/files/:id - success', async () => {
            db.run.mockImplementation((sql, params, callback) => callback(null, { changes: 1 }));
            const response = await request(app).delete('/api/files/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'File deleted successfully', changes: 1 });
            expect(db.run).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
        });
    });

    // Announcement tests
    describe('Announcements', () => {
        test('POST /api/announcement - success', async () => {
            const announcementData = { header: 'New Event', text: 'Join us for an event' };
            db.run.mockImplementation((sql, params, callback) => callback(null, { lastID: 1 }));
            const response = await request(app).post('/api/announcement').send(announcementData);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id: 1, message: 'Announcement created successfully' });
            expect(db.run).toHaveBeenCalledWith(expect.any(String), [announcementData.header, announcementData.text], expect.any(Function));
        });

        test('GET /api/announcement - success', async () => {
            db.all.mockResolvedValue([{ id: 1, header: 'Event', text: 'Details about the event' }]);
            const response = await request(app).get('/api/announcement');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 1, header: 'Event', text: 'Details about the event' }]);
            expect(db.all).toHaveBeenCalledWith(expect.any(String));
        });

        test('DELETE /api/announcement/:id - success', async () => {
            db.run.mockImplementation((sql, params, callback) => callback(null, { changes: 1 }));
            const response = await request(app).delete('/api/announcement/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Announcement deleted successfully', changes: 1 });
            expect(db.run).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
        });
    });

    // Sponsor API tests
    describe('Sponsors', () => {
        test('POST /api/sponsors - success', async () => {
            const sponsorData = { name: 'Acme Inc.', sponsored_for: 'Event', details: 'Details of sponsorship' };
            db.run.mockImplementation((sql, params, callback) => callback(null, { lastID: 1 }));
            const response = await request(app).post('/api/sponsors').send(sponsorData);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id: 1, message: 'Sponsor added successfully' });
            expect(db.run).toHaveBeenCalledWith(expect.any(String), [sponsorData.name, sponsorData.sponsored_for, sponsorData.details], expect.any(Function));
        });

        test('GET /api/sponsors - success', async () => {
            db.all.mockResolvedValue([{ id: 1, name: 'Acme Inc.', sponsored_for: 'Event', details: 'Details of sponsorship' }]);
            const response = await request(app).get('/api/sponsors');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 1, name: 'Acme Inc.', sponsored_for: 'Event', details: 'Details of sponsorship' }]);
            expect(db.all).toHaveBeenCalledWith(expect.any(String));
        });

        test('DELETE /api/sponsors/:id - success', async () => {
            db.run.mockImplementation((sql, params, callback) => callback(null, { changes: 1 }));
            const response = await request(app).delete('/api/sponsors/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Sponsor deleted successfully', changes: 1 });
            expect(db.run).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
        });
    });
});
