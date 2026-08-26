/* =====================================================
   MELOSAV — PROFILE
===================================================== */


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const user =
            getProfileUser();


        if (!user) {

            location.href =
                "login.html";

            return;

        }


        loadProfile();

        setupPhoto();

        setupProfileForm();

        setupColorPicker();

        setupAccounts();

        setupNotifications();

        setupSecurity();

        setupLogout();

        setupCopyMeloId();

    }
);


/* =====================================================
   USER
===================================================== */

function getProfileUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "meloCurrentUser"
            )
        );

    } catch {

        return null;

    }

}


/* =====================================================
   LOAD PROFILE
===================================================== */

function loadProfile() {

    const user =
        getProfileUser();


    const name =
        user.name ||
        user.fullName ||
        user.username ||
        "MELO User";


    const email =
        user.email ||
        "No email";


    const meloId =
        getMeloId(user);


    document.getElementById(
        "displayName"
    ).textContent =
        name;


    document.getElementById(
        "displayEmail"
    ).textContent =
        email;


    document.getElementById(
        "meloId"
    ).textContent =
        meloId;


    document.getElementById(
        "accountMeloId"
    ).textContent =
        meloId;


    document.getElementById(
        "accountEmail"
    ).textContent =
        email;


    document.getElementById(
        "nameInput"
    ).value =
        name;


    document.getElementById(
        "emailInput"
    ).value =
        email;


    loadPhoto(user);

}


/* =====================================================
   MELO ID
===================================================== */

function getMeloId(user) {

    if (user.meloId) {

        return user.meloId;

    }


    const base =
        (
            user.email ||
            user.name ||
            "USER"
        )
        .replace(
            /[^a-zA-Z0-9]/g,
            ""
        )
        .toUpperCase()
        .slice(
            0,
            6
        );


    const id =
        "MELO-" +
        base +
        "-" +
        Math.floor(
            1000 +
            Math.random() *
            9000
        );


    user.meloId =
        id;


    saveUser(
        user
    );


    return id;

}


/* =====================================================
   SAVE USER
===================================================== */

function saveUser(user) {

    localStorage.setItem(

        "meloCurrentUser",

        JSON.stringify(user)

    );


    let users = [];

    try {

        users =
            JSON.parse(
                localStorage.getItem(
                    "meloUsers"
                )
            ) || [];

    } catch {

        users = [];

    }


    const index =
        users.findIndex(
            item =>
                item.email ===
                user.email
        );


    if (index !== -1) {

        users[index] =
            user;

    } else {

        users.push(
            user
        );

    }


    localStorage.setItem(

        "meloUsers",

        JSON.stringify(users)

    );

}


/* =====================================================
   PROFILE PHOTO
===================================================== */

function setupPhoto() {

    const button =
        document.getElementById(
            "changePhotoBtn"
        );


    const input =
        document.getElementById(
            "photoInput"
        );


    button.addEventListener(
        "click",
        () => {

            input.click();

        }
    );


    input.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];


            if (!file) {

                return;

            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showProfileToast(
                    "Invalid Photo",
                    "Please choose an image.",
                    "error"
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                () => {

                    const user =
                        getProfileUser();


                    user.profilePhoto =
                        reader.result;


                    saveUser(
                        user
                    );


                    loadPhoto(
                        user
                    );


                    showProfileToast(
                        "Photo Updated 📸",
                        "Your profile photo has been changed.",
                        "success"
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =====================================================
   LOAD PHOTO
===================================================== */

function loadPhoto(user) {

    const image =
        document.getElementById(
            "profilePhoto"
        );


    if (
        user.profilePhoto
    ) {

        image.src =
            user.profilePhoto;

        return;

    }


    const name =
        user.name ||
        user.fullName ||
        "M";


    image.src =
        createAvatar(
            name
        );

}


/* =====================================================
   DEFAULT AVATAR
===================================================== */

function createAvatar(name) {

    const letter =
        name
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "M";


    const svg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 200 200"
        >

            <rect
                width="200"
                height="200"
                rx="100"
                fill="#F0E9FF"
            />

            <text
                x="100"
                y="120"
                text-anchor="middle"
                font-size="90"
                font-family="Arial"
                font-weight="700"
                fill="#7B2CFF"
            >
                ${letter}
            </text>

        </svg>
    `;


    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}


/* =====================================================
   EDIT PROFILE
===================================================== */

function setupProfileForm() {

    const form =
        document.getElementById(
            "profileForm"
        );


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "nameInput"
                )
                .value
                .trim();


            const email =
                document.getElementById(
                    "emailInput"
                )
                .value
                .trim()
                .toLowerCase();


            if (!name) {

                showProfileToast(
                    "Name Required",
                    "Please enter your name.",
                    "error"
                );

                return;

            }


            if (
                !email ||
                !email.includes("@")
            ) {

                showProfileToast(
                    "Invalid Email",
                    "Please enter a valid email.",
                    "error"
                );

                return;

            }


            const user =
                getProfileUser();


            const oldEmail =
                user.email;


            user.name =
                name;


            user.fullName =
                name;


            user.email =
                email;


            saveProfileWithEmailMigration(
                user,
                oldEmail
            );


            loadProfile();


            showProfileToast(
                "Profile Updated ✨",
                "Your profile information has been saved.",
                "success"
            );

        }
    );

}


/* =====================================================
   EMAIL MIGRATION
===================================================== */

function saveProfileWithEmailMigration(
    user,
    oldEmail
) {

    let users = [];

    try {

        users =
            JSON.parse(
                localStorage.getItem(
                    "meloUsers"
                )
            ) || [];

    } catch {

        users = [];

    }


    const index =
        users.findIndex(
            item =>
                item.email ===
                oldEmail
        );


    if (index !== -1) {

        users[index] =
            user;

    } else {

        users.push(
            user
        );

    }


    localStorage.setItem(
        "meloUsers",
        JSON.stringify(users)
    );


    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(user)
    );

}


/* =====================================================
   COLOR PICKER
===================================================== */

function setupColorPicker() {

    const grid =
        document.getElementById(
            "colorGrid"
        );


    if (!grid) {

        return;

    }


    const user =
        getProfileUser();


    const current =
        user?.themeColor ||
        "purple";


    markColor(
        current
    );


    grid
        .querySelectorAll(
            ".color-choice"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const color =
                            button.dataset.color;


                        if (
                            typeof saveMeloTheme ===
                            "function"
                        ) {

                            saveMeloTheme(
                                color
                            );

                        }


                        markColor(
                            color
                        );


                        const theme =
                            typeof MELO_THEMES !==
                            "undefined"
                                ? MELO_THEMES[color]
                                : null;


                        showProfileToast(

                            "Color Updated 🎨",

                            theme
                                ? `${theme.name} is now your MELO color.`
                                : "Your MELO color has been updated.",

                            "success"

                        );

                    }
                );

            }
        );

}


/* =====================================================
   MARK COLOR
===================================================== */

function markColor(
    selected
) {

    document
        .querySelectorAll(
            ".color-choice"
        )
        .forEach(
            button => {

                button.classList.toggle(

                    "selected",

                    button.dataset.color ===
                    selected

                );

            }
        );

}


/* =====================================================
   ACCOUNTS
===================================================== */

function setupAccounts() {

    renderAccounts();


    const addButton =
        document.getElementById(
            "addAccountBtn"
        );


    addButton.addEventListener(
        "click",
        () => {

            showProfileToast(
                "Add Account",
                "Account creation can be connected to your existing signup flow.",
                "info"
            );


            setTimeout(
                () => {

                    location.href =
                        "signup.html";

                },
                700
            );

        }
    );

}


/* =====================================================
   RENDER ACCOUNTS
===================================================== */

function renderAccounts() {

    const container =
        document.getElementById(
            "accountList"
        );


    let users = [];

    try {

        users =
            JSON.parse(
                localStorage.getItem(
                    "meloUsers"
                )
            ) || [];

    } catch {

        users = [];

    }


    const current =
        getProfileUser();


    container.innerHTML =
        "";


    users.forEach(
        (user, index) => {

            const isCurrent =
                current &&
                user.email ===
                current.email;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "account-item" +
                (
                    isCurrent
                        ? " current"
                        : ""
                );


            item.innerHTML = `

                <div class="account-item-info">

                    <strong>
                        ${escapeHTML(
                            user.name ||
                            user.fullName ||
                            "MELO User"
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            user.email ||
                            "No email"
                        )}
                    </small>

                </div>

                ${
                    isCurrent
                        ? `
                            <small>
                                Current
                            </small>
                          `
                        : `
                            <button
                                type="button"
                                class="switch-account-btn"
                            >
                                Switch
                            </button>
                          `
                }

            `;


            const switchButton =
                item.querySelector(
                    ".switch-account-btn"
                );


            if (switchButton) {

                switchButton.addEventListener(
                    "click",
                    () => {

                        localStorage.setItem(

                            "meloCurrentUser",

                            JSON.stringify(
                                user
                            )

                        );


                        if (
                            typeof loadTheme ===
                            "function"
                        ) {

                            loadTheme();

                        }


                        showProfileToast(
                            "Account Switched 🔄",
                            `Welcome back, ${user.name || "MELO User"}.`,
                            "success"
                        );


                        setTimeout(
                            () => {

                                location.href =
                                    "home.html";

                            },
                            700
                        );

                    }
                );

            }


            container.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   NOTIFICATIONS
===================================================== */

function setupNotifications() {

    const user =
        getProfileUser();


    const settings =
        user.notifications ||
        {};


    const transaction =
        document.getElementById(
            "transactionNotifications"
        );


    const budget =
        document.getElementById(
            "budgetNotifications"
        );


    const savings =
        document.getElementById(
            "savingsNotifications"
        );


    transaction.checked =
        settings.transactions !== false;


    budget.checked =
        settings.budget !== false;


    savings.checked =
        settings.savings !== false;


    transaction.addEventListener(
        "change",
        () => {

            saveNotification(
                "transactions",
                transaction.checked
            );

        }
    );


    budget.addEventListener(
        "change",
        () => {

            saveNotification(
                "budget",
                budget.checked
            );

        }
    );


    savings.addEventListener(
        "change",
        () => {

            saveNotification(
                "savings",
                savings.checked
            );

        }
    );

}


/* =====================================================
   SAVE NOTIFICATION
===================================================== */

function saveNotification(
    key,
    value
) {

    const user =
        getProfileUser();


    user.notifications =
        user.notifications ||
        {};


    user.notifications[key] =
        value;


    saveUser(
        user
    );

}


/* =====================================================
   SECURITY
===================================================== */

function setupSecurity() {

    document
        .getElementById(
            "changePinBtn"
        )
        .addEventListener(
            "click",
            () => {

                showProfileToast(
                    "Security PIN",
                    "PIN management will be connected to your secure authentication system.",
                    "info"
                );

            }
        );


    document
        .getElementById(
            "biometricBtn"
        )
        .addEventListener(
            "click",
            () => {

                showProfileToast(
                    "Biometric Security",
                    "Your biometric authentication can be managed here.",
                    "info"
                );

            }
        );

}


/* =====================================================
   COPY MELO ID
===================================================== */

function setupCopyMeloId() {

    document
        .getElementById(
            "copyMeloId"
        )
        .addEventListener(
            "click",
            async () => {

                const id =
                    document.getElementById(
                        "accountMeloId"
                    ).textContent;


                try {

                    await navigator.clipboard.writeText(
                        id
                    );


                    showProfileToast(
                        "Copied 📋",
                        "Your MELO ID has been copied.",
                        "success"
                    );

                } catch {

                    showProfileToast(
                        "MELO ID",
                        id,
                        "info"
                    );

                }

            }
        );

}


/* =====================================================
   LOGOUT
===================================================== */

function setupLogout() {

    document
        .getElementById(
            "logoutBtn"
        )
        .addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Are you sure you want to log out of MELOSAV?"
                    );


                if (!confirmed) {

                    return;

                }


                localStorage.removeItem(
                    "meloCurrentUser"
                );


                showProfileToast(
                    "Logged Out",
                    "See you again soon 💜",
                    "success"
                );


                setTimeout(
                    () => {

                        location.href =
                            "login.html";

                    },
                    700
                );

            }
        );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

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


/* =====================================================
   TOAST
===================================================== */

function showProfileToast(
    title,
    message,
    type = "info"
) {

    if (
        typeof meloToast ===
        "function"
    ) {

        meloToast(
            title,
            message,
            type
        );

    } else {

        alert(
            title +
            "\n\n" +
            message
        );

    }

}
