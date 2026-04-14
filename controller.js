window.addEventListener("load", init);
function init() {
    bindEvents();
    if (localStorage && localStorage.hackathonEvents) {
        loadRecords();
    } else {
        loadMUJEvents();
    }
    totalRecords();
}
function bindEvents() {
    document.querySelector("#add").addEventListener("click", addRecord);
    document.querySelector("#search").addEventListener("click", searchRecord);
    document.querySelector("#update").addEventListener("click", updateRecord);
    document.querySelector("#sort").addEventListener("click", sortRecord);
    document.querySelector("#save").addEventListener("click", saveRecord);
    document.querySelector("#loadServer").addEventListener("click", loadFromServer);
    document.querySelector("#load").addEventListener("click", loadRecords);
}

// ===== PRE-LOADED MUJ CLUB EVENTS =====
function loadMUJEvents() {
    var mujEvents = [
        new Items(1, "Hackoverflow 5.0", "IOSC (I/O Student Community)", "2026-04-10", "Offline", 4, "₹75,000", "iosc@muj.ac.in", "9876543210"),
        new Items(2, "CodeSprint 2026", "ACM MUJ Chapter", "2026-04-18", "Hybrid", 3, "₹50,000", "acm@muj.ac.in", "8876543211"),
        new Items(3, "DesignHack", "GDSC MUJ (Google DSC)", "2026-05-05", "Online", 2, "₹30,000", "gdsc@muj.ac.in", "7876543212"),
        new Items(4, "CyberQuest CTF", "CyberCell MUJ", "2026-03-28", "Offline", 3, "₹40,000", "cybercell@muj.ac.in", "6876543213"),
        new Items(5, "AI/ML Challenge", "IEEE MUJ", "2026-04-25", "Hybrid", 4, "₹1,00,000", "ieee@muj.ac.in", "9976543214"),
        new Items(6, "WebWars", "E-Cell MUJ", "2026-05-12", "Online", 2, "₹25,000", "ecell@muj.ac.in", "9176543215"),
        new Items(7, "RoboRumble", "Robotics Club MUJ", "2026-04-05", "Offline", 5, "₹60,000", "robotics@muj.ac.in", "9276543216"),
        new Items(8, "DataDash", "Analytics Club MUJ", "2026-05-20", "Hybrid", 3, "₹35,000", "analytics@muj.ac.in", "9376543217"),
        new Items(9, "AppDev Marathon", "Mozilla Campus Club MUJ", "2026-06-01", "Online", 2, "₹45,000", "mozilla@muj.ac.in", "9476543218"),
        new Items(10, "BlockBuild", "Blockchain Club MUJ", "2026-06-15", "Offline", 4, "₹80,000", "blockchain@muj.ac.in", "9576543219")
    ];

    mujEvents.forEach(event => {
        itemOperations.add(event);
        printRecord(event);
    });
}

function addRecord() {
    // Validate required fields
    var id = document.querySelector("#id").value;
    var eventName = document.querySelector("#eventName").value;
    if (!id || !eventName) {
        showToast("⚠️ Please fill Event ID and Event Name!");
        return;
    }

    var item = new Items();
    for (let key in item) {
        item[key] = document.querySelector("#" + key).value;
    }
    itemOperations.add(item);
    console.log(item);
    printRecord(item);
    totalRecords();
    clearForm();
    showToast("✅ Event added successfully!");
}

function clearForm() {
    var fields = ["id", "eventName", "organizer", "eventDate", "mode", "teamSize", "prizePool", "email", "phone"];
    fields.forEach(field => {
        document.querySelector("#" + field).value = "";
    });
}

function printRecord(item) {
    var tb = document.querySelector("#tbody");
    var tr = tb.insertRow();
    var idx = 0;
    for (let key in item) {
        let cell = tr.insertCell(idx);
        if (key == "mode") {
            let badge = document.createElement("span");
            badge.className = "badge badge-" + item[key].toLowerCase();
            badge.innerText = item[key];
            cell.appendChild(badge);
        } else {
            cell.innerText = item[key];
        }
        idx++;
    }
    let cell = tr.insertCell(idx);
    cell.className = "action-cell";
    cell.appendChild(createIcon("fas fa-trash-alt", trash, item.id));
    cell.appendChild(createIcon("fas fa-edit", edit, item.id));
}

function createIcon(cl, fn, id) {
    var iTag = document.createElement("i");
    iTag.className = cl;
    iTag.addEventListener("click", fn);
    iTag.setAttribute("iTagID", id);
    return iTag;
}

function trash() {
    let id = this.getAttribute("iTagID");
    itemOperations.remove(id);
    printTable(itemOperations.items);
    totalRecords();
    showToast("🗑️ Record deleted instantly!");
}

var item;
function edit() {
    let id = this.getAttribute("iTagID");
    item = itemOperations.search(id);
    for (let key in item) {
        document.querySelector("#" + key).value = item[key];
    }
    showToast("📝 Editing: " + item.eventName);
}

function totalRecords() {
    document.querySelector("#total").innerText = "Total: " + itemOperations.items.length;
}

function printTable(items) {
    var tbody = document.querySelector("tbody");
    tbody.innerHTML = '';
    items.forEach(item => printRecord(item));
}

function searchRecord() {
    var sb = document.querySelector("#searchbox");
    sb.classList.toggle('showhide');
    if (sb.classList.contains('showhide')) {
        var searchKey = document.querySelector("#searchkey").value;
        var searchValue = document.querySelector("#searchvalue").value;
        if (!searchValue) {
            printTable(itemOperations.items);
            totalRecords();
            showToast("Showing all records");
            return;
        }
        var items = itemOperations.searchAll(searchKey, searchValue);
        printTable(items);
        totalRecords();
        showToast("🔍 Found " + items.length + " result(s)");
    } else {
        printTable(itemOperations.items);
        totalRecords();
    }
}

function updateRecord() {
    if (!item) {
        showToast("⚠️ Click edit icon on a record first!");
        return;
    }
    for (let key in item) {
        item[key] = document.querySelector("#" + key).value;
    }
    printTable(itemOperations.items);
    clearForm();
    showToast("✅ Record updated successfully!");
    item = null;
}

function sortRecord() {
    let items = itemOperations.sortRecord();
    printTable(items);
    showToast("🔢 Records sorted by ID");
}

function saveRecord() {
    if (localStorage) {
        localStorage.hackathonEvents = JSON.stringify(itemOperations.items);
        showToast("💾 " + itemOperations.items.length + " records saved!");
    } else {
        showToast("⚠️ Local Storage not supported!");
    }
}

function loadFromServer() {
    showToast("☁️ Fetching from server...");
    setTimeout(() => {
        let mockData = [
            Object.assign(new Items(), {id: 101, eventName: "Global Tech Summit", organizer: "Microsoft", eventDate: "2026-10-10", mode: "Offline", teamSize: 5, prizePool: "₹2,00,000", email: "tech@microsoft.com", phone: "1800123456"}),
            Object.assign(new Items(), {id: 102, eventName: "AWS Cloud Quest", organizer: "Amazon", eventDate: "2026-11-15", mode: "Online", teamSize: 3, prizePool: "₹1,50,000", email: "events@aws.com", phone: "1800654321"})
        ];
        itemOperations.items = mockData;
        printTable(itemOperations.items);
        totalRecords();
        showToast("☁️ Data loaded from custom server!");
    }, 1000);
}

function loadRecords() {
    if (localStorage && localStorage.hackathonEvents) {
        let plainItems = JSON.parse(localStorage.hackathonEvents);
        itemOperations.items = plainItems.map(obj => Object.assign(new Items(), obj)); // Rehydrate Items class
        printTable(itemOperations.items);
        totalRecords();
        showToast("📂 " + itemOperations.items.length + " records loaded!");
    } else {
        showToast("⚠️ No saved records found!");
    }
}

function showToast(msg) {
    var toast = document.querySelector("#toast");
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
