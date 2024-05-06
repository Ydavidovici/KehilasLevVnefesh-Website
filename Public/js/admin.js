document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('minyanTimeForm').addEventListener('submit', event => handleFormSubmit(event, '/api/minyan', fetchMinyanTimes));
    document.getElementById('announcementForm').addEventListener('submit', event => handleFormSubmit(event, '/api/announcement', fetchAnnouncements));
    document.getElementById('fileUploadForm').addEventListener('submit', event => handleFormSubmit(event, '/api/upload', fetchUploadedFiles));

    document.getElementById('clearMinyanTimes').addEventListener('click', () => handleDelete('/api/minyan', fetchMinyanTimes));
    document.getElementById('deleteUploadedFiles').addEventListener('click', () => handleDelete('/api/files', fetchUploadedFiles));
    document.getElementById('clearAllAnnouncements').addEventListener('click', () => handleDelete('/api/announcement', fetchAnnouncements));

    fetchDataAndRenderAllUI();
});

function handleFormSubmit(event, actionUrl, callback) {
    event.preventDefault();
    const formData = new FormData(event.target);
    submitFormData(actionUrl, formData, callback);
}

function submitFormData(actionUrl, formData, callback) {
    fetch(actionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
    })
        .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! Status: ${response.status}`))
        .then(data => {
            console.log('Form submission successful:', data);
            callback();  // Refresh data or update UI
        })
        .catch(error => {
            console.error('Form submission failed:', error);
            alert('Form submission failed, check console for details.');
        });
}

function handleDelete(url, callback) {
    fetch(url, { method: 'DELETE' })
        .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! Status: ${response.status}`))
        .then(data => {
            console.log(data.message);
            callback();  // Refresh data or update UI
        })
        .catch(error => console.error('Error on delete operation:', error));
}

function fetchDataAndRenderAllUI() {
    fetchMinyanTimes();
    fetchAnnouncements();
    fetchUploadedFiles();
}
