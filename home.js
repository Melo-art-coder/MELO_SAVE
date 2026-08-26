/* =====================================================
   MELOSAV — HOME DASHBOARD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const user =
            requireUser();

        if (!user) return;


        loadHome(user);

    }
);


/* =====================================================
   LOAD HOME
===================================================== */

function loadHome(user) {

    updateGreeting(user);

    updateProfilePhoto(user);

    updateWallet(user);

    updateSpending(user);

    updateBudget(user);

    updateRecentTransactions(user);

    updateInsight(user);

}


/* =====================================================
   GREETING
===================================================== */

function updateGreeting(user) {

    const greeting =
        document.getElementById(
            "greeting"
        );

    const userName =
        document.getElementById(
            "userName"
        );


    const hour =
        new Date()
            .getHours();


    let text =
        "Good morning";


    if (hour >= 12 && hour < 17) {

        text =
            "Good afternoon";

    }


    if (hour >= 17) {

        text =
            "Good evening";

    }


    if (greeting) {

        greeting.textContent =
            text;

    }


    if (userName) {

        userName.textContent =
            `${user.name || "MELO User"}, let's check your money.`;

    }

}


/* =====================================================
   PROFILE PHOTO
===================================================== */

function updateProfilePhoto(user) {

    const image =
        document.getElementById(
            "profilePhoto"
        );


    if (!image) return;


    if (user.profilePhoto) {

        image.src =
            user.profilePhoto;

    } else {

        image.src =
            "logo.png";

    }

}


/* =====================================================
   WALLET
===================================================== */

function updateWallet(user) {

    const balance =
        Number(
            user.balance
        ) || 0;


    const income =
        Number(
            user.income
        ) || 0;


    const expenses =
        Number(
            user.expenses
        ) || 0;


    setText(
        "balance",
        formatMoney(balance)
    );


    setText(
        "totalIncome",
        formatMoney(income)
    );


    setText(
        "totalExpenses",
        formatMoney(expenses)
    );

}


/* =====================================================
   SPENDING
===================================================== */

function updateSpending(user) {

    const income =
        Number(
            user.income
        ) || 0;


    const expenses =
        Number(
            user.expenses
        ) || 0;


    let percentage =
        0;


    if (income > 0) {

        percentage =
            (expenses / income) *
            100;

    }


    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );


    const remaining =
        Math.max(
            0,
            income - expenses
        );


    setText(
        "usagePercentage",
        `${Math.round(percentage)}%`
    );


    setText(
        "spentAmount",
        formatMoney(expenses)
    );


    setText(
        "remainingAmount",
        formatMoney(remaining)
    );


    const bar =
        document.getElementById(
            "usageBar"
        );


    if (bar) {

        bar.style.width =
            `${percentage}%`;

    }

}


/* =====================================================
   BUDGET
===================================================== */

function updateBudget(user) {

    const budget =
        user.budget || {};


    const limit =
        Number(
            budget.amount
        ) || 0;


    const spent =
        Number(
            user.expenses
        ) || 0;


    const percentage =
        limit > 0
            ? Math.min(
                100,
                (spent / limit) *
                100
            )
            : 0;


    setText(
        "budgetSpent",
        formatMoney(spent)
    );


    setText(
        "budgetLimit",
        `of ${formatMoney(limit)}`
    );


    const title =
        document.getElementById(
            "budgetTitle"
        );


    const message =
        document.getElementById(
            "budgetMessage"
        );


    if (limit <= 0) {

        if (title) {

            title.textContent =
                "No budget set";

        }


        if (message) {

            message.textContent =
                "Set a budget to start tracking your spending.";

        }

    } else {

        if (title) {

            title.textContent =
                budget.period === "weekly"
                    ? "Weekly budget"
                    : "Monthly budget";

        }


        if (message) {

            const remaining =
                Math.max(
                    0,
                    limit - spent
                );


            message.textContent =
                `${formatMoney(remaining)} remaining in your budget.`;

        }

    }


    const bar =
        document.getElementById(
            "budgetBar"
        );


    if (bar) {

        bar.style.width =
            `${percentage}%`;

    }

}


/* =====================================================
   RECENT TRANSACTIONS
===================================================== */

function updateRecentTransactions(user) {

    const container =
        document.getElementById(
            "recentTransactions"
        );


    if (!container) return;


    container.innerHTML =
        "";


    const transactions =
        Array.isArray(
            user.transactions
        )
            ? user.transactions
            : [];


    const recent =
        transactions.slice(
            0,
            5
        );


    if (!recent.length) {

        container.innerHTML = `

            <div class="empty-state">

                No transactions yet.

                <br>

                Add money or make a payment
                to see your activity here.

            </div>

        `;

        return;

    }


    recent.forEach(
        transaction => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "transaction-item";


            const isIncome =
                transaction.type ===
                "income";


            const sign =
                isIncome
                    ? "+"
                    : "-";


            const icon =
                getTransactionIcon(
                    transaction.category
                );


            item.innerHTML = `

                <div class="transaction-icon">

                    ${icon}

                </div>


                <div class="transaction-info">

                    <strong>

                        ${escapeHTML(
                            transaction.title ||
                            transaction.category ||
                            "Transaction"
                        )}

                    </strong>


                    <small>

                        ${formatTransactionDate(
                            transaction.date
                        )}

                    </small>

                </div>


                <div class="transaction-amount ${

                    isIncome
                        ? "income"
                        : "expense"

                }">

                    ${sign}${formatMoney(
                        transaction.amount
                    )}

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   INSIGHT
===================================================== */

function updateInsight(user) {

    const title =
        document.getElementById(
            "insightTitle"
        );


    const text =
        document.getElementById(
            "insightText"
        );


    const income =
        Number(
            user.income
        ) || 0;


    const expenses =
        Number(
            user.expenses
        ) || 0;


    if (
        income === 0 &&
        expenses === 0
    ) {

        title.textContent =
            "Start your money journey";


        text.textContent =
            "Once you add your first transaction, MELOSAV will start showing useful information about your spending.";

        return;

    }


    if (expenses > income) {

        title.textContent =
            "Your spending is above your income";


        text.textContent =
            "You've spent more than you've recorded as income. Review your recent activity and check your budget.";

        return;

    }


    if (income > 0) {

        const percentage =
            Math.round(
                (
                    expenses /
                    income
                ) *
                100
            );


        title.textContent =
            `${percentage}% of your income has been used`;


        text.textContent =
            `You've received ${formatMoney(income)} and spent ${formatMoney(expenses)} so far.`;

    }

}


/* =====================================================
   TRANSACTION ICON
===================================================== */

function getTransactionIcon(
    category
) {

    const value =
        String(
            category || ""
        )
            .toLowerCase();


    if (
        value.includes("airtime")
    ) {

        return "A";

    }


    if (
        value.includes("data")
    ) {

        return "D";

    }


    if (
        value.includes("bill")
    ) {

        return "B";

    }


    if (
        value.includes("transfer")
    ) {

        return "T";

    }


    if (
        value.includes("food")
    ) {

        return "F";

    }


    if (
        value.includes("income")
    ) {

        return "+";

    }


    return "•";

}


/* =====================================================
   SAFE TEXT
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
