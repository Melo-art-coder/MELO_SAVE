let currentUser = null;


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        currentUser = getCurrentUser();

        if (!currentUser) {

            window.location.href =
                "login.html";

            return;

        }


        setupEvents();

        renderBudget();

    }
);


/* =====================================================
   EVENTS
===================================================== */

function setupEvents() {

    document
        .getElementById(
            "openBudgetSettings"
        )
        ?.addEventListener(
            "click",
            openBudgetSettings
        );


    document
        .getElementById(
            "closeBudgetSettings"
        )
        ?.addEventListener(
            "click",
            closeBudgetSettings
        );


    document
        .getElementById(
            "saveBudget"
        )
        ?.addEventListener(
            "click",
            saveBudget
        );


    document
        .getElementById(
            "openCategoryModal"
        )
        ?.addEventListener(
            "click",
            openCategoryModal
        );


    document
        .getElementById(
            "closeCategoryModal"
        )
        ?.addEventListener(
            "click",
            closeCategoryModal
        );


    document
        .getElementById(
            "saveCategory"
        )
        ?.addEventListener(
            "click",
            saveCategory
        );


    document
        .getElementById(
            "budgetSettingsModal"
        )
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "budgetSettingsModal"
                ) {

                    closeBudgetSettings();

                }

            }
        );


    document
        .getElementById(
            "categoryModal"
        )
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "categoryModal"
                ) {

                    closeCategoryModal();

                }

            }
        );

}


/* =====================================================
   RENDER
===================================================== */

function renderBudget() {

    if (!currentUser) return;


    const budget =
        Number(
            currentUser.monthlyBudget
        ) || 0;


    const spent =
        calculateMonthlyExpenses();


    const remaining =
        budget - spent;


    updateMainCard(
        budget,
        spent,
        remaining
    );


    renderCategories();

    updateDailyGuide(
        budget,
        remaining
    );

    updateAlert(
        budget,
        spent,
        remaining
    );

}


/* =====================================================
   MAIN CARD
===================================================== */

function updateMainCard(
    budget,
    spent,
    remaining
) {

    document.getElementById(
        "totalBudget"
    ).textContent =
        money(budget);


    document.getElementById(
        "budgetSpent"
    ).textContent =
        money(spent);


    document.getElementById(
        "budgetRemaining"
    ).textContent =
        money(
            Math.max(
                remaining,
                0
            )
        );


    let percentage = 0;


    if (budget > 0) {

        percentage =
            (spent / budget) * 100;

    }


    const safePercentage =
        Math.min(
            Math.max(
                percentage,
                0
            ),
            100
        );


    document.getElementById(
        "budgetPercentage"
    ).textContent =
        `${Math.round(percentage)}%`;


    document.getElementById(
        "mainProgress"
    ).style.width =
        `${safePercentage}%`;


    const status =
        document.getElementById(
            "budgetStatus"
        );


    if (!budget) {

        status.textContent =
            "Not set";

    } else if (remaining < 0) {

        status.textContent =
            "Over budget";

    } else if (percentage >= 80) {

        status.textContent =
            "Almost used";

    } else {

        status.textContent =
            "On track";

    }

}


/* =====================================================
   MONTHLY EXPENSES
===================================================== */

function calculateMonthlyExpenses() {

    const transactions =
        Array.isArray(
            currentUser.transactions
        )
            ? currentUser.transactions
            : [];


    const now =
        new Date();


    const currentMonth =
        now.getMonth();


    const currentYear =
        now.getFullYear();


    return transactions.reduce(
        (
            total,
            transaction
        ) => {

            if (
                transaction.type !==
                "expense"
            ) {

                return total;

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

                return total;

            }


            if (
                date.getMonth() !==
                currentMonth ||
                date.getFullYear() !==
                currentYear
            ) {

                return total;

            }


            return (
                total +
                Number(
                    transaction.amount
                || 0
                )
            );

        },
        0
    );

}


/* =====================================================
   CATEGORY BREAKDOWN
===================================================== */

function renderCategories() {

    const container =
        document.getElementById(
            "categoryList"
        );


    if (!container) return;


    const categories =
        currentUser.budgetCategories
            || {};


    const transactions =
        Array.isArray(
            currentUser.transactions
        )
            ? currentUser.transactions
            : [];


    container.innerHTML = "";


    const categoryNames =
        Object.keys(
            categories
        );


    if (!categoryNames.length) {

        container.innerHTML = `

            <div class="empty-category">

                <strong>
                    No category budgets yet.
                </strong>

                <p>
                    Add categories to see exactly
                    where your budget is going.
                </p>

            </div>

        `;

        return;

    }


    categoryNames.forEach(
        category => {

            const budget =
                Number(
                    categories[category]
                ) || 0;


            const spent =
                getCategorySpent(
                    category,
                    transactions
                );


            const remaining =
                budget - spent;


            const percentage =
                budget > 0
                    ? (
                        spent /
                        budget
                    ) * 100
                    : 0;


            const safePercentage =
                Math.min(
                    Math.max(
                        percentage,
                        0
                    ),
                    100
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "category-item";


            item.innerHTML = `

                <div class="category-top">

                    <div>

                        <span
                            class="category-mark"
                        >
                            ${categoryInitial(
                                category
                            )}
                        </span>

                        <strong>
                            ${categoryName(
                                category
                            )}
                        </strong>

                    </div>

                    <button
                        class="remove-category"
                        type="button"
                        data-category="${category}"
                    >
                        Remove
                    </button>

                </div>


                <div class="category-numbers">

                    <span>
                        ${money(spent)}
                        spent
                    </span>

                    <span>
                        ${money(
                            Math.max(
                                remaining,
                                0
                            )
                        )}
                        left
                    </span>

                </div>


                <div class="category-progress">

                    <div
                        class="category-progress-fill ${
                            percentage > 100
                                ? "over"
                                : ""
                        }"
                        style="width:${safePercentage}%"
                    ></div>

                </div>


                <div class="category-bottom">

                    <span>
                        Budget:
                        ${money(budget)}
                    </span>

                    <strong>
                        ${Math.round(
                            percentage
                        )}%
                    </strong>

                </div>

            `;


            item
                .querySelector(
                    ".remove-category"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        removeCategory(
                            category
                        );

                    }
                );


            container.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   CATEGORY SPENDING
===================================================== */

function getCategorySpent(
    category,
    transactions
) {

    const now =
        new Date();


    return transactions.reduce(
        (
            total,
            transaction
        ) => {

            if (
                transaction.type !==
                "expense"
            ) {

                return total;

            }


            if (
                transaction.category !==
                category
            ) {

                return total;

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

                return total;

            }


            if (
                date.getMonth() !==
                now.getMonth() ||
                date.getFullYear() !==
                now.getFullYear()
            ) {

                return total;

            }


            return (
                total +
                Number(
                    transaction.amount ||
                    0
                )
            );

        },
        0
    );

}


/* =====================================================
   DAILY GUIDE
===================================================== */

function updateDailyGuide(
    budget,
    remaining
) {

    const now =
        new Date();


    const lastDay =
        new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        ).getDate();


    const daysLeft =
        lastDay -
        now.getDate() +
        1;


    const guide =
        daysLeft > 0 &&
        remaining > 0
            ? remaining /
              daysLeft
            : 0;


    document.getElementById(
        "dailyGuide"
    ).textContent =
        money(guide);


    document.getElementById(
        "daysRemaining"
    ).textContent =
        daysLeft === 1
            ? "1 day"
            : `${daysLeft} days`;

}


/* =====================================================
   ALERT
===================================================== */

function updateAlert(
    budget,
    spent,
    remaining
) {

    const alert =
        document.getElementById(
            "budgetAlert"
        );


    if (!alert) return;


    if (!budget) {

        alert.hidden =
            false;


        document.getElementById(
            "alertTitle"
        ).textContent =
            "Set your monthly budget";


        document.getElementById(
            "alertMessage"
        ).textContent =
            "Add a budget amount to start tracking your spending.";

        return;

    }


    const percentage =
        (spent / budget) *
        100;


    if (remaining < 0) {

        alert.hidden =
            false;


        document.getElementById(
            "alertTitle"
        ).textContent =
            "You've gone over budget";


        document.getElementById(
            "alertMessage"
        ).textContent =
            `You're ${money(
                Math.abs(
                    remaining
                )
            )} over your monthly limit.`;

    } else if (
        percentage >= 80
    ) {

        alert.hidden =
            false;


        document.getElementById(
            "alertTitle"
        ).textContent =
            "You're close to your limit";


        document.getElementById(
            "alertMessage"
        ).textContent =
            `${Math.round(
                100 - percentage
            )}% of your budget remains.`;

    } else {

        alert.hidden =
            true;

    }

}


/* =====================================================
   BUDGET SETTINGS
===================================================== */

function openBudgetSettings() {

    const input =
        document.getElementById(
            "monthlyBudgetInput"
        );


    input.value =
        currentUser.monthlyBudget
            || "";


    document.getElementById(
        "budgetSettingsModal"
    ).hidden =
        false;

}


function closeBudgetSettings() {

    document.getElementById(
        "budgetSettingsModal"
    ).hidden =
        true;

}


function saveBudget() {

    const amount =
        Number(
            document.getElementById(
                "monthlyBudgetInput"
            ).value
        );


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        showToast(
            "Enter a valid budget amount.",
            "error"
        );

        return;

    }


    currentUser.monthlyBudget =
        amount;


    saveUser(
        currentUser
    );


    closeBudgetSettings();

    renderBudget();


    showToast(
        "Monthly budget saved.",
        "success"
    );

}


/* =====================================================
   CATEGORY MODAL
===================================================== */

function openCategoryModal() {

    document.getElementById(
        "categoryModal"
    ).hidden =
        false;

}


function closeCategoryModal() {

    document.getElementById(
        "categoryModal"
    ).hidden =
        true;

}


function saveCategory() {

    const category =
        document.getElementById(
            "categoryName"
        ).value;


    const amount =
        Number(
            document.getElementById(
                "categoryAmount"
            ).value
        );


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        showToast(
            "Enter a valid category budget.",
            "error"
        );

        return;

    }


    if (
        !currentUser.budgetCategories
    ) {

        currentUser.budgetCategories =
            {};

    }


    currentUser.budgetCategories[
        category
    ] =
        amount;


    saveUser(
        currentUser
    );


    document.getElementById(
        "categoryAmount"
    ).value =
        "";


    closeCategoryModal();

    renderBudget();


    showToast(
        "Category budget saved.",
        "success"
    );

}


/* =====================================================
   REMOVE CATEGORY
===================================================== */

function removeCategory(
    category
) {

    if (
        !currentUser.budgetCategories
    ) {

        return;

    }


    delete currentUser
        .budgetCategories[
            category
        ];


    saveUser(
        currentUser
    );


    renderBudget();


    showToast(
        "Category removed.",
        "success"
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


    if (index !== -1) {

        users[index] =
            user;

    } else {

        users.push(
            user
        );

    }


    localStorage.setItem(
        "meloUsers",
        JSON.stringify(users)
    );

}


/* =====================================================
   HELPERS
===================================================== */

function categoryName(
    category
) {

    const names = {

        food: "Food",

        transport:
            "Transport",

        airtime:
            "Airtime",

        data:
            "Data",

        bills:
            "Bills",

        shopping:
            "Shopping",

        education:
            "Education",

        transfer:
            "Transfers",

        other:
            "Other"

    };


    return (
        names[category] ||
        "Other"
    );

}


function categoryInitial(
    category
) {

    const names = {

        food: "FD",

        transport:
            "TP",

        airtime:
            "AT",

        data:
            "DT",

        bills:
            "BL",

        shopping:
            "SH",

        education:
            "ED",

        transfer:
            "TR",

        other:
            "OT"

    };


    return (
        names[category] ||
        "OT"
    );

}


function money(amount) {

    return (
        "₦" +
        Number(
            amount || 0
        ).toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 2,

                maximumFractionDigits: 2
            }
        )
    );

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
