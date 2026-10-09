let devices = [];

const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const tableBody = document.getElementById("tableBody");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const hintChips = document.querySelectorAll(".hint-chip");


// ===============================
// GET DEVICES FROM SPRING BOOT
// ===============================

async function loadDevices() {

    try {

        const response = await fetch("http://localhost:8080/api/devices");

        if (!response.ok) {
            throw new Error("Failed to load devices");
        }

        devices = await response.json();

        displayDevices(devices);

    } catch (error) {

        console.error("Error loading devices:", error);

        tableBody.innerHTML = "";

        resultsCount.innerHTML =
            "<strong>Error:</strong> Could not load devices.";

        emptyState.style.display = "block";
    }
}


// ===============================
// DISPLAY DEVICES
// ===============================

function displayDevices(deviceList) {

    tableBody.innerHTML = "";

    if (deviceList.length === 0) {

        emptyState.style.display = "block";

        resultsCount.innerHTML =
            "Showing <strong>0</strong> devices";

        return;
    }

    emptyState.style.display = "none";

    resultsCount.innerHTML =
        `Showing <strong>${deviceList.length}</strong> devices`;

    deviceList.forEach(device => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${device.deviceName}</td>
            <td>${device.ipAddress}</td>
            <td>${device.macAddress}</td>
            <td>${device.location}</td>
            <td>${device.deviceType}</td>
            <td>
                <span class="status ${device.status.toLowerCase()}">
                    ${device.status}
                </span>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


// ===============================
// SEARCH
// ===============================

function searchDevices() {

    const query = searchInput.value.toLowerCase().trim();

    const filteredDevices = devices.filter(device => {

        return (
            device.deviceName.toLowerCase().includes(query) ||
            device.ipAddress.toLowerCase().includes(query) ||
            device.macAddress.toLowerCase().includes(query) ||
            device.location.toLowerCase().includes(query) ||
            device.deviceType.toLowerCase().includes(query) ||
            device.status.toLowerCase().includes(query)
        );

    });

    displayDevices(filteredDevices);
}


// ===============================
// SEARCH INPUT
// ===============================

searchInput.addEventListener("input", searchDevices);


// ===============================
// CLEAR BUTTON
// ===============================

clearBtn.addEventListener("click", () => {

    searchInput.value = "";

    searchDevices();

    searchInput.focus();

});


// ===============================
// SEARCH HINTS
// ===============================

hintChips.forEach(chip => {

    chip.addEventListener("click", () => {

        searchInput.value = chip.dataset.query;

        searchDevices();

    });

});


// ===============================
// LOAD DATA WHEN PAGE OPENS
// ===============================

loadDevices();
