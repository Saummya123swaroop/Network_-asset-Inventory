// ==========================================
// EDIT DEVICE JAVASCRIPT
// DVC NETWORK ASSET INVENTORY
// ==========================================

const API_URL = "/api/devices";

let devices = [];
let currentDevice = null;
let originalDevice = null;


// ==========================================
// GET ELEMENTS
// ==========================================

const picker = document.getElementById("devicePicker");
const form = document.getElementById("editDeviceForm");

const deviceName = document.getElementById("deviceName");
const deviceType = document.getElementById("deviceType");

const ipAddress = document.getElementById("ipAddress");
const macAddress = document.getElementById("macAddress");

const locationField = document.getElementById("location");

const maintenanceDate =
    document.getElementById("maintenanceDate");

const status = document.getElementById("status");

const changeBanner =
    document.getElementById("changeBanner");

const changeBannerText =
    document.getElementById("changeBannerText");

const deleteBtn =
    document.getElementById("deleteBtn");

const deleteModal =
    document.getElementById("deleteModal");

const deleteDeviceName =
    document.getElementById("deleteDeviceName");

const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");

const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");

const revertBtn =
    document.getElementById("revertBtn");

const toast =
    document.getElementById("toast");

const toastText =
    document.getElementById("toastText");


// ==========================================
// CHECK REQUIRED ELEMENTS
// ==========================================

if (!picker || !form) {

    console.error(
        "Edit Device HTML elements are missing."
    );

}


// ==========================================
// LOAD DEVICES
// ==========================================

async function loadDevices() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Could not load devices. Status: " +
                response.status
            );

        }

        devices =
            await response.json();

        console.log(
            "Devices loaded:",
            devices
        );


        // ------------------------------
        // NO DEVICES
        // ------------------------------

        if (devices.length === 0) {

            picker.innerHTML =
                '<option value="">No devices found</option>';

            form.style.display = "none";

            showToast(
                "No devices available to edit",
                "danger"
            );

            return;

        }


        // ------------------------------
        // DEVICES FOUND
        // ------------------------------

        populatePicker();

        loadDevice(
            devices[0].id
        );

    }

    catch (error) {

        console.error(
            "Load devices error:",
            error
        );

        picker.innerHTML =
            '<option value="">Unable to load devices</option>';

        showToast(
            "Could not connect to Spring Boot",
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

        option.value =
            device.id;

        option.textContent =
            device.deviceName +
            " — " +
            device.ipAddress;

        picker.appendChild(option);

    });

}


// ==========================================
// LOAD SELECTED DEVICE
// ==========================================

function loadDevice(id) {

    const device =
        devices.find(
            d => d.id === Number(id)
        );

    if (!device) {

        console.error(
            "Device not found:",
            id
        );

        return;

    }


    currentDevice = device;


    originalDevice = {
        ...device
    };


    // ------------------------------
    // FILL FORM
    // ------------------------------

    deviceName.value =
        device.deviceName || "";

    deviceType.value =
        device.deviceType || "";

    ipAddress.value =
        device.ipAddress || "";

    macAddress.value =
        device.macAddress || "";

    locationField.value =
        device.location || "";

    maintenanceDate.value =
        device.maintenanceDate || "";

    status.value =
        device.status || "";


    picker.value =
        device.id;


    updateSelectLabels();

    clearChanges();


    console.log(
        "Selected device:",
        device
    );

}


// ==========================================
// SELECT LABELS
// ==========================================

function updateSelectLabels() {

    document
        .querySelectorAll(".field select")
        .forEach(select => {

            if (select.value !== "") {

                select.classList.add(
                    "has-value"
                );

            }

            else {

                select.classList.remove(
                    "has-value"
                );

            }

        });

}


// ==========================================
// DEVICE PICKER
// ==========================================

picker.addEventListener(
    "change",
    function () {

        loadDevice(
            picker.value
        );

    }
);


// ==========================================
// MAC ADDRESS FORMAT
// ==========================================

macAddress.addEventListener(
    "input",
    function () {

        let value =
            macAddress.value
                .replace(
                    /[^0-9a-fA-F]/g,
                    ""
                )
                .toUpperCase();


        value =
            value.substring(
                0,
                12
            );


        const parts =
            value.match(
                /.{1,2}/g
            ) || [];


        macAddress.value =
            parts.join(":");


        checkChanges();

    }
);


// ==========================================
// IP VALIDATION
// ==========================================

ipAddress.addEventListener(
    "input",
    function () {

        const value =
            ipAddress.value.trim();


        const parts =
            value.split(".");


        let valid = true;


        if (parts.length !== 4) {

            valid = false;

        }

        else {

            for (
                const part of parts
            ) {

                const number =
                    Number(part);


                if (
                    part === "" ||
                    number < 0 ||
                    number > 255
                ) {

                    valid = false;

                    break;

                }

            }

        }


        const field =
            ipAddress.closest(".field");


        if (field) {

            field.classList.toggle(
                "invalid",
                value.length > 0 &&
                !valid
            );

        }


        checkChanges();

    }
);


// ==========================================
// WATCH FORM CHANGES
// ==========================================

[
    deviceName,
    deviceType,
    ipAddress,
    macAddress,
    locationField,
    maintenanceDate,
    status

].forEach(element => {

    element.addEventListener(
        "input",
        checkChanges
    );


    element.addEventListener(
        "change",
        function () {

            updateSelectLabels();

            checkChanges();

        }
    );

});


// ==========================================
// CHECK FOR CHANGES
// ==========================================

function checkChanges() {

    if (!originalDevice) {

        return;

    }


    const changed =

        deviceName.value.trim() !==
            (originalDevice.deviceName || "") ||

        deviceType.value !==
            (originalDevice.deviceType || "") ||

        ipAddress.value.trim() !==
            (originalDevice.ipAddress || "") ||

        macAddress.value.trim() !==
            (originalDevice.macAddress || "") ||

        locationField.value.trim() !==
            (originalDevice.location || "") ||

        maintenanceDate.value !==
            (originalDevice.maintenanceDate || "") ||

        status.value !==
            (originalDevice.status || "");


    if (changed) {

        changeBannerText.textContent =
            "You have unsaved changes.";

        changeBanner.classList.add(
            "show"
        );

    }

    else {

        clearChanges();

    }

}


// ==========================================
// CLEAR CHANGE BANNER
// ==========================================

function clearChanges() {

    changeBanner.classList.remove(
        "show"
    );

}


// ==========================================
// REVERT CHANGES
// ==========================================

revertBtn.addEventListener(
    "click",
    function () {

        if (!currentDevice) {

            return;

        }


        loadDevice(
            currentDevice.id
        );


        showToast(
            "Changes reverted",
            "success"
        );

    }
);


// ==========================================
// UPDATE DEVICE
// ==========================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ------------------------------
        // HTML VALIDATION
        // ------------------------------

        if (!form.checkValidity()) {

            form.reportValidity();

            return;

        }


        // ------------------------------
        // CHECK DEVICE
        // ------------------------------

        if (!currentDevice) {

            showToast(
                "Please select a device",
                "danger"
            );

            return;

        }


        // ------------------------------
        // CREATE UPDATED DEVICE
        // ------------------------------

        const updatedDevice = {

            deviceName:
                deviceName.value.trim(),

            deviceType:
                deviceType.value,

            ipAddress:
                ipAddress.value.trim(),

            macAddress:
                macAddress.value.trim(),

            location:
                locationField.value.trim(),

            maintenanceDate:
                maintenanceDate.value,

            status:
                status.value

        };


        console.log(
            "Updating device:",
            updatedDevice
        );


        try {

            const response =
                await fetch(
                    API_URL +
                    "/" +
                    currentDevice.id,
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


            // ------------------------------
            // SERVER ERROR
            // ------------------------------

            if (!response.ok) {

    const errorText = await response.text();

    console.error("HTTP Status:", response.status);
    console.error("Server response:", errorText);

    throw new Error(
        "Update failed (" +
        response.status +
        "): " +
        errorText
    );
}


            // ------------------------------
            // GET SAVED DEVICE
            // ------------------------------

            const savedDevice =
                await response.json();


            console.log(
                "Updated device:",
                savedDevice
            );


            // ------------------------------
            // UPDATE LOCAL ARRAY
            // ------------------------------

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


            originalDevice = {
                ...savedDevice
            };


            populatePicker();


            picker.value =
                savedDevice.id;


            clearChanges();


            showToast(
                "Device updated successfully",
                "success"
            );

        }

        catch (error) {

            console.error(
                "Update error:",
                error
            );


            showToast(
                "Could not update device",
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
    function () {

        if (!currentDevice) {

            showToast(
                "No device selected",
                "danger"
            );

            return;

        }


        deleteDeviceName.textContent =
            currentDevice.deviceName;


        deleteModal.classList.add(
            "show"
        );

    }
);


// ==========================================
// CANCEL DELETE
// ==========================================

cancelDeleteBtn.addEventListener(
    "click",
    function () {

        deleteModal.classList.remove(
            "show"
        );

    }
);


// ==========================================
// CONFIRM DELETE
// ==========================================

confirmDeleteBtn.addEventListener(
    "click",
    async function () {

        if (!currentDevice) {

            return;

        }


        try {

            const response =
                await fetch(
                    API_URL +
                    "/" +
                    currentDevice.id,
                    {

                        method: "DELETE"

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Delete failed. Status: " +
                    response.status
                );

            }


            const deletedName =
                currentDevice.deviceName;


            // ------------------------------
            // REMOVE FROM ARRAY
            // ------------------------------

            devices =
                devices.filter(
                    device =>
                        device.id !==
                        currentDevice.id
                );


            deleteModal.classList.remove(
                "show"
            );


            showToast(
                deletedName +
                " deleted successfully",
                "success"
            );


            // ------------------------------
            // LOAD NEXT DEVICE
            // ------------------------------

            if (devices.length > 0) {

                populatePicker();

                loadDevice(
                    devices[0].id
                );

            }

            else {

                currentDevice = null;

                originalDevice = null;


                picker.innerHTML =
                    '<option value="">No devices found</option>';


                form.reset();

                clearChanges();

            }

        }

        catch (error) {

            console.error(
                "Delete error:",
                error
            );


            showToast(
                "Could not delete device",
                "danger"
            );

        }

    }
);


// ==========================================
// CLOSE DELETE MODAL
// ==========================================

deleteModal.addEventListener(
    "click",
    function (event) {

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
// TOAST
// ==========================================

function showToast(
    message,
    type = "success"
) {

    toastText.textContent =
        message;


    toast.className =
        "toast " +
        type +
        " show";


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


// ==========================================
// START APPLICATION
// ==========================================

loadDevices();