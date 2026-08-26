/* =====================================================
   MELOSAV — ANALYTICS
===================================================== */

let currentUser = null;

const categoryNames = {

    food: "Food",

    transport: "Transport",

    airtime: "Airtime",

    data: "Data",

    bills: "Bills",

    shopping: "Shopping",

    education: "Education",

    transfer: "Transfers",

    other: "Other"

};


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        currentUser =
            getCurrentUser();

        if (!currentUser) {

            window.location.href =
                "login.html";

            return;

        }

        renderAnalytics();

    }
);


/* =====================================================
   MAIN
===================================================== */

function renderAnalytics() {

    const transactions =
        getTransactions();


    const monthlyTransactions =
        getMonthlyTransactions(
            transactions
        );


    const income =
        getIncome(
            monthlyTransactions
        );


    const expenses =
        getExpenses(
            monthlyTransactions
        );


    const net =
        income - expenses;


    updateSummary(
        income,
        expenses,
        net
    );


    renderCategories(
        monthlyTransactions
    );


    renderTrend(
        monthlyTransactions
    );


    updateTopStats(
        monthlyTransactions
    );


    updateActivityStats(
        monthlyTransactions,
        income,
        expenses
    );


    updateInsight(
        income,
        expenses,
        net,
        monthlyTransactions
    );

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


function getTransactions() {

    if (
        !currentUser ||
        !Array.isArray(
            currentUser.transactions
        )
    ) {

        return [];

    }


    return currentUser.transactions;

}


/* =====================================================
   MONTH FILTER
===================================================== */

function getMonthlyTransactions(
    transactions
) {

    const now =
        new Date();


    return transactions.filter(
        transaction => {

            const date =
                new Date(
                    transaction.date
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return false;

            }


            return (
                date.getMonth() ===
                now.getMonth() &&

                date.getFullYear() ===
                now.getFullYear()
            );

        }
    );

}


/* =====================================================
   INCOME
===================================================== */

function getIncome(
    transactions
) {

    return transactions.reduce(
        (
            total,
            transaction
        ) => {

            if (
                transaction.type ===
                "income"
            ) {

                return (
                    total +
                    Number(
                        transaction.amount ||
                        0
                    )
                );

            }

            return total;

        },
        0
    );

}


/* =====================================================
   EXPENSES
===================================================== */

function getExpenses(
    transactions
) {

    return transactions.reduce(
        (
            total,
            transaction
        ) => {

            if (
                transaction.type ===
                "expense"
            ) {

                return (
                    total +
                    Number(
                        transaction.amount ||
                        0
                    )
                );

            }

            return total;

        },
        0
    );

}


/* =====================================================
   SUMMARY
===================================================== */

function updateSummary(
    income,
    expenses,
    net
) {

    document.getElementById(
        "totalIncome"
    ).textContent =
        money(income);


    document.getElementById(
        "totalExpenses"
    ).textContent =
        money(expenses);


    document.getElementById(
        "netChange"
    ).textContent =
        money(
            Math.abs(net)
        );


    const label =
        document.getElementById(
            "netLabel"
        );


    if (net > 0) {

        label.textContent =
            "Positive change";

    } else if (net < 0) {

        label.textContent =
            "More spent than received";

    } else {

        label.textContent =
            "No change yet";

    }

}


/* =====================================================
   CATEGORY DATA
===================================================== */

function getCategoryTotals(
    transactions
) {

    const totals = {};


    transactions.forEach(
        transaction => {

            if (
                transaction.type !==
                "expense"
            ) {

                return;

            }


            const category =
                (
                    transaction.category ||
                    "other"
                ).toLowerCase();


            const amount =
                Number(
                    transaction.amount ||
                    0
                );


            totals[category] =
                (
                    totals[category] ||
                    0
                ) + amount;

        }
    );


    return totals;

}


/* =====================================================
   CATEGORY CHART
===================================================== */

function renderCategories(
    transactions
) {

    const chart =
        document.getElementById(
            "categoryChart"
        );


    const legend =
        document.getElementById(
            "categoryLegend"
        );


    const totals =
        getCategoryTotals(
            transactions
        );


    const entries =
        Object.entries(
            totals
        )
        .sort(
            (
                a,
                b
            ) =>
                b[1] - a[1]
        );


    chart.innerHTML = "";

    legend.innerHTML = "";


    if (!entries.length) {

        chart.innerHTML = `

            <div class="chart-empty">

                No expenses recorded
                this month.

            </div>

        `;

        return;

    }


    const total =
        entries.reduce(
            (
                sum,
                item
            ) =>
                sum + item[1],
            0
        );


    entries.forEach(
        (
            [
                category,
                amount
            ],
            index
        ) => {

            const percentage =
                total > 0
                    ? (
                        amount /
                        total
                    ) * 100
                    : 0;


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "chart-row";


            row.innerHTML = `

                <div class="chart-label">

                    <span>
                        ${
                            categoryNames[
                                category
                            ] ||
                            "Other"
                        }
                    </span>

                    <strong>
                        ${money(amount)}
                    </strong>

                </div>


                <div class="chart-track">

                    <div
                        class="chart-fill"
                        style="
                            width:${percentage}%
                        "
                    ></div>

                </div>


                <small>
                    ${Math.round(
                        percentage
                    )}%
                </small>

            `;


            chart.appendChild(
                row
            );


            const legendItem =
                document.createElement(
                    "div"
                );


            legendItem.className =
                "legend-item";


            legendItem.innerHTML = `

                <span>
                    ${
                        categoryNames[
                            category
                        ] ||
                        "Other"
                    }
                </span>

                <strong>
                    ${Math.round(
                        percentage
                    )}%
                </strong>

            `;


            legend.appendChild(
                legendItem
            );

        }
    );

}


/* =====================================================
   TREND
===================================================== */

function renderTrend(
    transactions
) {

    const chart =
        document.getElementById(
            "trendChart"
        );


    chart.innerHTML = "";


    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        now.getMonth();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const dailyTotals = [];


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        dailyTotals.push(
            0
        );

    }


    transactions.forEach(
        transaction => {

            if (
                transaction.type !==
                "expense"
            ) {

                return;

            }


            const date =
                new Date(
                    transaction.date
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return;

            }


            const day =
                date.getDate();


            if (
                day >= 1 &&
                day <=
                    daysInMonth
            ) {

                dailyTotals[
                    day - 1
                ] += Number(
                    transaction.amount ||
                    0
                );

            }

        }
    );


    const max =
        Math.max(
            ...dailyTotals,
            1
        );


    dailyTotals.forEach(
        (
            amount,
            index
        ) => {

            const bar =
                document.createElement(
                    "div"
                );


            bar.className =
                "trend-bar";


            const height =
                Math.max(
                    (
                        amount /
                        max
                    ) * 100,
                    amount > 0
                        ? 5
                        : 2
                );


            bar.innerHTML = `

                <div
                    class="trend-value"
                    style="
                        height:${height}%
                    "
                    title="${money(amount)}"
                ></div>

                <small>
                    ${
                        index + 1
                    }
                </small>

            `;


            chart.appendChild(
                bar
            );

        }
    );

}


/* =====================================================
   TOP STATS
===================================================== */

function updateTopStats(
    transactions
) {

    const expenses =
        transactions.filter(
            transaction =>
                transaction.type ===
                "expense"
        );


    if (!expenses.length) {

        document.getElementById(
            "topCategory"
        ).textContent =
            "—";


        document.getElementById(
            "topCategoryAmount"
        ).textContent =
            "₦0.00 spent";


        document.getElementById(
            "largestExpense"
        ).textContent =
            "—";


        document.getElementById(
            "largestExpenseAmount"
        ).textContent =
            "₦0.00";

        return;

    }


    const totals =
        getCategoryTotals(
            transactions
        );


    const top =
        Object.entries(
            totals
        ).sort(
            (
                a,
                b
            ) =>
                b[1] - a[1]
        )[0];


    document.getElementById(
        "topCategory"
    ).textContent =
        categoryNames[
            top[0]
        ] ||
        "Other";


    document.getElementById(
        "topCategoryAmount"
    ).textContent =
        `${money(
            top[1]
        )} spent`;


    const largest =
        expenses.reduce(
            (
                biggest,
                transaction
            ) =>
                Number(
                    transaction.amount ||
                    0
                ) >
                Number(
                    biggest.amount ||
                    0
                )
                    ? transaction
                    : biggest
        );


    document.getElementById(
        "largestExpense"
    ).textContent =
        largest.title ||
        categoryNames[
            largest.category
        ] ||
        "Expense";


    document.getElementById(
        "largestExpenseAmount"
    ).textContent =
        money(
            Number(
                largest.amount ||
                0
            )
        );

}


/* =====================================================
   ACTIVITY STATS
===================================================== */

function updateActivityStats(
    transactions,
    income,
    expenses
) {

    const count =
        transactions.length;


    document.getElementById(
        "transactionCount"
    ).textContent =
        count;


    const expenseCount =
        transactions.filter(
            transaction =>
                transaction.type ===
                "expense"
        ).length;


    const average =
        expenseCount > 0
            ? expenses /
              expenseCount
            : 0;


    document.getElementById(
        "averageExpense"
    ).textContent =
        money(average);


    let rate = 0;


    if (income > 0) {

        rate =
            (
                (
                    income -
                    expenses
                ) /
                income
            ) * 100;

    }


    document.getElementById(
        "savingRate"
    ).textContent =
        `${Math.max(
            Math.round(rate),
            0
        )}%`;

}


/* =====================================================
   INSIGHT
===================================================== */

function updateInsight(
    income,
    expenses,
    net,
    transactions
) {

    const title =
        document.getElementById(
            "insightTitle"
        );


    const text =
        document.getElementById(
            "insightText"
        );


    if (!transactions.length) {

        title.textContent =
            "Your financial picture";


        text.textContent =
            "Add some transactions this month and MELOSAV will start building your spending picture.";

        return;

    }


    if (
        income === 0 &&
        expenses > 0
    ) {

        title.textContent =
            "Watch your spending";


        text.textContent =
            `You've recorded ${money(
                expenses
            )} in expenses this month without any income recorded yet.`;

        return;

    }


    if (
        net > 0
    ) {

        title.textContent =
            "You're currently ahead";


        text.textContent =
            `You have ${money(
                net
            )} more coming in than going out this month.`;

        return;

    }


    if (
        net < 0
    ) {

        title.textContent =
            "Spending is ahead";


        text.textContent =
            `Your expenses are currently ${money(
                Math.abs(net)
            )} higher than your recorded income this month.`;

        return;

    }


    title.textContent =
        "You're breaking even";


    text.textContent =
        "Your recorded income and expenses are currently balanced.";

}


/* =====================================================
   MONEY
===================================================== */

function money(
    amount
) {

    return (
        "₦" +
        Number(
            amount || 0
        ).toLocaleString(
            "en-NG",
            {
                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2
            }
        )
    );

}
