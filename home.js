/* =====================================
   MELOSAV HOME V5
===================================== */

let currentUser = null;
let balanceVisible = true;

/* =====================================
   APP START
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof loadTheme === "function") {
        loadTheme();
    }

    loadUser();
    setupButtons();
    setupWalletSlider();
    setupBalanceToggle();

});


/* =====================================
   LOAD USER
===================================== */

function loadUser() {

    currentUser = JSON.parse(
        localStorage.getItem("meloCurrentUser")
    );

    if (!currentUser) {

        location.href = "login.html";
        return;

    }

    document.getElementById("username").textContent =
        currentUser.name || "User";

    document.getElementById("greeting").textContent =
        getGreeting();

    updateWallet();
    updateBudget();
    updateAIMessage();
    loadTransactions();

    setTimeout(() => {

        speakGreeting(currentUser.name);

    },800);

}


/* =====================================
   UPDATE WALLET
===================================== */

function updateWallet(){

    const balance =
        Number(currentUser.balance || 0);

    const income =
        Number(currentUser.income || 0);

    const expenses =
        Number(currentUser.expenses || 0);

    const savings =
        Number(currentUser.savings || 0);

    animateMoney("balance",balance);
    animateMoney("income",income);
    animateMoney("expenses",expenses);
    animateMoney("savings",savings);

    document.getElementById("usdBalance").textContent="$0.00";
    document.getElementById("eurBalance").textContent="€0.00";
    document.getElementById("gbpBalance").textContent="£0.00";

}


/* =====================================
   DAILY BUDGET
===================================== */

function updateBudget(){

    const percent =
        Number(currentUser.dailyBudget || 0);

    document.getElementById("budgetPercent").textContent =
        percent + "%";

    document.getElementById("budgetFill").style.width =
        percent + "%";

}


/* =====================================
   FORMAT MONEY
===================================== */

function formatMoney(amount){

    return "₦" + Number(amount).toLocaleString(
        "en-NG",
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    );

}


/* =====================================
   GREETING
===================================== */

function getGreeting(){

    const hour =
        new Date().getHours();

    if(hour < 12){

        return "Good Morning ☀️";

    }

    if(hour < 18){

        return "Good Afternoon 🌤️";

    }

    return "Good Evening 🌙";

}


/* =====================================
   MELO AI
===================================== */

function updateAIMessage(){

    const tips=[

        "Save a little today for a better tomorrow. 💜",

        "Every naira saved gets you closer to your dream. 🎯",

        "Track your spending to stay ahead. 📊",

        "Small savings become big achievements. 🏆",

        "Welcome back! Let's grow your savings today. 🚀"

    ];

    const random =
        Math.floor(Math.random()*tips.length);

    document.getElementById("aiMessage").textContent =
        tips[random];

}


/* =====================================
   VOICE GREETING
===================================== */

function speakGreeting(name){

    if(!("speechSynthesis" in window))
        return;

    speechSynthesis.cancel();

    const firstName =
        name.split(" ")[0];

    const speech =
        new SpeechSynthesisUtterance(

        `${getGreeting()} ${firstName}. Welcome back to MELOSAV.`

        );

    speech.rate=0.9;
    speech.pitch=1;
    speech.volume=1;

    speechSynthesis.speak(speech);

}
/* =====================================
   BUTTON EVENTS
===================================== */

function setupButtons(){

    document.getElementById("themeBtn").addEventListener("click",()=>{

        location.href="theme-setup.html";

    });

    document.getElementById("notificationBtn").addEventListener("click",()=>{

        meloToast(
            "🔔 Notifications",
            "No new notifications.",
            "info"
        );

    });

    document.getElementById("incomeBtn").addEventListener("click", () => {

    location.href = "income.html";

});


    document.getElementById("expenseBtn").addEventListener("click",()=>{

    location.href = "expense.html";

});

    document.getElementById("saveBtn").addEventListener("click",()=>{

    location.href = "savings.html";

});

    document.getElementById("goalBtn").addEventListener("click",()=>{

        sheet.classList.remove("show");

location.href="goals.html";

    });

    const transferBtn=document.getElementById("transferBtn");

    if(transferBtn){

        transferBtn.addEventListener("click",()=>{

            meloToast(
                "💳 Transfer",
                "Transfer feature coming soon.",
                "info"
            );

        });

    }

    const budgetBtn=document.getElementById("budgetBtn");

    if(budgetBtn){

        budgetBtn.addEventListener("click",()=>{

            meloToast(
                "📊 Budget",
                "Budget feature coming soon.",
                "info"
            );

        });

    }

    setupQuickSheet();

}


/* =====================================
   QUICK SHEET
===================================== */

function setupQuickSheet(){

    const fab=document.getElementById("fab");
    const sheet=document.getElementById("quickSheet");
    const close=document.getElementById("closeSheet");

    fab.addEventListener("click",()=>{

        sheet.classList.add("show");

    });

    close.addEventListener("click",()=>{

        sheet.classList.remove("show");

    });

    document.getElementById("quickIncome").addEventListener("click",()=>{

    sheet.classList.remove("show");

    location.href = "income.html";

});

    document.getElementById("quickExpense").addEventListener("click",()=>{

    sheet.classList.remove("show");

    location.href = "expense.html";

});
    document.getElementById("quickSave").addEventListener("click",()=>{

    sheet.classList.remove("show");

    location.href = "savings.html";

});

    document.getElementById("quickGoal").addEventListener("click",()=>{

        location.href="goals.html";

    });

    document.getElementById("quickTransfer").addEventListener("click",()=>{

        location.href="transfer.html";

        sheet.classList.remove("show");

    });

}
/* =====================================
   SHOW / HIDE BALANCE
===================================== */

function setupBalanceToggle(){

    const button=document.getElementById("toggleBalance");

    button.addEventListener("click",()=>{

        balanceVisible=!balanceVisible;

        const ids=[
            "balance",
            "income",
            "expenses",
            "savings",
            "usdBalance",
            "eurBalance",
            "gbpBalance"
        ];

        ids.forEach(id=>{

            const el=document.getElementById(id);

            if(!el) return;

            if(balanceVisible){

                if(el.dataset.value){

                    el.textContent=el.dataset.value;

                }

            }else{

                el.dataset.value=el.textContent;

                el.textContent="••••••";

            }

        });

        button.textContent=
            balanceVisible ? "👁️" : "🙈";

    });

}


/* =====================================
   WALLET SLIDER
===================================== */

function setupWalletSlider(){

    const slider=document.getElementById("walletSlider");

    const dots=document.querySelectorAll(".wallet-dots span");

    if(!slider) return;

    slider.addEventListener("scroll",()=>{

        const index=Math.round(
            slider.scrollLeft/slider.clientWidth
        );

        dots.forEach(dot=>
            dot.classList.remove("active")
        );

        if(dots[index]){

            dots[index].classList.add("active");

        }

    });

}


/* =====================================
   RECENT TRANSACTIONS
===================================== */

function loadTransactions(){

    const container=document.getElementById("transactionList");

    if(!container) return;

    const transactions=currentUser.transactions || [];

    if(transactions.length===0){

        container.innerHTML=`
            <p class="empty">
                No transactions yet.
            </p>
        `;

        return;

    }

    container.innerHTML="";

    transactions
        .slice(-5)
        .reverse()
        .forEach(item=>{

            const card=document.createElement("div");

            card.className="transaction-item";

            card.innerHTML=`

                <div>

                    <strong>${item.title || "Transaction"}</strong>

                    <br>

                    <small>${item.date || ""}</small>

                </div>

                <h3>${formatMoney(item.amount || 0)}</h3>

            `;

            container.appendChild(card);

        });

}


/* =====================================
   ANIMATE MONEY
===================================== */

function animateMoney(id,amount){

    const element=document.getElementById(id);

    if(!element) return;

    let start=0;

    const duration=1000;

    const increment=amount/(duration/16);

    const timer=setInterval(()=>{

        start+=increment;

        if(start>=amount){

            start=amount;

            clearInterval(timer);

        }

        element.textContent=formatMoney(start);

    },16);

}