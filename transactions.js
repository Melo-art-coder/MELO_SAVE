/* =====================================
   MELOSAV TRANSACTIONS
===================================== */

let currentUser = null;
let transactions = [];
let currentFilter = "all";

/* =====================================
   APP START
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof loadTheme === "function") {
        loadTheme();
    }

    loadUser();
    setupButtons();
    setupSearch();
    setupFilters();

});


/* =====================================
   LOAD USER
===================================== */

function loadUser(){

    currentUser = JSON.parse(
        localStorage.getItem("meloCurrentUser")
    );

    if(!currentUser){

        location.href = "login.html";
        return;

    }

    transactions = currentUser.transactions || [];

    updateSummary();
    displayTransactions(transactions);

}


/* =====================================
   SUMMARY
===================================== */

function updateSummary(){

    let income = 0;
    let expense = 0;
    let savings = 0;

    transactions.forEach(item=>{

        const amount = Number(item.amount || 0);

        if(item.type === "income"){

            income += amount;

        }

        if(item.type === "expense"){

            expense += amount;

        }

        if(item.type === "savings"){

            savings += amount;

        }

    });

    document.getElementById("incomeTotal").textContent =
        formatMoney(income);

    document.getElementById("expenseTotal").textContent =
        formatMoney(expense);

    document.getElementById("savingsTotal").textContent =
        formatMoney(savings);

}


/* =====================================
   DISPLAY TRANSACTIONS
===================================== */

function displayTransactions(list){

    const container =
        document.getElementById("transactionList");

    if(list.length === 0){

        container.innerHTML = `

        <div class="empty-state">

            <div class="emoji">📄</div>

            <h2>No Transactions Yet</h2>

            <p>

            Your income, expenses and savings
            will appear here.

            </p>

        </div>

        `;

        return;

    }

    container.innerHTML = "";

    list
    .slice()
    .reverse()
    .forEach(item=>{

        let icon = "💰";
        let color = "icon-income";

        if(item.type === "expense"){

            icon = "💸";
            color = "icon-expense";

        }

        if(item.type === "savings"){

            icon = "🏦";
            color = "icon-savings";

        }

        const card = document.createElement("div");

        card.className = "transaction-card";

        card.innerHTML = `

        <div class="transaction-left">

            <div class="transaction-icon ${color}">

                ${icon}

            </div>

            <div class="transaction-info">

                <h3>

                    ${item.title || "Transaction"}

                </h3>

                <p>

                    ${item.date || "Today"}

                </p>

            </div>

        </div>

        <div class="transaction-amount">

            <h2>

                ${formatMoney(item.amount)}

            </h2>

            <small>

                ${item.type}

            </small>

        </div>

        `;

        container.appendChild(card);

    });

}


/* =====================================
   SEARCH
===================================== */

function setupSearch(){

    const search =
    document.getElementById("searchTransaction");

    search.addEventListener("input",()=>{

        const text =
        search.value.toLowerCase();

        const filtered =
        transactions.filter(item=>{

            return (
                item.title?.toLowerCase().includes(text)
            );

        });

        displayTransactions(filtered);

    });

}


/* =====================================
   FILTERS
===================================== */

function setupFilters(){

    const buttons =
    document.querySelectorAll(
        ".filter-row button"
    );

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            buttons.forEach(btn=>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            currentFilter =
            button.dataset.filter;

            if(currentFilter === "all"){

                displayTransactions(transactions);

                return;

            }

            const filtered =
            transactions.filter(item=>

                item.type === currentFilter

            );

            displayTransactions(filtered);

        });

    });

}


/* =====================================
   BUTTONS
===================================== */

function setupButtons(){

    document
    .getElementById("addTransaction")
    .addEventListener("click",()=>{

        meloToast(

            "➕ Add Transaction",

            "Use Income, Expense or Savings pages to add transactions.",

            "info"

        );

    });

}


/* =====================================
   FORMAT MONEY
===================================== */

function formatMoney(amount){

    return "₦" +

    Number(amount).toLocaleString(

        "en-NG",

        {

            minimumFractionDigits:2,

            maximumFractionDigits:2

        }

    );

}