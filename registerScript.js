document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Registration successful, token generated and saved in browser
            localStorage.setItem('token', data.token);
            alert("Bruger tilføjet databasen.");
            window.location.href = '/dashboard';
        } else {
            alert("Fejl! Bruger kunne ikke tilføjes: " + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
