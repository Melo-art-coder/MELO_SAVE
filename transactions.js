/* =====================================================
   MELOSAV — ACTIVITY
===================================================== */

let currentTypeFilter = "all";
let currentCategory = "all";
let searchTerm = "";

let selectedType = "expense";
let selectedTransactionId = null;


/* =====================================================
   START
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const user = getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    setupEvents();

    renderPage(user);

});


/* =====================================================
   EVENTS
===================================================== */

function setupEvents() {

    document
        .getElementById("openTransaction")
        ?.addEventListener(
            "click",
            openTransactionModal
        );


    document
        .getElementById("closeTransaction")
        ?.addEventListener(
            "click",
            closeTransactionModal
        );


    document
        .getElementById("saveTransaction")
        ?.addEventListener(
            "click",
            saveTransaction
        );


    document
        .getElementById("closeDetails")
        ?.addEventListener(
            "click",
            closeDetailsModal
        );


    document
        .getElementById("deleteTransaction")
        ?.addEventListener(
            "click",
            deleteSelectedTransaction
        );


    document
        .getElementById("transactionSearch")
        ?.addEventListener(
            "input",
            event => {

                searchTerm =
                    event.target.value
                        .trim()
                        .toLowerCase();

                renderPage(
                    getCurrentUser()
                );

            }
        );


    document
        .querySelectorAll(".filter")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    currentTypeFilter =
                        button.dataset.filter;

                    setActive(
                        ".filter",
                        button
                    );

                    renderPage(
                        getCurrentUser()
                    );

                }
            );

        });


    document
        .querySelectorAll(".category-filter")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    currentCategory =
                        button.dataset.category;

                    setActive(
                        ".category-filter",
                        button
                    );

                    renderPage(
                        getCurrentUser()
                    );

                }
            );

        });


    document
        .querySelectorAll(".type-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectedType =
                        button.dataset.type;

                    setActive(
                        ".type-button",
                        button
                    );

                }
            );

        });


    document
        .getElementById("transactionModal")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "transactionModal"
                ) {

                    closeTransactionModal();

                }

            }
        );


    document
        .getElementById("detailsModal")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "detailsModal"
                ) {

                    closeDetailsModal();

                }

            }
        );

}


/* =====================================================
   RENDER PAGE
===================================================== */

function renderPage(user) {

    if (!user) return;

    updateSummary(user);

    renderTransactions(user);

}


/* =====================================================
   SUMMARY
===================================================== */

function updateSummary(user) {

    const income =
        Number(user.income) || 0;

    const expenses =
        Number(user.expenses) || 0;


    const incomeElement =
        document.getElementById(
            "summaryIncome"
        );

    const expenseElement =
        document.getElementById(
            "summaryExpenses"
        );


    if (incomeElement) {

        incomeElement.textContent =
            money(income);

    }


    if (expenseElement) {

        expenseElement.textContent =
            money(expenses);

    }

}


/* =====================================================
   TRANSACTIONS
===================================================== */

function renderTransactions(user) {

    const list =
        document.getElementById(
            "transactionList"
        );


    if (!list) return;


    const transactions =
        Array.isArray(user.transactions)
            ? user.transactions
            : [];


    const filtered =
        transactions.filter(
            transaction => {

                const matchesType =
                    currentTypeFilter ===
                    "all" ||
                    transaction.type ===
                    currentTypeFilter;


                const matchesCategory =
                    currentCategory ===
                    "all" ||
                    transaction.category ===
                    currentCategory;


                const searchableText = [

                    transaction.title,

                    transaction.description,

                    transaction.category,

                    transaction.type

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !searchTerm ||
                    searchableText.includes(
                        searchTerm
                    );


                return (
                    matchesType &&
                    matchesCategory &&
                    matchesSearch
                );

            }
        );


    updateCount(
        filtered.length
    );


    list.innerHTML = "";


    if (!filtered.length) {

        list.innerHTML = `

            <div class="empty-state">

                <strong>
                    Nothing here yet.
                </strong>

                <p>
                    Your matching transactions
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    filtered.forEach(
        transaction => {

            list.appendChild(
                createTransactionElement(
                    transaction
                )
            );

        }
    );

}


/* =====================================================
   CREATE ITEM
===================================================== */

function createTransactionElement(
    transaction
) {

    const item =
        document.createElement(
            "button"
        );


    item.type = "button";

    item.className =
        "transaction-item";


    const isIncome =
        transaction.type ===
        "income";


    const title =
        transaction.title ||
        categoryName(
            transaction.category
        );


    const category =
        categoryName(
            transaction.category
        );


    item.innerHTML = `

        <span class="transaction-icon">

            ${categoryLetter(
                transaction.category
            )}

        </span>


        <span class="transaction-info">

            <strong>
                ${escapeHTML(title)}
            </strong>

            <small>

                ${escapeHTML(category)}

                ·

                ${formatDate(
                    transaction.date
                )}

            </small>

        </span>


        <span
            class="transaction-amount ${
                isIncome
                    ? "income"
                    : "expense"
            }"
        >

            ${isIncome ? "+" : "-"}
            ${money(transaction.amount)}

        </span>


        <span class="transaction-arrow">
            ›
        </span>

    `;


    item.addEventListener(
        "click",
        () => {

            showTransactionDetails(
                transaction
            );

        }
    );


    return item;

}


/* =====================================================
   DETAILS
===================================================== */

function showTransactionDetails(
    transaction
) {

    selectedTransactionId =
        transaction.id;


    document.getElementById(
        "detailsIcon"
    ).textContent =
        categoryLetter(
            transaction.category
        );


    document.getElementById(
        "detailsTitle"
    ).textContent =
        transaction.title ||
        categoryName(
            transaction.category
        );


    const amountElement =
        document.getElementById(
            "detailsAmount"
        );


    amountElement.textContent =
        (
            transaction.type ===
            "income"
                ? "+"
                : "-"
        ) +
        money(
            transaction.amount
        );


    amountElement.className =
        "details-amount " +
        (
            transaction.type ===
            "income"
                ? "income"
                : "expense"
        );


    document.getElementById(
        "detailsCategory"
    ).textContent =
        categoryName(
            transaction.category
        );


    document.getElementById(
        "detailsDate"
    ).textContent =
        formatDate(
            transaction.date
        );


    document.getElementById(
        "detailsDescription"
    ).textContent =
        transaction.description ||
        "No description";


    document.getElementById(
        "detailsModal"
    ).hidden =
        false;

}


/* =====================================================
   DELETE
===================================================== */

function deleteSelectedTransaction() {

    if (!selectedTransactionId) {
        return;
    }


    const user =
        getCurrentUser();


    if (!user) return;


    const transactions =
        Array.isArray(user.transactions)
            ? user.transactions
            : [];


    const index =
        transactions.findIndex(
            transaction =>
                transaction.id ===
                selectedTransactionId
        );


    if (index === -1) {

        closeDetailsModal();

        return;

    }


    const transaction =
        transactions[index];


    /*
       Reverse the transaction
       before deleting it.
    */

    if (
        transaction.type ===
        "income"
    ) {

        user.income =
            Math.max(
                0,
                (Number(user.income) || 0) -
                Number(transaction.amount || 0)
            );

    } else {

        user.expenses =
            Math.max(
                0,
                (Number(user.expenses) || 0) -
                Number(transaction.amount || 0)
            );

    }


    user.balance =
        (Number(user.income) || 0) -
        (Number(user.expenses) || 0);


    transactions.splice(
        index,
        1
    );


    user.transactions =
        transactions;


    saveUser(user);


    closeDetailsModal();


    showToast(
        "Transaction deleted.",
        "success"
    );


    renderPage(user);

}


/* =====================================================
   MODALS
===================================================== */

function openTransactionModal() {

    document.getElementById(
        "transactionModal"
    ).hidden =
        false;

}


function closeTransactionModal() {

    document.getElementById(
        "transactionModal"
    ).hidden =
        true;

}


function closeDetailsModal() {

    document.getElementById(
        "detailsModal"
    ).hidden =
        true;

    selectedTransactionId =
        null;

}


/* =====================================================
   SAVE TRANSACTION
===================================================== */

function saveTransaction() {

    const user =
        getCurrentUser();


    if (!user) return;


    const amount =
        Number(
            document.getElementById(
                "transactionAmount"
            ).value
        );


    const category =
        document.getElementById(
            "transactionCategory"
        ).value;


    const description =
        document.getElementById(
            "transactionDescription"
        ).value
        .trim();


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        showToast(
            "Enter a valid amount.",
            "error"
        );

        return;

    }


    if (!Array.isArray(user.transactions)) {

        user.transactions = [];

    }


    if (selectedType === "income") {

        user.income =
            (Number(user.income) || 0) +
            amount;

    } else {

        user.expenses =
            (Number(user.expenses) || 0) +
            amount;

    }


    user.balance =
        (Number(user.income) || 0) -
        (Number(user.expenses) || 0);


    const transaction = {

        id:
            generateId(),

        type:
            selectedType,

        category:
            category,

        title:
            description ||
            categoryName(category),

        description:
            description,

        amount:
            amount,

        date:
            new Date().toISOString()

    };


    user.transactions.unshift(
        transaction
    );


    saveUser(user);


    resetForm();

    closeTransactionModal();


    showToast(
        "Transaction saved.",
        "success"
    );


    renderPage(user);

}


/* =====================================================
   STORAGE
===================================================== */

function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "meloCurrentUser"
            )
        );

    } catch {

        return null;

    }

}


function saveUser(user) {

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(user)
    );


    let users = [];

    try {

        users =
            JSON.parse(
                localStorage.getItem(
                    "meloUsers"
                )
            ) || [];

    } catch {

        users = [];

    }


    if (!Array.isArray(users)) {

        users = [];

    }


    const index =
        users.findIndex(
            account => {

                if (
                    user.id &&
                    account.id
                ) {

                    return (
                        account.id ===
                        user.id
                    );

                }


                return (
                    account.email ===
                    user.email
                );

            }
        );


    if (index >= 0) {

        users[index] =
            user;

    } else {

        users.push(user);

    }


    localStorage.setItem(
        "meloUsers",
        JSON.stringify(users)
    );

}


/* =====================================================
   HELPERS
===================================================== */

function setActive(
    selector,
    selected
) {

    document
        .querySelectorAll(selector)
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    selected.classList.add(
        "active"
    );

}


function categoryName(category) {

    const names = {

        transfer: "Transfer",
        airtime: "Airtime",
        data: "Data",
        bills: "Bills",
        food: "Food",
        shopping: "Shopping",
        transport: "Transport",
        education: "Education",
        other: "Other"

    };


    return (
        names[category] ||
        "Other"
    );

}


function categoryLetter(category) {

    const letters = {

        transfer: "TR",
        airtime: "AT",
        data: "DT",
        bills: "BL",
        food: "FD",
        shopping: "SH",
        transport: "TP",
        education: "ED",
        other: "OT"

    };


    return (
        letters[category] ||
        "OT"
    );

}


function money(amount) {

    return (
        "₦" +
        Number(amount || 0)
            .toLocaleString(
                "en-NG",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
    );

}


function formatDate(date) {

    if (!date) {
        return "Unknown date";
    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return String(date);

    }


    return parsed.toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


function generateId() {

    return (
        "TX-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase()
    );

}


function resetForm() {

    document.getElementById(
        "transactionAmount"
    ).value = "";


    document.getElementById(
        "transactionDescription"
    ).value = "";


    selectedType =
        "expense";


    document
        .querySelectorAll(
            ".type-button"
        )
        .forEach(
            button =>
                button.classList.remove(
                    "active"
                )
        );


    document
        .querySelector(
            '.type-button[data-type="expense"]'
        )
        ?.classList.add(
            "active"
        );

}


function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function updateCount(count) {

    const element =
        document.getElementById(
            "transactionCount"
        );


    if (!element) return;


    element.textContent =
        count === 1
            ? "1 transaction"
            : `${count} transactions`;

}


function showToast(
    message,
    type = "success"
) {

    if (
        typeof meloToast ===
        "function"
    ) {

        meloToast(
            "MELOSAV",
            message,
            type
        );

    } else {

        alert(message);

    }

}
