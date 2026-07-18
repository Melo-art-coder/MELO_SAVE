/* =====================================
   WALLET V2
===================================== */

function updateForeignWallets(){

    const user = JSON.parse(
        localStorage.getItem("meloCurrentUser")
    );

    if(!user) return;

    const balance = Number(user.balance || 0);

    document.getElementById("usdBalance").textContent =
        formatUSD(
            nairaToUSD(balance)
        );

    document.getElementById("eurBalance").textContent =
        formatEUR(
            nairaToEUR(balance)
        );

    document.getElementById("gbpBalance").textContent =
        formatGBP(
            nairaToGBP(balance)
        );

}