function loadPage() {
    let auth = localStorage.getItem("authenticated") ? true : false;

    if (auth) {
        document.getElementById("content").innerHTML =
        `
            <h1>Termék felvétele</h1>
            
            <input type="text" id="itemname" placeholder="Termék neve">

            <input type="number" id="itemprice" placeholder="Termék ára">

            <input type="date" id="itemexpire">

            <button type="button" onclick="addrow()">Termék felvétele</button>

            <a href="../" id="tomainpage">
                <button>Kezdőoldalra</button>
            </a>
        `;

        let todayDate = new Date();

        let dateInput = document.getElementById("itemexpire");
        dateInput.value = todayDate.toISOString().split("T")[0];
        dateInput.setAttribute("min", todayDate.toISOString().split("T")[0]);
    } else {
        //window.location.href = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/";
        window.location.href = window.location.protocol + "//" + window.location.hostname + "/";    
    }
}

loadPage();

function addrow() {
    let auth = localStorage.getItem("authenticated") ? true : false;

    if (auth) {
        let userdata = localStorage.getItem("data");
        let itemname = document.getElementById("itemname").value;
        let itemprice = parseInt(document.getElementById("itemprice").value);
        let itemexpire = document.getElementById("itemexpire").value;

        fetch("https://api.fecooo.hu/api/v1/cm/newitem", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "user": userdata,
                "itemname": itemname,
                "itemprice": itemprice,
                "itemexpire": itemexpire
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status == 200) {
                alert("Sikeres felvétel!");
                window.location.reload();
            } else {
                alert("Sikertelen felvétel!");
            }
        })
    } else {
        return;
    }
}