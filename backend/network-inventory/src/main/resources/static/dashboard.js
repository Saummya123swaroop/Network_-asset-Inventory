// ==========================================
// DASHBOARD JAVASCRIPT
// ==========================================

const API_URL = "/api/devices";

let devices = [];


// ==========================================
// GET ELEMENTS
// ==========================================

const totalDevices = document.getElementById("totalDevices");
const routerCount = document.getElementById("routerCount");
const switchCount = document.getElementById("switchCount");
const firewallCount = document.getElementById("firewallCount");
const serverCount = document.getElementById("serverCount");
const accessPointCount = document.getElementById("accessPointCount");
const maintenanceCount = document.getElementById("maintenanceCount");

const deviceSearch = document.getElementById("deviceSearch");

const deviceTable = document.getElementById("deviceTable");
const tableBody = deviceTable
    ? deviceTable.querySelector("tbody")
    : null;

const logoutBtn = document.getElementById("logoutBtn");


// ==========================================
// LOAD DEVICES FROM SPRING BOOT
// ==========================================

async function loadDevices() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Server returned " + response.status
            );

        }

        devices = await response.json();

        console.log("Devices loaded:", devices);

        updateDashboard();

    }

    catch (error) {

        console.error(
            "Could not load devices:",
            error
        );

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5"
                        style="text-align:center; padding:30px;">
                        Unable to load devices
                    </td>
                </tr>
            `;

        }

    }

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    updateCounts();

    displayDevices(devices);

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateCounts() {

    const routers =
        devices.filter(
            device => device.deviceType === "Router"
        ).length;

    const switches =
        devices.filter(
            device => device.deviceType === "Switch"
        ).length;

    const firewalls =
        devices.filter(
            device => device.deviceType === "Firewall"
        ).length;

    const servers =
        devices.filter(
            device => device.deviceType === "Server"
        ).length;

    const accessPoints =
        devices.filter(
            device => device.deviceType === "Access Point"
        ).length;

    const maintenance =
        devices.filter(
            device => device.status === "Maintenance"
        ).length;


    totalDevices.textContent = devices.length;

    routerCount.textContent = routers;

    switchCount.textContent = switches;

    firewallCount.textContent = firewalls;

    serverCount.textContent = servers;

    accessPointCount.textContent = accessPoints;

    maintenanceCount.textContent = maintenance;

}


// ==========================================
// DISPLAY DEVICES
// ==========================================

function displayDevices(deviceList) {

    if (!tableBody) {
        return;
    }


    // No devices

    if (deviceList.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#7488a8;
                    ">
                    No devices found
                </td>
            </tr>
        `;

        return;

    }


    tableBody.innerHTML = "";


    deviceList.forEach(device => {

        const row = document.createElement("tr");


        // Status class

        let statusClass = "active";

        if (device.status === "Maintenance") {

            statusClass = "maintenance";

        }

        else if (device.status === "Offline") {

            statusClass = "offline";

        }


        row.innerHTML = `

            <td class="device-name">
                ${escapeHtml(device.deviceName)}
            </td>

            <td class="mono">
                ${escapeHtml(device.ipAddress)}
            </td>

            <td>
                ${escapeHtml(device.location)}
            </td>

            <td>

                <span class="type-pill">
                    ${escapeHtml(device.deviceType)}
                </span>

            </td>

            <td>

                <span class="badge ${statusClass}">
                    ${escapeHtml(device.status)}
                </span>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ==========================================
// SEARCH DEVICES
// ==========================================

if (deviceSearch) {

    deviceSearch.addEventListener(
        "input",
        function () {

            const searchText =
                deviceSearch.value
                    .trim()
                    .toLowerCase();


            // If search is empty,
            // show all devices

            if (searchText === "") {

                displayDevices(devices);

                return;

            }


            // Search in multiple fields

            const filteredDevices =
                devices.filter(device => {

                    return (

                        (device.deviceName || "")
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        (device.ipAddress || "")
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        (device.macAddress || "")
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        (device.deviceType || "")
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        (device.location || "")
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        (device.status || "")
                            .toLowerCase()
                            .includes(searchText)

                    );

                });


            displayDevices(filteredDevices);

        }
    );

}


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHtml(value) {

    if (value === null || value === undefined) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            window.location.href = "/logout";

        }
    );

}


// ==========================================
// START DASHBOARD
// ==========================================

loadDevices();