/* =========================================
   MELOSAV — PAYMENTS HUB
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initPayments
);


/* =========================================
   INITIALIZE
========================================= */

function initPayments() {

    const user =
        getCurrentUser();

    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    updateBalance();

    setupPaymentOptions();

    setupCloseButton();

    setupForms();

}


/* =========================================
   CURRENT USER
========================================= */

function getCurrentUser() {

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


/* =========================================
   UPDATE BALANCE
========================================= */

function updateBalance() {

    const user =
        getCurrentUser();

    const balance =
        Number(
            user?.balance || 0
        );


    const element =
        document.getElementById(
            "availableBalance"
        );


    if (element) {

        element.textContent =
            money(balance);

    }

}


/* =========================================
   PAYMENT OPTIONS
========================================= */

function setupPaymentOptions() {

    const options =
        document.querySelectorAll(
            ".payment-option"
        );


    options.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    const section =
                        option.dataset.section;

                    openPaymentSection(
                        section
                    );

                }
            );

        }
    );

}


/* =========================================
   OPEN SECTION
========================================= */

function openPaymentSection(
    section
) {

    const panel =
        document.getElementById(
            "paymentPanel"
        );


    panel.hidden = false;


    hideAllForms();


    const titles = {

        send: [
            "Send Money",
            "SEND MONEY",
            "Transfer money to another MELO user."
        ],

        bills: [
            "Pay Bills",
            "BILLS",
            "Take care of your regular payments."
        ],

        airtime: [
            "Buy Airtime",
            "AIRTIME",
            "Recharge a phone number."
        ],

        data: [
            "Buy Data",
            "DATA",
            "Purchase a data plan."
        ],

        qr: [
            "QR Pay",
            "QR PAY",
            "Pay using a MELO QR code."
        ],

        request: [
            "Request Money",
            "REQUEST",
            "Create a payment request."
        ],

        other: [
            "Other Payment",
            "OTHER",
            "Record another type of payment."
        ]

    };


    const content =
        titles[section];


    if (!content) return;


    document.getElementById(
        "panelTitle"
    ).textContent =
        content[0];


    document.getElementById(
        "panelEyebrow"
    ).textContent =
        content[1];


    document.getElementById(
        "panelDescription"
    ).textContent =
        content[2];


    const formMap = {

        send: "sendForm",

        bills: "billsForm",

        airtime: "airtimeForm",

        data: "dataForm",

        qr: "qrPanel",

        request: "requestForm",

        other: "otherForm"

    };


    const target =
        document.getElementById(
            formMap[section]
        );


    if (target) {

        target.hidden = false;

    }


    panel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================
   HIDE FORMS
========================================= */

function hideAllForms() {

    const forms =
        document.querySelectorAll(
            ".payment-form, .qr-panel"
        );


    forms.forEach(
        element => {

            element.hidden = true;

        }
    );

}


/* =========================================
   CLOSE
========================================= */

function setupCloseButton() {

    const button =
        document.getElementById(
            "closePanel"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            document.getElementById(
                "paymentPanel"
            ).hidden = true;

            hideAllForms();

        }
    );

}


/* =========================================
   FORMS
========================================= */

function setupForms() {

    const sendForm =
        document.getElementById(
            "sendForm"
        );


    const billsForm =
        document.getElementById(
            "billsForm"
        );


    const airtimeForm =
        document.getElementById(
            "airtimeForm"
        );


    const dataForm =
        document.getElementById(
            "dataForm"
        );


    const requestForm =
        document.getElementById(
            "requestForm"
        );


    const otherForm =
        document.getElementById(
            "otherForm"
        );


    if (sendForm) {

        sendForm.addEventListener(
            "submit",
            handleSendMoney
        );

    }


    if (billsForm) {

        billsForm.addEventListener(
            "submit",
            handleBills
        );

    }


    if (airtimeForm) {

        airtimeForm.addEventListener(
            "submit",
            handleAirtime
        );

    }


    if (dataForm) {

        dataForm.addEventListener(
            "submit",
            handleData
        );

    }


    if (requestForm) {

        requestForm.addEventListener(
            "submit",
            handleRequest
        );

    }


    if (otherForm) {

        otherForm.addEventListener(
            "submit",
            handleOther
        );

    }

}


/* =========================================
   SEND MONEY
========================================= */

function handleSendMoney(event) {

    event.preventDefault();


    const recipient =
        document.getElementById(
            "recipient"
        ).value.trim();


    const amount =
        Number(
            document.getElementById(
                "sendAmount"
            ).value
        );


    const note =
        document.getElementById(
            "sendNote"
        ).value.trim();


    if (!recipient) {

        toast(
            "Recipient required",
            "Enter who you want to send money to.",
            "error"
        );

        return;

    }


    if (!validAmount(amount)) {

        toast(
            "Invalid amount",
            "Enter a valid amount.",
            "error"
        );

        return;

    }


    makePayment(
        amount,
        "Transfer",
        `Sent to ${recipient}`,
        note
    );

}


/* =========================================
   BILLS
========================================= */

function handleBills(event) {

    event.preventDefault();


    const type =
        document.getElementById(
            "billType"
        ).value;


    const reference =
        document.getElementById(
            "billReference"
        ).value.trim();


    const amount =
        Number(
            document.getElementById(
                "billAmount"
            ).value
        );


    if (!type || !reference) {

        toast(
            "Missing information",
            "Complete the bill details.",
            "error"
        );

        return;

    }


    if (!validAmount(amount)) {

        toast(
            "Invalid amount",
            "Enter a valid amount.",
            "error"
        );

        return;

    }


    makePayment(
        amount,
        "Bills",
        `${type} payment`,
        `Reference: ${reference}`
    );

}


/* =========================================
   AIRTIME
========================================= */

function handleAirtime(event) {

    event.preventDefault();


    const network =
        document.getElementById(
            "airtimeNetwork"
        ).value;


    const phone =
        document.getElementById(
            "airtimePhone"
        ).value.trim();


    const amount =
        Number(
            document.getElementById(
                "airtimeAmount"
            ).value
        );


    if (
        !network ||
        !phone
    ) {

        toast(
            "Missing information",
            "Complete the airtime details.",
            "error"
        );

        return;

    }


    if (!validAmount(amount)) {

        toast(
            "Invalid amount",
            "Enter a valid amount.",
            "error"
        );

        return;

    }


    makePayment(
        amount,
        "Airtime",
        `${network} airtime`,
        phone
    );

}


/* =========================================
   DATA
========================================= */

function handleData(event) {

    event.preventDefault();


    const network =
        document.getElementById(
            "dataNetwork"
        ).value;


    const phone =
        document.getElementById(
            "dataPhone"
        ).value.trim();


    const plan =
        document.getElementById(
            "dataPlan"
        ).value;


    const amount =
        Number(
            document.getElementById(
                "dataAmount"
            ).value
        );


    if (
        !network ||
        !phone ||
        !plan
    ) {

        toast(
            "Missing information",
            "Complete the data purchase details.",
            "error"
        );

        return;

    }


    if (!validAmount(amount)) {

        toast(
            "Invalid amount",
            "Enter a valid amount.",
            "error"
        );

        return;

    }


    makePayment(
        amount,
        "Data",
        `${network} ${plan}`,
        phone
    );

}


/* =========================================
   OTHER PAYMENT
========================================= */

function handleOther(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "otherName"
        ).value.trim();


    const amount =
        Number(
            document.getElementById(
                "otherAmount"
            ).value
        );


    const note =
        document.getElementById(
            "otherNote"
        ).value.trim();


    if (!name) {

        toast(
            "Payment name required",
            "Tell MELOSAV what this payment is for.",
            "error"
        );

        return;

    }


    if (!validAmount(amount)) {

        toast(
            "Invalid amount",
            "Enter a valid amount.",
            "error"
        );

        return;

    }


    makePayment(
        amount,
        "Other",
        name,
        note
    );

}


/* =========================================
   REQUEST MONEY
========================================= */

function handleRequest(event) {

    event.preventDefault();


    const from =
        document.getElementById(
            "requestFrom"
        ).value.trim();


    const amount =
        Number(
            document.getElementById(
                "requestAmount"
            ).value
        );


    const note =
        document.getElementById(
            "requestNote"
        ).value.trim();


    if (!from) {

        toast(
            "Recipient required",
            "Enter who you are requesting money from.",
            "error"
        );

        return;

    }


    if (!validAmount(amount)) {

        toast(
            "Invalid amount",
            "Enter a valid amount.",
            "error"
        );

        return;

    }


    toast(
        "Request created",
        `Your request for ${money(amount)} is ready.`,
        "success"
    );


    event.target.reset();

}


/* =========================================
   MAKE PAYMENT
========================================= */

function makePayment(
    amount,
    category,
    title,
    description
) {

    let user =
        getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    user.balance =
        Number(
            user.balance || 0
        );


    if (amount > user.balance) {

        toast(
            "Insufficient balance",
            `You need ${money(
                amount - user.balance
            )} more to complete this payment.`,
            "error"
        );

        return;

    }


    user.balance -= amount;


    if (!Array.isArray(
        user.transactions
    )) {

        user.transactions = [];

    }


    user.transactions.push({

        type: "expense",

        category:
            category.toLowerCase(),

        title: title,

        amount: amount,

        description:
            description || "",

        date:
            new Date().toISOString()

    });


    saveUser(
        user
    );


    updateBalance();


    toast(
        "Payment successful",
        `${money(amount)} has been recorded.`,
        "success"
    );


    resetForms();


    setTimeout(
        () => {

            window.location.href =
                "transactions.html";

        },
        900
    );

}


/* =========================================
   SAVE USER
========================================= */

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
            existing =>
                existing.email ===
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
        JSON.stringify(
            users
        )
    );

}


/* =========================================
   RESET
========================================= */

function resetForms() {

    document
        .querySelectorAll(
            ".payment-form"
        )
        .forEach(
            form =>
                form.reset()
        );

}


/* =========================================
   VALIDATION
========================================= */

function validAmount(
    amount
) {

    return (
        Number.isFinite(
            amount
        ) &&
        amount > 0
    );

}


/* =========================================
   MONEY
========================================= */

function money(
    amount
) {

    return (
        "₦" +
        Number(
            amount || 0
        ).toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    );

}


/* =========================================
   TOAST
========================================= */

function toast(
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
            `${title}\n\n${message}`
        );

    }

}
