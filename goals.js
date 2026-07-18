/* =====================================
   MELOSAV GOALS V5
===================================== */

let currentUser = JSON.parse(localStorage.getItem("meloCurrentUser"));

const goalsContainer = document.getElementById("goalsContainer");
const goalModal = document.getElementById("goalModal");
const goalName = document.getElementById("goalName");
const goalTarget = document.getElementById("goalTarget");
const moneyModal=document.getElementById("moneyModal");

let selectedGoal=null;

/* =====================================
   START
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    if(typeof loadTheme==="function"){
        loadTheme();
    }

    if(!currentUser){
        location.href="login.html";
        return;
    }

    if(!currentUser.goals){
        currentUser.goals=[];
    }

    loadGoals();

});


/* =====================================
   SAVE USER
===================================== */

function saveUser(){

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(currentUser)
    );

    let users=JSON.parse(localStorage.getItem("meloUsers")) || [];

    const index=users.findIndex(
        user=>user.email===currentUser.email
    );

    if(index!==-1){

        users[index]=currentUser;

        localStorage.setItem(
            "meloUsers",
            JSON.stringify(users)
        );

    }

}


/* =====================================
   OPEN MODAL
===================================== */

function openGoalModal(){

    goalModal.classList.add("show");

}


/* =====================================
   CLOSE MODAL
===================================== */

function closeGoalModal(){

    goalModal.classList.remove("show");

    goalName.value="";
    goalTarget.value="";

}


/* =====================================
   CREATE GOAL
===================================== */

function createGoal(){

    const name=goalName.value.trim();
    const target=Number(goalTarget.value);

    if(name==="" || target<=0){

        meloToast(
            "Invalid Goal",
            "Enter a goal name and target.",
            "error"
        );

        return;

    }

    currentUser.goals.push({

        id:Date.now(),

        name:name,

        target:target,

        saved:0,

        created:new Date().toLocaleDateString()

    });

    saveUser();

    closeGoalModal();

    loadGoals();

    meloToast(
        "Goal Created 🎉",
        `${name} added successfully.`,
        "success"
    );

}


/* =====================================
   LOAD GOALS
===================================== */

function loadGoals(){

    goalsContainer.innerHTML="";

    if(currentUser.goals.length===0){

        goalsContainer.innerHTML=`
        <div class="empty-card">
            <h3>No Goals Yet</h3>
            <p>Create your first savings goal.</p>
        </div>
        `;

        return;

    }

    currentUser.goals.forEach(goal=>{

        const percent=Math.min(
            (goal.saved/goal.target)*100,
            100
        );

        const card=document.createElement("div");

        card.className="goal-card";

        card.innerHTML=`

        <h3>${goal.name}</h3>

        <p>${formatMoney(goal.saved)}
        / ${formatMoney(goal.target)}</p>

        <div class="progress">

            <div class="progress-fill"
            style="width:${percent}%">
            </div>

        </div>

        <span>${percent.toFixed(0)}%</span>
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

}


/* =====================================
   ADD MONEY
===================================== */

function addMoney(id){

    const amount=Number(
        prompt("Enter amount")
    );

    if(!amount || amount<=0) return;

    const goal=currentUser.goals.find(
        g=>g.id===id
    );

    if(!goal) return;

    if(currentUser.balance<amount){

        meloToast(
            "Insufficient Balance",
            "You don't have enough money.",
            "error"
        );

        return;

    }

    goal.saved+=amount;

    currentUser.balance-=amount;

    currentUser.savings=
        Number(currentUser.savings||0)+amount;

    currentUser.transactions=
        currentUser.transactions||[];

    currentUser.transactions.push({

        title:`Saved to ${goal.name}`,

        amount:amount,

        date:new Date().toLocaleDateString()

    });

    saveUser();

    loadGoals();

    if(goal.saved >= goal.target){

    goal.saved = goal.target;

    saveUser();

    if(typeof celebrateGoal === "function"){
        celebrateGoal();
    }

    meloToast(
        "🏆 Goal Achieved!",
        `${goal.name} completed successfully!`,
        "success"
    );

}else{

        meloToast(
            "Money Added",
            formatMoney(amount)+" saved.",
            "success"
        );

    }


/* =====================================
   DELETE GOAL
===================================== */

function deleteGoal(id){

    currentUser.goals=
        currentUser.goals.filter(
            goal=>goal.id!==id
        );

    saveUser();

    loadGoals();

    meloToast(
        "Deleted",
        "Goal removed.",
        "info"
    );

}


/* =====================================
   FORMAT MONEY
===================================== */

function formatMoney(amount){

    return "₦"+Number(amount).toLocaleString(
        "en-NG",
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    );

}
/* =====================================
   MELO AI ENCOURAGEMENT
===================================== */

function getGoalMessage(percent){

    if(percent >= 100){

        return "🎉 Congratulations! You achieved your goal!";

    }

    if(percent >= 75){

        return "🔥 You're almost there! Keep going!";

    }

    if(percent >= 50){

        return "💜 Amazing! You're halfway there.";

    }

    if(percent >= 25){

        return "🚀 Nice progress! Keep saving.";

    }

    return "🌱 Every little saving counts.";
}