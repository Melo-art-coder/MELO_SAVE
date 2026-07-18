/* =====================================
   MELOSAV LIVE EXCHANGE RATES V2
===================================== */

console.log("LIVE RATES V2 LOADED");

let ExchangeRates = {

    USD: 0,

    EUR: 0,

    GBP: 0

};

/* ==========================
   GET LIVE RATES
========================== */

async function loadExchangeRates(){

    try{

        const response = await fetch(
            "https://open.er-api.com/v6/latest/NGN"
        );

        const data = await response.json();

        ExchangeRates.USD = data.rates.USD;
        ExchangeRates.EUR = data.rates.EUR;
        ExchangeRates.GBP = data.rates.GBP;

        updateForeignWallets();

        console.log("Exchange rates updated");

    }catch(error){

        console.error(error);

        /* Offline fallback */

        ExchangeRates.USD = 1/1530;
        ExchangeRates.EUR = 1/1760;
        ExchangeRates.GBP = 1/2040;

        updateForeignWallets();

    }

}

/* ==========================
   CONVERSIONS
========================== */

function nairaToUSD(amount){

    return amount * ExchangeRates.USD;

}

function nairaToEUR(amount){

    return amount * ExchangeRates.EUR;

}

function nairaToGBP(amount){

    return amount * ExchangeRates.GBP;

}

/* ==========================
   FORMATTERS
========================== */

function formatUSD(amount){

    return "$" + amount.toFixed(2);

}

function formatEUR(amount){

    return "€" + amount.toFixed(2);

}

function formatGBP(amount){

    return "£" + amount.toFixed(2);

}