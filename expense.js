/* =====================================
   MELOSAV EXPENSE
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof loadTheme === "function") {
        loadTheme();
    }

    document
        .getElementById("expenseForm")
        .addEventListener("submit", saveExpense);

});


/* =====================================
   SAVE EXPENSE
===================================== */

function saveExpense(e){

    e.preventDefault();

    let user = JSON.parse(
        localStorage.getItem("meloCurrentUser")
    );

    if(!user){

        location.href = "login.html";
        return;

    }

    const amount = Number(
        document.getElementById("amount").value
    );

    const category =
        document.getElementById("category").value;

    const description =
        document.getElementById("description").value.trim();


    if(amount <= 0){

        meloToast(
            "❌ Invalid Amount",
            "Enter a valid expense amount.",
            "error"
        );

        return;

    }


    if(amount > Number(user.balance || 0)){

        meloToast(
            "💔 Insufficient Balance",
            "You don't have enough money for this expense.",
            "error"
        );

        return;

    }


    /* Update Wallet */

    user.balance =
        Number(user.balance || 0) - amount;

    user.expenses =
        Number(user.expenses || 0) + amount;


    /* Save Transaction */

    if(!user.transactions){

        user.transactions = [];

    }

    user.transactions.push({

        type:"expense",

        title:description || category,

        category:category,

        amount:amount,

        date:new Date().toLocaleString()

    });


    /* Save Current User */

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(user)
    );


    /* Update Users List */

    let users = JSON.parse(
        localStorage.getItem("meloUsers")
    ) || [];

    const index = users.findIndex(
        u => u.email === user.email
    );

    if(index !== -1){

        users[index] = user;

        localStorage.setItem(
            "meloUsers",
            JSON.stringify(users)
        );

    }


    /* Beautiful Melo AI Messages */

    const messages = [

        "Expense recorded successfully. Smart tracking leads to smarter saving. 💜",

        "Well done! Every expense tracked helps you understand your finances better. 📊",

        "Great job! Knowing where your money goes is the first step to financial freedom. 🌱",

        "Expense saved successfully. Small habits today build a stronger tomorrow. 🚀",

        "Transaction completed! Keep making thoughtful spending decisions. ✨"

    ];

    const random =
        Math.floor(Math.random() * messages.length);


    meloToast(

        "💸 Expense Added",

        messages[random],

        "success"

    );


    setTimeout(() => {

        location.href = "home.html";

    },1500);

}