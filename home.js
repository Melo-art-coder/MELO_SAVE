/* =====================================
   MELOSAV DASHBOARD LOGIC
===================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


loadUser();

loadBalance();


});




/* =========================
   LOAD USER
========================= */


function loadUser(){

let user =
JSON.parse(
localStorage.getItem("meloCurrentUser")
);



if(user){


document.getElementById("username")
.textContent =
user.name;



document.getElementById("greeting")
.textContent =
getGreeting(user.name);


}


}





/* =========================
   GREETING
========================= */


function getGreeting(name){


let hour =
new Date().getHours();



if(hour < 12){

return "Good Morning ☀️";

}


else if(hour < 18){

return "Good Afternoon 🌤️";

}


else{

return "Good Evening 🌙";

}


}





/* =========================
   BALANCE
========================= */


function loadBalance(){


let user =
JSON.parse(
localStorage.getItem("meloCurrentUser")
);



if(!user) return;



let balance =
user.balance || 0;



document.getElementById("balance")
.textContent =
"₦" + balance.toLocaleString();



}




/* =========================
   THEME BUTTON
========================= */


document
.getElementById("themeBtn")
.onclick = ()=>{


let themes = [

"purple-light",
"purple-dark",

"emerald-light",
"emerald-dark",

"ocean-light",
"ocean-dark",

"rose-light",
"rose-dark",

"gold-light",
"gold-dark"

];



let current =
localStorage.getItem("meloTheme")
||
"purple-light";



let index =
themes.indexOf(current);



let next =
themes[
(index + 1) % themes.length
];



changeTheme(next);


};