/* =====================================
   MELOSAV HOME
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    loadUser();

});


function loadUser(){

    const user =
    JSON.parse(localStorage.getItem("meloCurrentUser"));

    if(!user){

        location.href="login.html";

        return;

    }

    document.getElementById("username").textContent =
    user.name;

    document.getElementById("greeting").textContent =
    getGreeting();

    document.getElementById("balance").textContent =
    "₦" + (user.balance || 0).toLocaleString();

    document.getElementById("income").textContent =
    "₦" + (user.income || 0).toLocaleString();

    document.getElementById("expenses").textContent =
    "₦" + (user.expenses || 0).toLocaleString();

    document.getElementById("savings").textContent =
    "₦" + (user.savings || 0).toLocaleString();

}


function getGreeting(){

    const hour = new Date().getHours();

    if(hour < 12){

        return "Good Morning ☀️";

    }

    if(hour < 18){

        return "Good Afternoon 🌤️";

    }

    return "Good Evening 🌙";

}


/* Theme Button */

document
.getElementById("themeBtn")
.addEventListener("click", () => {

    location.href="theme-setup.html";

});


/* Notifications */

document
.getElementById("notificationBtn")
.addEventListener("click", () => {

    alert("Notifications coming soon 🔔");

});


/* Quick Actions */

document.getElementById("incomeBtn").onclick=()=>{

    alert("Income feature coming soon 💰");

};

document.getElementById("expenseBtn").onclick=()=>{

    alert("Expense feature coming soon 💸");

};

document.getElementById("saveBtn").onclick=()=>{

    alert("Savings feature coming soon 🏦");

};

document.getElementById("goalBtn").onclick=()=>{

    location.href="goals.html";

};


/* Floating Button */

document.getElementById("fab").onclick=()=>{

    alert("Quick Add coming soon ➕");

};