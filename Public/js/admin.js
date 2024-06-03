document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('minyanTimeForm').addEventListener('submit', event => handleFormSubmit(event, '/api/minyan', fetchMinyanTimes));
    document.getElementById('announcementForm').addEventListener('submit', event => handleFormSubmit(event, '/api/announcement', fetchAnnouncements));
    document.getElementById('fileUploadForm').addEventListener('submit', event => handleFileUpload(event, '/api/upload', fetchUploadedFiles));

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

function handleFileUpload(event, actionUrl, callback) {
    event.preventDefault();
    const formData = new FormData(event.target);
    submitFileData(actionUrl, formData, callback);
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
            callback();
        })
        .catch(error => {
            console.error('Form submission failed:', error);
            alert('Form submission failed, check console for details.');
        });
}

function submitFileData(actionUrl, formData, callback) {
    fetch(actionUrl, {
        method: 'POST',
        body: formData
    })
        .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! Status: ${response.status}`))
        .then(data => {
            console.log('File upload successful:', data);
            callback();
        })
        .catch(error => {
            console.error('File upload failed:', error);
            alert('File upload failed, check console for details.');
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

async function fetchMinyanTimes() {
    try {
        const response = await fetch('/api/minyan');
        if (!response.ok) throw new Error(`Failed to fetch minyan times: ${response.statusText}`);
        const minyanTimes = await response.json();
        updateMinyanTimesUI(minyanTimes);
    } catch (error) {
        console.error('Error fetching minyan times:', error);
        updateMinyanTimesUI([]);
    }
}

function updateMinyanTimesUI(minyanTimes) {
    const container = document.getElementById('minyanTimesList');
    container.innerHTML = minyanTimes.map(minyan =>
        `<div class="minyan-item">${minyan.day} - ${minyan.name} at ${minyan.time}</div>`
    ).join('');
}

async function fetchAnnouncements() {
    try {
        const response = await fetch('/api/announcement');
        if (!response.ok) throw new Error('Failed to load announcements');
        const announcements = await response.json();
        if (announcements.length === 0) {
            alert("No announcements available.");
        }
        updateAnnouncementsUI(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        updateAnnouncementsUI([]);
    }
}

function updateAnnouncementsUI(announcements) {
    const container = document.getElementById('announcementList');
    container.innerHTML = announcements.map(announcement =>
        `<div class="announcement-item"><strong>${announcement.header}</strong>: ${announcement.text}</div>`
    ).join('');
}

async function fetchUploadedFiles() {
    try {
        const response = await fetch('/api/files');
        if (!response.ok) throw new Error('Failed to load files');
        const files = await response.blob();
        displayFile(files);
    } catch (error) {
        console.error('Error fetching files:', error);
    }
}

function displayFile(fileBlob) {
    const iframe = document.getElementById('pdfViewer');
    iframe.src = URL.createObjectURL(fileBlob);
}

function updateUploadedFilesUI(files) {
    const container = document.getElementById('uploadedFileContainer');
    container.innerHTML = files.map(file => `
        <div class="file-item">
            ${file.original_name} uploaded on ${new Date(file.upload_date).toLocaleDateString()}
            <button onclick="deleteFile('${file.original_name}')">Delete</button>
            <button onclick="downloadFile('${file.original_name}')">Download</button>
        </div>
    `).join('');
}

function deleteFile(originalName) {
    fetch(`/api/files?original_name=${encodeURIComponent(originalName)}`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            console.error('Failed to delete file');
            return response.json().then(data => console.error(data.message));
        }
        console.log('File deleted successfully');
        fetchUploadedFiles();
    }).catch(error => console.error('Error deleting file:', error));
}

function downloadFile(originalName) {
    const link = document.createElement('a');
    link.href = `/api/download?original_name=${encodeURIComponent(originalName)}`;
    link.download = originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
