/* =====================================================
   MELOSAV — CORE STORAGE SYSTEM
   Version 2.0
===================================================== */

const MELO_STORAGE = {

    USERS: "meloUsers",

    CURRENT_USER: "meloCurrentUser",

    THEME: "meloTheme"

};


/* =====================================================
   SAFE JSON
===================================================== */

function readJSON(key, fallback = null) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {

            return fallback;

        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            `MELOSAV storage error: ${key}`,
            error
        );

        return fallback;

    }

}


/* =====================================================
   USERS
===================================================== */

function getUsers() {

    return readJSON(
        MELO_STORAGE.USERS,
        []
    );

}


function saveUsers(users) {

    localStorage.setItem(

        MELO_STORAGE.USERS,

        JSON.stringify(users)

    );

}


/* =====================================================
   CURRENT USER
===================================================== */

function getCurrentUser() {

    return readJSON(
        MELO_STORAGE.CURRENT_USER,
        null
    );

}


function saveCurrentUser(user) {

    if (!user) {

        return;

    }

    localStorage.setItem(

        MELO_STORAGE.CURRENT_USER,

        JSON.stringify(user)

    );

}


/* =====================================================
   FIND CURRENT USER INDEX
===================================================== */

function findUserIndex(user) {

    if (!user) {

        return -1;

    }

    const users =
        getUsers();


    return users.findIndex(
        storedUser => {

            if (
                user.id &&
                storedUser.id
            ) {

                return (
                    storedUser.id ===
                    user.id
                );

            }

            return (
                storedUser.email ===
                user.email
            );

        }
    );

}


/* =====================================================
   SAVE USER EVERYWHERE
===================================================== */

function saveUser(user) {

    if (!user) {

        return false;

    }


    const users =
        getUsers();


    const index =
        findUserIndex(user);


    if (index === -1) {

        users.push(user);

    } else {

        users[index] =
            user;

    }


    saveUsers(users);

    saveCurrentUser(user);

    return true;

}


/* =====================================================
   UPDATE CURRENT USER
===================================================== */

function updateCurrentUser(updates) {

    const user =
        getCurrentUser();


    if (!user) {

        return null;

    }


    Object.assign(
        user,
        updates
    );


    saveUser(user);


    return user;

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {

    localStorage.removeItem(
        MELO_STORAGE.CURRENT_USER
    );

}


/* =====================================================
   CHECK LOGIN
===================================================== */

function requireUser() {

    const user =
        getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return null;

    }


    return user;

}


/* =====================================================
   MONEY
===================================================== */

function normalizeMoney(value) {

    const number =
        Number(value);


    if (
        !Number.isFinite(number)
    ) {

        return 0;

    }


    return Math.max(
        0,
        number
    );

}


/* =====================================================
   TRANSACTION ID
===================================================== */

function createTransactionId() {

    return (
        "TXN-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()
    );

}


/* =====================================================
   ADD TRANSACTION
===================================================== */

function addTransaction(transaction) {

    const user =
        getCurrentUser();


    if (!user) {

        return null;

    }


    if (
        !Array.isArray(
            user.transactions
        )
    ) {

        user.transactions = [];

    }


    const newTransaction = {

        id:
            transaction.id ||
            createTransactionId(),

        type:
            transaction.type ||
            "expense",

        category:
            transaction.category ||
            "Other",

        title:
            transaction.title ||
            transaction.category ||
            "Transaction",

        amount:
            normalizeMoney(
                transaction.amount
            ),

        description:
            transaction.description ||
            "",

        date:
            transaction.date ||
            new Date().toISOString(),

        status:
            transaction.status ||
            "completed"

    };


    user.transactions.unshift(
        newTransaction
    );


    recalculateUser(user);


    saveUser(user);


    return newTransaction;

}


/* =====================================================
   RECALCULATE USER FINANCES
===================================================== */

function recalculateUser(user) {

    if (!user) {

        return;

    }


    const transactions =
        Array.isArray(
            user.transactions
        )
            ? user.transactions
            : [];


    let income =
        0;

    let expenses =
        0;


    transactions.forEach(
        transaction => {

            const amount =
                normalizeMoney(
                    transaction.amount
                );


            if (
                transaction.type ===
                "income"
            ) {

                income += amount;

            } else {

                expenses += amount;

            }

        }
    );


    user.income =
        income;


    user.expenses =
        expenses;


    user.balance =
        income -
        expenses;


    if (
        !Number.isFinite(
            user.balance
        )
    ) {

        user.balance = 0;

    }


    return user;

}


/* =====================================================
   FORMAT MONEY
===================================================== */

function formatMoney(
    amount,
    currency = "₦"
) {

    const value =
        Number(amount) || 0;


    return (
        currency +
        value.toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    );

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatTransactionDate(
    date
) {

    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "Unknown date";

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


/* =====================================================
   FORMAT TIME
===================================================== */

function formatTransactionTime(
    date
) {

    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "";

    }


    return parsed.toLocaleTimeString(
        "en-NG",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =====================================================
   GENERATE MELO ID
===================================================== */

function generateMeloId(user) {

    if (
        user.meloId
    ) {

        return user.meloId;

    }


    const random =
        Math.floor(
            100000 +
            Math.random() *
            900000
        );


    user.meloId =
        `MELO-${random}`;


    return user.meloId;

}


/* =====================================================
   ENSURE USER STRUCTURE
===================================================== */

function normalizeUser(user) {

    if (!user) {

        return null;

    }


    user.id =
        user.id ||
        (
            "USER-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 7)
        );


    user.name =
        user.name ||
        user.fullName ||
        user.username ||
        "MELO User";


    user.email =
        user.email ||
        "";


    user.balance =
        Number(
            user.balance
        ) || 0;


    user.income =
        Number(
            user.income
        ) || 0;


    user.expenses =
        Number(
            user.expenses
        ) || 0;


    if (
        !Array.isArray(
            user.transactions
        )
    ) {

        user.transactions = [];

    }


    if (
        !Array.isArray(
            user.wallets
        )
    ) {

        user.wallets = [

            {
                id: "NGN",
                name: "Naira",
                currency: "₦",
                balance: user.balance
            }

        ];

    }


    if (
        !user.notifications
    ) {

        user.notifications = {

            transactions: true,

            budget: true,

            savings: true

        };

    }


    user.meloId =
        generateMeloId(user);


    recalculateUser(
        user
    );


    return user;

}


/* =====================================================
   INITIALIZE CURRENT USER
===================================================== */

function initializeUser() {

    const user =
        getCurrentUser();


    if (!user) {

        return null;

    }


    const normalized =
        normalizeUser(
            user
        );


    saveUser(
        normalized
    );


    return normalized;

}


/* =====================================================
   INITIALIZE STORAGE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeUser();

    }
);
