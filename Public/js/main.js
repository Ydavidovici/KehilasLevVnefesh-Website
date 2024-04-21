// Entry point when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    refreshUI();
    fetchConfig();
});

function setupEventListeners() {
    // Forms
    setupFormSubmission('announcementForm', addAnnouncement);
    setupFormSubmission('minyanTimeForm', addMinyanTime);
    setupFormSubmission('fileUploadForm', handleFileUpload, true); // Handle file upload with FormData
    setupFormSubmission('loginForm', performLogin);

    // Buttons
    setupButtonClick('clearMinyanTimes', clearAllMinyanTimes);
}

function setupFormSubmission(formId, callback, isFormData = false) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const formData = isFormData ? new FormData(form) : null;
            formData ? callback(formData) : callback();
        });
    }
}

function setupButtonClick(buttonId, callback) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', callback);
    }
}

function addMinyanTime() {
    const data = {
        name: document.getElementById('minyanName').value,
        time: document.getElementById('minyanTime').value,
        day: document.getElementById('minyanDay').value
    };
    fetchData('/api/minyan', 'POST', data, refreshUI);
}

function clearAllMinyanTimes() {
    fetchData('/api/minyan/clear', 'DELETE', {}, refreshUI);
}

function handleFileUpload(formData) {
    fetch('/api/files', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('File upload successful:', data);
            refreshUI();
        })
        .catch(error => console.error('Error with file upload:', error));
}

function performLogin() {
    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };
    fetchData('/admin/login', 'POST', data, handleLoginResponse);
}

function handleLoginResponse(response) {
    if (response.ok) {
        window.location.href = '/admin';
    } else {
        alert('Login failed! Please check your credentials and try again.');
    }
}

function fetchData(url, method, body, callback) {
    const options = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'GET' ? JSON.stringify(body) : null
    };
    fetch(url, options)
        .then(response => {
            if (!response.ok) throw new Error(`${response.statusText} (${response.status})`);
            return response.json();
        })
        .then(data => callback(data))
        .catch(error => console.error(`Error with ${method} at ${url}:`, error));
}

function refreshUI() {
    fetchMinyanTimes();
    fetchAnnouncements();
    fetchUploadedFiles();
    fetchSponsors();
}

function fetchMinyanTimes() {
    fetchData('/api/minyan', 'GET', {}, updateMinyanTimesUI);
}

function fetchAnnouncements() {
    fetchData('/api/announcement', 'GET', {}, updateAnnouncementsUI);
}

function fetchUploadedFiles() {
    fetchData('/api/files', 'GET', {}, updateUploadedFilesUI);
}

function fetchSponsors() {
    fetchData('/api/sponsors', 'GET', {}, updateSponsorsUI);
}

function updateMinyanTimesUI(minyanTimes) {
    updateUIList('minyanTimesList', minyanTimes, minyan => `${minyan.name} at ${minyan.time} on ${minyan.day}`);
}

function updateAnnouncementsUI(announcements) {
    updateUIList('announcementsList', announcements, announcement => `${announcement.header}: ${announcement.text}`);
}

function updateUploadedFilesUI(files) {
    updateUIList('uploadedFilesList', files, file => `${file.originalName} (${file.mimeType}) - ${file.size} bytes`);
}

function updateSponsorsUI(sponsors) {
    updateUIList('sponsorsList', sponsors, sponsor => `${sponsor.name} (${sponsor.contactInfo})`);
}

function updateUIList(containerId, items, formatter) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.textContent = formatter(item);
        container.appendChild(div);
    });
}

function fetchConfig() {
    fetchData('/api/config', 'GET', {}, (config) => {
        console.log('Config loaded:', config);
    });
}
