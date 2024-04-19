const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
jest.mock('fs');
jest.mock('bcrypt');

const { db, initializeTables, seedAdmins } = require('./sqlite');

describe('SQLite Database Tests', () => {
    const mockRun = jest.fn();
    const mockSerialize = jest.fn();
    const mockAll = jest.fn();

    beforeAll(() => {
        sqlite3.Database = jest.fn().mockImplementation(() => ({
            serialize: mockSerialize.mockImplementation((callback) => callback()),
            run: mockRun,
            all: mockAll
        }));
    });

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.DB_PATH = 'memory';
    });

    test('initializeTables should create necessary tables', () => {
        initializeTables(db);
        expect(mockSerialize).toHaveBeenCalled();
        expect(mockRun).toHaveBeenCalledTimes(8); // Expect the `run` method to be called for each table creation
        expect(mockRun.mock.calls[0][0]).toContain('CREATE TABLE IF NOT EXISTS minyan_times');
        expect(mockRun.mock.calls[1][0]).toContain('CREATE TABLE IF NOT EXISTS admins');
        expect(mockRun.mock.calls[2][0]).toContain('CREATE TABLE IF NOT EXISTS file_uploads');
        expect(mockRun.mock.calls[3][0]).toContain('CREATE TABLE IF NOT EXISTS announcements');
        expect(mockRun.mock.calls[4][0]).toContain('CREATE TABLE IF NOT EXISTS sponsorship_types');
        expect(mockRun.mock.calls[5][0]).toContain('CREATE TABLE IF NOT EXISTS sponsorship_details');
        expect(mockRun.mock.calls[6][0]).toContain('CREATE TABLE IF NOT EXISTS sponsors');
        expect(mockRun.mock.calls[7][0]).toContain('CREATE TABLE IF NOT EXISTS sponsorships');
    });

    test('seedAdmins should insert default admin data', async () => {
        const hashMock = jest.fn((password, saltRounds, callback) => callback(null, 'hashed_password'));
        bcrypt.hash.mockImplementation(hashMock);

        await seedAdmins(db, jest.fn());

        expect(hashMock).toHaveBeenCalledWith('adminPassword1', 10, expect.any(Function));
        expect(hashMock).toHaveBeenCalledWith('adminPassword2', 10, expect.any(Function));
        expect(mockRun).toHaveBeenCalledWith(expect.any(String), ['admin1', 'hashed_password'], expect.any(Function));
        expect(mockRun).toHaveBeenCalledWith(expect.any(String), ['admin2', 'hashed_password'], expect.any(Function));
    });

    test('errorHandler should log errors', () => {
        const consoleSpy = jest.spyOn(console, 'error');
        const testError = new Error('Test Error');
        errorHandler(testError);
        expect(consoleSpy).toHaveBeenCalledWith('SQLite Error:', testError.message);
    });
});
