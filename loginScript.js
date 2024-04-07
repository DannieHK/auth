document.getElementById('loginForm').addEventListener('submit', function (event) {
    console.log('Form submitted');

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    function getTokenExpirationDate(token) { // Function to parse JWT and get the expiration date
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (!decodedToken.exp) {
            return null;
        };
        const date = new Date(0);
        date.setUTCSeconds(decodedToken.exp);
        return date;
    };

    function isTokenExpiringSoon(expirationDate) {
        const alertBefore = 60 * 60 * 1000; // Alert 60 minutes before token expires
        if (expirationDate < new Date(new Date().getTime() + alertBefore)) {
            return true;
        } else {
            return false;
        };
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                return response.json();
            }
        })
        .then(data => {
            console.log('Success: ', data);
            // Hide login form and show logout button upon successful login
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'block';

            const token = document.cookie.split('; ').find(row => row.startsWith('token')).split('=')[1];
            // Get the token expiration date
            const expirationDate = getTokenExpirationDate(token);
            setInterval(() => {
                if (isTokenExpiringSoon(expirationDate)) {
                    console.log(expirationDate);
                    alert("Din session udløber om 1 time. Det vil være en god ide at gemme dine ting, logge ud, og så logge ind igen.");
                }
            }, 15 * 60 * 1000);
        })
        .catch(error => {
            console.error("Error: ", error);
        });
    event.preventDefault();
});
