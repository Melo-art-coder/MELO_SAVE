/* =====================================
   MELOSAV HOME V6
===================================== */

console.log("HOME V6 LOADED");

let currentUser = null;
let balanceVisible = true;


/* =====================================
   APP START
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof loadTheme === "function") {
        loadTheme();
    }

    loadUser();
    setupButtons();
    setupWalletSlider();
    setupBalanceToggle();

});


/* =====================================
   LOAD USER
===================================== */

function loadUser() {

    currentUser = JSON.parse(
        localStorage.getItem("meloCurrentUser")
    );

    if (!currentUser) {

        location.href = "login.html";
        return;

    }

    document.getElementById("username").textContent =
        currentUser.name || "User";

    document.getElementById("greeting").textContent =
        getGreeting();

    updateWallet();
    loadExchangeRates();
    updateBudget();
    updateAIMessage();
    loadTransactions();

    setTimeout(() => {

        speakGreeting(currentUser.name);

    }, 800);

}


/* =====================================
   UPDATE WALLET
===================================== */

function updateWallet() {

    const balance =
        Number(currentUser.balance || 0);

    const income =
        Number(currentUser.income || 0);

    const expenses =
        Number(currentUser.expenses || 0);

    const savings =
        Number(currentUser.savings || 0);


    /*
       Store the REAL values
       separately from what's displayed.
    */

    setMoneyValue("balance", balance);
    setMoneyValue("income", income);
    setMoneyValue("expenses", expenses);
    setMoneyValue("savings", savings);


    /*
       Currency wallets
    */

    setCurrencyValue(
        "usdBalance",
        "$0.00"
    );

    setCurrencyValue(
        "eurBalance",
        "€0.00"
    );

    setCurrencyValue(
        "gbpBalance",
        "£0.00"
    );


    /*
       Apply current visibility state.
    */

    refreshBalanceDisplay();

}


/* =====================================
   STORE MONEY VALUE
===================================== */

function setMoneyValue(id, amount) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.dataset.value =
        formatMoney(amount);

}


/* =====================================
   STORE CURRENCY VALUE
===================================== */

function setCurrencyValue(id, value) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.dataset.value = value;

}


/* =====================================
   SHOW / HIDE BALANCE
===================================== */

function setupBalanceToggle() {

    const button =
        document.getElementById("toggleBalance");

    if (!button) {

        console.error(
            "❌ toggleBalance button not found."
        );

        return;

    }


    /*
       Make sure the starting state
       is visible.
    */

    balanceVisible = true;

    refreshBalanceDisplay();


    button.addEventListener("click", () => {

        balanceVisible =
            !balanceVisible;

        refreshBalanceDisplay();

    });

}


/* =====================================
   REFRESH BALANCE DISPLAY
===================================== */

function refreshBalanceDisplay() {

    const ids = [

        "balance",
        "income",
        "expenses",
        "savings",
        "usdBalance",
        "eurBalance",
        "gbpBalance"

    ];


    ids.forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) return;


        /*
           REAL VALUE stays inside
           data-value.
        */

        const realValue =
            element.dataset.value || "₦0.00";


        if (balanceVisible) {

            element.textContent =
                realValue;

        } else {

            element.textContent =
                "••••••";

        }

    });


    /*
       Change eye icon.
    */

    const button =
        document.getElementById(
            "toggleBalance"
        );

    if (button) {

        button.textContent =
            balanceVisible
                ? "👁️"
                : "🙈";

    }

}


/* =====================================
   DAILY BUDGET
===================================== */

function updateBudget() {

    const percent =
        Number(
            currentUser.dailyBudget || 0
        );

    const percentElement =
        document.getElementById(
            "budgetPercent"
        );

    const fillElement =
        document.getElementById(
            "budgetFill"
        );


    if (percentElement) {

        percentElement.textContent =
            percent + "%";

    }


    if (fillElement) {

        fillElement.style.width =
            percent + "%";

    }

}


/* =====================================
   FORMAT MONEY
===================================== */

function formatMoney(amount) {

    return "₦" +
        Number(amount || 0)
            .toLocaleString(
                "en-NG",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

}


/* =====================================
   GREETING
===================================== */

function getGreeting() {

    const hour =
        new Date().getHours();

    if (hour < 12) {

        return "Good Morning ☀️";

    }

    if (hour < 18) {

        return "Good Afternoon 🌤️";

    }

    return "Good Evening 🌙";

}


/* =====================================
   MELO AI
===================================== */

function updateAIMessage() {

    const tips = [

        "Save a little today for a better tomorrow. 💜",

        "Every naira saved gets you closer to your dream. 🎯",

        "Track your spending to stay ahead. 📊",

        "Small savings become big achievements. 🏆",

        "Welcome back! Let's grow your savings today. 🚀"

    ];

    const random =
        Math.floor(
            Math.random() * tips.length
        );

    const aiMessage =
        document.getElementById(
            "aiMessage"
        );

    if (aiMessage) {

        aiMessage.textContent =
            tips[random];

    }

}


/* =====================================
   VOICE GREETING
===================================== */

function speakGreeting(name) {

    if (!("speechSynthesis" in window))
        return;

    speechSynthesis.cancel();

    const firstName =
        name.split(" ")[0];

    const speech =
        new SpeechSynthesisUtterance(

            `${getGreeting()} ${firstName}. Welcome back to MELOSAV.`

        );

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speechSynthesis.speak(speech);

}


/* =====================================
   BUTTON EVENTS
===================================== */

function setupButtons() {

    const settingsBtn =
        document.getElementById(
            "settingsBtn"
        );

    if (settingsBtn) {

        settingsBtn.addEventListener(
            "click",
            () => {
                location.href =
                    "settings.html";
            }
        );

    }


    const notificationBtn =
        document.getElementById(
            "notificationBtn"
        );

    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            () => {
                location.href =
                    "notifications.html";
            }
        );

    }


    const incomeBtn =
        document.getElementById(
            "incomeBtn"
        );

    if (incomeBtn) {

        incomeBtn.addEventListener(
            "click",
            () => {
                location.href =
                    "income.html";
            }
        );

    }


    const expenseBtn =
        document.getElementById(
            "expenseBtn"
        );

    if (expenseBtn) {

        expenseBtn.addEventListener(
            "click",
            () => {
                location.href =
                    "expense.html";
            }
        );

    }


    const saveBtn =
        document.getElementById(
            "saveBtn"
        );

    if (saveBtn) {

        saveBtn.addEventListener(
            "click",
            () => {
                location.href =
                    "savings.html";
            }
        );

    }


    const goalBtn =
        document.getElementById(
            "goalBtn"
        );

    if (goalBtn) {

        goalBtn.addEventListener(
            "click",
            () => {
                location.href =
                    "goals.html";
            }
        );

    }


    const transferBtn =
        document.getElementById(
            "transferBtn"
        );

    if (transferBtn) {

        transferBtn.addEventListener(
            "click",
            () => {
                location.href =
                    "transfer.html";
            }
        );

    }


    const budgetBtn =
        document.getElementById(
            "budgetBtn"
        );

    if (budgetBtn) {

        budgetBtn.addEventListener(
            "click",
            () => {

                meloToast(
                    "📊 Budget",
                    "Budget feature coming soon.",
                    "info"
                );

            }
        );

    }


    setupQuickSheet();

}


/* =====================================
   QUICK SHEET
===================================== */

function setupQuickSheet() {

    const fab =
        document.getElementById("fab");

    const sheet =
        document.getElementById(
            "quickSheet"
        );

    const close =
        document.getElementById(
            "closeSheet"
        );


    if (!fab || !sheet || !close)
        return;


    fab.addEventListener(
        "click",
        () => {

            sheet.classList.add(
                "show"
            );

        }
    );


    close.addEventListener(
        "click",
        () => {

            sheet.classList.remove(
                "show"
            );

        }
    );


    const actions = {

        quickIncome: "income.html",

        quickExpense: "expense.html",

        quickSave: "savings.html",

        quickGoal: "goals.html",

        quickTransfer: "transfer.html"

    };


    Object.keys(actions).forEach(id => {

        const button =
            document.getElementById(id);

        if (!button) return;

        button.addEventListener(
            "click",
            () => {

                sheet.classList.remove(
                    "show"
                );

                location.href =
                    actions[id];

            }
        );

    });

}


/* =====================================
   WALLET SLIDER
===================================== */

function setupWalletSlider() {

    const slider =
        document.getElementById(
            "walletSlider"
        );

    const dots =
        document.querySelectorAll(
            ".wallet-dots span"
        );

    if (!slider) return;


    slider.addEventListener(
        "scroll",
        () => {

            const index =
                Math.round(
                    slider.scrollLeft /
                    slider.clientWidth
                );


            dots.forEach(dot =>
                dot.classList.remove(
                    "active"
                )
            );


            if (dots[index]) {

                dots[index].classList.add(
                    "active"
                );

            }

        }
    );

}


/* =====================================
   RECENT TRANSACTIONS
===================================== */

function loadTransactions() {

    const container =
        document.getElementById(
            "transactionList"
        );

    if (!container) return;


    const transactions =
        currentUser.transactions || [];


    if (transactions.length === 0) {

        container.innerHTML = `
            <p class="empty">
                No transactions yet.
            </p>
        `;

        return;

    }


    container.innerHTML = "";


    transactions
        .slice(0, 5)
        .forEach(item => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "transaction-item";


            card.innerHTML = `

                <div>

                    <strong>
                        ${item.title ||
                        "Transaction"}
                    </strong>

                    <br>

                    <small>
                        ${item.date || ""}
                    </small>

                </div>

                <h3>
                    ${formatMoney(
                        item.amount || 0
                    )}
                </h3>

            `;


            container.appendChild(card);

        });

}


/* =====================================
   EXCHANGE RATES
===================================== */

function loadExchangeRates() {

    /*
       Keep your existing exchange
       rate function if you already
       have one elsewhere.
    */

}


/* =====================================
   SERVICE WORKER
===================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .then(() => {

                    console.log(
                        "MELOSAV Service Worker Registered ✅"
                    );

                })
                .catch(error => {

                    console.error(error);

                });

        }
    );

}
