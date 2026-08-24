/* =====================================
   MELOSAV LANDING PAGE V2
   SLOW-MO SCROLL ENGINE
===================================== */

console.log("💜 MELOSAV LANDING V2 LOADED");


/* =====================================
   START
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    /*
       Tell CSS that JavaScript is available.

       IMPORTANT:
       Without this class, every section
       remains visible.
    */

    document.body.classList.add("js-loaded");


    setupScrollReveal();

    setupSmoothLinks();

    setupHeaderScroll();

});


/* =====================================
   SLOW-MO SCROLL REVEAL
===================================== */

function setupScrollReveal() {

    const elements =
        document.querySelectorAll(".reveal");


    /*
       If browser doesn't support
       IntersectionObserver, show everything.
    */

    if (!("IntersectionObserver" in window)) {

        elements.forEach(element => {

            element.classList.add("visible");

        });

        return;

    }


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                });

            },

            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -70px 0px"

            }

        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* =====================================
   SMOOTH INTERNAL LINKS
===================================== */

function setupSmoothLinks() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(link => {

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


                if (!target) {

                    return;

                }


                event.preventDefault();


                target.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }
        );

    });

}


/* =====================================
   HEADER SCROLL EFFECT
===================================== */

function setupHeaderScroll() {

    const header =
        document.querySelector(
            ".site-header"
        );


    if (!header) return;


    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 30) {

                header.classList.add(
                    "scrolled"
                );

            } else {

                header.classList.remove(
                    "scrolled"
                );

            }

        },
        {
            passive: true
        }
    );

}


/* =====================================
   WELCOME
===================================== */

console.log(
    "✨ Slow-mo MELOSAV scrolling ready"
);
