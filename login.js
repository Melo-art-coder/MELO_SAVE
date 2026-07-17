// =====================================
// MELOSAV LOGIN
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    // Load theme
    if (typeof loadTheme === "function") {
        loadTheme();
    }

    // Login Button
    document
        .getElementById("loginBtn")
        .addEventListener("click", loginUser);

    // Show / Hide PIN
    const pin = document.getElementById("pin");
    const toggle = document.getElementById("togglePin");

    toggle.addEventListener("click", () => {

        if (pin.type === "password") {

            pin.type = "text";
            toggle.textContent = "🙈";

        } else {

            pin.type = "password";
            toggle.textContent = "👁️";

        }

    });

});

// =====================================
// LOGIN
// =====================================

function loginUser() {

    const email = document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const pin = document
        .getElementById("pin")
        .value
        .trim();

    if (!email || !pin) {

    meloToast(
        "📝 Almost There",
        "Please enter your email address and PIN to continue.",
        "warning"
    );

    return;

}

    const users = JSON.parse(
        localStorage.getItem("meloUsers")
    ) || [];

    const user = users.find(u =>
        u.email === email &&
        u.pin === pin
    );

    if (!user) {

    meloToast(
        "🔐 Login Failed",
        "We couldn't match that email and PIN. Please check your details and try again.",
        "error"
    );

    return;

}

    // Save Current User
    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(user)
    );

    // Welcome Message
    meloToast(
    `👋 Welcome Back, ${user.name.split(" ")[0]}!`,
    "We're so happy to see you again. Your financial journey continues today. 💜",
    "success"
);

    // Redirect to Dashboard

setTimeout(() => {

    window.location.href = "home.html";

}, 1200);
}

    