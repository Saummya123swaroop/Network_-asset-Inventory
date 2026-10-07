
const API_URL = "http://localhost:8080/api/devices";


// ==========================================
// LOAD DEVICES FROM SPRING BOOT
// ==========================================

async function loadDashboard() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load devices");
        }

        const devices = await response.json();

        console.log("Devices from database:", devices);

        // Update dashboard statistics
        updateStatistics(devices);

        // Update Recent Devices table
        updateRecentDevices(devices);

    } catch (error) {

        console.error("Error loading dashboard:", error);

    }
}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics(devices) {

    const total =
        devices.length;

    const routers =
        devices.filter(device =>
            device.deviceType === "Router"
        ).length;

    const switches =
        devices.filter(device =>
            device.deviceType === "Switch"
        ).length;

    const firewalls =
        devices.filter(device =>
            device.deviceType === "Firewall"
        ).length;

    const servers =
        devices.filter(device =>
            device.deviceType === "Server"
        ).length;

    const accessPoints =
        devices.filter(device =>
            device.deviceType === "Access Point"
        ).length;

    const maintenance =
        devices.filter(device =>
            device.status === "Maintenance"
        ).length;


    const statValues =
        document.querySelectorAll(".stat-value");


    if (statValues.length >= 7) {

        statValues[0].textContent = total;

        statValues[1].textContent = routers;

        statValues[2].textContent = switches;

        statValues[3].textContent = firewalls;

        statValues[4].textContent = servers;

        statValues[5].textContent = accessPoints;

        statValues[6].textContent = maintenance;

    }

}


// ==========================================
// UPDATE RECENT DEVICES TABLE
// ==========================================

function updateRecentDevices(devices) {

    const tableBody =
        document.querySelector("#deviceTable tbody");


    if (!tableBody) {
        return;
    }


    // Clear existing hard-coded rows

    tableBody.innerHTML = "";


    // Add devices from database

    devices.forEach(device => {

        const row =
            document.createElement("tr");


        // Decide status CSS class

        let statusClass = "";


        if (device.status === "Active") {

            statusClass = "active";

        }
        else if (device.status === "Maintenance") {

            statusClass = "maintenance";

        }
        else if (device.status === "Offline") {

            statusClass = "offline";

        }


        row.innerHTML = `

            <td class="device-name">
                ${device.deviceName || ""}
            </td>

            <td class="mono">
                ${device.ipAddress || ""}
            </td>

            <td>
                ${device.location || ""}
            </td>

            <td>
                <span class="type-pill">
                    ${device.deviceType || ""}
                </span>
            </td>

            <td>
                <span class="badge ${statusClass}">
                    ${getStatusText(device.status)}
                </span>
            </td>

        `;


        tableBody.appendChild(row);

    });


    // Activate search

    setupSearch();

}


// ==========================================
// STATUS TEXT
// ==========================================

function getStatusText(status) {

    if (status === "Maintenance") {

        return "Maintenance";

    }

    if (status === "Active") {

        return "Active";

    }

    if (status === "Offline") {

        return "Offline";

    }

    return status || "";

}


// ==========================================
// SEARCH DEVICES
// ==========================================

function setupSearch() {

    const searchInput =
        document.getElementById("deviceSearch");

    const table =
        document.getElementById("deviceTable");


    if (!searchInput || !table) {
        return;
    }


    const rows =
        table.querySelectorAll("tbody tr");


    searchInput.oninput = function () {

        const term =
            searchInput.value
                .trim()
                .toLowerCase();


        rows.forEach(row => {

            const text =
                row.textContent.toLowerCase();


            if (text.includes(term)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    };

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                window.location.href =
                    "logiin.html";

            }

        }
    );

}


// ==========================================
// START DASHBOARD
// ==========================================

loadDashboard();