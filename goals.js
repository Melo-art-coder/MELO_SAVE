/* =====================================
   MELOSAV GOALS V5
===================================== */
console.log("GOALS JS LOADED");
let currentUser = JSON.parse(
    localStorage.getItem("meloCurrentUser")
);

const goalsContainer = document.getElementById("goalList");

const goalModal = document.getElementById("goalModal");

const goalName = document.getElementById("goalName");

const goalTarget = document.getElementById("goalAmount");

const goalDate = document.getElementById("goalDate");

let selectedGoal = null;


/* =====================================
   START
===================================== */

document.addEventListener("DOMContentLoaded",()=>{


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


});


/* =====================================
   SAVE USER
===================================== */

function saveUser(){

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(currentUser)
    );


    let users =
    JSON.parse(localStorage.getItem("meloUsers")) || [];


    let index =
    users.findIndex(
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
   MODAL
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


    let name =
    goalName.value.trim();


    let target =
    Number(goalTarget.value);


    if(!name || target<=0){


        meloToast(
            "Invalid Goal",
            "Enter goal name and amount",
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
        name+" added successfully",
        "success"
    );


}



/* =====================================
   LOAD GOALS
===================================== */


function loadGoals(){


    goalsContainer.innerHTML="";


    let completed=0;
    let savedTotal=0;



    if(currentUser.goals.length===0){


        goalsContainer.innerHTML=`

        <div class="empty-state">

        <h2>🎯</h2>

        <h3>No Goals Yet</h3>

        <p>
        Create your first savings goal.
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




    currentUser.goals.forEach(goal=>{


        let percent =
        Math.min(
            (goal.saved/goal.target)*100,
            100
        );



        savedTotal += goal.saved;



        if(percent>=100){

            completed++;

        }




        let card =
        document.createElement("div");


        card.className="goal-card";



        card.innerHTML=`

        <h3>
        ${goal.name}
        </h3>


        <p>
        ${formatMoney(goal.saved)}
        /
        ${formatMoney(goal.target)}
        </p>



        <div class="progress">

            <div class="progress-fill"
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
        savedTotal
    );


}



/* =====================================
   SUMMARY
===================================== */


function updateSummary(total,completed,saved){


    document.getElementById("totalGoals").innerText=total;


    document.getElementById("completedGoals").innerText=completed;


    document.getElementById("savedGoals").innerText=
    formatMoney(saved);


}



/* =====================================
   ADD MONEY
===================================== */


function addMoney(id){


    let amount =
    Number(prompt("Enter amount"));



    if(!amount || amount<=0)
    return;



    let goal =
    currentUser.goals.find(
        g=>g.id===id
    );



    if(!goal)
    return;



    if(currentUser.balance < amount){


        meloToast(
            "Insufficient Balance",
            "Not enough money",
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
    Number(currentUser.savings||0)+amount;



    saveUser();


    loadGoals();



    meloToast(
        "Saved 💜",
        formatMoney(amount)+" added",
        "success"
    );



}



/* =====================================
   DELETE
===================================== */


function deleteGoal(id){


    currentUser.goals =
    currentUser.goals.filter(
        g=>g.id!==id
    );


    saveUser();


    loadGoals();



    meloToast(
        "Deleted",
        "Goal removed",
        "info"
    );


}



/* =====================================
   MONEY FORMAT
===================================== */


function formatMoney(amount){

return "₦"+
Number(amount)
.toLocaleString(
"en-NG",
{
minimumFractionDigits:2
}
);

}



/* =====================================
   MELO AI
===================================== */


function getGoalMessage(percent){


if(percent>=100)
return "🎉 Goal completed! Amazing work!";


if(percent>=75)
return "🔥 Almost there! Keep pushing!";


if(percent>=50)
return "💜 Halfway done! Great progress!";


if(percent>=25)
return "🚀 Nice start! Keep saving!";


return "🌱 Every little step counts.";

}