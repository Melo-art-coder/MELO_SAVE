/* =====================================================
   MELOSAV — CREATE ACCOUNT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const signupButton =
        document.getElementById("signupBtn");

    if (!signupButton) {

        console.error(
            "MELOSAV: signupBtn was not found."
        );

        return;

    }


    signupButton.addEventListener(
        "click",
        createAccount
    );

});


/* =====================================================
   CREATE ACCOUNT
===================================================== */

function createAccount(event) {

    if (event) {
        event.preventDefault();
    }


    /* =========================
       GET INPUTS
    ========================= */

    const name =
        document
            .getElementById("name")
            .value
            .trim();


    const email =
        document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();


    const pin =
        document
            .getElementById("pin")
            .value
            .trim();


    const confirmPin =
        document
            .getElementById("confirmPin")
            .value
            .trim();


    const terms =
        document
            .getElementById("terms")
            .checked;


    /* =========================
       VALIDATION
    ========================= */

    if (!name) {

        showSignupMessage(
            "Please enter your full name.",
            "error"
        );

        return;

    }


    if (!email) {

        showSignupMessage(
            "Please enter your email address.",
            "error"
        );

        return;

    }


    if (!validEmail(email)) {

        showSignupMessage(
            "Please enter a valid email address.",
            "error"
        );

        return;

    }


    if (!pin) {

        showSignupMessage(
            "Please create a PIN.",
            "error"
        );

        return;

    }


    if (!/^\d{4,6}$/.test(pin)) {

        showSignupMessage(
            "Your PIN must contain 4 to 6 numbers.",
            "error"
        );

        return;

    }


    if (pin !== confirmPin) {

        showSignupMessage(
            "Your PINs do not match.",
            "error"
        );

        return;

    }


    if (!terms) {

        showSignupMessage(
            "Please accept the Terms & Conditions.",
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
            "MELOSAV: Could not read users.",
            error
        );

        users = [];

    }


    if (!Array.isArray(users)) {

        users = [];

    }


    /* =========================
       CHECK EMAIL
    ========================= */

    const existingUser =
        users.find(function (user) {

            return (
                String(
                    user.email || ""
                )
                    .toLowerCase() ===
                email
            );

        });


    if (existingUser) {

        showSignupMessage(
            "An account with this email already exists.",
            "error"
        );

        return;

    }


    /* =========================
       CREATE MELO ID
    ========================= */

    const meloId =
        generateMeloId();


    /* =========================
       CREATE USER
    ========================= */

    const user = {

        id:
            generateUserId(),

        name:
            name,

        email:
            email,

        pin:
            pin,

        meloId:
            meloId,

        profilePhoto:
            "",


        /* FINANCIAL DATA */

        balance:
            0,

        income:
            0,

        expenses:
            0,


        /* TRANSACTIONS */

        transactions:
            [],


        /* WALLET */

        wallets: [

            {

                id:
                    "NGN",

                name:
                    "Naira",

                currency:
                    "₦",

                balance:
                    0

            }

        ],


        /* BUDGET */

        budget: {

            amount:
                0,

            period:
                "monthly"

        },


        /* SETTINGS */

        themeColor:
            "purple",


        notifications: {

            transactions:
                true,

            budget:
                true,

            savings:
                true

        },


        /* ACCOUNT */

        createdAt:
            new Date()
                .toISOString()

    };


    /* =========================
       SAVE USER
    ========================= */

    users.push(user);


    try {

        localStorage.setItem(

            "meloUsers",

            JSON.stringify(users)

        );


        localStorage.setItem(

            "meloCurrentUser",

            JSON.stringify(user)

        );


        localStorage.setItem(

            "meloTheme",

            "purple"

        );

    } catch (error) {

        console.error(
            "MELOSAV: Failed to save account.",
            error
        );

        showSignupMessage(
            "Your account could not be saved. Please try again.",
            "error"
        );

        return;

    }


    /* =========================
       SUCCESS
    ========================= */

    showSignupMessage(
        "Your MELOSAV account has been created.",
        "success"
    );


    setTimeout(function () {

        window.location.href =
            "home.html";

    }, 1000);

}


/* =====================================================
   EMAIL VALIDATION
===================================================== */

function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =====================================================
   USER ID
===================================================== */

function generateUserId() {

    return (
        "USER-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()
    );

}


/* =====================================================
   MELO ID
===================================================== */

function generateMeloId() {

    return (
        "MELO-" +
        Math.floor(
            100000 +
            Math.random() * 900000
        )
    );

}


/* =====================================================
   MESSAGE
===================================================== */

function showSignupMessage(
    message,
    type
) {

    if (
        typeof meloToast ===
        "function"
    ) {

        meloToast(

            type === "success"
                ? "Success"
                : "MELOSAV",

            message,

            type

        );

    } else {

        alert(message);

    }

}
