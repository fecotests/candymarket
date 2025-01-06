function loadPage() {
    let auth = localStorage.getItem("authenticated") ? true : false;

    if (!auth) {
        return;
    }
    else {
        //window.location.href = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/index.html";
        window.location.href = window.location.protocol + "//" + window.location.hostname + "/";
    }
}

loadPage();

function login() {
    let un = document.getElementById("username").value;
    let pw = document.getElementById("password").value;

    fetch("https://api.fecooo.hu/api/v1/cm/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "user": btoa(`${un}:${pw}`)
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data) {
            if (data.status == 200) {
                localStorage.setItem("authenticated", true);
                // localStorage.setItem("data", `${pw}:${un}`);
                localStorage.setItem("data", btoa(`${un}:${pw}`));
                //window.location.href = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/";
                window.location.href = window.location.protocol + "//" + window.location.hostname + "/";
            } else {
                localStorage.setItem("authenticated", false);
            }
        }
    })
}