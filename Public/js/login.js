document.addEventListener('DOMContentLoaded', function() {
    setupLoginEventListeners();
});

function setupLoginEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', performLogin);
    }
}

async function performLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/admin/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password }),
            credentials: 'same-origin'
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to login');
        }

        window.location.href = '/admin';
    } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed! Please try again.');
    }
}
