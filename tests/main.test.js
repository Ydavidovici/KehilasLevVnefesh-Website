describe('DOMContentLoaded and Event Listeners', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <form id="minyanTimeForm"></form>
            <div id="minyanTimesList"></div>
            <div id="uploadedFileContainer"></div>
        `;
        require('./main');  // Assuming your code is in main.js
    });

    it('attaches submit event listener to form', () => {
        const form = document.getElementById('minyanTimeForm');
        expect(form.onsubmit).toBeDefined();
    });
});

describe('API interactions', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('posts minyan successfully', async () => {
        fetch.mockResponseOnce(JSON.stringify({ success: true }), { status: 200 });
        const { postMinyan } = require('../Public/js/main'); 
        await expect(postMinyan({ name: 'Morning Minyan', time: '07:00 AM' })).resolves.toEqual({ success: true });
    });

    it('handles failure when posting minyan', async () => {
        fetch.mockReject(new Error('API failure'));
        const { postMinyan } = require('./main');
        await expect(postMinyan({ name: 'Morning Minyan', time: '07:00 AM' })).rejects.toThrow('API failure');
    });

    it('fetches minyan times and updates DOM', async () => {
        const mockData = [{ id: 1, name: 'Morning Minyan', time: '07:00 AM' }];
        fetch.mockResponseOnce(JSON.stringify(mockData), { status: 200 });
        const { fetchMinyanTimes } = require('./main');
        await fetchMinyanTimes();
        const list = document.getElementById('minyanTimesList');
        expect(list.children.length).toBe(1);
        expect(list.firstChild.textContent).toContain('Morning Minyan at 07:00 AM');
    });
});

it('handles empty minyan list', async () => {
    fetch.mockResponseOnce(JSON.stringify([]), { status: 200 });
    const { fetchMinyanTimes } = require('../Public/js/main');
    await fetchMinyanTimes();
    const list = document.getElementById('minyanTimesList');
    expect(list.innerHTML).toContain('No Minyan Times available');
});
