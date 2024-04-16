const request = require('supertest');
const path = require('path');
const app = require('../index');

describe('Express Server Tests', () => {
    describe('General Server Responses', () => {
        it('should serve the main page', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            expect(response.type).toBe('text/html');
        });

        it('should return 404 for non-existent routes', async () => {
            const response = await request(app).get('/nonexistent');
            expect(response.status).toBe(404);
            expect(response.text).toContain('Page Not Found');
        });
    });

    describe('Middleware Logs', () => {
        // Example of testing output, you'd need to mock console.log or intercept stdout
        it('should log requests', async () => {
            const logSpy = jest.spyOn(console, 'log');
            await request(app).get('/');
            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Serving the main page.'));
            logSpy.mockRestore();
        });
    });

    describe('Admin Routes', () => {
        // Assuming admin routes handle this path
        it('should handle /api/admin endpoint correctly', async () => {
            const response = await request(app).get('/api/admin');
            // Assertions depend on the actual implementation of your admin routes
            expect(response.status).toBe(200);  // or whatever status code your route returns
        });
    });

    // Add tests for CORS and sessions if needed
    describe('CORS and Security Headers', () => {
        it('should allow CORS for all routes', async () => {
            const response = await request(app).get('/');
            expect(response.headers['access-control-allow-origin']).toBe('*');
        });
    });
});

