/* =====================================
   MELOSAV GOALS V8
   GOALS + WALLET SYNC + TRANSACTIONS
===================================== */

console.log("🎯 MELOSAV GOALS V8 LOADED");

let currentUser = null;
let selectedGoal = null;


/* =====================================
   ELEMENTS
===================================== */

const goalsContainer =
    document.getElementById("goalList");

const goalModal =
    document.getElementById("goalModal");

const goalName =
    document.getElementById("goalName");

const goalTarget =
    document.getElementById("goalAmount");

const goalDate =
    document.getElementById("goalDate");

const moneyModal =
    document.getElementById("moneyModal");

const moneyInput =
    document.getElementById("moneyInput");


/* =====================================
   START
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            typeof loadTheme === "function"
        ) {

            loadTheme();

        }

        currentUser =
            typeof getCurrentUser === "function"
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

        currentUser.goals =
            Array.isArray(currentUser.goals)
                ? currentUser.goals
                : [];

        loadGoals();
        setupButtons();

    }
);


/* =====================================
   BUTTONS
===================================== */

function setupButtons() {

    const createBtn =
        document.getElementById(
            "createGoalBtn"
        );

    const fab =
        document.getElementById("fab");

    const cancelBtn =
        document.getElementById(
            "cancelGoal"
        );

    const saveBtn =
        document.getElementById(
            "saveGoal"
        );

    if (createBtn) {

        createBtn.addEventListener(
            "click",
            openGoalModal
        );

    }

    if (fab) {

        fab.addEventListener(
            "click",
            openGoalModal
        );

    }

    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            closeGoalModal
        );

    }

    if (saveBtn) {

        saveBtn.addEventListener(
            "click",
            createGoal
        );

    }

}


/* =====================================
   SAVE CURRENT USER
===================================== */

function refreshUser() {

    if (
        typeof getCurrentUser ===
        "function"
    ) {

        currentUser =
            getCurrentUser();

    } else {

        currentUser =
            JSON.parse(
                localStorage.getItem(
                    "meloCurrentUser"
                )
            );

    }

}


/* =====================================
   CREATE GOAL MODAL
===================================== */

function openGoalModal() {

    if (!goalModal) return;

    goalModal.classList.add("show");

    setTimeout(() => {

        if (goalName) {

            goalName.focus();

        }

    }, 100);

}


function closeGoalModal() {

    if (!goalModal) return;

    goalModal.classList.remove("show");

    if (goalName)
        goalName.value = "";

    if (goalTarget)
        goalTarget.value = "";

    if (goalDate)
        goalDate.value = "";

}


/* =====================================
   CREATE GOAL
===================================== */

function createGoal() {

    const name =
        goalName.value.trim();

    const target =
        Number(goalTarget.value);

    const date =
        goalDate.value ||
        "No deadline";

    if (!name) {

        meloToast(
            "🎯 Goal Name Missing",
            "Give your savings goal a name.",
            "warning"
        );

        return;

    }

    if (!target || target <= 0) {

        meloToast(
            "💰 Invalid Amount",
            "Enter a valid target amount.",
            "error"
        );

        return;

    }


    let goal = null;


    if (
        typeof createGoalData ===
        "function"
    ) {

        goal =
            createGoalData(
                name,
                target,
                date
            );

    } else {

        currentUser.goals.push({

            id: Date.now(),

            name,

            target,

            saved: 0,

            date,

            completed: false,

            createdAt:
                new Date().toISOString()

        });

        saveFallbackUser();

    }


    if (!goal) {

        meloToast(
            "❌ Goal Error",
            "The goal could not be created.",
            "error"
        );

        return;

    }


    refreshUser();

    closeGoalModal();

    loadGoals();

    meloToast(
        "🎯 Goal Created!",
        `${name} is ready. Start saving towards it! 💜`,
        "success"
    );

}


/* =====================================
   LOAD GOALS
===================================== */

function loadGoals() {

    refreshUser();

    if (!goalsContainer) return;

    goalsContainer.innerHTML = "";

    let totalSaved = 0;
    let completed = 0;

    const goals =
        currentUser?.goals || [];


    if (goals.length === 0) {

        goalsContainer.innerHTML = `

            <div class="empty-state">

                <h2>🎯</h2>

                <h3>No Goals Yet</h3>

                <p>
                    Create your first savings goal
                    and begin your financial journey.
                </p>

            </div>

        `;

        updateSummary(0, 0, 0);

        return;

    }


    goals.forEach(goal => {

        const target =
            Number(goal.target) || 0;

        const saved =
            Number(goal.saved) || 0;

        const percent =
            target > 0
                ? Math.min(
                    (saved / target) * 100,
                    100
                )
                : 0;

        totalSaved += saved;

        if (
            saved >= target &&
            target > 0
        ) {

            completed++;

            goal.completed = true;

        }


        const card =
            document.createElement("div");

        card.className =
            "goal-card";

        card.innerHTML = `

            <div class="goal-card-top">

                <div>

                    <h3>
                        🎯
                        ${escapeHTML(goal.name)}
                    </h3>

                    <small>
                        ${formatDate(goal.date)}
                    </small>

                </div>

                <strong>
                    ${percent.toFixed(0)}%
                </strong>

            </div>


            <div class="goal-money">

                <span>
                    ${formatMoney(saved)}
                </span>

                <span>
                    / ${formatMoney(target)}
                </span>

            </div>


            <div class="progress">

                <div
                    class="progress-fill"
                    style="width:${percent}%">
                </div>

            </div>


            <p class="goal-ai">
                ${getGoalMessage(percent)}
            </p>


            <div class="goal-actions">

                <button
                    class="add-money-btn"
                    onclick="addMoney(${goal.id})">

                    💰 Add Money

                </button>


                <button
                    class="delete-goal-btn"
                    onclick="deleteGoal(${goal.id})">

                    🗑 Delete

                </button>

            </div>

        `;

        goalsContainer.appendChild(card);

    });


    updateSummary(
        goals.length,
        completed,
        totalSaved
    );

}


/* =====================================
   SUMMARY
===================================== */

function updateSummary(
    total,
    completed,
    saved
) {

    const totalElement =
        document.getElementById(
            "totalGoals"
        );

    const completedElement =
        document.getElementById(
            "completedGoals"
        );

    const savedElement =
        document.getElementById(
            "savedGoals"
        );

    if (totalElement) {

        totalElement.textContent =
            total;

    }

    if (completedElement) {

        completedElement.textContent =
            completed;

    }

    if (savedElement) {

        savedElement.textContent =
            formatMoney(saved);

    }

}


/* =====================================
   OPEN ADD MONEY
===================================== */

function addMoney(id) {

    selectedGoal = id;

    const goal =
        currentUser.goals.find(
            g =>
                Number(g.id) ===
                Number(id)
        );

    if (!goal) {

        meloToast(
            "Goal Not Found",
            "This goal could not be found.",
            "error"
        );

        return;

    }

    if (!moneyModal || !moneyInput) {

        console.error(
            "Money modal elements are missing."
        );

        return;

    }

    moneyInput.value = "";

    moneyModal.classList.add("show");

    setTimeout(() => {

        moneyInput.focus();

    }, 100);

}


/* =====================================
   CONFIRM ADD MONEY
===================================== */

function confirmAddMoney() {

    if (selectedGoal === null) {

        return;

    }

    const amount =
        Number(moneyInput.value);

    if (!amount || amount <= 0) {

        meloToast(
            "💰 Invalid Amount",
            "Enter a valid amount to save.",
            "error"
        );

        return;

    }


    /* =================================
       USE STORAGE V7
    ================================= */

    if (
        typeof addGoalDeposit !==
        "function"
    ) {

        meloToast(
            "⚠️ Storage Error",
            "Storage system is not loaded.",
            "error"
        );

        console.error(
            "addGoalDeposit() is unavailable."
        );

        return;

    }


    const result =
        addGoalDeposit(
            selectedGoal,
            amount
        );


    if (!result.success) {

        if (
            result.reason ===
            "INSUFFICIENT_BALANCE"
        ) {

            meloToast(
                "💸 Insufficient Balance",
                "You don't have enough money in your wallet.",
                "error"
            );

        }

        else if (
            result.reason ===
            "ALREADY_COMPLETED"
        ) {

            meloToast(
                "🎉 Already Completed!",
                "This goal has already reached its target.",
                "info"
            );

        }

        else {

            meloToast(
                "❌ Couldn't Add Money",
                "Something went wrong.",
                "error"
            );

        }

        return;

    }


    refreshUser();

    const goal =
        result.goal;


    closeMoneyModal();

    loadGoals();


    if (result.completed) {

        if (
            typeof celebrateGoalConfetti ===
            "function"
        ) {

            celebrateGoalConfetti();

        }

        meloToast(
            "🎉 Goal Completed!",
            `${goal.name} has reached its target!`,
            "success"
        );

    }

    else {

        meloToast(
            "💜 Money Added!",
            `${formatMoney(result.amount)} added to ${goal.name}.`,
            "success"
        );

    }


    selectedGoal = null;

}


/* =====================================
   CLOSE MONEY MODAL
===================================== */

function closeMoneyModal() {

    if (!moneyModal) return;

    moneyModal.classList.remove("show");

    selectedGoal = null;

    if (moneyInput) {

        moneyInput.value = "";

    }

}


/* =====================================
   DELETE GOAL
===================================== */

function deleteGoal(id) {

    refreshUser();

    const goal =
        currentUser.goals.find(
            g =>
                Number(g.id) ===
                Number(id)
        );

    if (!goal) return;


    const confirmed =
        confirm(
            `Delete "${goal.name}"?`
        );

    if (!confirmed) return;


    if (
        typeof deleteGoalData ===
        "function"
    ) {

        deleteGoalData(id);

    } else {

        currentUser.goals =
            currentUser.goals.filter(
                g =>
                    Number(g.id) !==
                    Number(id)
            );

        saveFallbackUser();

    }


    refreshUser();

    loadGoals();


    meloToast(
        "🗑 Goal Deleted",
        "The goal was removed successfully.",
        "info"
    );

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
   DATE
===================================== */

function formatDate(date) {

    if (
        !date ||
        date === "No deadline"
    ) {

        return "No deadline";

    }

    const parsed =
        new Date(date);

    if (isNaN(parsed.getTime())) {

        return "No deadline";

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


/* =====================================
   GOAL MESSAGE
===================================== */

function getGoalMessage(percent) {

    if (percent >= 100)
        return "🎉 Goal completed! Amazing work!";

    if (percent >= 75)
        return "🔥 You're almost there!";

    if (percent >= 50)
        return "💜 Halfway there! Keep saving.";

    if (percent >= 25)
        return "🚀 Nice progress! Keep going.";

    return "🌱 Every little step counts.";

}


/* =====================================
   ESCAPE HTML
===================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================
   FALLBACK SAVE
===================================== */

function saveFallbackUser() {

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(currentUser)
    );

    let users =
        JSON.parse(
            localStorage.getItem(
                "meloUsers"
            )
        ) || [];

    const index =
        users.findIndex(
            u =>
                u.email ===
                currentUser.email
        );

    if (index !== -1) {

        users[index] = currentUser;

    }

    localStorage.setItem(
        "meloUsers",
        JSON.stringify(users)
    );

}


/* =====================================
   MODALS
===================================== */

if (goalModal) {

    goalModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                goalModal
            ) {

                closeGoalModal();

            }

        }
    );

}


if (moneyModal) {

    moneyModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                moneyModal
            ) {

                closeMoneyModal();

            }

        }
    );

}


/* =====================================
   ESCAPE KEY
===================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) return;

        if (
            goalModal &&
            goalModal.classList.contains(
                "show"
            )
        ) {

            closeGoalModal();

        }

        if (
            moneyModal &&
            moneyModal.classList.contains(
                "show"
            )
        ) {

            closeMoneyModal();

        }

    }
);


/* =====================================
   ENTER
===================================== */

if (moneyInput) {

    moneyInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                confirmAddMoney();

            }

        }
    );

}


console.log(
    "✅ MELOSAV Goals V8 Ready"
);
