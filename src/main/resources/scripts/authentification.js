function login() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    fetch("/api/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`

    }).then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else if (response.status === 403 || response.status === 401) {
            window.location.href = '/application.html?error=true';
        } else {
            console.error('Unexpected response:', response);
        }
    })
        .catch(error => {
            console.error('Error during login:', error);
        });
}