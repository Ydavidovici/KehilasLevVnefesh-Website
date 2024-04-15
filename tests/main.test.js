it('Submits form and adds new minyan time', async () => {
    setAsAdminPage(true);
    require('../Public/js/main');

    const form = document.getElementById('minyanTimeForm');
    form.dispatchEvent(new Event('submit'));

    await new Promise(process.nextTick);

    // Ensure fetch was called for adding
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/minyan/add', expect.objectContaining({
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name: 'Morning Prayer', time: '08:00' })
    }));

    // Refresh list check
    expect(fetch).toHaveBeenCalledTimes(2); // One for initial list, one for add
});

it('Fetches minyan times and populates list', async () => {
    setAsAdminPage(true);
    require('../Public/js/main');

    await new Promise(process.nextTick);

    // Ensure fetch was called for listing
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/minyan/list');

    const minyanList = document.getElementById('minyanTimesList');
    expect(minyanList.children.length).toBeGreaterThan(0);
    expect(minyanList.textContent).toContain('Morning Prayer at 08:00');
});

it('Deletes minyan time when delete button clicked', async () => {
    setAsAdminPage(true);
    require('../Public/js/main');

    // Simulate initial list fetching
    await new Promise(process.nextTick);

    // Assuming your delete button is appended after fetch
    const deleteButton = document.querySelector('.minyan-time button');
    deleteButton.dispatchEvent(new Event('click'));

    // Check if the delete fetch call was made
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('delete'), expect.objectContaining({
        method: 'DELETE'
    }));
});

it('Clears all minyan times when clear button clicked', async () => {
    setAsAdminPage(true);
    require('../Public/js/main');

    const clearButton = document.getElementById('clearMinyanTimes');
    clearButton.dispatchEvent(new Event('click'));

    // Check if the clear fetch call was made
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/minyan/clear', expect.objectContaining({
        method: 'POST'
    }));
});
