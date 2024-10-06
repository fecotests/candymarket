let todayDate = new Date();

function loadPage() {
    let auth = localStorage.getItem("authenticated") ? true : false;

    if (auth) {
        document.getElementById("content").innerHTML =
        `
            <h1>Candy Market - Raktárkészlet</h1>

            <a href="ujsor" id="newitem">
                <button type="button">Új termék</button>
            </a>

            <table>
                <thead>
                    <tr>
                        <th width="60%">Termék neve</th>
                        <th width="20%">Ára</th>
                        <th width="20%" colspan="2">Szavatosság</th>
                    </tr>
                </thead>
                <tbody id="items">

                </tbody>
            </table>
        `;
        let userdata = localStorage.getItem("data").split(":");

        fetch("https://api.f5api.xyz/api/v1/items", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "username": userdata[1],
                "password": userdata[0]
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status == 200) {
                data.items.filter(x => x.id != 0).forEach(item => {
                    generateTableRow(item);
                });
            } else {
                return;
            }
        })
    } else {
        return;
    }
}

loadPage();


function deleteRow(id, name) {
    let auth = localStorage.getItem("authenticated") ? true : false;

    if (auth) {
        let conf = confirm(`Biztos vagy a ${name} termék törlésében?`);

        if (conf) {
            let userdata = localStorage.getItem("data").split(":");

            fetch("https://api.f5api.xyz/api/v1/deleteitem", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "username": userdata[1],
                    "password": userdata[0],
                    "itemid": parseInt(id)
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status == 200) {
                    alert("Sikeres törlés!");
                    window.location.reload();
                } else {
                    alert("Sikertelen törlés!");
                }
            })
        } else {
            return;
        }
    } else {
        return;
    }
    
}


function generateTableRow(obj) {
    let itemExpireDate = new Date(obj.expire);
    let daysDifference = (itemExpireDate - todayDate) / (1000 * 60 * 60 * 24);

    let className = daysDifference <= 30 ? "verySoon" : daysDifference <= 50 ? "soon" : "";

    document.getElementById("items").innerHTML +=
    `
        <tr>
            <td>${obj.name}</td>
            <td>${obj.price} Ft</td>
            <td class="${className}">${obj.expire.replaceAll("-", ".")}.</td>
            <td id="${obj.id}" class="deleterow" onclick="deleteRow(${obj.id}, '${obj.name}')" width="25px">X</tr>
        </tr>
    `;
}