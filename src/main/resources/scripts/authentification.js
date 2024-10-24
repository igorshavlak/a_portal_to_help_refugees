function login() {
    const username = document.getElementById("email").value
    const password = document.getElementById("password").value

    fetch("api/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`

    }).then(r  => r.text())
        .then(data =>{
            if (data === "successful"){
                alert("successful login!");
            }else {
                alert(data);
            }
        })
}