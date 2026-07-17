// =====================================
// MELOSAV SIGN UP
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const signupBtn = document.getElementById("signupBtn");

    signupBtn.addEventListener("click", createAccount);

});

function createAccount() {

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim().toLowerCase();

    const pin =
        document.getElementById("pin").value.trim();

    const confirmPin =
        document.getElementById("confirmPin").value.trim();

    const agreed =
        document.getElementById("terms").checked;

    const mode =
        document.querySelector('input[name="mode"]:checked').value;

    // Validation

    if (!name || !email || !pin || !confirmPin) {

        alert("Please complete all fields.");

        return;

    }

    if (pin.length < 4 || pin.length > 6) {

        alert("PIN must be 4–6 digits.");

        return;

    }

    if (pin !== confirmPin) {

        alert("PINs do not match.");

        return;

    }

    if (!agreed) {

        alert("Please accept the Terms & Conditions.");

        return;

    }

    // Existing users

    let users =
        JSON.parse(localStorage.getItem("meloUsers")) || [];

    const exists = users.find(user =>
        user.email === email
    );

    if (exists) {

        alert("An account already exists with this email.");

        return;

    }

    // Create user

    const newUser = {

        id: Date.now(),

        name,

        email,

        pin,

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

    users.push(newUser);

    localStorage.setItem(
        "meloUsers",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(newUser)
    );

    // Theme

    if (mode === "dark") {

        localStorage.setItem(
            "meloTheme",
            "midnight"
        );

    } else {

        localStorage.setItem(
            "meloTheme",
            "purple"
        );

    }

    if (typeof loadTheme === "function") {

        loadTheme();

    }

    // Welcome

    alert(`💜 Welcome to MELOSAV, ${name}!`);

    // Melo AI Voice

    if ("speechSynthesis" in window) {

        const speech = new SpeechSynthesisUtterance(

            `Welcome to MeloSave ${name}.
            I'm Melo AI.
            I'll help you save smarter and manage better.`

        );

        speech.rate = 1;

        speech.pitch = 1;

        speech.volume = 1;

        speechSynthesis.speak(speech);

    }

    // Redirect

    setTimeout(() => {

        window.location.href = "home.html";

    }, 2500);

}