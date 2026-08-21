/* =====================================
   MELOSAV TRANSACTIONS V2
   COMPLETE MONEY HISTORY
===================================== */

console.log(
    "📄 MELOSAV TRANSACTIONS V2 LOADED"
);

let currentUser = null;
let transactions = [];
let currentFilter = "all";
let searchText = "";


/* =====================================
   START
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            typeof loadTheme ===
            "function"
        ) {

            loadTheme();

        }

        loadUser();

        setupSearch();

        setupFilters();

        setupButtons();

    }
);


/* =====================================
   LOAD USER
===================================== */

function loadUser() {

    currentUser =
        typeof getCurrentUser ===
        "function"
            ? getCurrentUser()
            : JSON.parse(
                localStorage.getItem(
                    "meloCurrentUser"
                )
            );

    if (!currentUser) {

        location.href =
            "login.html";

        return;

    }

    transactions =
        Array.isArray(
            currentUser.transactions
        )
            ? currentUser.transactions
            : [];

    updateSummary();

    renderTransactions();

}


/* =====================================
   SUMMARY
===================================== */

function updateSummary() {

    let income = 0;
    let expense = 0;
    let savings = 0;

    transactions.forEach(
        item => {

            const amount =
                Number(item.amount || 0);

            if (
                item.type ===
                "income"
            ) {

                income += amount;

            }

            else if (
                item.type ===
                "expense"
            ) {

                expense += amount;

            }

            else if (
                item.type ===
                "savings"
            ) {

                savings += amount;

            }

        }
    );


    const incomeElement =
        document.getElementById(
            "incomeTotal"
        );

    const expenseElement =
        document.getElementById(
            "expenseTotal"
        );

    const savingsElement =
        document.getElementById(
            "savingsTotal"
        );


    if (incomeElement)
        incomeElement.textContent =
            formatMoney(income);

    if (expenseElement)
        expenseElement.textContent =
            formatMoney(expense);

    if (savingsElement)
        savingsElement.textContent =
            formatMoney(savings);

}


/* =====================================
   FILTER + SEARCH
===================================== */

function getFilteredTransactions() {

    return transactions.filter(
        item => {

            const matchesFilter =
                currentFilter === "all" ||
                item.type === currentFilter;


            const search =
                searchText.trim();

            if (!search) {

                return matchesFilter;

            }


            const searchableText = [

                item.title,

                item.type,

                item.category,

                item.goalName,

                item.date

            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            return (
                matchesFilter &&
                searchableText.includes(
                    search
                )
            );

        }
    );

}


/* =====================================
   RENDER
===================================== */

function renderTransactions() {

    const list =
        getFilteredTransactions();

    displayTransactions(list);

}


/* =====================================
   DISPLAY
===================================== */

function displayTransactions(list) {

    const container =
        document.getElementById(
            "transactionList"
        );

    if (!container) return;


    if (!list.length) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="emoji">
                    📄
                </div>

                <h2>
                    No Transactions Found
                </h2>

                <p>
                    Your money activity will
                    appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    list.forEach(item => {

        let icon = "💰";
        let color = "icon-income";


        if (
            item.type ===
            "expense"
        ) {

            icon = "💸";
            color = "icon-expense";

        }

        else if (
            item.type ===
            "savings"
        ) {

            icon = "🏦";
            color = "icon-savings";

        }

        else if (
            item.type ===
            "goal"
        ) {

            icon = "🎯";
            color = "icon-savings";

        }


        const card =
            document.createElement(
                "div"
            );

        card.className =
            "transaction-card";


        card.innerHTML = `

            <div class="transaction-left">

                <div
                    class="transaction-icon ${color}">
                    ${icon}
                </div>

                <div
                    class="transaction-info">

                    <h3>
                        ${escapeHTML(
                            item.title ||
                            "Transaction"
                        )}
                    </h3>

                    <p>
                        ${formatDateTime(
                            item.date
                        )}
                    </p>

                </div>

            </div>


            <div class="transaction-amount">

                <h2>
                    ${formatMoney(
                        item.amount
                    )}
                </h2>

                <small>
                    ${escapeHTML(
                        item.type ||
                        "other"
                    )}
                </small>

            </div>

        `;


        container.appendChild(card);

    });

}


/* =====================================
   SEARCH
===================================== */

function setupSearch() {

    const search =
        document.getElementById(
            "searchTransaction"
        );

    if (!search) return;


    search.addEventListener(
        "input",
        () => {

            searchText =
                search.value.toLowerCase();

            renderTransactions();

        }
    );

}


/* =====================================
   FILTERS
===================================== */

function setupFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-row button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );

                    button.classList.add(
                        "active"
                    );

                    currentFilter =
                        button.dataset.filter ||
                        "all";

                    renderTransactions();

                }
            );

        }
    );

}


/* =====================================
   REFRESH WHEN RETURNING TO PAGE
===================================== */

window.addEventListener(
    "pageshow",
    () => {

        loadUser();

    }
);


/* =====================================
   BUTTON
===================================== */

function setupButtons() {

    const button =
        document.getElementById(
            "addTransaction"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            meloToast(
                "➕ Add Transaction",
                "Use the Income, Expense or Savings pages to record money.",
                "info"
            );

        }
    );

}


/* =====================================
   MONEY
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
   DATE
===================================== */

function formatDateTime(date) {

    if (!date) {

        return "Today";

    }

    const parsed =
        new Date(date);

    if (
        isNaN(
            parsed.getTime()
        )
    ) {

        return String(date);

    }

    return parsed.toLocaleString(
        "en-NG",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =====================================
   ESCAPE
===================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


console.log(
    "✅ MELOSAV Transactions V2 Ready"
);
