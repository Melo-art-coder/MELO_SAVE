/* =====================================
   MELOSAV LANDING PAGE
   SMOOTH SCROLL + REVEAL ANIMATIONS
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("💜 MELOSAV Landing Page Ready");


    /* =====================================
       HEADER
    ===================================== */

    const header =
        document.querySelector(".site-header");


    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 30) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
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

                    const targetID =
                        link.getAttribute("href");

                    if (
                        !targetID ||
                        targetID === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetID
                        );

                    if (!target) return;

                    event.preventDefault();

                    target.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

                }
            );

        });


    /* =====================================
       SCROLL REVEAL
    ===================================== */

    const revealElements =
        document.querySelectorAll(
            ".feature-card, .step, .about-content, .faq-container, .contact-box, .section-heading"
        );


    revealElements.forEach(element => {

        element.classList.add("scroll-reveal");

    });


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
                threshold: 0.15,

                rootMargin:
                    "0px 0px -60px 0px"

            }

        );


    revealElements.forEach(element => {

        observer.observe(element);

    });


    /* =====================================
       HERO ANIMATION
    ===================================== */

    const hero =
        document.querySelector(".hero-content");


    if (hero) {

        hero.classList.add("hero-loaded");

    }


});
