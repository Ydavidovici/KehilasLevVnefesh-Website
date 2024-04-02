document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('minyanTimeForm');

    if (form) {
        console.log('Adding event listener to form.');
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const minyanName = document.getElementById('minyanName').value;
            const minyanTime = document.getElementById('minyanTime').value;

            console.log(`Attempting to submit new minyan: ${minyanName} at ${minyanTime}`);

            fetch('http://localhost:4000/api/minyan/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: minyanName,
                    time: minyanTime,
                }),
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok.');
                return response.json();
            })
            .then(data => {
                console.log('Success in submitting new minyan:', data);
                fetchMinyanTimes(); // Refresh the list of minyan times
            })
            .catch((error) => {
                console.error('Error in submitting new minyan:', error);
            });
        });
    } else {
        console.log('Form not found.');
    }

    function fetchMinyanTimes() {
        console.log('Fetching minyan times...');
        fetch('http://localhost:4000/api/minyan/list')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch minyan times.');
                return response.json();
            })
            .then(data => {
                const list = document.getElementById('minyanTimesList');
                if (list) {
                    console.log(`Received minyan times:`, data);
                    list.innerHTML = ''; // Clear the current list
                    if (data && data.length > 0) {
                        data.forEach(minyan => {
                            const div = document.createElement('div');
                            div.textContent = `${minyan.name} at ${minyan.time}`;
                            list.appendChild(div);
                        });
                    } else {
                        console.log('No minyanim found.');
                        list.textContent = 'No current minyanim.';
                    }
                } else {
                    console.log('Minyan times list container not found.');
                }
            })
            .catch(error => {
                console.error('Error fetching minyan times:', error);
            });
    }

    // Check if the list container exists on the page before fetching minyan times
    const listContainer = document.getElementById('minyanTimesList');
    if (listContainer) {
        console.log('Initial fetch of minyan times.');
        fetchMinyanTimes(); // Initial fetch of minyan times
    } else {
        console.log('Minyan times list container not found at initial load.');
    }
});
