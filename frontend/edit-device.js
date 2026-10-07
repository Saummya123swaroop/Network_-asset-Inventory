let devices = [];
let currentDevice = null;
let originalSnapshot = null;


// ==========================================
// GET ELEMENTS
// ==========================================

const picker = document.getElementById("devicePicker");
const form = document.getElementById("editDeviceForm");

const changeBanner = document.getElementById("changeBanner");
const changeBannerText = document.getElementById("changeBannerText");

const statusSelect = document.getElementById("status");
const statusPreview = document.getElementById("statusPreview");

const macInput = document.getElementById("macAddress");
const ipInput = document.getElementById("ipAddress");

const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");

const deleteBtn = document.getElementById("deleteBtn");
const deleteModal = document.getElementById("deleteModal");

const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");

const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");

const deleteDeviceName =
    document.getElementById("deleteDeviceName");


// ==========================================
// FORM FIELDS
// ==========================================

const fieldEls = {

    name: document.getElementById("deviceName"),

    type: document.getElementById("deviceType"),

    ip: document.getElementById("ipAddress"),

    mac: document.getElementById("macAddress"),

    location: document.getElementById("location"),

    lastMaintenance:
        document.getElementById("lastMaintenance"),

    status:
        document.getElementById("status")
};


// ==========================================
// STATUS MAP
// ==========================================

const statusMap = {

    Active: {
        text: "Active",
        cls: "active"
    },

    Maintenance: {
        text: "Under Maintenance",
        cls: "maintenance"
    },

    Offline: {
        text: "Offline",
        cls: "offline"
    }
};


// ==========================================
// LOAD DEVICES FROM SPRING BOOT
// ==========================================

async function loadDevices() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/devices"
        );

        if (!response.ok) {
            throw new Error("Failed to load devices");
        }

        devices = await response.json();

        console.log("Devices loaded:", devices);


        if (devices.length === 0) {

            picker.innerHTML =
                '<option value="">No devices found</option>';

            return;
        }


        populatePicker();

        loadDevice(devices[0].id);

    }

    catch (error) {

        console.error(
            "Error loading devices:",
            error
        );

        showToast(
            "Could not load devices. Make sure Spring Boot is running.",
            "danger"
        );
    }
}


// ==========================================
// POPULATE DEVICE DROPDOWN
// ==========================================

function populatePicker() {

    picker.innerHTML = "";

    devices.forEach(device => {

        const option =
            document.createElement("option");

        option.value = device.id;

        option.textContent =
            `${device.deviceName} — ${device.location}`;

        picker.appendChild(option);
    });
}


// ==========================================
// LOAD DEVICE INTO FORM
// ==========================================

function loadDevice(id) {

    const device = devices.find(
        d => d.id === Number(id)
    );

    if (!device) {
        return;
    }


    currentDevice = device;

    originalSnapshot = {
        ...device
    };


    // Fill form

    fieldEls.name.value =
        device.deviceName || "";

    fieldEls.type.value =
        device.deviceType || "";

    fieldEls.ip.value =
        device.ipAddress || "";

    fieldEls.mac.value =
        device.macAddress || "";

    fieldEls.location.value =
        device.location || "";

    fieldEls.lastMaintenance.value =
        device.maintenanceDate || "";

    fieldEls.status.value =
        device.status || "";


    // Select floating label

    [
        fieldEls.type,
        fieldEls.status
    ].forEach(select => {

        if (select.value) {
            select.classList.add("has-value");
        }
        else {
            select.classList.remove("has-value");
        }

    });


    updateStatusPreview();

    clearChangeState();

    picker.value = device.id;
}


// ==========================================
// STATUS PREVIEW
// ==========================================

function updateStatusPreview() {

    const info =
        statusMap[statusSelect.value];


    if (!info) {

        statusPreview.classList.add("hidden");

        return;
    }


    statusPreview.textContent =
        info.text;

    statusPreview.className =
        `status-preview ${info.cls}`;
}


// ==========================================
// CLEAR CHANGE STATE
// ==========================================

function clearChangeState() {

    document
        .querySelectorAll(".field")
        .forEach(field => {

            field.classList.remove("changed");

        });


    changeBanner.classList.remove("show");
}


// ==========================================
// CHECK FOR CHANGES
// ==========================================

function checkForChanges() {

    if (!originalSnapshot) {
        return;
    }


    let changedField = null;


    document
        .querySelectorAll(".field[data-field]")
        .forEach(fieldDiv => {

            const key =
                fieldDiv.dataset.field;

            const element =
                fieldEls[key];

            if (!element) {
                return;
            }


            const currentValue =
                String(element.value);


            const originalValue =
                String(
                    originalSnapshot[getOriginalKey(key)] ?? ""
                );


            const isChanged =
                currentValue !== originalValue;


            fieldDiv.classList.toggle(
                "changed",
                isChanged
            );


            if (isChanged && !changedField) {

                changedField = {

                    key: key,

                    oldVal:
                        originalSnapshot[
                            getOriginalKey(key)
                        ],

                    newVal:
                        element.value

                };
            }

        });


    if (changedField) {

        const labels = {

            name: "Device Name",

            type: "Device Type",

            ip: "IP Address",

            mac: "MAC Address",

            location: "Location",

            lastMaintenance:
                "Last Maintenance Date",

            status: "Status"

        };


        changeBannerText.innerHTML =

            `${labels[changedField.key]}
             changed:
             <span class="old-val">
                ${changedField.oldVal ?? ""}
             </span>
             →
             <span class="new-val">
                ${changedField.newVal}
             </span>`;


        changeBanner.classList.add("show");

    }

    else {

        changeBanner.classList.remove("show");
    }
}


// ==========================================
// MATCH FRONTEND FIELD TO DATABASE FIELD
// ==========================================

function getOriginalKey(key) {

    const map = {

        name: "deviceName",

        type: "deviceType",

        ip: "ipAddress",

        mac: "macAddress",

        location: "location",

        lastMaintenance:
            "maintenanceDate",

        status: "status"

    };

    return map[key];
}


// ==========================================
// MAC ADDRESS AUTO FORMATTING
// ==========================================

macInput.addEventListener(
    "input",
    () => {

        let value =
            macInput.value
                .replace(/[^0-9a-fA-F]/g, "")
                .toUpperCase();


        value =
            value.slice(0, 12);


        const parts =
            value.match(/.{1,2}/g) || [];


        macInput.value =
            parts.join(":");


        checkForChanges();
    }
);


// ==========================================
// IP ADDRESS VALIDATION
// ==========================================

ipInput.addEventListener(
    "input",
    () => {

        const octets =
            ipInput.value.split(".");


        const isValid =
            octets.length <= 4 &&
            octets.every(octet => {

                if (octet === "") {
                    return true;
                }

                const number =
                    Number(octet);

                return (
                    number >= 0 &&
                    number <= 255
                );

            });


        const field =
            ipInput.closest(".field");


        if (field) {

            field.classList.toggle(
                "invalid",
                ipInput.value.length > 0 &&
                !isValid
            );
        }


        checkForChanges();
    }
);


// ==========================================
// WATCH FORM CHANGES
// ==========================================

Object
    .values(fieldEls)
    .forEach(element => {

        element.addEventListener(
            "input",
            checkForChanges
        );


        element.addEventListener(
            "change",
            () => {

                if (
                    element.tagName === "SELECT"
                ) {

                    element.classList.add(
                        "has-value"
                    );
                }


                if (
                    element === statusSelect
                ) {

                    updateStatusPreview();
                }


                checkForChanges();

            }
        );

    });


// ==========================================
// DEVICE PICKER
// ==========================================

picker.addEventListener(
    "change",
    () => {

        loadDevice(
            picker.value
        );

    }
);


// ==========================================
// REVERT CHANGES
// ==========================================

form.addEventListener(
    "reset",
    event => {

        event.preventDefault();


        if (currentDevice) {

            loadDevice(
                currentDevice.id
            );

        }

    }
);


// ==========================================
// UPDATE DEVICE
// ==========================================

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!form.checkValidity()) {

            form.reportValidity();

            return;
        }


        if (!currentDevice) {

            showToast(
                "No device selected.",
                "danger"
            );

            return;
        }


        const updatedDevice = {

            deviceName:
                fieldEls.name.value.trim(),

            deviceType:
                fieldEls.type.value,

            ipAddress:
                fieldEls.ip.value.trim(),

            macAddress:
                fieldEls.mac.value.trim(),

            location:
                fieldEls.location.value.trim(),

            maintenanceDate:
                fieldEls.lastMaintenance.value,

            status:
                fieldEls.status.value
        };


        console.log(
            "Sending update:",
            updatedDevice
        );


        try {

            const response = await fetch(

                `http://localhost:8080/api/devices/${currentDevice.id}`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedDevice
                        )
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Server error:",
                    errorText
                );

                throw new Error(
                    `Server returned ${response.status}`
                );
            }


            const savedDevice =
                await response.json();


            console.log(
                "Updated successfully:",
                savedDevice
            );


            // Update local array

            const index =
                devices.findIndex(
                    device =>
                        device.id ===
                        savedDevice.id
                );


            if (index !== -1) {

                devices[index] =
                    savedDevice;
            }


            currentDevice =
                savedDevice;


            originalSnapshot =
                {
                    ...savedDevice
                };


            populatePicker();

            picker.value =
                savedDevice.id;


            clearChangeState();


            showToast(
                `${savedDevice.deviceName} updated successfully!`,
                "success"
            );

        }

        catch (error) {

            console.error(
                "Error updating device:",
                error
            );


            showToast(
                "Could not update device. Make sure Spring Boot is running.",
                "danger"
            );

        }

    }
);


// ==========================================
// DELETE BUTTON
// ==========================================

deleteBtn.addEventListener(
    "click",
    () => {

        if (!currentDevice) {
            return;
        }


        deleteDeviceName.textContent =
            currentDevice.deviceName;


        deleteModal.classList.add("show");

    }
);


// ==========================================
// CANCEL DELETE
// ==========================================

cancelDeleteBtn.addEventListener(
    "click",
    () => {

        deleteModal.classList.remove(
            "show"
        );

    }
);


// ==========================================
// CLOSE MODAL
// ==========================================

deleteModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            deleteModal
        ) {

            deleteModal.classList.remove(
                "show"
            );
        }

    }
);


// ==========================================
// CONFIRM DELETE
// ==========================================

confirmDeleteBtn.addEventListener(
    "click",
    async () => {

        if (!currentDevice) {
            return;
        }


        const deletedDevice =
            currentDevice;


        try {

            const response =
                await fetch(

                    `http://localhost:8080/api/devices/${deletedDevice.id}`,

                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );
            }


            // Remove from local array

            devices =
                devices.filter(
                    device =>
                        device.id !==
                        deletedDevice.id
                );


            deleteModal.classList.remove(
                "show"
            );


            showToast(
                `${deletedDevice.deviceName} deleted successfully!`,
                "danger"
            );


            // Load another device

            if (devices.length > 0) {

                populatePicker();

                loadDevice(
                    devices[0].id
                );

            }

            else {

                currentDevice = null;

                picker.innerHTML =
                    '<option value="">No devices remaining</option>';

                form.reset();

            }

        }

        catch (error) {

            console.error(
                "Error deleting device:",
                error
            );


            showToast(
                "Could not delete device.",
                "danger"
            );

        }

    }
);


// ==========================================
// TOAST
// ==========================================

function showToast(
    message,
    type = "success"
) {

    if (!toast) {

        alert(message);

        return;
    }


    if (toastText) {

        toastText.textContent =
            message;

    }


    toast.className =
        `toast ${type} show`;


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );
}


// ==========================================
// INITIAL LOAD
// ==========================================

loadDevices();