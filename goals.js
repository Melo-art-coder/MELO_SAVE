/* =====================================
   MELOSAV GOALS V6
===================================== */

console.log("GOALS V6 LOADED");

let currentUser = JSON.parse(
    localStorage.getItem("meloCurrentUser")
);

let selectedGoal = null;

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


/* =====================================
   APP START
===================================== */

document.addEventListener("DOMContentLoaded",()=>{

    if(typeof loadTheme==="function"){
        loadTheme();
    }

    if(!currentUser){

        location.href="login.html";
        return;

    }

    currentUser.goals =
    currentUser.goals || [];

    loadGoals();

    setupButtons();

});


/* =====================================
   BUTTON EVENTS
===================================== */

function setupButtons(){

    document
    .getElementById("createGoalBtn")
    .onclick=openGoalModal;

    document
    .getElementById("fab")
    .onclick=openGoalModal;

    document
    .getElementById("cancelGoal")
    .onclick=closeGoalModal;

    document
    .getElementById("saveGoal")
    .onclick=createGoal;

}


/* =====================================
   SAVE USER
===================================== */

function saveUser(){

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(currentUser)
    );

    let users =
    JSON.parse(
        localStorage.getItem("meloUsers")
    ) || [];

    const index =
    users.findIndex(user=>

        user.email===currentUser.email

    );

    if(index!==-1){

        users[index]=currentUser;

    }

    localStorage.setItem(

        "meloUsers",

        JSON.stringify(users)

    );

}


/* =====================================
   GOAL MODAL
===================================== */

function openGoalModal(){

    goalModal.classList.add("show");

}

function closeGoalModal(){

    goalModal.classList.remove("show");

    goalName.value="";

    goalTarget.value="";

    goalDate.value="";

}


/* =====================================
   CREATE GOAL
===================================== */

function createGoal(){

    const name=
    goalName.value.trim();

    const target=
    Number(goalTarget.value);

    if(!name || target<=0){

        meloToast(

            "Invalid Goal",

            "Enter a goal name and amount.",

            "error"

        );

        return;

    }

    currentUser.goals.push({

        id:Date.now(),

        name:name,

        target:target,

        saved:0,

        date:goalDate.value || "No deadline"

    });

    saveUser();

    closeGoalModal();

    loadGoals();

    meloToast(

        "Goal Created 🎯",

        name+" created successfully.",

        "success"

    );

}


/* =====================================
   LOAD GOALS
===================================== */

function loadGoals(){

    goalsContainer.innerHTML="";

    let totalSaved=0;

    let completed=0;

    if(currentUser.goals.length===0){

        goalsContainer.innerHTML=`

        <div class="empty-state">

            <h2>🎯</h2>

            <h3>No Goals Yet</h3>

            <p>Create your first savings goal.</p>

        </div>

        `;

        updateSummary(

            0,

            0,

            0

        );

        return;

    }

    currentUser.goals.forEach(goal=>{

        const percent=Math.min(

            (goal.saved/goal.target)*100,

            100

        );

        totalSaved+=goal.saved;

        if(percent>=100){

            completed++;

        }

        const card=document.createElement("div");

        card.className="goal-card";

        card.innerHTML=`

            <h3>${goal.name}</h3>

            <p>

                ${formatMoney(goal.saved)}

                /

                ${formatMoney(goal.target)}

            </p>

            <div class="progress">

                <div

                class="progress-fill"

                style="width:${percent}%">

                </div>

            </div>

            <span>

                ${percent.toFixed(0)}%

            </span>

            <p class="goal-ai">

                ${getGoalMessage(percent)}

            </p>

            <div class="goal-actions">

                <button onclick="addMoney(${goal.id})">

                    ➕ Add

                </button>

                <button onclick="deleteGoal(${goal.id})">

                    🗑 Delete

                </button>

            </div>

        `;

        goalsContainer.appendChild(card);

    });

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

    document.getElementById(

        "totalGoals"

    ).textContent=total;

    document.getElementById(

        "completedGoals"

    ).textContent=completed;

    document.getElementById(

        "savedGoals"

    ).textContent=formatMoney(saved);

}
/* =====================================
   ADD MONEY
===================================== */

function addMoney(id){

    selectedGoal = id;

    document
    .getElementById("moneyInput")
    .value = "";

    document
    .getElementById("moneyModal")
    .classList.add("show");

    document
    .getElementById("moneyInput")
    .focus();

}


/* =====================================
   CONFIRM MONEY
===================================== */

function confirmAddMoney(){

    const amount = Number(

        document
        .getElementById("moneyInput")
        .value

    );

    if(!amount || amount <= 0){

        meloToast(
            "Invalid Amount",
            "Enter a valid amount.",
            "error"
        );

        return;

    }

    const goal = currentUser.goals.find(

        g => g.id === selectedGoal

    );

    if(!goal) return;

    if(currentUser.balance < amount){

        meloToast(
            "Insufficient Balance",
            "You don't have enough balance.",
            "error"
        );

        return;

    }

    goal.saved += amount;

    if(goal.saved > goal.target){

        goal.saved = goal.target;

    }

    currentUser.balance -= amount;

    currentUser.savings =
    Number(currentUser.savings || 0) + amount;

    saveUser();

    loadGoals();

    closeMoneyModal();

    meloToast(
        "Money Added 💜",
        formatMoney(amount) + " saved.",
        "success"
    );

}


/* =====================================
   CLOSE MONEY MODAL
===================================== */

function closeMoneyModal(){

    document
    .getElementById("moneyModal")
    .classList.remove("show");

}


/* =====================================
   DELETE GOAL
===================================== */

function deleteGoal(id){

    if(!confirm("Delete this goal?")){

        return;

    }

    currentUser.goals =
    currentUser.goals.filter(

        goal => goal.id !== id

    );

    saveUser();

    loadGoals();

    meloToast(
        "Goal Deleted",
        "Goal removed successfully.",
        "info"
    );

}


/* =====================================
   FORMAT MONEY
===================================== */

function formatMoney(amount){

    return "₦" +

    Number(amount)

    .toLocaleString(

        "en-NG",

        {

            minimumFractionDigits:2,

            maximumFractionDigits:2

        }

    );

}


/* =====================================
   GOAL AI
===================================== */

function getGoalMessage(percent){

    if(percent >= 100){

        return "🎉 Goal completed! Amazing work!";

    }

    if(percent >= 75){

        return "🔥 You're almost there!";

    }

    if(percent >= 50){

        return "💜 Halfway done! Keep saving.";

    }

    if(percent >= 25){

        return "🚀 Nice progress!";

    }

    return "🌱 Every little step counts.";

}
/* =====================================
   GOAL CELEBRATION
===================================== */

function celebrateGoal(goal){

    if(goal.saved >= goal.target && !goal.completed){

        goal.completed = true;

        saveUser();

        if(typeof celebrateGoalConfetti === "function"){

            celebrateGoalConfetti();

        }

        meloToast(
            "🎉 Goal Completed!",
            `${goal.name} has been completed.`,
            "success"
        );

    }

}


/* =====================================
   REFRESH HOME DATA
===================================== */

function refreshHomeData(){

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(currentUser)
    );

}


/* =====================================
   AUTO SAVE
===================================== */

window.addEventListener("beforeunload",()=>{

    saveUser();

});


/* =====================================
   KEYBOARD SUPPORT
===================================== */

document.addEventListener("keydown",(e)=>{

    const modal =
    document.getElementById("moneyModal");

    if(!modal) return;

    if(
        e.key==="Escape" &&
        modal.classList.contains("show")
    ){

        closeMoneyModal();

    }

    if(
        e.key==="Enter" &&
        modal.classList.contains("show")
    ){

        confirmAddMoney();

    }

});


/* =====================================
   UPDATE GOAL AFTER SAVING
===================================== */

const oldConfirm = confirmAddMoney;

confirmAddMoney = function(){

    oldConfirm();

    const goal =
    currentUser.goals.find(
        g=>g.id===selectedGoal
    );

    if(goal){

        celebrateGoal(goal);

    }

    refreshHomeData();

};


/* =====================================
   GOALS READY
===================================== */

console.log("✅ MELOSAV Goals V6 Ready");