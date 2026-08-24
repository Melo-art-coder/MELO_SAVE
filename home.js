/* =====================================
   MELOSAV HOME V17
   REAL WALLET SYSTEM
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        let user =
            MELO_STORAGE.currentUser();


        if (!user) {

            location.href =
                "login.html";

            return;

        }


        /* ===============================
           FORMAT
        =============================== */

        function money(
            amount,
            currency = "NGN"
        ) {

            const symbols = {

                NGN: "₦",
                USD: "$",
                EUR: "€",
                GBP: "£"

            };


            return (

                symbols[currency] +

                Number(
                    amount || 0
                ).toLocaleString(
                    "en-US",
                    {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    }

                )

            );

        }


        /* ===============================
           CURRENCY EQUIVALENTS
        =============================== */

        const rates = {

            USD: 0.00067,
            EUR: 0.00057,
            GBP: 0.00049

        };


        /* ===============================
           HIDE
        =============================== */

        let hidden =
            localStorage.getItem(
                "meloBalancesHidden"
            ) === "true";


        /* ===============================
           ANIMATE
        =============================== */

        function animate(
            element,
            target,
            currency
        ) {

            if (!element) return;


            if (hidden) {

                element.textContent =
                    "••••••";

                return;

            }


            const startValue =
                Number(
                    element.dataset.value || 0
                );


            const start =
                performance.now();


            const duration =
                1000;


            function frame(now) {

                const progress =
                    Math.min(
                        (
                            now - start
                        ) / duration,
                        1
                    );


                const ease =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );


                const value =
                    startValue +
                    (
                        target -
                        startValue
                    ) * ease;


                element.textContent =
                    money(
                        value,
                        currency
                    );


                element.dataset.value =
                    value;


                if (
                    progress < 1
                ) {

                    requestAnimationFrame(
                        frame
                    );

                }

            }


            requestAnimationFrame(
                frame
            );

        }


        /* ===============================
           WALLET
        =============================== */

        function updateWallet() {

            user =
                MELO_STORAGE.currentUser();


            if (!user) return;


            const balance =
                Number(
                    user.wallets.NGN || 0
                );


            const expenses =
                Number(
                    user.expenses || 0
                );


            const savings =
                Number(
                    user.savings || 0
                );


            const income =
                Number(
                    user.income || 0
                );


            /* MAIN BALANCE */

            animate(
                document.getElementById(
                    "balance"
                ),
                balance,
                "NGN"
            );


            /* FOREIGN */

            animate(
                document.getElementById(
                    "usdBalance"
                ),
                balance * rates.USD,
                "USD"
            );


            animate(
                document.getElementById(
                    "eurBalance"
                ),
                balance * rates.EUR,
                "EUR"
            );


            animate(
                document.getElementById(
                    "gbpBalance"
                ),
                balance * rates.GBP,
                "GBP"
            );


            /* EXPENSE */

            const expenseElement =
                document.getElementById(
                    "expenses"
                );


            if (expenseElement) {

                expenseElement.textContent =
                    hidden
                        ? "••••••"
                        : money(
                            expenses
                        );

            }


            /* SAVINGS */

            const savingsElement =
                document.getElementById(
                    "savings"
                );


            if (savingsElement) {

                savingsElement.textContent =
                    hidden
                        ? "••••••"
                        : money(
                            savings
                        );

            }


            /* =========================
               SPENDING
            ========================= */

            const spent =
                expenses;


            const remaining =
                Math.max(
                    income - spent,
                    0
                );


            const percentage =
                income > 0
                    ? Math.min(
                        (
                            spent /
                            income
                        ) * 100,
                        100
                    )
                    : 0;


            const percentElement =
                document.getElementById(
                    "budgetPercent"
                );


            const fill =
                document.getElementById(
                    "budgetFill"
                );


            const spentElement =
                document.getElementById(
                    "spentIncomeText"
                );


            const remainingElement =
                document.getElementById(
                    "remainingIncomeText"
                );


            if (percentElement) {

                percentElement.textContent =
                    Math.round(
                        percentage
                    ) + "%";

            }


            if (fill) {

                fill.style.width =
                    percentage + "%";

            }


            if (spentElement) {

                spentElement.textContent =
                    hidden
                        ? "••••••"
                        : money(spent);

            }


            if (remainingElement) {

                remainingElement.textContent =
                    hidden
                        ? "••••••"
                        : money(remaining);

            }


            /* EYE */

            const eye =
                document.getElementById(
                    "toggleBalance"
                );


            if (eye) {

                eye.textContent =
                    hidden
                        ? "🙈"
                        : "👁️";

            }


            updateTransactions();

        }


        /* ===============================
           TRANSACTIONS
        =============================== */

        function updateTransactions() {

            const container =
                document.getElementById(
                    "transactionList"
                );


            if (!container) return;


            const transactions =
                user.transactions || [];


            if (!transactions.length) {

                container.innerHTML = `
                    <p class="empty">
                        No transactions yet.
                    </p>
                `;

                return;

            }


            container.innerHTML =
                transactions
                    .slice(0, 5)
                    .map(
                        transaction => {

                            const income =
                                transaction.type ===
                                "income";


                            return `

                                <div class="home-transaction">

                                    <div class="transaction-icon">

                                        ${
                                            income
                                                ? "💰"
                                                : "💸"
                                        }

                                    </div>


                                    <div class="transaction-info">

                                        <strong>
                                            ${
                                                transaction.title ||
                                                transaction.type
                                            }
                                        </strong>

                                        <small>
                                            ${
                                                transaction.description ||
                                                "Money transaction"
                                            }
                                        </small>

                                    </div>


                                    <strong
                                        class="${
                                            income
                                                ? "money-in"
                                                : "money-out"
                                        }"
                                    >

                                        ${
                                            income
                                                ? "+"
                                                : "-"
                                        }

                                        ${money(
                                            transaction.amount
                                        )}

                                    </strong>

                                </div>

                            `;

                        }
                    )
                    .join("");

        }


        /* ===============================
           HIDE / SHOW
        =============================== */

        const toggle =
            document.getElementById(
                "toggleBalance"
            );


        if (toggle) {

            toggle.addEventListener(
                "click",
                () => {

                    hidden =
                        !hidden;


                    localStorage.setItem(
                        "meloBalancesHidden",
                        String(hidden)
                    );


                    [
                        "balance",
                        "usdBalance",
                        "eurBalance",
                        "gbpBalance"
                    ].forEach(
                        id => {

                            const element =
                                document.getElementById(
                                    id
                                );


                            if (element) {

                                element.dataset.value =
                                    "0";

                            }

                        }
                    );


                    updateWallet();

                }
            );

        }


        /* ===============================
           USER
        =============================== */

        const username =
            document.getElementById(
                "username"
            );


        if (username) {

            username.textContent =
                user.name ||
                user.username ||
                "Melody";

        }


        /* ===============================
           GREETING
        =============================== */

        const greeting =
            document.getElementById(
                "greeting"
            );


        if (greeting) {

            const hour =
                new Date().getHours();


            greeting.textContent =
                hour < 12
                    ? "Good Morning ☀️"
                    : hour < 18
                        ? "Good Afternoon 🌤️"
                        : "Good Evening 🌙";

        }


        /* ===============================
           QUICK ACTIONS
        =============================== */

        const pages = {

            incomeBtn:
                "income.html",

            expenseBtn:
                "expense.html",

            saveBtn:
                "savings.html",

            goalBtn:
                "goals.html",

            transferBtn:
                "transfer.html",

            budgetBtn:
                "budget.html"

        };


        Object.entries(
            pages
        ).forEach(
            ([id, page]) => {

                const button =
                    document.getElementById(
                        id
                    );


                if (button) {

                    button.addEventListener(
                        "click",
                        () => {

                            location.href =
                                page;

                        }
                    );

                }

            }
        );


        /* ===============================
           HEADER BUTTONS
        =============================== */

        document
            .getElementById(
                "notificationBtn"
            )
            ?.addEventListener(
                "click",
                () => {

                    location.href =
                        "notifications.html";

                }
            );


        document
            .getElementById(
                "settingsBtn"
            )
            ?.addEventListener(
                "click",
                () => {

                    location.href =
                        "settings.html";

                }
            );


        /* ===============================
           ADD MENU
        =============================== */

        const addButton =
            document.getElementById(
                "navAdd"
            );


        const addMenu =
            document.getElementById(
                "addMenu"
            );


        if (
            addButton &&
            addMenu
        ) {

            addButton.addEventListener(
                "click",
                () => {

                    addMenu.classList.toggle(
                        "show"
                    );

                    addButton.classList.toggle(
                        "open"
                    );

                }
            );


            addMenu
                .querySelectorAll(
                    "[data-page]"
                )
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            () => {

                                location.href =
                                    button.dataset.page;

                            }
                        );

                    }
                );

        }


        /* ===============================
           PROFILE PHOTO
        =============================== */

        const profile =
            document.getElementById(
                "homeProfilePic"
            );


        if (
            profile &&
            user.profilePhoto
        ) {

            profile.src =
                user.profilePhoto;

        }


        /* ===============================
           SLIDER
        =============================== */

        const slider =
            document.getElementById(
                "walletSlider"
            );


        if (slider) {

            const dots =
                document.querySelectorAll(
                    ".wallet-dots span"
                );


            slider.addEventListener(
                "scroll",
                () => {

                    const cards =
                        slider.querySelectorAll(
                            ".wallet-card"
                        );


                    let closest =
                        0;

                    let distance =
                        Infinity;


                    cards.forEach(
                        (
                            card,
                            index
                        ) => {

                            const difference =
                                Math.abs(
                                    slider.scrollLeft -
                                    card.offsetLeft
                                );


                            if (
                                difference <
                                distance
                            ) {

                                distance =
                                    difference;

                                closest =
                                    index;

                            }

                        }
                    );


                    dots.forEach(
                        (
                            dot,
                            index
                        ) => {

                            dot.classList.toggle(
                                "active",
                                index === closest
                            );

                        }
                    );

                },
                {
                    passive: true
                }
            );

        }


        /* INITIAL */

        updateWallet();

    }
);
