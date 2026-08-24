/* =====================================
   MELOSAV GOALS V8
   GOALS + NOTIFICATIONS + MONEY
===================================== */

console.log("🎯 MELOSAV GOALS V8 LOADED");

let currentUser = null;
let selectedGoal = null;

const goalsContainer = document.getElementById("goalList");
const goalModal = document.getElementById("goalModal");
const goalName = document.getElementById("goalName");
const goalTarget = document.getElementById("goalAmount");
const moneyModal = document.getElementById("moneyModal");
const moneyInput = document.getElementById("moneyInput");


/* =====================================
   START
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof loadTheme === "function") {
        loadTheme();
    }

    currentUser = getCurrentUser();

    if (!currentUser) {
        location.href = "login.html";
        return;
    }

    currentUser.goals = Array.isArray(currentUser.goals)
        ? currentUser.goals
        : [];

    loadGoals();
    setupButtons();

});


/* =====================================
   SAVE USER
===================================== */

function saveUser() {

    updateCurrentUser(currentUser);

}


/* =====================================
   BUTTONS
===================================== */

function setupButtons() {

    const createBtn =
        document.getElementById("createGoalBtn");

    const fab =
        document.getElementById("fab");

    const cancelBtn =
        document.getElementById("cancelGoal");

    const saveBtn =
        document.getElementById("saveGoal");

    const cancelMoney =
        document.getElementById("cancelMoney");

    const confirmMoney =
        document.getElementById("confirmMoney");


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

    if (cancelMoney) {
        cancelMoney.addEventListener(
            "click",
            closeMoneyModal
        );
    }

    if (confirmMoney) {
        confirmMoney.addEventListener(
            "click",
            confirmAddMoney
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

}


/* =====================================
   CREATE GOAL
===================================== */

function createGoal() {

    const name =
        goalName?.value.trim();

    const target =
        Number(goalTarget?.value);


    if (!name) {

        meloToast(
            "🎯 Goal Name Missing",
            "Give your goal a name.",
            "warning"
        );

        return;
    }


    if (!target || target <= 0) {

        meloToast(
            "💰 Invalid Target",
            "Enter a valid target amount.",
            "error"
        );

        return;
    }


    const newGoal = {

        id: Date.now(),

        name: name,

        target: target,

        saved: 0,

        completed: false,

        createdAt:
            new Date().toISOString()

    };


    currentUser.goals.push(newGoal);

    saveUser();


    /* Notification only.
       Creating a goal is NOT a money transaction. */

    if (typeof notifyGoalCreated === "function") {

        notifyGoalCreated(name);

    } else {

        addNotification(
            "🎯 New Goal Created",
            `Melo just created a new savings goal: "${name}".`,
            "goal"
        );

    }


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

    if (!goalsContainer) return;

    goalsContainer.innerHTML = "";

    let totalSaved = 0;
    let completed = 0;


    if (
        !currentUser.goals ||
        currentUser.goals.length === 0
    ) {

        goalsContainer.innerHTML = `

            <div class="empty-state">

                <h2>🎯</h2>

                <h3>No Goals Yet</h3>

                <p>
                    Create your first savings goal
                    and start saving.
                </p>

            </div>

        `;

        updateSummary(0, 0, 0);

        return;
    }


    currentUser.goals.forEach(goal => {

        const target =
            Number(goal.target || 0);

        const saved =
            Number(goal.saved || 0);


        const percent =
            target > 0
                ? Math.min(
                    (saved / target) * 100,
                    100
                )
                : 0;


        totalSaved += saved;


        if (saved >= target && target > 0) {

            goal.completed = true;
            completed++;

        }


        const card =
            document.createElement("div");

        card.className = "goal-card";


        card.innerHTML = `

            <div class="goal-card-top">

                <div>

                    <h3>
                        🎯 ${escapeHTML(goal.name)}
                    </h3>

                    <small>
                        ${
                            goal.completed
                            ? "🎉 Completed"
                            : "Active Goal"
                        }
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

                ${
                    !goal.completed
                    ? `
                        <button
                            class="add-money-btn"
                            onclick="addMoney(${goal.id})">
                            💰 Add Money
                        </button>
                    `
                    : `
                        <button
                            class="add-money-btn"
                            disabled>
                            🎉 Completed
                        </button>
                    `
                }


                <button
                    class="delete-goal-btn"
                    onclick="deleteGoal(${goal.id})">

                    🗑 Delete

                </button>

            </div>

        `;


        goalsContainer.appendChild(card);

    });


    saveUser();

    updateSummary(
        currentUser.goals.length,
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
        document.getElementById("totalGoals");

    const completedElement =
        document.getElementById("completedGoals");

    const savedElement =
        document.getElementById("savedGoals");


    if (totalElement)
        totalElement.textContent = total;

    if (completedElement)
        completedElement.textContent = completed;

    if (savedElement)
        savedElement.textContent =
            formatMoney(saved);

}


/* =====================================
   ADD MONEY
===================================== */

function addMoney(id) {

    selectedGoal = id;

    const goal =
        currentUser.goals.find(
            g => g.id === id
        );


    if (!goal) return;


    if (!moneyModal || !moneyInput) {

        const amount =
            prompt(
                `How much do you want to add to ${goal.name}?`
            );

        if (amount) {

            processGoalMoney(
                Number(amount)
            );

        }

        return;
    }


    moneyInput.value = "";

    moneyModal.classList.add("show");

    setTimeout(() => {

        moneyInput.focus();

    }, 100);

}


/* =====================================
   CONFIRM MONEY
===================================== */

function confirmAddMoney() {

    if (!selectedGoal) return;

    const amount =
        Number(moneyInput?.value);


    processGoalMoney(amount);

}


/* =====================================
   PROCESS GOAL MONEY
===================================== */

function processGoalMoney(amount) {

    if (!amount || amount <= 0) {

        meloToast(
            "💰 Invalid Amount",
            "Enter a valid amount.",
            "error"
        );

        return;
    }


    const result =
        addGoalDeposit(
            selectedGoal,
            amount
        );


    if (!result || !result.success) {

        meloToast(
            "💸 Not Enough Balance",
            "You don't have enough money in your wallet.",
            "error"
        );

        return;
    }


    const goal =
        currentUser.goals.find(
            g => g.id === selectedGoal
        );


    currentUser =
        getCurrentUser();


    closeMoneyModal();

    loadGoals();


    if (
        result.completed &&
        typeof celebrateGoalConfetti === "function"
    ) {

        celebrateGoalConfetti();

    }


    meloToast(

        result.completed
            ? "🎉 Goal Completed!"
            : "💜 Money Added!",

        result.completed
            ? `${goal.name} reached its target!`
            : `${formatMoney(result.amount)} added to ${goal.name}.`,

        "success"

    );


    selectedGoal = null;

}


/* =====================================
   CLOSE MONEY MODAL
===================================== */

function closeMoneyModal() {

    if (!moneyModal) return;

    moneyModal.classList.remove("show");

    selectedGoal = null;

    if (moneyInput)
        moneyInput.value = "";

}


/* =====================================
   DELETE GOAL
===================================== */

function deleteGoal(id) {

    const goal =
        currentUser.goals.find(
            g => g.id === id
        );


    if (!goal) return;


    const confirmed =
        confirm(
            `Delete "${goal.name}"?`
        );


    if (!confirmed) return;


    const goalNameDeleted =
        goal.name;


    currentUser.goals =
        currentUser.goals.filter(
            g => g.id !== id
        );


    saveUser();


    if (typeof notifyGoalDeleted === "function") {

        notifyGoalDeleted(
            goalNameDeleted
        );

    } else {

        addNotification(
            "🗑 Goal Deleted",
            `Melo just removed the savings goal "${goalNameDeleted}".`,
            "goal"
        );

    }


    loadGoals();


    meloToast(
        "🗑 Goal Deleted",
        "The goal was removed successfully.",
        "info"
    );

}


/* =====================================
   HELPERS
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


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================
   MODAL OUTSIDE CLICK
===================================== */

if (goalModal) {

    goalModal.addEventListener(
        "click",
        event => {

            if (event.target === goalModal) {

                closeGoalModal();

            }

        }
    );

}


if (moneyModal) {

    moneyModal.addEventListener(
        "click",
        event => {

            if (event.target === moneyModal) {

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

        if (event.key !== "Escape") return;

        if (
            goalModal &&
            goalModal.classList.contains("show")
        ) {

            closeGoalModal();

        }

        if (
            moneyModal &&
            moneyModal.classList.contains("show")
        ) {

            closeMoneyModal();

        }

    }
);


/* =====================================
   ENTER TO ADD MONEY
===================================== */

if (moneyInput) {

    moneyInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                confirmAddMoney();

            }

        }
    );

}


console.log("✅ GOALS V8 READY");
