function loadPage() {
    localStorage.removeItem("data");
    localStorage.setItem("authenticated", false);
    window.location.href = window.location.protocol + "//" + window.location.hostname + "/";
}

loadPage();