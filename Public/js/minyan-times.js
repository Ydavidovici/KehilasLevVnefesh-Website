document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndRenderAllUI();
});

async function fetchDataAndRenderAllUI() {
    await Promise.all([fetchMinyanTimes(), fetchAnnouncements(), fetchUploadedFiles()]);
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
