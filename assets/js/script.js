let APIData = null;
let todayDate = new Date();

let selectedItemId = -1;

function loadPage() {
    let auth = localStorage.getItem("authenticated") ? true : false;

    if (auth) {
        document.getElementById("content").innerHTML =
        `
            <h1>Candy Market - Raktárkészlet</h1>

            <a href="ujsor" id="newitem">
                <button type="button">Új termék</button>
            </a>

            <div id="editRowContainer">
                <input type="text" class="editRowInput" id="editRowName" placeholder="Termék neve">

                <input type="number" class="editRowInput" id="editRowPrice" placeholder="Termék ára">
                
                <input type="date" class="editRowInput" id="editRowExpire" placeholder="Termék szavatossága">

                <button type="button" onclick="modifyRow()">Módosít</button>
            </div>

            <input type="text" id="searchBar" placeholder="Keresés" oninput="updateRows()">

            <table>
                <thead>
                    <tr>
                        <th width="60%">Termék neve</th>
                        <th width="20%">Ára</th>
                        <th width="20%" colspan="3">Szavatosság</th>
                    </tr>
                </thead>
                <tbody id="items">

                </tbody>
            </table>
        `;
        let userdata = localStorage.getItem("data").split(":");

        fetch("https://f5api.mysrv.us/api/v1/items", {
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
                APIData = data;
            } else {
                return;
            }
        })
    } else {
        return;
    }
}

loadPage();

function updateRows() {
    clearRows();
    let searchBarValue = document.getElementById("searchBar").value.toLowerCase().trim();

    APIData.items.filter(x => x.id != 0 && (x.name.toLowerCase().includes(searchBarValue) || `${x.price}`.includes(searchBarValue))).forEach(item => {
        generateTableRow(item);
    });
}


function clearRows() {
    let rows = document.getElementById("items");
    while (rows.firstChild) {
        rows.removeChild(rows.lastChild);
    }
}


function showModifySection(id) {
    let element = APIData.items.filter(x => x.id == id)[0];
    selectedItemId = id;

    document.getElementById("editRowName").value = element.name;
    document.getElementById("editRowPrice").value = element.price;
    document.getElementById("editRowExpire").value = element.expire;

    document.getElementById("editRowContainer").style.display = "flex";
}


function modifyRow() {
    let auth = localStorage.getItem("authenticated") ? true : false;

    if (auth) {
        let element = APIData.items.filter(x => x.id == selectedItemId)[0];

        let conf = confirm(`Biztos vagy a ${element.name} termék módosításában?`);

        if (conf) {
            let userdata = localStorage.getItem("data").split(":");

            let editRowName = document.getElementById("editRowName").value;
            let editRowPrice = document.getElementById("editRowPrice").value;
            let editRowExpire = document.getElementById("editRowExpire").value;

            fetch("https://f5api.mysrv.us/api/v1/modifyitem", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "username": userdata[1],
                    "password": userdata[0],
                    "itemid": parseInt(selectedItemId),
                    "itemname": editRowName,
                    "itemprice": parseInt(editRowPrice),
                    "itemexpire": editRowExpire
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status == 200) {
                    alert("Sikeres módosítás!");
                    window.location.reload();
                    selectedItemId = -1;
                } else {
                    alert("Sikertelen módosítás!");
                }
            })
        } else {
            return;
        }
    } else {
        return;
    }
}


function deleteRow(id, name) {
    let auth = localStorage.getItem("authenticated") ? true : false;

    if (auth) {
        let conf = confirm(`Biztos vagy a ${name} termék törlésében?`);

        if (conf) {
            let userdata = localStorage.getItem("data").split(":");

            fetch("https://f5api.mysrv.us/api/v1/deleteitem", {
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
            <td class="modifyrow" onclick="showModifySection(${obj.id})" width="30px">✏️</td>
            <td class="deleterow" onclick="deleteRow(${obj.id}, '${obj.name}')" width="30px">X</tr>
        </tr>
    `;
}