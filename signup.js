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
        "Your PIN should be between 4 and 6 digits.",
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

    // Existing users

    let users =
        JSON.parse(localStorage.getItem("meloUsers")) || [];

    const exists = users.find(user =>
        user.email === email
    );

    if (exists) {

        meloToast(
    "💜 Welcome Back!",
    "This email is already registered. Try logging in or use another email.",
    "warning"
);

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
        "theme-purple-dark"
    );

} else {

    localStorage.setItem(
        "meloTheme",
        "theme-purple-light"
    );

}

    if (typeof loadTheme === "function") {

        loadTheme();

    }

    // Welcome

meloToast(
    "🎉 Welcome, " + name.split(" ")[0] + "!",
    "Your MELOSAV account is ready. Let's turn your goals into achievements, one save at a time. 💜",
    "success"
);

// Melo AI Voice

    if ("speechSynthesis" in window) {

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(

        `Welcome to MELOSAV, ${name}.
        I'm Melo AI.
        I'll help you save smarter, manage better, and achieve your financial goals.
        Let's begin your journey together.`

    );

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onend = () => {

        window.location.href = "home.html";

    };

    speechSynthesis.speak(speech);

} else {

    setTimeout(() => {

        window.location.href = "home.html";

    }, 3500);

}

}
   