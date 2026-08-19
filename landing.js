// =====================================
// MELOSAV LANDING PAGE V2
// Slow-Mo Scroll Animations
// =====================================

window.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       HERO SLOW FADE-IN
    ===================================== */

    const hero = document.querySelector(".hero");

    if (hero) {

        hero.style.opacity = "0";
        hero.style.transform = "translateY(35px)";

        setTimeout(() => {

            hero.style.transition =
                "opacity 1.2s ease, transform 1.2s ease";

            hero.style.opacity = "1";
            hero.style.transform = "translateY(0)";

        }, 200);

    }


    /* =====================================
       SCROLL REVEAL
    ===================================== */

    const revealElements = document.querySelectorAll(
        ".features h2, .feature-card, footer"
    );


    revealElements.forEach(element => {

        element.classList.add("scroll-reveal");

    });


    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                }

            });

        },
        {
            threshold: 0.15
        }
    );


    revealElements.forEach(element => {

        observer.observe(element);

    });


    /* =====================================
       FEATURE CARD STAGGER
    ===================================== */

    const cards =
        document.querySelectorAll(".feature-card");


    cards.forEach((card, index) => {

        card.style.transitionDelay =
            `${index * 0.12}s`;

    });


    /* =====================================
       SMOOTH ANCHOR SCROLL
    ===================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener("click", event => {

            const target =
                document.querySelector(
                    link.getAttribute("href")
                );

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================
       CONSOLE
    ===================================== */

    console.log(
        "💜 MELOSAV Landing Page V2 Loaded"
    );

});
