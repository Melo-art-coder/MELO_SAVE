/* =====================================
   MELOSAV TRANSFER
===================================== */

let currentUser = JSON.parse(
    localStorage.getItem("meloCurrentUser")
);

/* =====================================
   PAGE START
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof loadTheme === "function") {
        loadTheme();
    }

    meloToast(
        "💳 Ready to Transfer",
        "Move your money safely and securely. 💜",
        "success"
    );

    randomTip();

});


/* =====================================
   TRANSFER
===================================== */

document.getElementById("transferForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    const recipient =
        document.getElementById("recipient").value.trim();

    const amount =
        Number(document.getElementById("amount").value);

    const note =
        document.getElementById("note").value.trim();

    if(recipient === ""){

        meloToast(
            "Recipient Required",
            "Please enter the recipient's name.",
            "warning"
        );

        return;

    }

    if(amount <= 0){

        meloToast(
            "Invalid Amount",
            "Enter a valid transfer amount.",
            "warning"
        );

        return;

    }

    if(amount > currentUser.balance){

        meloToast(
            "Insufficient Balance",
            "You don't have enough money.",
            "error"
        );

        return;

    }

    currentUser.balance -= amount;

    currentUser.transactions =
        currentUser.transactions || [];

    currentUser.transactions.unshift({

        type:"Transfer",

        title:"Transfer to " + recipient,

        amount:amount,

        note:note,

        date:new Date().toLocaleString()

    });

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(currentUser)
    );

    meloToast(
        "Transfer Successful 💜",
        `₦${amount.toLocaleString()} sent to ${recipient}.`,
        "success"
    );

    setTimeout(()=>{

        location.href="home.html";

    },1800);

});


/* =====================================
   RANDOM MELO TIP
===================================== */

function randomTip(){

    const tips=[

        "Always double-check the recipient before sending money. 💜",

        "Transfer only what you can afford. 🌸",

        "Keep saving even after every transfer. 🎯",

        "Review your transactions regularly. 📊",

        "Smart transfers help you stay in control. 🚀"

    ];

    const random =
        Math.floor(Math.random()*tips.length);

    document.getElementById("transferTip").textContent =
        tips[random];

}