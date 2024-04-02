const fetchMock = require('jest-fetch-mock');
const { JSDOM } = require('jsdom');

// Mock the fetch API
fetchMock.enableMocks();

describe('DOM Manipulation and AJAX Requests', () => {
    beforeEach(() => {
        // Set up our document body
        document.body.innerHTML =
            '<div>' +
            '  <form id="minyanTimeForm">' +
            '    <input id="minyanName" value="Test Minyan">' +
            '    <input id="minyanTime" value="08:00">' +
            '  </form>' +
            '  <div id="minyanTimesList"></div>' +
            '</div>';

        // Reset all mocks before each test
        fetch.resetMocks();
    });

    it('should add a new minyan and refresh the list of minyan times', async () => {
        // Mock the fetch responses
        fetch.mockResponses(
            [JSON.stringify({ id: 1, name: 'Test Minyan', time: '08:00' }), { status: 200 }],
            [JSON.stringify([{ id: 1, name: 'Test Minyan', time: '08:00' }]), { status: 200 }]
        );

        require('../Public/js/main');

        // Simulate form submission
        const form = document.getElementById('minyanTimeForm');
        const event = new Event('submit');
        form.dispatchEvent(event);

        // Wait for fetches to resolve
        await Promise.resolve();

        // Check that the minyan times list was updated
        const list = document.getElementById('minyanTimesList');
        expect(list.textContent).toContain('Test Minyan at 08:00');
    });

    it('should display a message if no minyanim found', async () => {
        // Mock the fetch response
        fetch.mockResponseOnce(JSON.stringify([]), { status: 200 });

        require('../Public/js/main'); // Import your main.js file

        // Wait for fetch to resolve
        await Promise.resolve();

        // Check that the no minyanim message is displayed
        const list = document.getElementById('minyanTimesList');
        expect(list.textContent).toBe('No current minyanim.');
    });
});
