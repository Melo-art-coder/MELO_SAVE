/* =====================================
   MELOSAV — EXPENSE V4
   Reliable expense saving
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("expenseForm");

    if (!form) {
        console.error("MELOSAV: expenseForm not found.");
        return;
    }

    form.addEventListener("submit", saveExpense);

});


function saveExpense(event) {

    event.preventDefault();

    const amountInput =
        document.getElementById("amount");

    const categoryInput =
        document.getElementById("category");

    const descriptionInput =
        document.getElementById("description");


    const amount =
        Number(amountInput?.value);


    const category =
        categoryInput?.value?.trim() ||
        "Expense";


    const description =
        descriptionInput?.value?.trim() ||
        "";


    /* =================================
       VALIDATE AMOUNT
    ================================= */

    if (!Number.isFinite(amount) || amount <= 0) {

        showExpenseToast(
            "Invalid Amount",
            "Please enter an amount greater than ₦0.",
            "error"
        );

        return;
    }


    /* =================================
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

        showExpenseToast(
            "Not Logged In",
            "Please log in before recording an expense.",
            "error"
        );

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1000);

        return;
    }


    /* =================================
       PREPARE WALLET
    ================================= */

    if (!user.wallets) {

        user.wallets = {};

    }


    /*
       If this is an older account,
       take the old balance and use it
       as the starting NGN wallet.
    */

    if (
        typeof user.wallets.NGN !== "number"
    ) {

        user.wallets.NGN =
            Number(user.balance || 0);

    }


    user.wallets.NGN =
        Number(user.wallets.NGN || 0);


    user.expenses =
        Number(user.expenses || 0);


    user.income =
        Number(user.income || 0);


    if (!Array.isArray(user.transactions)) {

        user.transactions = [];

    }


    if (!Array.isArray(user.notifications)) {

        user.notifications = [];

    }


    /* =================================
       CHECK AVAILABLE MONEY
    ================================= */

    const available =
        user.wallets.NGN;


    if (amount > available) {

        showExpenseToast(
            "Insufficient Balance",
            `You have only ₦${available.toLocaleString("en-NG")} available.`,
            "error"
        );

        return;
    }


    /* =================================
       DEDUCT REAL WALLET
    ================================= */

    user.wallets.NGN =
        available - amount;


    /*
       Keep old balance field synced
       so older MELOSAV files don't break.
    */

    user.balance =
        user.wallets.NGN;


    /* =================================
       UPDATE TOTAL EXPENSES
    ================================= */

    user.expenses += amount;


    /* =================================
       CREATE TRANSACTION
    ================================= */

    const transaction = {

        id:
            Date.now(),

        type:
            "expense",

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


    /* =================================
       CREATE NOTIFICATION
    ================================= */

    user.notifications.unshift({

        id:
            Date.now() + 1,

        title:
            "💸 Expense Recorded",

        message:
            `Melo just spent ₦${amount.toLocaleString("en-NG")} on ${category}.`,

        type:
            "expense",

        read:
            false,

        date:
            new Date().toISOString()

    });


    /* =================================
       SAVE CURRENT USER
    ================================= */

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(user)
    );


    /* =================================
       SAVE USERS LIST
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


    /* =================================
       SUCCESS
    ================================= */

    showExpenseToast(
        "Expense Added 💸",
        `₦${amount.toLocaleString("en-NG")} was deducted from your wallet.`,
        "success"
    );


    /* =================================
       GO HOME
    ================================= */

    setTimeout(() => {

        window.location.href =
            "home.html";

    }, 900);

}


/* =====================================
   TOAST
===================================== */

function showExpenseToast(
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


    alert(
        `${title}\n\n${message}`
    );

}
