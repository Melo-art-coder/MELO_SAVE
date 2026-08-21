/* =====================================
   MELOSAV LANDING PAGE
   TRUE SLOW-MO SCROLL SYSTEM
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("💜 MELOSAV SLOW-MO V3 LOADED");

    const hero = document.querySelector(".hero");
    const sections = document.querySelectorAll(
        ".features, footer"
    );

    /* =====================================
       HERO
    ===================================== */

    if (hero) {
        hero.classList.add("slow-ready");
    }


    /* =====================================
       PREPARE SECTIONS
    ===================================== */

    sections.forEach(section => {
        section.classList.add("slow-section");
    });


    /* =====================================
       SCROLL ENGINE
    ===================================== */

    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;

    let ticking = false;


    window.addEventListener(
        "scroll",
        () => {

            targetScroll = window.scrollY;

            if (!ticking) {

                window.requestAnimationFrame(
                    smoothScrollEffect
                );

                ticking = true;

            }

        },
        {
            passive: true
        }
    );


    function smoothScrollEffect() {

        currentScroll +=
            (targetScroll - currentScroll) * 0.08;


        /* HERO PARALLAX */

        if (hero) {

            const movement =
                currentScroll * 0.18;

            hero.style.transform =
                `translate3d(0, ${movement}px, 0)`;

        }


        /* SECTION MOVEMENT */

        sections.forEach(section => {

            const rect =
                section.getBoundingClientRect();

            const windowHeight =
                window.innerHeight;


            if (
                rect.top < windowHeight &&
                rect.bottom > 0
            ) {

                const distance =
                    (windowHeight / 2) -
                    (rect.top + rect.height / 2);


                const movement =
                    distance * 0.06;


                section.style.transform =
                    `translate3d(0, ${movement}px, 0)`;

            }

        });


        ticking = false;


        if (
            Math.abs(
                targetScroll - currentScroll
            ) > 0.5
        ) {

            window.requestAnimationFrame(
                smoothScrollEffect
            );

            ticking = true;

        }

    }


    /* =====================================
       REVEAL ANIMATION
    ===================================== */

    const revealElements =
        document.querySelectorAll(
            ".features h2, .feature-card, footer"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "slow-visible"
                        );

                    }

                });

            },
            {
                threshold: 0.08
            }
        );


    revealElements.forEach(element => {

        element.classList.add(
            "slow-hidden"
        );

        observer.observe(element);

    });

});
