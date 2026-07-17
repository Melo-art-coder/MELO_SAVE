/* =====================================
   MELOSAV HOME
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();
    loadUser();

    // Theme Button
    document.getElementById("themeBtn").onclick = () => {
        location.href = "theme-setup.html";
    };

    // Notifications
    document.getElementById("notificationBtn").onclick = () => {
        meloToast(
            "🔔 Notifications",
            "This feature is coming soon.",
            "info"
        );
    };

    // Quick Actions
    document.getElementById("incomeBtn").onclick = () => {
        meloToast(
            "💰 Income",
            "Income feature coming soon.",
            "info"
        );
    };

    document.getElementById("expenseBtn").onclick = () => {
        meloToast(
            "💸 Expenses",
            "Expense feature coming soon.",
            "info"
        );
    };

    document.getElementById("saveBtn").onclick = () => {
        meloToast(
            "🏦 Savings",
            "Savings feature coming soon.",
            "info"
        );
    };

    document.getElementById("goalBtn").onclick = () => {
        location.href = "goals.html";
    };

    document.getElementById("fab").onclick = () => {
        meloToast(
            "➕ Quick Add",
            "Quick Add feature coming soon.",
            "info"
        );
    };

});

function loadUser() {

    const user = JSON.parse(
        localStorage.getItem("meloCurrentUser")
    );

    if (!user) {

        location.href = "login.html";
        return;

    }

    document.getElementById("username").textContent = user.name;

    document.getElementById("greeting").textContent = getGreeting();

    // Dashboard Values

    const income = user.data?.income?.length || 0;
    const expenses = user.data?.expenses?.length || 0;
    const savings = user.data?.savings?.length || 0;

    // Dashboard Values

const balance = user.balance || 0;

document.getElementById("balance").textContent =
    `₦${balance.toLocaleString()}`;

document.getElementById("usdBalance").textContent =
    "$0.00";

document.getElementById("eurBalance").textContent =
    "€0.00";

document.getElementById("gbpBalance").textContent =
    "£0.00";

const income = user.data?.income?.length || 0;
const expenses = user.data?.expenses?.length || 0;
const savings = user.data?.savings?.length || 0;

document.getElementById("income").textContent = income;
document.getElementById("expenses").textContent = expenses;
document.getElementById("savings").textContent = savings;

    // Melo AI Welcome

    setTimeout(() => {

        speakGreeting(user.name);

    }, 1000);

}

function getGreeting() {

    const hour = new Date().getHours();

    if (hour < 12) {

        return "Good Morning ☀️";

    }

    if (hour < 18) {

        return "Good Afternoon 🌤️";

    }

    return "Good Evening 🌙";

}

function speakGreeting(name) {

    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    const firstName = name.split(" ")[0];

    const hour = new Date().getHours();

    let message = "";

    if (hour < 12) {

        message = `Good morning ${firstName}. I'm Melo AI. Welcome back to MELOSAV. Let's save smarter today.`;

    } else if (hour < 18) {

        message = `Good afternoon ${firstName}. I'm Melo AI. Welcome back to MELOSAV. Let's continue building your savings.`;

    } else {

        message = `Good evening ${firstName}. I'm Melo AI. Welcome back to MELOSAV. Let's manage your money wisely today.`;

    }

    const speech = new SpeechSynthesisUtterance(message);

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speechSynthesis.speak(speech);

}
/* =====================================
   HIDE / SHOW BALANCE
===================================== */

let hidden = false;

document.getElementById("toggleBalance").onclick = () => {

    hidden = !hidden;

    document.getElementById("balance").textContent =
        hidden ? "••••••••" : "₦0.00";

    document.getElementById("toggleBalance").textContent =
        hidden ? "🙈" : "👁️";

};


/* =====================================
   WALLET DOTS
===================================== */

const slider = document.getElementById("walletSlider");
const dots = document.querySelectorAll(".wallet-dots span");

slider.addEventListener("scroll", () => {

    const index = Math.round(
        slider.scrollLeft / slider.clientWidth
    );

    dots.forEach(dot => dot.classList.remove("active"));

    if (dots[index]) {

        dots[index].classList.add("active");

    }

});
// =====================================
// SWIPEABLE WALLET + HIDE BALANCE
// =====================================

let balanceVisible = true;

const toggleBtn = document.getElementById("toggleBalance");

toggleBtn.addEventListener("click", () => {

    balanceVisible = !balanceVisible;

    const values = [
        "balance",
        "income",
        "expenses",
        "savings",
        "usdBalance",
        "eurBalance",
        "gbpBalance"
    ];

    values.forEach(id => {

        const el = document.getElementById(id);

        if (!el) return;

        if (balanceVisible) {

            el.dataset.hidden
                ? el.textContent = el.dataset.hidden
                : null;

        } else {

            el.dataset.hidden = el.textContent;

            el.textContent = "••••••";

        }

    });

    toggleBtn.textContent =
        balanceVisible ? "👁️" : "🙈";

});


// Wallet Dots

const slider =
document.getElementById("walletSlider");

const dots =
document.querySelectorAll(".wallet-dots span");

slider.addEventListener("scroll", () => {

    const index =
    Math.round(
        slider.scrollLeft /
        slider.clientWidth
    );

    dots.forEach(dot =>
        dot.classList.remove("active")
    );

    if(dots[index]){

        dots[index].classList.add("active");

    }

});