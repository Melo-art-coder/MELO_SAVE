// =====================================
// MELOSAV SIGN UP
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const signupBtn = document.getElementById("signupBtn");

    if (signupBtn) {
        signupBtn.addEventListener("click", createAccount);
    }

});


// =====================================
// CREATE ACCOUNT
// =====================================

function createAccount() {

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const pinInput = document.getElementById("pin");
    const confirmPinInput = document.getElementById("confirmPin");
    const termsInput = document.getElementById("terms");


    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const pin = pinInput.value.trim();
    const confirmPin = confirmPinInput.value.trim();
    const agreed = termsInput.checked;


    // =====================================
    // VALIDATION
    // =====================================

    if (!name || !email || !pin || !confirmPin) {

        meloToast(
            "📝 A Few Details Missing",
            "Please fill in all the required fields before continuing.",
            "warning"
        );

        return;
    }


    if (pin.length < 4 || pin.length > 6) {

        meloToast(
            "🔐 Invalid PIN",
            "Your PIN must be between 4 and 6 digits.",
            "error"
        );

        return;
    }


    if (!/^\d+$/.test(pin)) {

        meloToast(
            "🔐 Invalid PIN",
            "Your PIN must contain numbers only.",
            "error"
        );

        return;
    }


    if (pin !== confirmPin) {

        meloToast(
            "🔒 PINs Don't Match",
            "Double-check both PINs and try again.",
            "error"
        );

        return;
    }


    if (!agreed) {

        meloToast(
            "📜 One Last Step",
            "Please accept the Terms & Conditions to continue.",
            "warning"
        );

        return;
    }


    // =====================================
    // GET EXISTING USERS
    // =====================================

    let users = [];

    try {

        users = JSON.parse(
            localStorage.getItem("meloUsers")
        ) || [];

    } catch (error) {

        users = [];

    }


    // =====================================
    // CHECK EXISTING EMAIL
    // =====================================

    const exists = users.find(
        user => user.email === email
    );


    if (exists) {

        meloToast(
            "💜 Account Already Exists",
            "This email is already registered. Try logging in or use another email.",
            "warning"
        );

        return;
    }


    // =====================================
    // CREATE USER
    // =====================================

    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        pin: pin,

        data: {

            income: [],

            expenses: [],

            savings: [],

            goals: [],

            transactions: [],

            notifications: [],

            streak: {

                count: 1,

                lastActive: new Date().toDateString()

            }

        }

    };


    // =====================================
    // SAVE USER
    // =====================================

    users.push(newUser);

    localStorage.setItem(
        "meloUsers",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(newUser)
    );


    // =====================================
    // DEFAULT THEME
    // =====================================

    if (!localStorage.getItem("meloTheme")) {

        localStorage.setItem(
            "meloTheme",
            "purple-light"
        );

    }


    if (typeof loadTheme === "function") {

        loadTheme();

    }


    // =====================================
    // WELCOME MESSAGE
    // =====================================

    meloToast(
        "🎉 Welcome, " + name.split(" ")[0] + "!",
        "Your MELOSAV account is ready. Let's turn your goals into achievements, one save at a time. 💜",
        "success"
    );


    // =====================================
    // MELO AI VOICE
    // =====================================

    if ("speechSynthesis" in window) {

        speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(
            `Welcome to MELOSAV, ${name}. I'm Melo AI. I'll help you save smarter and manage better.`
        );

        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;

        speechSynthesis.speak(speech);

    }


    // =====================================
    // GO TO HOME
    // =====================================

    setTimeout(() => {

        window.location.href = "home.html";

    }, 4500);

}
