/* =====================================
   MELOSAV STORAGE V7
   CENTRAL DATA + WALLETS + TRANSACTIONS
===================================== */

console.log("💜 MELOSAV STORAGE V7 LOADED");

const USERS_KEY = "meloUsers";
const CURRENT_USER_KEY = "meloCurrentUser";


/* =====================================
   USER STORAGE
===================================== */

function getUsers(){

    return JSON.parse(
        localStorage.getItem(USERS_KEY)
    ) || [];

}


function saveUsers(users){

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


function getCurrentUser(){

    return JSON.parse(
        localStorage.getItem(CURRENT_USER_KEY)
    );

}


function saveCurrentUser(user){

    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
    );

}


function updateCurrentUser(user){

    if(!user) return;

    const users = getUsers();

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
   WALLET CONFIG
===================================== */

const MELOSAV_RATES = {

    NGN: 1,

    USD: 1500,

    EUR: 1750,

    GBP: 2000

};


function convertCurrency(
    amount,
    from,
    to
){

    amount = Number(amount) || 0;

    if(from === to){

        return amount;

    }

    const ngnValue =
        amount * MELOSAV_RATES[from];

    return ngnValue /
        MELOSAV_RATES[to];

}


/* =====================================
   CREATE USER DATA
===================================== */

function createUserData(user){

    return {

        ...user,

        balance:
            Number(user.balance || 0),

        income:
            Number(user.income || 0),

        expenses:
            Number(user.expenses || 0),

        savings:
            Number(user.savings || 0),

        dailyBudget:
            Number(user.dailyBudget || 0),

        goals:
            Array.isArray(user.goals)
                ? user.goals
                : [],

        transactions:
            Array.isArray(user.transactions)
                ? user.transactions
                : [],

        achievements:
            Array.isArray(user.achievements)
                ? user.achievements
                : [],

        streak:
            Number(user.streak || 0),

        notifications:
            Array.isArray(user.notifications)
                ? user.notifications
                : [],

        reminderSettings:
            user.reminderSettings || {

                enabled:true,
                spendingReminder:true,
                goalReminder:true,
                savingReminder:true

            },

        wallets:
            user.wallets || {

                NGN:{
                    balance:
                        Number(user.balance || 0)
                },

                USD:{
                    balance:0
                },

                EUR:{
                    balance:0
                },

                GBP:{
                    balance:0
                }

            },

        defaultCurrency:
            user.defaultCurrency || "NGN"

    };

}


/* =====================================
   ENSURE USER STRUCTURE
===================================== */

function ensureUserStructure(user){

    if(!user) return null;


    user.balance =
        Number(user.balance || 0);

    user.income =
        Number(user.income || 0);

    user.expenses =
        Number(user.expenses || 0);

    user.savings =
        Number(user.savings || 0);


    if(!Array.isArray(user.goals))
        user.goals = [];


    if(!Array.isArray(user.transactions))
        user.transactions = [];


    if(!Array.isArray(user.notifications))
        user.notifications = [];


    if(!user.wallets){

        user.wallets = {};

    }


    ["NGN","USD","EUR","GBP"]
        .forEach(currency => {

            if(!user.wallets[currency]){

                user.wallets[currency] = {
                    balance:0
                };

            }

            user.wallets[currency].balance =
                Number(
                    user.wallets[currency].balance || 0
                );

        });


    /*
       Keep old NGN balance compatible
    */

    user.wallets.NGN.balance =
        Number(user.balance || 0);


    return user;

}


/* =====================================
   CENTRAL TRANSACTION SYSTEM
===================================== */

function addTransaction(
    title,
    amount,
    type,
    extraData = {}
){

    const user =
        ensureUserStructure(
            getCurrentUser()
        );

    if(!user) return null;


    const transaction = {

        id:
            Date.now() +
            Math.random(),

        title:
            title || "Transaction",

        amount:
            Number(amount || 0),

        type:
            type || "other",

        date:
            new Date().toISOString(),

        ...extraData

    };


    user.transactions.unshift(
        transaction
    );


    updateCurrentUser(user);

    return transaction;

}


/* =====================================
   ADD INCOME
===================================== */

function addIncome(
    amount,
    title = "Income",
    currency = "NGN"
){

    const user =
        ensureUserStructure(
            getCurrentUser()
        );

    if(!user) return false;


    amount = Number(amount);


    if(!amount || amount <= 0)
        return false;


    currency =
        MELOSAV_RATES[currency]
            ? currency
            : "NGN";


    user.wallets[currency].balance += amount;


    /*
       NGN remains the main dashboard balance
    */

    if(currency === "NGN"){

        user.balance += amount;

    }


    user.income += amount;


    user.transactions.unshift({

        id:
            Date.now() +
            Math.random(),

        title:title,

        amount:amount,

        type:"income",

        currency:currency,

        date:new Date().toISOString()

    });


    updateCurrentUser(user);

    return true;

}


/* =====================================
   ADD EXPENSE
===================================== */

function addExpense(
    amount,
    title = "Expense",
    currency = "NGN"
){

    const user =
        ensureUserStructure(
            getCurrentUser()
        );

    if(!user) return false;


    amount = Number(amount);


    if(!amount || amount <= 0)
        return false;


    currency =
        MELOSAV_RATES[currency]
            ? currency
            : "NGN";


    const wallet =
        user.wallets[currency];


    if(wallet.balance < amount){

        return false;

    }


    wallet.balance -= amount;


    if(currency === "NGN"){

        user.balance -= amount;

    }


    user.expenses += amount;


    user.transactions.unshift({

        id:
            Date.now() +
            Math.random(),

        title:title,

        amount:amount,

        type:"expense",

        currency:currency,

        date:new Date().toISOString()

    });


    updateCurrentUser(user);

    return true;

}


/* =====================================
   ADD SAVINGS
===================================== */

function addSavings(
    amount,
    title = "Savings",
    currency = "NGN"
){

    const user =
        ensureUserStructure(
            getCurrentUser()
        );

    if(!user) return false;


    amount = Number(amount);


    if(!amount || amount <= 0)
        return false;


    currency =
        MELOSAV_RATES[currency]
            ? currency
            : "NGN";


    const wallet =
        user.wallets[currency];


    if(wallet.balance < amount){

        return false;

    }


    wallet.balance -= amount;


    if(currency === "NGN"){

        user.balance -= amount;

    }


    user.savings += amount;


    user.transactions.unshift({

        id:
            Date.now() +
            Math.random(),

        title:title,

        amount:amount,

        type:"savings",

        currency:currency,

        date:new Date().toISOString()

    });


    updateCurrentUser(user);

    return true;

}


/* =====================================
   GOAL DEPOSIT
===================================== */

function addGoalDeposit(
    goalId,
    amount,
    currency = "NGN"
){

    const user =
        ensureUserStructure(
            getCurrentUser()
        );

    if(!user) return false;


    amount = Number(amount);


    if(!amount || amount <= 0)
        return false;


    currency =
        MELOSAV_RATES[currency]
            ? currency
            : "NGN";


    const goal =
        user.goals.find(
            g => g.id === goalId
        );


    if(!goal){

        return {
            success:false,
            reason:"goal-not-found"
        };

    }


    const wallet =
        user.wallets[currency];


    if(wallet.balance < amount){

        return {
            success:false,
            reason:"insufficient-balance"
        };

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

        return {
            success:false,
            reason:"completed"
        };

    }


    const amountToAdd =
        Math.min(
            amount,
            remaining
        );


    goal.saved =
        saved + amountToAdd;


    wallet.balance -= amountToAdd;


    if(currency === "NGN"){

        user.balance -= amountToAdd;

    }


    user.savings += amountToAdd;


    if(goal.saved >= target){

        goal.saved = target;

        goal.completed = true;

    }


    user.transactions.unshift({

        id:
            Date.now() +
            Math.random(),

        title:
            `Savings Goal: ${goal.name}`,

        amount:amountToAdd,

        type:"savings",

        category:"goal",

        goalId:goal.id,

        goalName:goal.name,

        currency:currency,

        date:new Date().toISOString()

    });


    updateCurrentUser(user);


    return {

        success:true,

        amount:amountToAdd,

        completed:
            goal.completed === true

    };

}


/* =====================================
   TRANSFER MONEY
===================================== */

function transferMoney(
    amount,
    fromCurrency,
    toCurrency,
    title = "Transfer"
){

    const user =
        ensureUserStructure(
            getCurrentUser()
        );

    if(!user) return false;


    amount = Number(amount);


    if(!amount || amount <= 0)
        return false;


    if(
        !MELOSAV_RATES[fromCurrency] ||
        !MELOSAV_RATES[toCurrency]
    ){

        return false;

    }


    const source =
        user.wallets[fromCurrency];


    if(source.balance < amount){

        return false;

    }


    const converted =
        convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );


    source.balance -= amount;


    user.wallets[toCurrency].balance +=
        converted;


    if(fromCurrency === "NGN"){

        user.balance -= amount;

    }


    if(toCurrency === "NGN"){

        user.balance += converted;

    }


    user.transactions.unshift({

        id:
            Date.now() +
            Math.random(),

        title:title,

        amount:amount,

        convertedAmount:converted,

        type:"transfer",

        fromCurrency,

        toCurrency,

        date:new Date().toISOString()

    });


    updateCurrentUser(user);

    return {

        success:true,

        amount,

        converted

    };

}


/* =====================================
   SAVE GOALS
===================================== */

function saveGoals(goals){

    const user =
        getCurrentUser();

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

    const user =
        getCurrentUser();

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

    const user =
        ensureUserStructure(
            getCurrentUser()
        );

    if(!user) return;


    user.notifications.unshift({

        id:
            Date.now() +
            Math.random(),

        title:title,

        message:message,

        type:type,

        read:false,

        date:new Date().toISOString()

    });


    updateCurrentUser(user);

}


/* =====================================
   MARK NOTIFICATION READ
===================================== */

function markNotificationRead(id){

    const user =
        getCurrentUser();

    if(!user) return;


    const notification =
        user.notifications.find(
            n => n.id === id
        );


    if(notification){

        notification.read = true;

    }


    updateCurrentUser(user);

}


/* =====================================
   LOGOUT
===================================== */

function logout(){

    localStorage.removeItem(
        CURRENT_USER_KEY
    );

    location.href =
        "login.html";

}


console.log(
    "✅ MELOSAV STORAGE V7 READY"
);
