/* =====================================
   MELOSAV STORAGE V6
   CENTRAL DATA + TRANSACTIONS SYSTEM
===================================== */

console.log("💜 STORAGE V6 LOADED");


/* =====================================
   STORAGE KEYS
===================================== */

const USERS_KEY = "meloUsers";
const CURRENT_USER_KEY = "meloCurrentUser";


/* =====================================
   GET ALL USERS
===================================== */

function getUsers(){

    return JSON.parse(
        localStorage.getItem(USERS_KEY)
    ) || [];

}


/* =====================================
   SAVE ALL USERS
===================================== */

function saveUsers(users){

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


/* =====================================
   GET CURRENT USER
===================================== */

function getCurrentUser(){

    return JSON.parse(
        localStorage.getItem(CURRENT_USER_KEY)
    );

}


/* =====================================
   SAVE CURRENT USER
===================================== */

function saveCurrentUser(user){

    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
    );

}


/* =====================================
   UPDATE CURRENT USER
===================================== */

function updateCurrentUser(user){

    if(!user) return;

    let users = getUsers();

    const index = users.findIndex(
        u => u.email === user.email
    );

    if(index !== -1){

        users[index] = user;

    }else{

        users.push(user);

    }

    saveUsers(users);

    saveCurrentUser(user);

}


/* =====================================
   CREATE USER DATA
===================================== */

function createUserData(user){

    return {

        ...user,

        balance: Number(user.balance || 0),

        income: Number(user.income || 0),

        expenses: Number(user.expenses || 0),

        savings: Number(user.savings || 0),

        dailyBudget: Number(user.dailyBudget || 0),

        goals: Array.isArray(user.goals)
            ? user.goals
            : [],

        transactions: Array.isArray(user.transactions)
            ? user.transactions
            : [],

        achievements: Array.isArray(user.achievements)
            ? user.achievements
            : [],

        streak: Number(user.streak || 0),

        notifications: Array.isArray(user.notifications)
            ? user.notifications
            : [],

        reminderSettings:
            user.reminderSettings || {

                enabled: true,

                spendingReminder: true,

                goalReminder: true,

                savingReminder: true

            }

    };

}


/* =====================================
   CENTRAL TRANSACTION FUNCTION
===================================== */

function addTransaction(
    title,
    amount,
    type,
    extraData = {}
){

    const user = getCurrentUser();

    if(!user) return null;


    if(!Array.isArray(user.transactions)){

        user.transactions = [];

    }


    const transaction = {

        id: Date.now(),

        title: title || "Transaction",

        amount: Number(amount || 0),

        type: type || "other",

        date: new Date().toISOString(),

        ...extraData

    };


    /*
       Add newest transaction
       to the beginning
    */

    user.transactions.unshift(
        transaction
    );


    /*
       Keep the transaction history
       connected to the current user
    */

    updateCurrentUser(user);


    return transaction;

}


/* =====================================
   ADD INCOME
===================================== */

function addIncome(amount, title = "Income"){

    const user = getCurrentUser();

    if(!user) return;


    amount = Number(amount);


    if(!amount || amount <= 0) return;


    user.income =
        Number(user.income || 0) + amount;


    user.balance =
        Number(user.balance || 0) + amount;


    /*
       Add transaction directly
       without saving twice
    */

    if(!Array.isArray(user.transactions)){

        user.transactions = [];

    }


    user.transactions.unshift({

        id: Date.now(),

        title: title,

        amount: amount,

        type: "income",

        date: new Date().toISOString()

    });


    updateCurrentUser(user);

}


/* =====================================
   ADD EXPENSE
===================================== */

function addExpense(amount, title = "Expense"){

    const user = getCurrentUser();

    if(!user) return;


    amount = Number(amount);


    if(!amount || amount <= 0) return;


    user.expenses =
        Number(user.expenses || 0) + amount;


    user.balance =
        Number(user.balance || 0) - amount;


    if(!Array.isArray(user.transactions)){

        user.transactions = [];

    }


    user.transactions.unshift({

        id: Date.now(),

        title: title,

        amount: amount,

        type: "expense",

        date: new Date().toISOString()

    });


    updateCurrentUser(user);

}


/* =====================================
   ADD SAVINGS
===================================== */

function addSavings(amount, title = "Savings"){

    const user = getCurrentUser();

    if(!user) return;


    amount = Number(amount);


    if(!amount || amount <= 0) return;


    /*
       Don't allow saving more
       than the wallet contains
    */

    if(
        Number(user.balance || 0)
        < amount
    ){

        return false;

    }


    user.savings =
        Number(user.savings || 0) + amount;


    user.balance =
        Number(user.balance || 0) - amount;


    if(!Array.isArray(user.transactions)){

        user.transactions = [];

    }


    user.transactions.unshift({

        id: Date.now(),

        title: title,

        amount: amount,

        type: "savings",

        date: new Date().toISOString()

    });


    updateCurrentUser(user);


    return true;

}


/* =====================================
   ADD GOAL DEPOSIT
===================================== */

function addGoalDeposit(
    goalId,
    amount
){

    const user = getCurrentUser();

    if(!user) return false;


    amount = Number(amount);


    if(!amount || amount <= 0){

        return false;

    }


    if(!Array.isArray(user.goals)){

        user.goals = [];

    }


    const goal = user.goals.find(
        goal => goal.id === goalId
    );


    if(!goal){

        return false;

    }


    const balance =
        Number(user.balance || 0);


    /*
       Wallet check
    */

    if(balance < amount){

        return false;

    }


    const target =
        Number(goal.target || 0);

    const saved =
        Number(goal.saved || 0);


    const remaining =
        Math.max(
            target - saved,
            0
        );


    if(remaining <= 0){

        goal.completed = true;

        updateCurrentUser(user);

        return false;

    }


    /*
       Never allow the goal
       to go above its target
    */

    const amountToAdd =
        Math.min(
            amount,
            remaining
        );


    goal.saved =
        saved + amountToAdd;


    user.balance =
        balance - amountToAdd;


    user.savings =
        Number(user.savings || 0)
        + amountToAdd;


    if(goal.saved >= target){

        goal.saved = target;

        goal.completed = true;

    }


    /*
       Record goal deposit
    */

    if(!Array.isArray(user.transactions)){

        user.transactions = [];

    }


    user.transactions.unshift({

        id: Date.now(),

        title:
            `Savings Goal: ${goal.name}`,

        amount: amountToAdd,

        type: "savings",

        category: "goal",

        goalId: goal.id,

        goalName: goal.name,

        date: new Date().toISOString()

    });


    updateCurrentUser(user);


    return {

        success: true,

        amount: amountToAdd,

        completed: goal.completed === true

    };

}


/* =====================================
   SAVE GOALS
===================================== */

function saveGoals(goals){

    const user = getCurrentUser();

    if(!user) return;


    user.goals =
        Array.isArray(goals)
            ? goals
            : [];


    updateCurrentUser(user);

}


/* =====================================
   GET GOALS
===================================== */

function getGoals(){

    const user = getCurrentUser();

    if(!user) return [];


    return Array.isArray(user.goals)
        ? user.goals
        : [];

}


/* =====================================
   ADD NOTIFICATION
===================================== */

function addNotification(
    title,
    message,
    type = "info"
){

    const user = getCurrentUser();

    if(!user) return;


    if(!Array.isArray(user.notifications)){

        user.notifications = [];

    }


    user.notifications.unshift({

        id: Date.now(),

        title: title,

        message: message,

        type: type,

        read: false,

        date: new Date().toISOString()

    });


    updateCurrentUser(user);

}


/* =====================================
   LOGOUT
===================================== */

function logout(){

    localStorage.removeItem(
        CURRENT_USER_KEY
    );

    location.href = "login.html";

}


console.log("✅ MELOSAV Storage V6 Ready");
