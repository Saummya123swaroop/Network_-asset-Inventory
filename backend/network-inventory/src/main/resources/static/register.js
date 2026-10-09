// ============================================
// REGISTER PAGE JAVASCRIPT
// ============================================

const registerForm =
    document.getElementById("registerForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const message =
    document.getElementById("message");

const registerButton =
    document.querySelector(".register-btn");


// ============================================
// SHOW MESSAGE
// ============================================

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        "message " + type;
}


// ============================================
// REGISTER
// ============================================

registerForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        // ====================================
        // BASIC VALIDATION
        // ====================================

        if (username === "") {

            showMessage(
                "Please enter a username.",
                "error"
            );

            usernameInput.focus();

            return;
        }


        if (password === "") {

            showMessage(
                "Please enter a password.",
                "error"
            );

            passwordInput.focus();

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Password must be at least 6 characters.",
                "error"
            );

            passwordInput.focus();

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            confirmPasswordInput.focus();

            return;
        }


        // ====================================
        // DISABLE BUTTON
        // ====================================

        registerButton.disabled = true;

        registerButton.textContent =
            "Creating Account...";


        // ====================================
        // USER OBJECT
        // ====================================

        const user = {

            username: username,

            password: password,

            role: "ADMIN"
        };


        console.log(
            "Registering user:",
            username
        );


        // ====================================
        // SEND TO SPRING BOOT
        // ====================================

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/auth/register",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(user)
                    }
                );


            const responseText =
                await response.text();


            console.log(
                "Registration response:",
                responseText
            );


            // =================================
            // CHECK ERROR
            // =================================

            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Registration failed."
                );
            }


            // =================================
            // SUCCESS
            // =================================

            showMessage(
                "Registration successful! Redirecting to login...",
                "success"
            );


            registerForm.reset();


            setTimeout(
                function() {

                    window.location.href =
                        "logiin.html";

                },
                1500
            );

        }

        catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showMessage(
                error.message ||
                "Could not register. Make sure Spring Boot is running.",
                "error"
            );


            registerButton.disabled = false;

            registerButton.textContent =
                "Create Account";
        }

    }
);