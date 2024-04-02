const { TextEncoder, TextDecoder } = require('text-encoding');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const request = require('supertest');
const express = require('express');
const adminRoutes = require('../routes/admin');
const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin API', () => {
    it('should add a new minyan', async () => {
        const res = await request(app)
            .post('/admin/minyan/add')
            .send({
                name: 'Test Minyan',
                time: '08:00'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Test Minyan');
        expect(res.body).toHaveProperty('time', '08:00');
    });

    it('should fetch all minyan times', async () => {
        const res = await request(app)
            .get('/admin/minyan/list');

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
