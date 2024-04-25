document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    fetchDataAndRenderAllUI();
});
function setupEventListeners() {
    // Forms submission
    document.getElementById('minyanTimeForm').addEventListener('submit', handleMinyanTimeSubmission);
    document.getElementById('announcementForm').addEventListener('submit', handleAnnouncementSubmission);
    document.getElementById('fileUploadForm').addEventListener('submit', handleFileUpload);
    document.getElementById('addSponsorForm').addEventListener('submit', addSponsor);
    document.getElementById('addSponsorshipForm').addEventListener('submit', addSponsorship);
    document.getElementById('sponsorForm').addEventListener('submit', handleSponsorSubmission);
    document.getElementById('sponsorshipForm').addEventListener('submit', handleSponsorshipSubmission);

    // Button clicks
    document.getElementById('clearMinyanTimes').addEventListener('click', clearAllMinyanTimes);
    document.getElementById('deleteUploadedFile').addEventListener('click', deleteUploadedFiles);
}

function fetchDataAndRenderAllUI() {
    fetchMinyanTimes();
    fetchAnnouncements();
    fetchUploadedFiles();
    fetchSponsors();
    fetchSponsorships();
}


function fetchMinyanTimes() {
    const url = '/api/minyan';
    fetch(url, {
        method: 'GET',
        headers: {'Accept': 'application/json'}
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch minyan times: ${response.statusText}`);
        }
        return response.json();
    }).then(data => {
        updateMinyanTimesUI(data);
    }).catch(error => {
        console.error('Error fetching minyan times:', error);
        // Update the UI to show an error message or empty state
        updateMinyanTimesUI([]);
    });
}


function fetchAnnouncements() {
    const url = '/api/announcement';
    fetch(url, {
        method: 'GET',
        headers: {'Accept': 'application/json'}
    }).then(response => {
        if (!response.ok) throw new Error('Failed to load announcements');
        return response.json();
    }).then(data => {
        updateAnnouncementsUI(data);
    }).catch(error => {
        console.error('Error fetching announcements:', error);
        updateAnnouncementsUI([]);
    });
}


function fetchUploadedFiles() {
    const url = '/api/files';
    fetch(url, {
        method: 'GET',
        headers: {'Accept': 'application/json'}
    }).then(response => {
        if (!response.ok) throw new Error('Failed to load files');
        return response.json();
    }).then(data => {
        updateUploadedFilesUI(data);
    }).catch(error => {
        console.error('Error fetching files:', error);
        updateUploadedFilesUI([]);
    });
}


function fetchSponsors() {
    const url = '/api/sponsors';
    fetch(url, {
        method: 'GET',
        headers: {'Accept': 'application/json'}
    }).then(response => {
        if (!response.ok) throw new Error('Failed to load sponsors');
        return response.json();
    }).then(data => {
        updateSponsorsUI(data);
    }).catch(error => {
        console.error('Error fetching sponsors:', error);
        updateSponsorsUI([]);
    });
}

function fetchSponsorships() {
    const url = '/api/sponsorships';
    fetch(url, {
        method: 'GET',
        headers: {'Accept': 'application/json'}
    }).then(response => {
        if (!response.ok) throw new Error('Failed to load sponsorships');
        return response.json();
    }).then(data => {
        updateSponsorshipsUI(data);
    }).catch(error => {
        console.error('Error fetching sponsorships:', error);
        updateSponsorshipsUI([]);
    });
}


function handleMinyanTimeSubmission(event) {
    event.preventDefault();
    const url = '/api/minyan';
    const data = {
        name: document.getElementById('minyanName').value,
        time: document.getElementById('minyanTime').value,
        day: document.getElementById('minyanDay').value
    };

    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) throw new Error(`Failed to post minyan time: ${response.statusText}`);
        return response.json();
    }).then(() => {
        fetchMinyanTimes();
    }).catch(error => {
        console.error('Error submitting minyan time:', error);
    });
}


function handleAnnouncementSubmission(event) {
    event.preventDefault();
    const url = '/api/announcement';
    const data = {
        header: document.getElementById('announcementHeader').value,
        text: document.getElementById('announcementText').value
    };

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to post announcement');
            return response.json();
        })
        .then(() => fetchAnnouncements())
        .catch(error => console.error('Error submitting announcement:', error));
}


function handleFileUpload(event) {
    event.preventDefault();
    const url = '/api/files';
    const formData = new FormData(document.getElementById('fileUploadForm'));

    fetch(url, {
        method: 'POST',
        body: formData
    }).then(response => {
        if (!response.ok) throw new Error('Failed to upload file');
        fetchUploadedFiles();
    }).catch(error => {
        console.error('Error with file upload:', error);
    });
}

function clearAllMinyanTimes() {
    const url = '/api/minyan/clear';
    fetch(url, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        if (!response.ok) throw new Error('Failed to clear minyan times');
        fetchMinyanTimes(); // Refresh the list after clearing
        alert('All minyan times cleared successfully.');
    }).catch(error => {
        console.error('Error clearing minyan times:', error);
        alert('Failed to clear minyan times. Please try again later.');
    });
}



function deleteMinyanTime(minyanId) {
    const url = `/api/minyan/${minyanId}`;
    fetch(url, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Failed to delete minyan time: ${response.statusText}`);
        }
        fetchMinyanTimes(); // Refresh the list after deleting
    }).catch(error => {
        console.error('Error deleting minyan time:', error);
    });
}

function performLogin(event) {
    event.preventDefault();
    const url = '/admin/login';
    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        credentials: 'same-origin'
    }).then(response => {
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return response.json();
    }).then(response => {
        if (response.success) {
            window.location.href = '/admin';
        } else {
            alert(response.message || 'Login failed! Please check your credentials and try again.');
        }
    }).catch(error => {
        console.error('Login failed:', error);
        alert('Login failed! Please try again.');
    });
}

function updateUIList(containerId, items, formatter) {
    const container = document.getElementById(containerId);
    container.innerHTML = items.map(item => `<div>${formatter(item)}</div>`).join('');
}

function updateMinyanTimesUI(minyanTimes) {
    const container = document.getElementById('minyanTimesList');
    if (!container) {
        console.error('Minyan times list container not found');
        return;
    }
    const htmlContent = minyanTimes.map(minyan => `
        <div class="minyan-item">
            ${minyan.day} - ${minyan.name} at ${minyan.time}
            <button onclick="deleteMinyanTime(${minyan.id})">Delete</button>
        </div>
    `).join('');
    container.innerHTML = htmlContent;
}



function updateAnnouncementsUI(data) {
    updateUIList('announcementList', data, item => `<strong>${item.header}</strong>: ${item.text}`);
}

function updateUploadedFilesUI(data) {
    updateUIList('uploadedFileContainer', data, file => `${file.original_name} (Uploaded on ${file.upload_date}) <button onclick="deleteUploadedFile(${file.id})">Delete</button>`);
}

function updateSponsorsUI(data) {
    updateUIList('sponsorsList', data, sponsor => `${sponsor.name} (${sponsor.contact_info})`);
}

function updateSponsorshipsUI(data) {
    updateUIList('sponsorshipsList', data, sp => `${sp.sponsor_id}: ${sp.detail_id} for $${sp.amount} on ${sp.date}`);
}

function deleteUploadedFiles() {
    // Assuming bulk delete; adjust if necessary for individual delete
    const url = '/api/files/delete_all';
    fetch(url, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        if (!response.ok) throw new Error('Failed to delete files');
        fetchUploadedFiles(); // Refresh the files list
    }).catch(error => {
        console.error('Error deleting files:', error);
    });
}

function fetchAnnouncements() {
    const url = '/api/announcement';
    fetch(url, {
        method: 'GET',
        headers: {'Accept': 'application/json'}
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to load announcements');
        }
        return response.json();
    }).then(data => {
        updateAnnouncementsUI(data);
    }).catch(error => {
        console.error('Error fetching announcements:', error);
        updateAnnouncementsUI([]); // Handle the case where no data is fetched
    });
}

function updateAnnouncementsUI(announcements) {
    const container = document.getElementById('announcementList');
    if (!container) {
        console.error('Announcement list container not found');
        return;
    }
    if (announcements.length === 0) {
        container.innerHTML = "<p>No announcements available.</p>";
        return;
    }
    const htmlContent = announcements.map(announcement => `
        <div class="announcement-item">
            <strong>${announcement.header}</strong>
            <p>${announcement.text}</p>
            <button onclick="deleteAnnouncement(${announcement.id})">Delete</button>
        </div>
    `).join('');
    container.innerHTML = htmlContent;
}

function deleteAnnouncement(announcementId) {
    const url = `/api/announcement/${announcementId}`;
    fetch(url, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete announcement');
        }
        fetchAnnouncements(); // Refresh the list after deleting
    }).catch(error => {
        console.error('Error deleting announcement:', error);
    });
}

function handleSponsorSubmission(event) {
    event.preventDefault();
    const sponsorData = {
        name: document.getElementById('sponsorName').value,
        details: document.getElementById('sponsorDetails').value
    };
    fetch('/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sponsorData)
    }).then(response => response.json())
        .then(() => {
            fetchSponsors(); // Refresh the list
        })
        .catch(error => console.error('Error adding sponsor:', error));
}

function fetchSponsors() {
    fetch('/api/sponsors')
        .then(response => response.json())
        .then(data => updateSponsorsUI(data))
        .catch(error => console.error('Error fetching sponsors:', error));
}

function updateSponsorsUI(sponsors) {
    const sponsorsList = document.getElementById('sponsorsList');
    sponsorsList.innerHTML = sponsors.map(sponsor =>
        `<div>${sponsor.name} - ${sponsor.details} <button onclick="deleteSponsor(${sponsor.id})">Delete</button></div>`
    ).join('');
}

function deleteSponsor(sponsorId) {
    fetch(`/api/sponsors/${sponsorId}`, { method: 'DELETE' })
        .then(() => fetchSponsors())
        .catch(error => console.error('Error deleting sponsor:', error));
}



function handleSponsorshipSubmission(event) {
    event.preventDefault();
    const sponsorshipData = {
        sponsorId: document.getElementById('sponsorId').value,
        detail: document.getElementById('detail').value,
        date: document.getElementById('sponsorshipDate').value,
        amount: document.getElementById('amount').value
    };
    fetch('/api/sponsorships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sponsorshipData)
    }).then(response => response.json())
        .then(() => {
            fetchSponsorships(); // Refresh the list
        })
        .catch(error => console.error('Error adding sponsorship:', error));
}

function fetchSponsorships() {
    fetch('/api/sponsorships')
        .then(response => response.json())
        .then(data => updateSponsorshipsUI(data))
        .catch(error => console.error('Error fetching sponsorships:', error));
}

function updateSponsorshipsUI(sponsorships) {
    const sponsorshipsList = document.getElementById('sponsorshipsList');
    sponsorshipsList.innerHTML = sponsorships.map(sp =>
        `<div>Sponsor ID: ${sp.sponsor_id}, Details: ${sp.detail}, Amount: ${sp.amount} on ${sp.date} 
         <button onclick="deleteSponsorship(${sp.id})">Delete</button></div>`
    ).join('');
}

function deleteSponsorship(sponsorshipId) {
    fetch(`/api/sponsorships/${sponsorshipId}`, { method: 'DELETE' })
        .then(() => fetchSponsorships())
        .catch(error => console.error('Error deleting sponsorship:', error));
}


function fetchSponsors() {
    fetch('/api/sponsors')
        .then(response => response.json())
        .then(data => updateSponsorsUI(data))
        .catch(error => console.error('Error fetching sponsors:', error));
}

function updateSponsorsUI(sponsors) {
    const container = document.getElementById('sponsorsList');
    if (container) {
        container.innerHTML = sponsors.map(sponsor =>
            `<div>${sponsor.name} - Contact Info: ${sponsor.contact_info}</div>`
        ).join('');
    }
}

function fetchSponsorships() {
    fetch('/api/sponsorships')
        .then(response => response.json())
        .then(data => updateSponsorshipsUI(data))
        .catch(error => console.error('Error fetching sponsorships:', error));
}

function updateSponsorshipsUI(sponsorships) {
    const container = document.getElementById('sponsorshipsList');
    if (container) {
        container.innerHTML = sponsorships.map(sp =>
            `<div>${sp.sponsorName} (${sp.detailName}): $${sp.amount} on ${sp.date}</div>`
        ).join('');
    }
}











