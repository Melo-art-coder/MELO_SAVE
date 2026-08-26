/* =====================================================
   MELOSAV — LOGIN
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const loginButton =
        document.getElementById("loginBtn");

    if (!loginButton) {

        console.error(
            "MELOSAV: loginBtn was not found."
        );

        return;

    }

    loginButton.addEventListener(
        "click",
        loginUser
    );

});


/* =====================================================
   LOGIN
===================================================== */

function loginUser(event) {

    if (event) {
        event.preventDefault();
    }


    const emailField =
        document.getElementById("email");

    const pinField =
        document.getElementById("pin");


    if (
        !emailField ||
        !pinField
    ) {

        console.error(
            "MELOSAV: Login fields are missing."
        );

        return;

    }


    const email =
        emailField.value
            .trim()
            .toLowerCase();

    const pin =
        pinField.value
            .trim();


    /* =========================
       VALIDATION
    ========================= */

    if (!email) {

        showLoginMessage(
            "Please enter your email.",
            "error"
        );

        return;

    }


    if (!validLoginEmail(email)) {

        showLoginMessage(
            "Please enter a valid email address.",
            "error"
        );

        return;

    }


    if (!pin) {

        showLoginMessage(
            "Please enter your PIN.",
            "error"
        );

        return;

    }


    /* =========================
       GET USERS
    ========================= */

    let users = [];

    try {

        users =
            JSON.parse(
                localStorage.getItem(
                    "meloUsers"
                )
            ) || [];

    } catch (error) {

        console.error(
            "MELOSAV: Could not read accounts.",
            error
        );

        users = [];

    }


    if (!Array.isArray(users)) {

        users = [];

    }


    /* =========================
       FIND ACCOUNT
    ========================= */

    const user =
        users.find(function (account) {

            return (
                String(
                    account.email || ""
                )
                    .toLowerCase() ===
                email
            );

        });


    if (!user) {

        showLoginMessage(
            "No MELOSAV account was found with this email.",
            "error"
        );

        return;

    }


    /* =========================
       CHECK PIN
    ========================= */

    if (
        String(user.pin) !==
        String(pin)
    ) {

        showLoginMessage(
            "Incorrect PIN.",
            "error"
        );

        return;

    }


    /* =========================
       SAVE CURRENT USER
    ========================= */

    localStorage.setItem(

        "meloCurrentUser",

        JSON.stringify(user)

    );


    /* =========================
       LOAD USER THEME
    ========================= */

    localStorage.setItem(

        "meloTheme",

        user.themeColor ||
        "purple"

    );


    /* =========================
       SUCCESS
    ========================= */

    showLoginMessage(
        "Welcome back.",
        "success"
    );


    setTimeout(function () {

        window.location.href =
            "home.html";

    }, 700);

}


/* =====================================================
   EMAIL VALIDATION
===================================================== */

function validLoginEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =====================================================
   MESSAGE
===================================================== */

function showLoginMessage(
    message,
    type
) {

    if (
        typeof meloToast ===
        "function"
    ) {

        meloToast(

            type === "success"
                ? "Welcome Back"
                : "Login",

            message,

            type

        );

    } else {

        alert(message);

    }

}
