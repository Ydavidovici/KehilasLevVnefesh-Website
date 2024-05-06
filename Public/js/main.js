document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndRenderAllUI();
});

function fetchDataAndRenderAllUI() {
    fetchMinyanTimes();
    fetchAnnouncements();
    fetchUploadedFiles();
}

function fetchMinyanTimes() {
    fetch('/api/minyan')
        .then(response => response.json())
        .then(data => updateMinyanTimesUI(data))
        .catch(error => console.error('Failed to fetch minyan times:', error));
}

function updateMinyanTimesUI(minyanTimes) {
    const container = document.getElementById('minyanTimesList');
    container.innerHTML = minyanTimes.map(minyan =>
        `<div class="minyan-item">${minyan.day} - ${minyan.name} at ${minyan.time}</div>`
    ).join('');
}

function fetchAnnouncements() {
    fetch('/api/announcement')
        .then(response => response.json())
        .then(data => updateAnnouncementsUI(data))
        .catch(error => console.error('Failed to fetch announcements:', error));
}

function updateAnnouncementsUI(announcements) {
    const container = document.getElementById('announcementList');
    container.innerHTML = announcements.map(announcement =>
        `<div class="announcement-item"><strong>${announcement.header}</strong><p>${announcement.text}</p></div>`
    ).join('');
}

function fetchUploadedFiles() {
    fetch('/api/files')
        .then(response => response.blob())
        .then(blob => displayUploadedFile(URL.createObjectURL(blob)))
        .catch(error => console.error('Error fetching files:', error));
}

function displayUploadedFile(fileUrl) {
    const iframe = document.getElementById('uploadedFileContainer');
    iframe.src = fileUrl;
}
