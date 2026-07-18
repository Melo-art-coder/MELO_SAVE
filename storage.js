/* =====================================
   MELOSAV STORAGE V5
===================================== */

console.log("STORAGE V5 LOADED");

/* ==========================
   STORAGE KEYS
========================== */

const USERS_KEY = "meloUsers";
const CURRENT_USER_KEY = "meloCurrentUser";


/* ==========================
   GET ALL USERS
========================== */

function getUsers(){

    return JSON.parse(
        localStorage.getItem(USERS_KEY)
    ) || [];

}


/* ==========================
   SAVE ALL USERS
========================== */

function saveUsers(users){

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


/* ==========================
   GET CURRENT USER
========================== */

function getCurrentUser(){

    return JSON.parse(
        localStorage.getItem(CURRENT_USER_KEY)
    );

}


/* ==========================
   SAVE CURRENT USER
========================== */

function saveCurrentUser(user){

    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
    );

}


/* ==========================
   UPDATE CURRENT USER
========================== */

function updateCurrentUser(user){

    let users = getUsers();

    const index = users.findIndex(
        u => u.email === user.email
    );

    if(index !== -1){

        users[index] = user;

    }

    saveUsers(users);

    saveCurrentUser(user);

}


/* ==========================
   CREATE USER DATA
========================== */

function createUserData(user){

    return{

        ...user,

        balance:0,

        income:0,

        expenses:0,

        savings:0,

        dailyBudget:0,

        goals:[],

        transactions:[],

        achievements:[],

        streak:0,

        notifications:[]

    };

}


/* ==========================
   ADD TRANSACTION
========================== */

function addTransaction(title,amount,type){

    const user = getCurrentUser();

    if(!user) return;

    user.transactions.unshift({

        id:Date.now(),

        title,

        amount,

        type,

        date:new Date().toLocaleString()

    });

    updateCurrentUser(user);

}


/* ==========================
   ADD INCOME
========================== */

function addIncome(amount){

    const user = getCurrentUser();

    amount = Number(amount);

    user.income += amount;

    user.balance += amount;

    addTransaction(
        "Income",
        amount,
        "income"
    );

    updateCurrentUser(user);

}


/* ==========================
   ADD EXPENSE
========================== */

function addExpense(amount){

    const user = getCurrentUser();

    amount = Number(amount);

    user.expenses += amount;

    user.balance -= amount;

    addTransaction(
        "Expense",
        amount,
        "expense"
    );

    updateCurrentUser(user);

}


/* ==========================
   ADD SAVINGS
========================== */

function addSavings(amount){

    const user = getCurrentUser();

    amount = Number(amount);

    user.savings += amount;

    user.balance -= amount;

    addTransaction(
        "Savings",
        amount,
        "savings"
    );

    updateCurrentUser(user);

}


/* ==========================
   SAVE GOALS
========================== */

function saveGoals(goals){

    const user = getCurrentUser();

    user.goals = goals;

    updateCurrentUser(user);

}


/* ==========================
   GET GOALS
========================== */

function getGoals(){

    const user = getCurrentUser();

    return user.goals || [];

}


/* ==========================
   LOGOUT
========================== */

function logout(){

    localStorage.removeItem(
        CURRENT_USER_KEY
    );

    location.href = "login.html";

}