// ============================================
// ADD DEVICE JAVASCRIPT
// ============================================


// ============================================
// GET HTML ELEMENTS
// ============================================

const form = document.getElementById("addDeviceForm");

const deviceName = document.getElementById("deviceName");
const deviceType = document.getElementById("deviceType");

const ipInput = document.getElementById("ipAddress");
const macInput = document.getElementById("macAddress");

const locationInput = document.getElementById("location");

const maintenanceDate =
    document.getElementById("maintenanceDate");

const statusSelect =
    document.getElementById("status");

const statusPreview =
    document.getElementById("statusPreview");

const toast =
    document.getElementById("toast");

const toastText =
    document.getElementById("toastText");


// ============================================
// SELECT FIELD LABEL
// ============================================

document
    .querySelectorAll(".field select")
    .forEach(select => {

        function updateSelect() {

            if (select.value !== "") {

                select.classList.add("has-value");

            } else {

                select.classList.remove("has-value");

            }
        }

        select.addEventListener(
            "change",
            updateSelect
        );

        updateSelect();
    });


// ============================================
// MAC ADDRESS AUTO FORMAT
// ============================================

macInput.addEventListener("input", () => {

    let value = macInput.value
        .replace(/[^0-9a-fA-F]/g, "")
        .toUpperCase();

    // Maximum 12 hexadecimal characters
    value = value.substring(0, 12);

    const parts =
        value.match(/.{1,2}/g) || [];

    macInput.value =
        parts.join(":");
});


// ============================================
// IP ADDRESS VALIDATION
// ============================================

ipInput.addEventListener("input", () => {

    const value =
        ipInput.value.trim();

    const parts =
        value.split(".");

    let valid = true;

    if (parts.length !== 4) {

        valid = false;

    } else {

        for (let part of parts) {

            if (
                part === "" ||
                Number(part) < 0 ||
                Number(part) > 255
            ) {

                valid = false;
                break;
            }
        }
    }

    const field =
        ipInput.closest(".field");

    if (field) {

        field.classList.toggle(
            "invalid",
            value.length > 0 && !valid
        );
    }
});


// ============================================
// STATUS PREVIEW
// ============================================

statusSelect.addEventListener(
    "change",
    () => {

        const value =
            statusSelect.value;

        if (!value) {

            statusPreview.classList.add(
                "hidden"
            );

            return;
        }

        if (value === "Active") {

            statusPreview.textContent =
                "Active";

            statusPreview.className =
                "status-preview active";

        }

        else if (value === "Maintenance") {

            statusPreview.textContent =
                "Under Maintenance";

            statusPreview.className =
                "status-preview maintenance";

        }

        else if (value === "Offline") {

            statusPreview.textContent =
                "Offline";

            statusPreview.className =
                "status-preview offline";
        }
    }
);


// ============================================
// ADD DEVICE TO SPRING BOOT
// ============================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        console.log(
            "ADD DEVICE BUTTON CLICKED"
        );


        // ====================================
        // BASIC VALIDATION
        // ====================================

        if (
            deviceName.value.trim() === "" ||
            deviceType.value === "" ||
            ipInput.value.trim() === "" ||
            macInput.value.trim() === "" ||
            locationInput.value.trim() === "" ||
            statusSelect.value === ""
        ) {

            alert(
                "Please fill all required fields."
            );

            return;
        }


        // ====================================
        // CREATE DEVICE OBJECT
        // ====================================

        const device = {

            deviceName:
                deviceName.value.trim(),

            deviceType:
                deviceType.value,

            ipAddress:
                ipInput.value.trim(),

            macAddress:
                macInput.value.trim(),

            location:
                locationInput.value.trim(),

            maintenanceDate:
                maintenanceDate.value,

            status:
                statusSelect.value
        };


        console.log(
            "Sending device to Spring Boot:"
        );

        console.log(device);


        // ====================================
        // SEND POST REQUEST
        // ====================================

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/devices",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(device)
                    }
                );


            console.log(
                "HTTP STATUS:",
                response.status
            );


            // =================================
            // GET SERVER RESPONSE
            // =================================

            const responseText =
                await response.text();


            console.log(
                "SERVER RESPONSE:",
                responseText
            );


            // =================================
            // CHECK ERROR
            // =================================

            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status +
                    " - " +
                    responseText
                );
            }


            // =================================
            // SUCCESS
            // =================================

            console.log(
                "DEVICE ADDED SUCCESSFULLY!"
            );


            showToast(
                "Device added successfully"
            );


            // Clear form
            form.reset();


            // Reset select states
            document
                .querySelectorAll(
                    ".field select"
                )
                .forEach(select => {

                    select.classList.remove(
                        "has-value"
                    );
                });


            statusPreview.classList.add(
                "hidden"
            );


        }

        catch (error) {

            console.error(
                "ADD DEVICE ERROR:",
                error
            );


            alert(
                "Could not add device.\n\n" +
                error.message
            );
        }

    }
);


// ============================================
// TOAST FUNCTION
// ============================================

function showToast(message) {

    toastText.textContent =
        message;

    toast.classList.add(
        "show"
    );

    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 3000);
}