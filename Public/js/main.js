document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('minyanTimeForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const minyanName = document.getElementById('minyanName').value;
            const minyanTime = document.getElementById('minyanTime').value;

            fetch('http://localhost:4000/api/minyan/add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: minyanName, time: minyanTime})
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok.');
                return response.json();
            })
            .then(data => {
                fetchMinyanTimes(); // Refresh the list of minyan times
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }

    function fetchMinyanTimes() {
        fetch('http://localhost:4000/api/minyan/list')
            .then(response => response.json())
            .then(data => {
                const list = document.getElementById('minyanTimesList');
                list.innerHTML = '';
                data.forEach(minyan => {
                    const div = document.createElement('div');
                    div.className = 'minyan-time';
                    div.setAttribute('data-id', minyan.id);
                    div.textContent = `${minyan.name} at ${minyan.time}`;

                    // Check if the current page is the admin page
                    if (window.location.pathname === '/KehilasLevVnefesh/views/admin.html') {
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.onclick = function () {
                            deleteMinyan(minyan.id);
                        };
                        div.appendChild(deleteButton);
                    }

                    list.appendChild(div);
                });
            })
            .catch(error => console.error('Error fetching minyan times:', error));
    }
    function deleteMinyan(id) {
        fetch(`http://localhost:4000/api/minyan/delete/${id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Deletion failed.');
                fetchMinyanTimes(); // Refresh list after deletion
            })
            .catch(error => console.error(`Error deleting minyan time:`, error));
    }

    const clearButton = document.getElementById('clearMinyanTimes');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            fetch('http://localhost:4000/api/minyan/clear', { method: 'POST' })
                .then(response => {
                    if (!response.ok) throw new Error('Clearing failed.');
                    fetchMinyanTimes(); // Refresh list after clearing
                })
                .catch(error => console.error('Error clearing minyan times:', error));
        });
    }
    function fetchUploadedFiles() {
        fetch('http://localhost:4000/api/file/list')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('uploadedFileContainer');
                container.innerHTML = '';
                data.forEach(file => {
                    const div = document.createElement('div');
                    div.className = 'uploaded-file';
                    div.setAttribute('data-id', file.id);
                    div.textContent = `${file.originalname} (${file.mimetype}) - ${file.size} bytes`;

                    container.appendChild(div);
                });
            })
            .catch(error => console.error('Error fetching uploaded files:', error));
    }

    fetchMinyanTimes();
    fetchUploadedFiles();
});
