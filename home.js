/* =====================================
   MELOSAV HOME
   GOALS SYNCHRONIZATION V1
===================================== */

console.log(
    "🏠 MELOSAV HOME GOALS SYNC LOADED"
);


/* =====================================
   LOAD CURRENT USER
===================================== */

function getHomeUser() {

    if (
        typeof getCurrentUser ===
        "function"
    ) {

        return getCurrentUser();

    }

    return JSON.parse(
        localStorage.getItem(
            "meloCurrentUser"
        )
    );

}


/* =====================================
   DISPLAY GOALS ON HOME
===================================== */

function loadHomeGoals() {

    const user =
        getHomeUser();

    if (!user) return;


    const goals =
        Array.isArray(user.goals)
            ? user.goals
            : [];


    /*
       Change this ID if your
       Home goals container uses
       another ID.
    */

    const container =
        document.getElementById(
            "homeGoals"
        );


    if (!container) {

        console.warn(
            "⚠️ #homeGoals not found. Add id=\"homeGoals\" to your Home goals container."
        );

        return;

    }


    if (!goals.length) {

        container.innerHTML = `

            <div class="home-goals-empty">

                <span>🎯</span>

                <p>
                    No savings goals yet.
                </p>

                <a href="goals.html">
                    Create a Goal
                </a>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    goals.slice(0, 3).forEach(
        goal => {

            const target =
                Number(goal.target || 0);

            const saved =
                Number(goal.saved || 0);

            const percent =
                target > 0
                    ? Math.min(
                        (saved / target) *
                        100,
                        100
                    )
                    : 0;


            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "home-goal-card";


            card.innerHTML = `

                <div class="home-goal-top">

                    <strong>
                        🎯
                        ${escapeHomeHTML(
                            goal.name
                        )}
                    </strong>

                    <span>
                        ${percent.toFixed(0)}%
                    </span>

                </div>


                <div class="home-goal-money">

                    ₦${saved.toLocaleString(
                        "en-NG",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )}

                    /

                    ₦${target.toLocaleString(
                        "en-NG",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )}

                </div>


                <div class="home-goal-progress">

                    <div
                        style="
                            width:${percent}%;
                        "
                    ></div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =====================================
   ESCAPE HOME HTML
===================================== */

function escapeHomeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================
   HOME PAGE START
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadHomeGoals();

    }
);


/* =====================================
   REFRESH WHEN COMING BACK
===================================== */

window.addEventListener(
    "pageshow",
    () => {

        loadHomeGoals();

    }
);


/* =====================================
   STORAGE EVENT
===================================== */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            "meloCurrentUser"
        ) {

            loadHomeGoals();

        }

    }
);
