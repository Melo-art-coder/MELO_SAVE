/* =====================================
   MELOSAV GOALS V8
   GOALS + HOME SYNC + TRANSACTIONS
===================================== */

console.log("🎯 MELOSAV GOALS V8 LOADED");

let currentUser = null;
let selectedGoal = null;


/* =====================================
   ELEMENTS
===================================== */

let goalsContainer;
let goalModal;
let goalName;
let goalTarget;
let goalDeadline;
let moneyModal;
let moneyInput;


/* =====================================
   START
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if(typeof loadTheme === "function"){

            loadTheme();

        }


        currentUser =
            getCurrentUser();


        if(!currentUser){

            location.href =
                "login.html";

            return;

        }


        currentUser.goals =
            Array.isArray(currentUser.goals)
                ? currentUser.goals
                : [];


        cacheElements();

        loadGoals();

        setupButtons();

        setupModals();

    }
);


/* =====================================
   ELEMENTS
===================================== */

function cacheElements(){

    goalsContainer =
        document.getElementById(
            "goalList"
        );

    goalModal =
        document.getElementById(
            "goalModal"
        );

    goalName =
        document.getElementById(
            "goalName"
        );

    goalTarget =
        document.getElementById(
            "goalAmount"
        );

    /*
       New field.
       Supports either ID.
    */

    goalDeadline =
        document.getElementById(
            "goalDeadline"
        ) ||
        document.getElementById(
            "goalDate"
        );


    moneyModal =
        document.getElementById(
            "moneyModal"
        );

    moneyInput =
        document.getElementById(
            "moneyInput"
        );

}


/* =====================================
   BUTTONS
===================================== */

function setupButtons(){

    const createBtn =
        document.getElementById(
            "createGoalBtn"
        );

    const fab =
        document.getElementById(
            "fab"
        );

    const cancelBtn =
        document.getElementById(
            "cancelGoal"
        );

    const saveBtn =
        document.getElementById(
            "saveGoal"
        );

    const cancelMoney =
        document.getElementById(
            "cancelMoney"
        );

    const confirmMoney =
        document.getElementById(
            "confirmMoney"
        );


    if(createBtn){

        createBtn.onclick =
            openGoalModal;

    }


    if(fab){

        fab.onclick =
            openGoalModal;

    }


    if(cancelBtn){

        cancelBtn.onclick =
            closeGoalModal;

    }


    if(saveBtn){

        saveBtn.onclick =
            createGoal;

    }


    if(cancelMoney){

        cancelMoney.onclick =
            closeMoneyModal;

    }


    if(confirmMoney){

        confirmMoney.onclick =
            confirmAddMoney;

    }

}


/* =====================================
   CREATE GOAL MODAL
===================================== */

function openGoalModal(){

    if(!goalModal) return;

    goalModal.classList.add(
        "show"
    );


    setTimeout(
        () => {

            goalName?.focus();

        },
        100
    );

}


function closeGoalModal(){

    if(!goalModal) return;

    goalModal.classList.remove(
        "show"
    );


    if(goalName)
        goalName.value = "";


    if(goalTarget)
        goalTarget.value = "";


    if(goalDeadline)
        goalDeadline.value = "";

}


/* =====================================
   CREATE GOAL
===================================== */

function createGoal(){

    const name =
        goalName?.value.trim();


    const target =
        Number(
            goalTarget?.value
        );


    const deadline =
        goalDeadline?.value ||
        "No deadline";


    if(!name){

        meloToast(
            "🎯 Goal Name Missing",
            "Give your savings goal a name.",
            "warning"
        );

        return;

    }


    if(
        !target ||
        target <= 0
    ){

        meloToast(
            "💰 Invalid Amount",
            "Enter a valid target amount.",
            "error"
        );

        return;

    }


    const newGoal = {

        id:
            Date.now() +
            Math.random(),

        name:name,

        target:target,

        saved:0,

        deadline:deadline,

        completed:false,

        createdAt:
            new Date().toISOString()

    };


    currentUser.goals.push(
        newGoal
    );


    updateCurrentUser(
        currentUser
    );


    loadGoals();


    closeGoalModal();


    /*
       Record the creation itself
       as a non-money activity.
    */

    addTransaction(
        `Created Goal: ${name}`,
        0,
        "goal_created",
        {
            goalId:newGoal.id,
            goalName:name
        }
    );


    meloToast(
        "🎯 Goal Created!",
        `${name} is ready. Start saving towards it! 💜`,
        "success"
    );

}


/* =====================================
   LOAD GOALS
===================================== */

function loadGoals(){

    if(!goalsContainer)
        return;


    currentUser =
        getCurrentUser();


    currentUser.goals =
        Array.isArray(
            currentUser.goals
        )
            ? currentUser.goals
            : [];


    goalsContainer.innerHTML =
        "";


    let totalSaved = 0;
    let completed = 0;


    if(
        currentUser.goals.length === 0
    ){

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


        updateSummary(
            0,
            0,
            0
        );

        return;

    }


    currentUser.goals.forEach(
        goal => {

            const target =
                Number(
                    goal.target
                ) || 0;


            const saved =
                Number(
                    goal.saved
                ) || 0;


            const percent =
                target > 0
                    ? Math.min(
                        (saved / target) *
                        100,
                        100
                    )
                    : 0;


            totalSaved += saved;


            if(
                saved >= target &&
                target > 0
            ){

                completed++;

                goal.completed =
                    true;

            }


            const card =
                document.createElement(
                    "div"
                );


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
                            ${
                                formatDeadline(
                                    goal.deadline ||
                                    goal.date
                                )
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
                        /
                        ${formatMoney(target)}
                    </span>

                </div>


                <div class="progress">

                    <div
                        class="progress-fill"
                        style="
                            width:${percent}%
                        ">
                    </div>

                </div>


                <p class="goal-ai">

                    ${getGoalMessage(percent)}

                </p>


                <div class="goal-actions">

                    <button
                        class="add-money-btn"
                        onclick="
                            addMoney(${goal.id})
                        ">

                        💰 Add Money

                    </button>


                    <button
                        class="delete-goal-btn"
                        onclick="
                            deleteGoal(${goal.id})
                        ">

                        🗑 Delete

                    </button>

                </div>

            `;


            goalsContainer.appendChild(
                card
            );

        }
    );


    updateCurrentUser(
        currentUser
    );


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
){

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


    if(totalElement)
        totalElement.textContent =
            total;


    if(completedElement)
        completedElement.textContent =
            completed;


    if(savedElement)
        savedElement.textContent =
            formatMoney(saved);

}


/* =====================================
   ADD MONEY
===================================== */

function addMoney(id){

    selectedGoal = id;


    const goal =
        currentUser.goals.find(
            g => g.id === id
        );


    if(!goal){

        meloToast(
            "Goal Not Found",
            "This goal could not be found.",
            "error"
        );

        return;

    }


    if(
        !moneyModal ||
        !moneyInput
    ){

        console.error(
            "Money modal missing."
        );

        return;

    }


    moneyInput.value =
        "";


    moneyModal.classList.add(
        "show"
    );


    setTimeout(
        () => {

            moneyInput.focus();

        },
        100
    );

}


/* =====================================
   CONFIRM ADD MONEY
===================================== */

function confirmAddMoney(){

    if(selectedGoal === null)
        return;


    const amount =
        Number(
            moneyInput.value
        );


    if(
        !amount ||
        amount <= 0
    ){

        meloToast(
            "💰 Invalid Amount",
            "Enter a valid amount to save.",
            "error"
        );

        return;

    }


    const result =
        addGoalDeposit(
            selectedGoal,
            amount,
            "NGN"
        );


    if(!result.success){

        if(
            result.reason ===
            "insufficient-balance"
        ){

            meloToast(
                "💸 Insufficient Balance",
                "You don't have enough money in your wallet.",
                "error"
            );

        }

        else if(
            result.reason ===
            "completed"
        ){

            meloToast(
                "🎉 Already Completed!",
                "This goal has reached its target.",
                "info"
            );

        }

        else{

            meloToast(
                "❌ Something went wrong",
                "The money could not be added.",
                "error"
            );

        }

        return;

    }


    currentUser =
        getCurrentUser();


    closeMoneyModal();


    loadGoals();


    /*
       Tell other pages that
       data changed.
    */

    window.dispatchEvent(
        new Event(
            "meloDataUpdated"
        )
    );


    if(result.completed){

        if(
            typeof celebrateGoalConfetti ===
            "function"
        ){

            celebrateGoalConfetti();

        }


        meloToast(
            "🎉 Goal Completed!",
            "You reached your savings goal!",
            "success"
        );

    }else{

        meloToast(
            "💜 Money Added!",
            `${formatMoney(result.amount)} added to your goal.`,
            "success"
        );

    }


    selectedGoal = null;

}


/* =====================================
   DELETE GOAL
===================================== */

function deleteGoal(id){

    currentUser =
        getCurrentUser();


    const goal =
        currentUser.goals.find(
            g => g.id === id
        );


    if(!goal)
        return;


    const confirmed =
        confirm(
            `Delete "${goal.name}"?`
        );


    if(!confirmed)
        return;


    currentUser.goals =
        currentUser.goals.filter(
            g => g.id !== id
        );


    updateCurrentUser(
        currentUser
    );


    addTransaction(
        `Deleted Goal: ${goal.name}`,
        0,
        "goal_deleted",
        {
            goalId:goal.id,
            goalName:goal.name
        }
    );


    loadGoals();


    meloToast(
        "🗑 Goal Deleted",
        "The goal was removed successfully.",
        "info"
    );

}


/* =====================================
   CLOSE MONEY MODAL
===================================== */

function closeMoneyModal(){

    if(moneyModal){

        moneyModal.classList.remove(
            "show"
        );

    }


    selectedGoal = null;


    if(moneyInput)
        moneyInput.value = "";

}


/* =====================================
   MODALS
===================================== */

function setupModals(){

    if(goalModal){

        goalModal.addEventListener(
            "click",
            event => {

                if(
                    event.target ===
                    goalModal
                ){

                    closeGoalModal();

                }

            }
        );

    }


    if(moneyModal){

        moneyModal.addEventListener(
            "click",
            event => {

                if(
                    event.target ===
                    moneyModal
                ){

                    closeMoneyModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if(
                event.key !==
                "Escape"
            )
                return;


            closeGoalModal();

            closeMoneyModal();

        }
    );


    if(moneyInput){

        moneyInput.addEventListener(
            "keydown",
            event => {

                if(
                    event.key ===
                    "Enter"
                ){

                    event.preventDefault();

                    confirmAddMoney();

                }

            }
        );

    }

}


/* =====================================
   HELPERS
===================================== */

function formatMoney(amount){

    return "₦" +
        Number(amount || 0)
            .toLocaleString(
                "en-NG",
                {
                    minimumFractionDigits:2,
                    maximumFractionDigits:2
                }
            );

}


function formatDeadline(date){

    if(
        !date ||
        date === "No deadline"
    ){

        return "No withdrawal deadline";

    }


    const parsed =
        new Date(date);


    if(
        isNaN(
            parsed.getTime()
        )
    ){

        return "No withdrawal deadline";

    }


    return `
        🔒 Withdraw after
        ${parsed.toLocaleDateString(
            "en-NG",
            {
                day:"numeric",
                month:"short",
                year:"numeric"
            }
        )}
    `;

}


function getGoalMessage(percent){

    if(percent >= 100)
        return "🎉 Goal completed! Amazing work!";


    if(percent >= 75)
        return "🔥 You're almost there!";


    if(percent >= 50)
        return "💜 Halfway there! Keep saving.";


    if(percent >= 25)
        return "🚀 Nice progress! Keep going.";


    return "🌱 Every little step counts.";

}


function escapeHTML(value){

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


console.log(
    "✅ MELOSAV Goals V8 Ready"
);
