// =====================================
// MELOSAV LANDING PAGE
// =====================================

window.addEventListener("DOMContentLoaded",()=>{

    // Hero Fade In

    const hero=document.querySelector(".hero");

    hero.style.opacity="0";

    hero.style.transform="translateY(25px)";

    setTimeout(()=>{

        hero.style.transition=".8s";

        hero.style.opacity="1";

        hero.style.transform="translateY(0)";

    },200);

});

// Welcome message in console

console.log("💜 Welcome to MELOSAV");