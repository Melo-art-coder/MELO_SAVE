/* =====================================
   MELOSAV SAVINGS
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof loadTheme === "function") {
        loadTheme();
    }

    document
        .getElementById("savingsForm")
        .addEventListener("submit", saveSavings);

});


/* =====================================
   SAVE SAVINGS
===================================== */

function saveSavings(e){

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


    /* Validation */

    if(amount <= 0){

        meloToast(
            "❌ Invalid Amount",
            "Please enter a valid amount.",
            "error"
        );

        return;

    }

    if(amount > Number(user.balance || 0)){

        meloToast(
            "💔 Insufficient Balance",
            "You don't have enough money to save this amount.",
            "error"
        );

        return;

    }


    /* Update Wallet */

    user.balance =
        Number(user.balance || 0) - amount;

    user.savings =
        Number(user.savings || 0) + amount;


    /* Save Transaction */

    if(!user.transactions){

        user.transactions = [];

    }

    user.transactions.push({

        type: "savings",

        title: description || category,

        category: category,

        amount: amount,

        date: new Date().toLocaleString()

    });


    /* Save Current User */

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(user)
    );


    /* Update User List */

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


    /* Melo AI Celebration */

    const messages = [

        "Amazing! Every naira you save today builds a stronger tomorrow. 💜",

        "Fantastic! Your future self is smiling already. 🌱",

        "Well done! Consistent saving is the secret to financial freedom. 🏦",

        "Great choice! Small savings today become big achievements tomorrow. 🎯",

        "You're doing great! Every saving brings you one step closer to your goals. 🚀",

        "Excellent work! Building wealth starts with habits like this. ✨"

    ];

    const random =
        Math.floor(Math.random() * messages.length);


    meloToast(

        "🏦 Savings Added",

        messages[random],

        "success"

    );


    setTimeout(() => {

        location.href = "home.html";

    },1500);

}