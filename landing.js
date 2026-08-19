// =====================================
// MELOSAV LANDING PAGE V2
// Scroll Reveal + Navbar
// =====================================

window.addEventListener("DOMContentLoaded", () => {

    console.log("💜 MELOSAV Landing V2 Loaded");


    /* =====================================
       HERO ENTRANCE
    ===================================== */

    const hero = document.querySelector(".hero");

    if (hero) {

        hero.style.opacity = "0";
        hero.style.transform = "translateY(30px)";

        setTimeout(() => {

            hero.style.transition =
                "opacity .9s ease, transform .9s ease";

            hero.style.opacity = "1";
            hero.style.transform = "translateY(0)";

        }, 150);

    }


    /* =====================================
       SCROLL REVEAL
    ===================================== */

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                } else {

                    // Remove this if you want animations
                    // to happen only once.

                    entry.target.classList.remove("show");

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

    const cards = document.querySelectorAll(
        ".feature-card"
    );

    cards.forEach((card, index) => {

        card.style.setProperty(
            "--delay",
            `${index * 0.08}s`
        );

    });


    /* =====================================
       STICKY NAVBAR EFFECT
    ===================================== */

    const navbar =
        document.querySelector(".landing-nav");

    if (navbar) {

        function updateNavbar() {

            if (window.scrollY > 30) {

                navbar.classList.add("scrolled");

            } else {

                navbar.classList.remove("scrolled");

            }

        }

        window.addEventListener(
            "scroll",
            updateNavbar,
            { passive: true }
        );

        updateNavbar();

    }


    /* =====================================
       SMOOTH NAVIGATION
    ===================================== */

    const navLinks =
        document.querySelectorAll(
            '.landing-nav a[href^="#"]'
        );

    navLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

});
