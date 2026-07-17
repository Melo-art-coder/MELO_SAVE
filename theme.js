/* =====================================
   MELOSAV THEME ENGINE
===================================== */


/*
   Available themes:

   purple-light
   purple-dark

   emerald-light
   emerald-dark

   ocean-light
   ocean-dark

   rose-light
   rose-dark

   gold-light
   gold-dark
*/


const DEFAULT_THEME = "purple-light";



/* =========================
   APPLY THEME
========================= */

function applyTheme(theme){

    const body = document.body;


    // Remove old theme classes

    body.classList.forEach(className=>{

        if(className.startsWith("theme-")){

            body.classList.remove(className);

        }

    });


    // Add selected theme

    body.classList.add(
        "theme-" + theme
    );


    // Save theme

    localStorage.setItem(
        "meloTheme",
        theme
    );

}



/* =========================
   LOAD SAVED THEME
========================= */

function loadTheme(){

    const savedTheme =
    localStorage.getItem("meloTheme");


    if(savedTheme){

        applyTheme(savedTheme);

    }

    else{

        applyTheme(DEFAULT_THEME);

    }

}



/* =========================
   CHANGE THEME
========================= */

function changeTheme(theme){

    applyTheme(theme);


    // Optional toast if MeloToast exists

    if(typeof meloToast === "function"){

        meloToast(
            "Theme changed successfully 🎨"
        );

    }

}



/* =========================
   AUTO LOAD
========================= */


document.addEventListener(
"DOMContentLoaded",
()=>{

    loadTheme();

});