const request = require('supertest');
const express = require('express');
const adminRoutes = require('../routes/admin'); // Make sure the path is correct
const app = express();

app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin API', () => {
    // Test for adding a new minyan
    it('should add a new minyan', async () => {
        const res = await request(app)
            .post('/admin/minyan/add')
            .send({
                name: 'Test Minyan',
                time: '08:00'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toEqual('Test Minyan');
        expect(res.body.time).toEqual('08:00');
    });

    // Test for fetching all minyan times
    it('should fetch all minyan times', async () => {
        const res = await request(app).get('/admin/minyan/list');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test for clearing all minyan times
    it('should clear all minyan times', async () => {
        const res = await request(app).post('/admin/minyan/clear');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('All minyan times cleared');
    });

    it('should delete a specific minyan time', async () => {
        const idToDelete = 1;
        const res = await request(app).delete(`/admin/minyan/delete/${idToDelete}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', `Deleted minyan time with ID ${idToDelete}`);
    });
});
