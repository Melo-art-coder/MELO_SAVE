/* =====================================
   MELOSAV LANDING PAGE V2
   SLOW-MO SCROLL ANIMATIONS
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("💜 MELOSAV Landing V2 Loaded");


    /* =====================================
       HERO INTRO
    ===================================== */

    const hero = document.querySelector(".hero");

    if (hero) {

        hero.classList.add("hero-ready");

    }


    /* =====================================
       SCROLL REVEAL
    ===================================== */

    const revealElements = document.querySelectorAll(
        ".features h2, .feature-card, footer"
    );


    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("reveal-show");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );


    revealElements.forEach((element) => {

        element.classList.add("reveal");

        observer.observe(element);

    });


    /* =====================================
       SMOOTH SCROLL
    ===================================== */

    document.documentElement.style.scrollBehavior = "smooth";


    /* =====================================
       PARALLAX HERO
    ===================================== */

    window.addEventListener(
        "scroll",
        () => {

            if (!hero) return;

            const scrollY = window.scrollY;

            if (scrollY < window.innerHeight) {

                hero.style.transform =
                    `translateY(${scrollY * 0.12}px)`;

            }

        },
        {
            passive: true
        }
    );


});
