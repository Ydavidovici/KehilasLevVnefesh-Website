document.addEventListener('DOMContentLoaded', function () {
    refreshUI();
    setupFormAndButtons();
    fetchConfig();
    setupButtonClick();
    setupFormSubmission('announcementForm', addAnnouncement);
    setupFileUpload('fileUploadForm');

});

function setupFormAndButtons() {
    setupFormSubmission('minyanTimeForm', addMinyanTime);
    setupButtonClick('clearMinyanTimes', clearAllMinyanTimes);
}

function setupFormSubmission(formId, callback) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            callback();
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
    const name = document.getElementById('minyanName').value;
    const time = document.getElementById('minyanTime').value;
    const day = document.getElementById('minyanDay').value;

    fetchData('/api/minyan', 'POST', { name, time, day }, refreshUI);
}

function clearAllMinyanTimes() {
    fetchData('/api/minyan/clear', 'DELETE', {}, refreshUI);
}

function fetchData(url, method, body, callback) {
    const options = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    customFetch(url, options)
        .then(callback)
        .catch(error => console.error(`Error with ${method} at ${url}:`, error));
}

function refreshUI() {
    fetchMinyanTimes();
    fetchUploadedFiles();
}

function fetchMinyanTimes() {
    fetchData('/api/minyan', 'GET', {}, updateMinyanTimesUI);
}

function fetchUploadedFiles() {
    fetchData('/api/files', 'GET', {}, updateUploadedFilesUI);
}

function updateMinyanTimesUI(minyanTimes) {
    updateUIList('minyanTimesList', minyanTimes, minyan => `${minyan.name} at ${minyan.time} on ${minyan.day}`);
}

function updateUploadedFilesUI(files) {
    updateUIList('uploadedFileContainer', files, file => `${file.originalname} (${file.mimetype}) - ${file.size} bytes`);
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

function customFetch(url, options) {
    return fetch(url, options)
        .then(response => {
            if (!response.ok) throw new Error(`${response.statusText} (${response.status})`);
            return response.json();
        });
}

function fetchAnnouncements() {
    fetchData('/api/announcement', 'GET', {}, updateAnnouncementsUI);
}

function addAnnouncement() {
    const header = document.getElementById('announcementHeader').value;
    const text = document.getElementById('announcementText').value;
    fetchData('/api/announcement', 'POST', { header, text }, refreshUI);
}

function updateAnnouncement(id) {
    const header = document.getElementById('editAnnouncementHeader').value;
    const text = document.getElementById('editAnnouncementText').value;
    fetchData(`/api/announcement/${id}`, 'PUT', { header, text }, refreshUI);
}

function deleteAnnouncement(id) {
    fetchData(`/api/announcement/${id}`, 'DELETE', {}, refreshUI);
}

function updateAnnouncementsUI(announcements) {
    updateUIList('announcementsList', announcements, announcement => `${announcement.header}: ${announcement.text}`);
}

function fetchSponsors() {
    fetchData('/api/sponsors', 'GET', {}, updateSponsorsUI);
}

function addSponsor() {
    const name = document.getElementById('sponsorName').value;
    const contactInfo = document.getElementById('sponsorContactInfo').value; // Assuming you have these fields in your HTML
    fetchData('/api/sponsors', 'POST', { name, contactInfo }, refreshUI);
}

function updateSponsor(id) {
    const name = document.getElementById('editSponsorName').value;
    const contactInfo = document.getElementById('editSponsorContactInfo').value;
    fetchData(`/api/sponsors/${id}`, 'PUT', { name, contactInfo }, refreshUI);
}

function deleteSponsor(id) {
    fetchData(`/api/sponsors/${id}`, 'DELETE', {}, refreshUI);
}

function updateSponsorsUI(sponsors) {
    updateUIList('sponsorsList', sponsors, sponsor => `${sponsor.name} (${sponsor.contactInfo})`);
}

function setupFormSubmission(formId, callback) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            callback();
        });
    }
}

function isAdminPage() {
    return window.location.pathname.includes('admin');
}

function setupFileUpload(formId) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('/api/files', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                refreshUI();  // Refresh your UI here
            })
            .catch(error => console.error('Error:', error));
    });
}

// stripe setup
const stripe = Stripe(process.env.'your_publishable_key_here');  // Replace with your actual publishable Stripe key

async function initiateSponsorshipCheckout(sponsorshipType, amount) {
    try {
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sponsorshipType, amount })
        });
        const sessionData = await response.json();

        if (response.ok) {
            return sessionData.sessionId;
        } else {
            throw new Error('Failed to create checkout session.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error initiating payment. Please try again.');
    }
}

async function redirectToStripeCheckout(sessionId) {
    const result = await stripe.redirectToCheckout({
        sessionId: sessionId
    });

    if (result.error) {
        alert(result.error.message);
    }
}

function handleSponsorshipPayment(sponsorshipType, amount) {
    initiateSponsorshipCheckout(sponsorshipType, amount)
        .then(sessionId => {
            if (sessionId) {
                redirectToStripeCheckout(sessionId);
            }
        })
        .catch(error => {
            console.error('Payment initiation failed:', error);
            alert('Failed to redirect to payment. Please try again.');
        });
}

async function fetchConfig() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        console.log('Config:', config);
        // Use the config in your client-side logic
    } catch (error) {
        console.error('Failed to fetch configuration:', error);
    }
}

async function startCheckout(sponsorshipType, amount) {
    const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sponsorshipType, amount })
    });
    const { sessionId } = await response.json();
    const stripe = Stripe('your_publishable_key_here');
    stripe.redirectToCheckout({ sessionId });
}

