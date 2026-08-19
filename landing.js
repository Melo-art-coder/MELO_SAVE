/* =====================================
   MELOSAV LANDING PAGE
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("💜 MELOSAV Landing Page Ready");


    /* =====================================
       HERO ANIMATION
    ===================================== */

    const hero = document.querySelector(".hero");

    if (hero) {

        hero.classList.add("loaded");

    }


    /* =====================================
       HEADER SCROLL EFFECT
    ===================================== */

    const header =
        document.querySelector(".site-header");


    function updateHeader() {

        if (!header) return;


        if (window.scrollY > 30) {

            header.style.boxShadow =
                "0 8px 30px rgba(0,0,0,.08)";

        } else {

            header.style.boxShadow =
                "none";

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive:true }
    );


    updateHeader();


    /* =====================================
       SMOOTH NAVIGATION
    ===================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) return;


                    event.preventDefault();


                    target.scrollIntoView({

                        behavior:"smooth",

                        block:"start"

                    });

                }
            );

        });


});
