/* =====================================
   MELOSAV - ADD INCOME
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof loadTheme === "function") {
        loadTheme();
    }

    document
        .getElementById("incomeForm")
        .addEventListener("submit", saveIncome);

});


/* =====================================
   SAVE INCOME
===================================== */

function saveIncome(e){

    e.preventDefault();

    const amount =
        Number(document.getElementById("amount").value);

    const category =
        document.getElementById("category").value;

    const description =
        document.getElementById("description").value.trim();

    if(amount <= 0){

        meloToast(
            "Invalid Amount",
            "Enter an amount greater than zero.",
            "error"
        );

        return;

    }

    let user = JSON.parse(
        localStorage.getItem("meloCurrentUser")
    );

    if(!user){

        location.href="login.html";
        return;

    }

    /* =====================
       DEFAULT VALUES
    ===================== */

    user.balance = Number(user.balance || 0);

    user.income = Number(user.income || 0);

    if(!user.transactions){

        user.transactions = [];

    }

    /* =====================
       UPDATE BALANCE
    ===================== */

    user.balance += amount;

    user.income += amount;

    /* =====================
       SAVE TRANSACTION
    ===================== */

    const transaction = {

        type:"income",

        title:category,

        amount:amount,

        description:description,

        date:new Date().toLocaleString()

    };

    user.transactions.push(transaction);

    /* =====================
       UPDATE USERS LIST
    ===================== */

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(user)
    );

    let users = JSON.parse(
        localStorage.getItem("meloUsers")
    ) || [];

    const index = users.findIndex(u =>

        u.email === user.email

    );

    if(index !== -1){

        users[index] = user;

        localStorage.setItem(
            "meloUsers",
            JSON.stringify(users)
        );

    }

    /* =====================
       SUCCESS
    ===================== */

    meloToast(

        "Income Added",

        `${formatMoney(amount)} has been added successfully.`,

        "success"

    );

    setTimeout(()=>{

        location.href="home.html";

    },1200);

}


/* =====================================
   FORMAT MONEY
===================================== */

function formatMoney(amount){

    return "₦" + Number(amount).toLocaleString(

        "en-NG",

        {

            minimumFractionDigits:2,

            maximumFractionDigits:2

        }

    );

}