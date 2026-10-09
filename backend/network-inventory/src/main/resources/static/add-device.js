document.addEventListener("DOMContentLoaded", function () {

    // ============================
    // GET ELEMENTS
    // ============================

    const form = document.getElementById("addDeviceForm");

    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");

    const macInput = document.getElementById("macAddress");


    // ============================
    // CHECK FORM
    // ============================

    if (!form) {
        console.error("ERROR: addDeviceForm was not found.");
        return;
    }

    console.log("Add Device JavaScript loaded successfully.");



    // ============================
    // MAC ADDRESS AUTO FORMAT
    // ============================

    if (macInput) {

        macInput.addEventListener("input", function () {

            let value = macInput.value
                .replace(/[^a-fA-F0-9]/g, "")
                .toUpperCase();

            // Maximum 12 hexadecimal characters
            if (value.length > 12) {
                value = value.substring(0, 12);
            }

            let formatted = "";

            for (let i = 0; i < value.length; i += 2) {

                if (formatted.length > 0) {
                    formatted += ":";
                }

                formatted += value.substring(i, i + 2);
            }

            macInput.value = formatted;
        });

    }



    // ============================
    // FORM SUBMIT
    // ============================

    form.addEventListener("submit", async function (event) {

        // Prevent normal HTML form submission
        event.preventDefault();

        console.log("Add Device button clicked.");
        console.log("Form submission started.");


        // ============================
        // GET FORM VALUES
        // ============================

        const deviceNameElement =
            document.getElementById("deviceName");

        const deviceTypeElement =
            document.getElementById("deviceType");

        const ipAddressElement =
            document.getElementById("ipAddress");

        const macAddressElement =
            document.getElementById("macAddress");

        const locationElement =
            document.getElementById("location");

        const maintenanceDateElement =
            document.getElementById("maintenanceDate");

        const statusElement =
            document.getElementById("status");


        // ============================
        // CHECK REQUIRED ELEMENTS
        // ============================

        if (
            !deviceNameElement ||
            !deviceTypeElement ||
            !ipAddressElement ||
            !macAddressElement ||
            !locationElement ||
            !maintenanceDateElement ||
            !statusElement
        ) {

            console.error(
                "ERROR: One or more form fields could not be found."
            );

            showToast(
                "Form error. Please refresh the page."
            );

            return;
        }



        // ============================
        // CREATE DEVICE OBJECT
        // ============================

        const device = {

            deviceName:
                deviceNameElement.value.trim(),

            deviceType:
                deviceTypeElement.value,

            ipAddress:
                ipAddressElement.value.trim(),

            macAddress:
                macAddressElement.value.trim(),

            location:
                locationElement.value.trim(),

            maintenanceDate:
                maintenanceDateElement.value || null,

            status:
                statusElement.value

        };


        console.log("============================");
        console.log("DEVICE BEING SENT TO SERVER");
        console.log("============================");
        console.log(device);



        // ============================
        // BASIC VALIDATION
        // ============================

        if (!device.deviceName) {

            showToast("Please enter a device name.");
            return;

        }


        if (!device.deviceType) {

            showToast("Please select a device type.");
            return;

        }


        if (!device.ipAddress) {

            showToast("Please enter an IP address.");
            return;

        }


        if (!device.macAddress) {

            showToast("Please enter a MAC address.");
            return;

        }


        if (!device.location) {

            showToast("Please enter a location.");
            return;

        }


        if (!device.status) {

            showToast("Please select a status.");
            return;

        }



        // ============================
        // SEND DEVICE TO SPRING BOOT
        // ============================

        try {

            console.log("Sending POST request to /api/devices...");


            const response = await fetch("/api/devices", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(device)

            });


            console.log(
                "Server response status:",
                response.status
            );



            // ============================
            // SERVER ERROR
            // ============================

            if (!response.ok) {

                let errorMessage =
                    "Failed to add device.";

                try {

                    const errorText =
                        await response.text();

                    if (errorText) {
                        console.error(
                            "Server error:",
                            errorText
                        );

                        errorMessage =
                            "Failed to add device: " +
                            errorText;
                    }

                } catch (error) {

                    console.error(
                        "Could not read server error:",
                        error
                    );

                }


                showToast(errorMessage);

                return;
            }



            // ============================
            // SUCCESS
            // ============================

            console.log(
                "Device successfully saved."
            );


            showToast(
                "Device added successfully!"
            );


            // ============================
            // CLEAR FORM
            // ============================

            form.reset();



            // ============================
            // REDIRECT TO DASHBOARD
            // ============================

            console.log(
                "Redirecting to dashboard..."
            );


            setTimeout(function () {

                window.location.href =
                    "/dashboard.html";

            }, 1200);


        } catch (error) {

            // ============================
            // CONNECTION ERROR
            // ============================

            console.error(
                "ERROR CONNECTING TO SERVER:",
                error
            );


            showToast(
                "Could not connect to server."
            );

        }

    });



    // ============================
    // TOAST FUNCTION
    // ============================

    function showToast(message) {

        console.log("Toast:", message);


        if (!toast || !toastText) {

            alert(message);

            return;
        }


        toastText.textContent = message;

        toast.classList.remove("hidden");


        setTimeout(function () {

            toast.classList.add("hidden");

        }, 3000);

    }

});