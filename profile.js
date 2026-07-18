/* =====================================
   MELOSAV PROFILE V5
===================================== */

console.log("PROFILE V5 LOADED");

let currentUser = null;

/* =====================================
   START
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    if(typeof loadTheme === "function"){
        loadTheme();
    }

    loadProfile();
    setupButtons();

});


/* =====================================
   LOAD PROFILE
===================================== */

function loadProfile(){

    currentUser = JSON.parse(
        localStorage.getItem("meloCurrentUser")
    );

    if(!currentUser){

        location.href = "login.html";
        return;

    }

    document.getElementById("profileName").textContent =
        currentUser.name || "User";

    document.getElementById("profileEmail").textContent =
        currentUser.email || "No Email";

    document.getElementById("avatar").textContent =
        (currentUser.name || "U")
        .charAt(0)
        .toUpperCase();

    document.getElementById("profileBalance").textContent =
        formatMoney(currentUser.balance || 0);

    document.getElementById("incomeStat").textContent =
        formatMoney(currentUser.income || 0);

    document.getElementById("expenseStat").textContent =
        formatMoney(currentUser.expenses || 0);

    document.getElementById("savingStat").textContent =
        formatMoney(currentUser.savings || 0);

    document.getElementById("goalStat").textContent =
        (currentUser.goals || []).length;

}


/* =====================================
   BUTTONS
===================================== */

function setupButtons(){

    document.getElementById("themeBtn").addEventListener("click",()=>{

        location.href="theme-setup.html";

    });

    document.getElementById("editBtn").addEventListener("click",()=>{

        meloToast(
            "Edit Profile",
            "Coming soon.",
            "info"
        );

    });

    document.getElementById("pinBtn").addEventListener("click",()=>{

        meloToast(
            "Change PIN",
            "Coming soon.",
            "info"
        );

    });

    document.getElementById("shareBtn").addEventListener("click",shareApp);

    document.getElementById("logoutBtn").addEventListener("click",logout);

}


/* =====================================
   SHARE APP
===================================== */

function shareApp(){

    const text =
`I'm using MELOSAV 💜 to track my savings and manage my money!`;

    if(navigator.share){

        navigator.share({

            title:"MELOSAV",

            text:text

        });

    }else{

        navigator.clipboard.writeText(text);

        meloToast(
            "Copied",
            "Share message copied.",
            "success"
        );

    }

}


/* =====================================
   LOGOUT
===================================== */

function logout(){

    localStorage.removeItem("meloCurrentUser");

    meloToast(
        "Logged Out",
        "See you again soon! 💜",
        "success"
    );

    setTimeout(()=>{

        location.href="login.html";

    },800);

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