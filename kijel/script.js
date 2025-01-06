function loadPage() {
    localStorage.removeItem("data");
    localStorage.removeItem("authenticated");
    window.location.href = window.location.protocol + "//" + window.location.hostname + "/";
}

loadPage();