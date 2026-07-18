/* =====================================
   MELOSAV THEME SETUP
===================================== */

let selectedColor = "purple";
let selectedMode = "light";

/* ===============================
   LOAD SAVED THEME
================================ */

document.addEventListener("DOMContentLoaded", () => {

    const savedTheme =
        localStorage.getItem("meloTheme");

    if(savedTheme){

        const parts = savedTheme.split("-");

        selectedColor = parts[0];
        selectedMode = parts[1];

    }

    highlightSelection();

    applyTheme();

});


/* ===============================
   COLOR BUTTONS
================================ */

document.querySelectorAll(".theme-card").forEach(card=>{

    card.addEventListener("click",()=>{

        selectedColor = card.dataset.theme;

        highlightSelection();

        applyTheme();

    });

});


/* ===============================
   LIGHT / DARK
================================ */

document.querySelectorAll('input[name="mode"]').forEach(radio=>{

    radio.addEventListener("change",()=>{

        selectedMode = radio.value;

        applyTheme();

    });

});


/* ===============================
   APPLY THEME
================================ */

function applyTheme(){

    document.body.className =
        `theme-${selectedColor}-${selectedMode}`;

}


/* ===============================
   HIGHLIGHT BUTTONS
================================ */

function highlightSelection(){

    document.querySelectorAll(".theme-card").forEach(card=>{

        card.classList.remove("active");

        if(card.dataset.theme===selectedColor){

            card.classList.add("active");

        }

    });

    const mode=document.querySelector(
        `input[value="${selectedMode}"]`
    );

    if(mode){

        mode.checked=true;

    }

}


/* ===============================
   CONTINUE
================================ */

document.getElementById("continueBtn").addEventListener("click",()=>{

    const theme =
        `${selectedColor}-${selectedMode}`;

    localStorage.setItem(
        "meloTheme",
        theme
    );

    // If already logged in, go home.
    if(localStorage.getItem("meloCurrentUser")){

        location.href="home.html";

    }else{

        location.href="login.html";

    }

});