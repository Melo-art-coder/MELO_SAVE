/* =====================================
   MELOSAV AUTH V5
===================================== */

console.log("AUTH V5 LOADED");

const USERS_KEY = "meloUsers";
const CURRENT_USER_KEY = "meloCurrentUser";

/* ==========================
   GET USERS
========================== */

function getUsers(){

    return JSON.parse(
        localStorage.getItem(USERS_KEY)
    ) || [];

}


/* ==========================
   SAVE USERS
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
   SET CURRENT USER
========================== */

function setCurrentUser(user){

    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
    );

}


/* ==========================
   CREATE ACCOUNT
========================== */

function createAccount(user){

    let users = getUsers();

    const exists = users.some(

        u => u.email.toLowerCase() ===
        user.email.toLowerCase()

    );

    if(exists){

        return{

            success:false,

            message:"Account already exists."

        };

    }

    const newUser = {

        ...user,

        balance:0,

        income:0,

        expenses:0,

        savings:0,

        dailyBudget:0,

        goals:[],

        transactions:[],

        notifications:[],

        achievements:[],

        streak:0,

        createdAt:new Date().toLocaleString()

    };

    users.push(newUser);

    saveUsers(users);

    setCurrentUser(newUser);

    return{

        success:true,

        message:"Account created."

    };

}


/* ==========================
   LOGIN
========================== */

function login(email,pin){

    const users = getUsers();

    const user = users.find(

        u =>

        u.email.toLowerCase() ===
        email.toLowerCase()

        &&

        u.pin === pin

    );

    if(!user){

        return{

            success:false,

            message:"Invalid email or PIN."

        };

    }

    setCurrentUser(user);

    return{

        success:true,

        message:"Login successful."

    };

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


/* ==========================
   PAGE PROTECTION
========================== */

function requireLogin(){

    const user = getCurrentUser();

    if(!user){

        location.href = "login.html";

    }

}


/* ==========================
   UPDATE USER
========================== */

function updateUser(updatedUser){

    let users = getUsers();

    const index = users.findIndex(

        u => u.email === updatedUser.email

    );

    if(index !== -1){

        users[index] = updatedUser;

    }

    saveUsers(users);

    setCurrentUser(updatedUser);

}