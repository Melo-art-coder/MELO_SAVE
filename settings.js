/* =====================================
   MELOSAV SETTINGS V1
===================================== */

console.log("SETTINGS V1 LOADED");

let currentUser = null;

/* =====================================
   START
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    if(typeof loadTheme === "function"){
        loadTheme();
    }

    loadUser();

    setupButtons();

    loadSettings();

});


/* =====================================
   LOAD USER
===================================== */

function loadUser(){

    currentUser = JSON.parse(
        localStorage.getItem("meloCurrentUser")
    );

    if(!currentUser){

        location.href = "login.html";
        return;

    }

}


/* =====================================
   BUTTONS
===================================== */

function setupButtons(){

    // Profile

    document.getElementById("profileBtn")
    .addEventListener("click",()=>{

        location.href="profile.html";

    });


    // Edit Profile

    const editModal=document.getElementById("editModal");

document.getElementById("editProfileBtn")
.addEventListener("click",()=>{

    document.getElementById("editName").value=currentUser.name;

    document.getElementById("editEmail").value=currentUser.email;

    editModal.classList.add("show");

});

document.getElementById("cancelEdit")
.addEventListener("click",()=>{

    editModal.classList.remove("show");

});

document.getElementById("saveEdit")
.addEventListener("click",saveProfile);


    // Change PIN

    document.getElementById("changePinBtn")
    .addEventListener("click",()=>{

        meloToast(
            "Coming Soon 🔒",
            "Change PIN feature is coming soon.",
            "info"
        );

    });


    // Theme

    document.getElementById("themeBtn")
    .addEventListener("click",()=>{

        location.href="theme-setup.html";

    });


    // Currency

    document.getElementById("currencyBtn")
    .addEventListener("click",()=>{

        meloToast(
            "Currency",
            "More currencies coming soon.",
            "info"
        );

    });


    // Privacy

    document.getElementById("privacyBtn")
    .addEventListener("click",()=>{

        meloToast(
            "Privacy Policy",
            "Privacy page coming soon.",
            "info"
        );

    });


    // Terms

    document.getElementById("termsBtn")
    .addEventListener("click",()=>{

        meloToast(
            "Terms & Conditions",
            "Terms page coming soon.",
            "info"
        );

    });


    // Backup

    document.getElementById("backupBtn")
    .addEventListener("click",()=>{

        meloToast(
            "Backup",
            "Cloud backup coming soon.",
            "info"
        );

    });


    // Restore

    document.getElementById("restoreBtn")
    .addEventListener("click",()=>{

        meloToast(
            "Restore",
            "Restore feature coming soon.",
            "info"
        );

    });


    // Notifications

    document.getElementById("notificationToggle")
    .addEventListener("change",saveSettings);


    // Logout

    document.getElementById("logoutBtn")
    .addEventListener("click",logoutUser);

}


/* =====================================
   SETTINGS
===================================== */

function loadSettings(){

    const enabled =
        JSON.parse(
            localStorage.getItem("meloNotifications")
        );

    document.getElementById("notificationToggle").checked =
        enabled !== false;

}


function saveSettings(){

    const enabled =
        document.getElementById("notificationToggle").checked;

    localStorage.setItem(
        "meloNotifications",
        JSON.stringify(enabled)
    );

    meloToast(
        "Settings Saved 💜",
        "Your preferences have been updated.",
        "success"
    );

}


/* =====================================
   LOGOUT
===================================== */

function logoutUser(){

    if(!confirm("Are you sure you want to log out?")){
        return;
    }

    localStorage.removeItem("meloCurrentUser");

    meloToast(
        "Logged Out",
        "See you again soon! 💜",
        "success"
    );

    setTimeout(()=>{

        location.href="login.html";

    },800);

}
/* =====================================
   EDIT PROFILE
===================================== */

function editProfile(){

    const newName = prompt(
        "Enter your new full name:",
        currentUser.name
    );

    if(!newName || newName.trim()===""){
        return;
    }

    const newEmail = prompt(
        "Enter your new email:",
        currentUser.email
    );

    if(!newEmail || newEmail.trim()===""){
        return;
    }

    const users = JSON.parse(
        localStorage.getItem("meloUsers")
    ) || [];

    const emailExists = users.find(user=>

        user.email===newEmail &&
        user.email!==currentUser.email

    );

    if(emailExists){

        meloToast(
            "Email Exists",
            "That email is already in use.",
            "error"
        );

        return;

    }

    currentUser.name = newName.trim();

    currentUser.email = newEmail.trim();

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(currentUser)
    );

    const index = users.findIndex(
        user=>user.email===currentUser.email
    );

    if(index !== -1){

        users[index] = currentUser;

    }

    localStorage.setItem(
        "meloUsers",
        JSON.stringify(users)
    );

    meloToast(
        "Profile Updated 💜",
        "Your profile was updated successfully.",
        "success"
    );

    setTimeout(()=>{

        location.reload();

    },700);

}
function saveProfile(){

    const name=document.getElementById("editName").value.trim();

    const email=document.getElementById("editEmail").value.trim();

    if(name==="" || email===""){

        meloToast(

            "Invalid",

            "Fill all fields.",

            "error"

        );

        return;

    }

    const oldEmail=currentUser.email;

    currentUser.name=name;

    currentUser.email=email;

    localStorage.setItem(

        "meloCurrentUser",

        JSON.stringify(currentUser)

    );

    let users=JSON.parse(

        localStorage.getItem("meloUsers")

    ) || [];

    const index=users.findIndex(

        user=>user.email===oldEmail

    );

    if(index!==-1){

        users[index]=currentUser;

    }

    localStorage.setItem(

        "meloUsers",

        JSON.stringify(users)

    );

    editModal.classList.remove("show");

    meloToast(

        "Profile Updated 💜",

        "Changes saved successfully.",

        "success"

    );

}