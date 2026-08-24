/* =====================================
   MELOSAV — INCOME V4
   Reliable income saving
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("incomeForm");

    if (!form) {
        console.error("MELOSAV: incomeForm not found.");
        return;
    }

    form.addEventListener("submit", saveIncome);

});


function saveIncome(event) {

    event.preventDefault();

    const amountInput = document.getElementById("amount");
    const categoryInput = document.getElementById("category");
    const descriptionInput = document.getElementById("description");

    const amount = Number(amountInput?.value);

    const category =
        categoryInput?.value?.trim() ||
        "Income";

    const description =
        descriptionInput?.value?.trim() ||
        "";


    /* ================================
       VALIDATE
    ================================= */

    if (!Number.isFinite(amount) || amount <= 0) {

        showToast(
            "Invalid Amount",
            "Please enter an amount greater than ₦0.",
            "error"
        );

        return;
    }


    /* ================================
       GET USER
    ================================= */

    let user;

    try {

        user = JSON.parse(
            localStorage.getItem("meloCurrentUser")
        );

    } catch (error) {

        console.error(
            "Could not read current user:",
            error
        );

    }


    if (!user) {

        showToast(
            "Not Logged In",
            "Please log in before adding income.",
            "error"
        );

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

        return;
    }


    /* ================================
       PREPARE USER
    ================================= */

    if (!user.wallets) {
        user.wallets = {};
    }


    if (
        typeof user.wallets.NGN !== "number"
    ) {

        user.wallets.NGN =
            Number(user.balance || 0);

    }


    user.wallets.NGN =
        Number(user.wallets.NGN || 0);


    user.income =
        Number(user.income || 0);


    if (!Array.isArray(user.transactions)) {
        user.transactions = [];
    }


    if (!Array.isArray(user.notifications)) {
        user.notifications = [];
    }


    /* ================================
       ADD MONEY
    ================================= */

    user.wallets.NGN += amount;

    user.income += amount;


    /* Keep old balance compatible */

    user.balance =
        user.wallets.NGN;


    /* ================================
       TRANSACTION
    ================================= */

    const transaction = {

        id:
            Date.now(),

        type:
            "income",

        title:
            category,

        amount:
            amount,

        currency:
            "NGN",

        description:
            description,

        date:
            new Date().toISOString()

    };


    user.transactions.unshift(
        transaction
    );


    /* ================================
       NOTIFICATION
    ================================= */

    user.notifications.unshift({

        id:
            Date.now() + 1,

        title:
            "💰 Income Added",

        message:
            `Melo just added ₦${amount.toLocaleString("en-NG")} to your wallet.`,

        type:
            "income",

        read:
            false,

        date:
            new Date().toISOString()

    });


    /* ================================
       SAVE CURRENT USER
    ================================= */

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(user)
    );


    /* ================================
       SAVE TO USERS
    ================================= */

    let users = [];

    try {

        users =
            JSON.parse(
                localStorage.getItem("meloUsers")
            ) || [];

    } catch {

        users = [];

    }


    const userIndex =
        users.findIndex(
            existingUser =>
                existingUser.email === user.email
        );


    if (userIndex !== -1) {

        users[userIndex] = user;

    } else {

        users.push(user);

    }


    localStorage.setItem(
        "meloUsers",
        JSON.stringify(users)
    );


    /* ================================
       SUCCESS
    ================================= */

    showToast(
        "Income Added 💰",
        `₦${amount.toLocaleString("en-NG")} added successfully.`,
        "success"
    );


    /* ================================
       REDIRECT
    ================================= */

    setTimeout(() => {

        window.location.href =
            "home.html";

    }, 900);

}


/* =====================================
   TOAST
===================================== */

function showToast(
    title,
    message,
    type = "info"
) {

    if (
        typeof meloToast ===
        "function"
    ) {

        meloToast(
            title,
            message,
            type
        );

        return;
    }


    /* Fallback */

    alert(
        `${title}\n\n${message}`
    );

}
