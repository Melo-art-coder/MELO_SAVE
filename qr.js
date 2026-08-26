/* =====================================
   MELOSAV — QR PAY V3
===================================== */

let currentMyQRData = "";
let currentRequestQRData = "";


document.addEventListener("DOMContentLoaded", () => {

    const user = getUser();

    if (!user) {
        location.href = "login.html";
        return;
    }

    setupButtons();
    loadUserQR();

});


/* =====================================
   GET USER
===================================== */

function getUser() {

    try {

        return JSON.parse(
            localStorage.getItem("meloCurrentUser")
        );

    } catch {

        return null;

    }

}


/* =====================================
   SAVE USER
===================================== */

function saveUser(user) {

    localStorage.setItem(
        "meloCurrentUser",
        JSON.stringify(user)
    );


    let users = [];

    try {

        users =
            JSON.parse(
                localStorage.getItem("meloUsers")
            ) || [];

    } catch {

        users = [];

    }


    const index = users.findIndex(u => {

        if (
            user.email &&
            u.email
        ) {

            return u.email === user.email;

        }

        if (
            user.id &&
            u.id
        ) {

            return u.id === user.id;

        }

        return false;

    });


    if (index !== -1) {

        users[index] = user;

    } else {

        users.push(user);

    }


    localStorage.setItem(
        "meloUsers",
        JSON.stringify(users)
    );

}


/* =====================================
   BUTTONS
===================================== */

function setupButtons() {

    const scanQR =
        document.getElementById("scanQR");

    const myQR =
        document.getElementById("myQR");

    const requestQR =
        document.getElementById("requestQR");

    const startCamera =
        document.getElementById("startCamera");

    const simulateScan =
        document.getElementById("simulateScan");

    const requestForm =
        document.getElementById("requestForm");

    const copyMyQR =
        document.getElementById("copyMyQR");

    const copyRequestQR =
        document.getElementById("copyRequestQR");

    const closeQR =
        document.getElementById("closeQR");


    if (scanQR) {

        scanQR.addEventListener(
            "click",
            showScanner
        );

    }


    if (myQR) {

        myQR.addEventListener(
            "click",
            showMyQR
        );

    }


    if (requestQR) {

        requestQR.addEventListener(
            "click",
            showRequest
        );

    }


    if (startCamera) {

        startCamera.addEventListener(
            "click",
            startQRScanner
        );

    }


    if (simulateScan) {

        simulateScan.addEventListener(
            "click",
            simulateScan
        );

    }


    if (requestForm) {

        requestForm.addEventListener(
            "submit",
            generateRequest
        );

    }


    if (copyMyQR) {

        copyMyQR.addEventListener(
            "click",
            () => {

                copyText(
                    currentMyQRData,
                    "My QR data copied 💜"
                );

            }
        );

    }


    if (copyRequestQR) {

        copyRequestQR.addEventListener(
            "click",
            () => {

                copyText(
                    currentRequestQRData,
                    "Request data copied 💜"
                );

            }
        );

    }


    if (closeQR) {

        closeQR.addEventListener(
            "click",
            () => {

                const card =
                    document.getElementById(
                        "generatedCard"
                    );

                if (card) {

                    card.hidden = true;

                }

            }
        );

    }

}


/* =====================================
   HIDE ALL
===================================== */

function hideSections() {

    const ids = [

        "scannerCard",
        "myQRCard",
        "requestCard",
        "generatedCard"

    ];


    ids.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {

            element.hidden = true;

        }

    });

}


/* =====================================
   SHOW SCANNER
===================================== */

function showScanner() {

    hideSections();


    const card =
        document.getElementById(
            "scannerCard"
        );


    if (card) {

        card.hidden = false;

        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* =====================================
   SHOW MY QR
===================================== */

function showMyQR() {

    hideSections();


    const card =
        document.getElementById(
            "myQRCard"
        );


    if (card) {

        card.hidden = false;

        generateMyQR();

        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* =====================================
   SHOW REQUEST
===================================== */

function showRequest() {

    hideSections();


    const card =
        document.getElementById(
            "requestCard"
        );


    if (card) {

        card.hidden = false;

        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* =====================================
   LOAD USER
===================================== */

function loadUserQR() {

    const user =
        getUser();


    if (!user) return;


    const name =
        user.name ||
        user.fullName ||
        user.username ||
        "MELO User";


    const qrName =
        document.getElementById(
            "qrName"
        );


    if (qrName) {

        qrName.textContent =
            name;

    }

}


/* =====================================
   GENERATE MY QR
===================================== */

function generateMyQR() {

    const user =
        getUser();


    if (!user) return;


    const name =
        user.name ||
        user.fullName ||
        user.username ||
        "MELO User";


    const identifier =
        user.email ||
        user.id ||
        user.username ||
        name;


    currentMyQRData =
        JSON.stringify({

            type:
                "MELO_PAYMENT",

            version:
                1,

            name:
                name,

            identifier:
                identifier

        });


    const container =
        document.getElementById(
            "userQR"
        );


    if (!container) return;


    container.innerHTML = "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        container.textContent =
            "QR library failed to load.";

        return;

    }


    new QRCode(
        container,
        {

            text:
                currentMyQRData,

            width:
                200,

            height:
                200,

            colorDark:
                "#111111",

            colorLight:
                "#ffffff",

            correctLevel:
                QRCode.CorrectLevel.H

        }
    );

}


/* =====================================
   GENERATE REQUEST QR
===================================== */

function generateRequest(event) {

    event.preventDefault();


    const amount =
        Number(
            document.getElementById(
                "qrAmount"
            ).value
        );


    const note =
        document.getElementById(
            "qrNote"
        ).value.trim();


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        showToast(
            "Invalid Amount",
            "Enter a valid amount greater than zero.",
            "error"
        );

        return;

    }


    const user =
        getUser();


    const name =
        user.name ||
        user.fullName ||
        user.username ||
        "MELO User";


    currentRequestQRData =
        JSON.stringify({

            type:
                "MELO_REQUEST",

            version:
                1,

            recipient:
                name,

            identifier:
                user.email ||
                user.id ||
                user.username ||
                name,

            amount:
                amount,

            note:
                note ||
                "MELO payment request"

        });


    const qrContainer =
        document.getElementById(
            "generatedQR"
        );


    if (!qrContainer) return;


    qrContainer.innerHTML = "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        showToast(
            "QR Error",
            "The QR generator could not load.",
            "error"
        );

        return;

    }


    new QRCode(
        qrContainer,
        {

            text:
                currentRequestQRData,

            width:
                200,

            height:
                200,

            colorDark:
                "#111111",

            colorLight:
                "#ffffff",

            correctLevel:
                QRCode.CorrectLevel.H

        }
    );


    document.getElementById(
        "generatedAmount"
    ).textContent =
        money(amount);


    document.getElementById(
        "generatedNote"
    ).textContent =
        note ||
        "MELO payment request";


    const card =
        document.getElementById(
            "generatedCard"
        );


    if (card) {

        card.hidden = false;

        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    showToast(
        "QR Created 💜",
        "Your payment request QR is ready.",
        "success"
    );

}


/* =====================================
   START CAMERA
===================================== */

async function startQRScanner() {

    const video =
        document.getElementById(
            "qrVideo"
        );


    if (!video) return;


    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        showToast(
            "Camera Unavailable",
            "Your browser does not support camera access.",
            "error"
        );

        return;

    }


    try {

        const stream =
            await navigator.mediaDevices
                .getUserMedia({
                    video: {
                        facingMode:
                            "environment"
                    }
                });


        video.srcObject =
            stream;


        video.hidden =
            false;


        showToast(
            "Camera Ready 📷",
            "Point the camera at a MELOSAV QR code.",
            "success"
        );


        /*
           The camera preview is now working.

           Real QR decoding will be connected
           in the next scanner upgrade.
        */


    } catch (error) {

        console.error(
            "Camera error:",
            error
        );


        showToast(
            "Camera Permission",
            "Please allow camera access to scan QR codes.",
            "error"
        );

    }

}


/* =====================================
   TEST SCAN
===================================== */

function simulateScan() {

    const users =
        getUsers();


    const current =
        getUser();


    const recipient =
        users.find(user => {

            if (
                current.email &&
                user.email
            ) {

                return (
                    user.email !==
                    current.email
                );

            }

            return false;

        });


    if (!recipient) {

        showToast(
            "No Test Recipient",
            "Create another MELOSAV account to test payments.",
            "error"
        );

        return;

    }


    const name =
        recipient.name ||
        recipient.fullName ||
        recipient.username ||
        "MELO User";


    const amount =
        prompt(
            `QR detected for ${name}\n\nEnter amount to send:`
        );


    if (
        amount === null
    ) {

        return;

    }


    const numericAmount =
        Number(amount);


    if (
        !Number.isFinite(
            numericAmount
        ) ||
        numericAmount <= 0
    ) {

        showToast(
            "Invalid Amount",
            "Enter a valid amount.",
            "error"
        );

        return;

    }


    const confirmed =
        confirm(
            `Confirm payment?\n\n` +
            `Recipient: ${name}\n` +
            `Amount: ${money(numericAmount)}`
        );


    if (!confirmed) {

        return;

    }


    processPayment(
        recipient,
        numericAmount
    );

}


/* =====================================
   GET USERS
===================================== */

function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "meloUsers"
            )
        ) || [];

    } catch {

        return [];

    }

}


/* =====================================
   PROCESS PAYMENT
===================================== */

function processPayment(
    recipient,
    amount
) {

    const sender =
        getUser();


    if (!sender) return;


    sender.balance =
        Number(
            sender.balance || 0
        );


    if (
        amount >
        sender.balance
    ) {

        showToast(
            "Insufficient Balance",
            `Available balance: ${money(sender.balance)}`,
            "error"
        );

        return;

    }


    sender.balance -=
        amount;


    if (
        !Array.isArray(
            sender.transactions
        )
    ) {

        sender.transactions = [];

    }


    const recipientName =
        recipient.name ||
        recipient.fullName ||
        recipient.username ||
        "MELO User";


    sender.transactions.unshift({

        id:
            "QR-" +
            Date.now(),

        type:
            "transfer",

        category:
            "QR Payment",

        title:
            "QR Payment",

        amount:
            amount,

        recipient:
            recipientName,

        description:
            `QR payment to ${recipientName}`,

        method:
            "QR Pay",

        date:
            new Date().toLocaleString(
                "en-NG"
            ),

        timestamp:
            Date.now()

    });


    saveUser(
        sender
    );


    creditRecipient(
        recipient,
        amount,
        sender
    );


    addNotification(
        sender,
        `You sent ${money(amount)} to ${recipientName}.`
    );


    showToast(
        "Payment Successful 💜",
        `${money(amount)} sent to ${recipientName}.`,
        "success"
    );


    setTimeout(() => {

        location.href =
            "home.html";

    }, 1400);

}


/* =====================================
   CREDIT RECIPIENT
===================================== */

function creditRecipient(
    recipient,
    amount,
    sender
) {

    recipient.balance =
        Number(
            recipient.balance || 0
        );


    recipient.balance +=
        amount;


    if (
        !Array.isArray(
            recipient.transactions
        )
    ) {

        recipient.transactions = [];

    }


    const senderName =
        sender.name ||
        sender.fullName ||
        sender.username ||
        "MELO User";


    recipient.transactions.unshift({

        id:
            "QR-IN-" +
            Date.now(),

        type:
            "income",

        category:
            "QR Payment",

        title:
            "QR Payment Received",

        amount:
            amount,

        sender:
            senderName,

        description:
            `QR payment from ${senderName}`,

        method:
            "QR Pay",

        date:
            new Date().toLocaleString(
                "en-NG"
            ),

        timestamp:
            Date.now()

    });


    saveUser(
        recipient
    );


    addNotification(
        recipient,
        `You received ${money(amount)} from ${senderName}.`
    );

}


/* =====================================
   NOTIFICATION
===================================== */

function addNotification(
    user,
    message
) {

    if (
        !Array.isArray(
            user.notifications
        )
    ) {

        user.notifications = [];

    }


    user.notifications.unshift({

        id:
            "NOTIF-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2, 7),

        title:
            "Melo Money Update",

        message:
            message,

        text:
            message,

        type:
            "money",

        read:
            false,

        date:
            new Date().toLocaleString(
                "en-NG"
            ),

        timestamp:
            Date.now()

    });


    if (
        user.notifications.length >
        100
    ) {

        user.notifications =
            user.notifications.slice(
                0,
                100
            );

    }


    saveUser(
        user
    );

}


/* =====================================
   COPY
===================================== */

async function copyText(
    text,
    successMessage
) {

    if (!text) {

        showToast(
            "Nothing to Copy",
            "Generate your QR first.",
            "error"
        );

        return;

    }


    try {

        await navigator.clipboard.writeText(
            text
        );


        showToast(
            "Copied 💜",
            successMessage,
            "success"
        );

    } catch {

        showToast(
            "Copy Failed",
            "Your browser blocked clipboard access.",
            "error"
        );

    }

}


/* =====================================
   MONEY
===================================== */

function money(amount) {

    return (
        "₦" +
        Number(
            amount || 0
        ).toLocaleString(
            "en-NG",
            {
                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2
            }
        )
    );

}


/* =====================================
   TOAST
===================================== */

function showToast(
    title,
    message,
    type
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
