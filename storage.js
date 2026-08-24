/* =====================================
   MELOSAV STORAGE V2
   SINGLE SOURCE OF TRUTH
===================================== */

const MELO_STORAGE = {

    getUser() {

        try {

            return JSON.parse(
                localStorage.getItem("meloCurrentUser")
            );

        } catch {

            return null;

        }

    },


    saveUser(user) {

        if (!user) return;

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


        const index =
            users.findIndex(
                u => u.email === user.email
            );


        if (index !== -1) {

            users[index] = user;

        } else {

            users.push(user);

        }


        localStorage.setItem(
            "meloUsers",
            JSON.stringify(users)
        );

    },


    prepareUser(user) {

        if (!user) return null;


        /* =================================
           REAL WALLET
        ================================= */

        if (!user.wallets) {

            user.wallets = {};

        }


        /*
           IMPORTANT:
           wallets.NGN is now the
           actual available money.
        */

        if (
            typeof user.wallets.NGN !== "number"
        ) {

            user.wallets.NGN =
                Number(user.balance || 0);

        }


        user.wallets.NGN =
            Number(user.wallets.NGN || 0);


        user.wallets.USD =
            Number(user.wallets.USD || 0);

        user.wallets.EUR =
            Number(user.wallets.EUR || 0);

        user.wallets.GBP =
            Number(user.wallets.GBP || 0);


        /* =================================
           TOTALS
        ================================= */

        user.income =
            Number(user.income || 0);

        user.expenses =
            Number(user.expenses || 0);

        user.savings =
            Number(user.savings || 0);


        /* =================================
           ARRAYS
        ================================= */

        if (!Array.isArray(user.transactions)) {

            user.transactions = [];

        }


        if (!Array.isArray(user.notifications)) {

            user.notifications = [];

        }


        /* =================================
           LEGACY BALANCE SYNC
        ================================= */

        user.balance =
            user.wallets.NGN;


        return user;

    },


    currentUser() {

        const user =
            this.getUser();

        return this.prepareUser(user);

    },


    addMoney(
        user,
        amount,
        currency = "NGN"
    ) {

        user =
            this.prepareUser(user);

        amount =
            Number(amount);


        if (
            !user ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            return false;

        }


        if (!user.wallets) {

            user.wallets = {};

        }


        user.wallets[currency] =
            Number(
                user.wallets[currency] || 0
            ) + amount;


        if (currency === "NGN") {

            user.balance =
                user.wallets.NGN;

        }


        return true;

    },


    removeMoney(
        user,
        amount,
        currency = "NGN"
    ) {

        user =
            this.prepareUser(user);

        amount =
            Number(amount);


        if (
            !user ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            return false;

        }


        const balance =
            Number(
                user.wallets[currency] || 0
            );


        if (amount > balance) {

            return false;

        }


        user.wallets[currency] =
            balance - amount;


        if (currency === "NGN") {

            user.balance =
                user.wallets.NGN;

        }


        return true;

    },


    addTransaction(
        user,
        transaction
    ) {

        user =
            this.prepareUser(user);


        user.transactions.unshift({

            id:
                Date.now() +
                Math.random(),

            date:
                new Date().toISOString(),

            ...transaction

        });

    },


    addNotification(
        user,
        title,
        message,
        type = "info"
    ) {

        user =
            this.prepareUser(user);


        user.notifications.unshift({

            id:
                Date.now() +
                Math.random(),

            title,

            message,

            type,

            read: false,

            date:
                new Date().toISOString()

        });

    }

};
