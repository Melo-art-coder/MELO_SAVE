/* =====================================
   MELOSAV EXCHANGE RATES V1
===================================== */

console.log("RATES V1 LOADED");

const ExchangeRates = {

    NGN:1,

    USD:1530,

    EUR:1760,

    GBP:2040

};


/* ==========================
   NAIRA TO OTHERS
========================== */

function nairaToUSD(amount){

    return amount / ExchangeRates.USD;

}

function nairaToEUR(amount){

    return amount / ExchangeRates.EUR;

}

function nairaToGBP(amount){

    return amount / ExchangeRates.GBP;

}


/* ==========================
   FORMATTERS
========================== */

function formatUSD(amount){

    return "$" + Number(amount).toLocaleString(
        "en-US",
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    );

}

function formatEUR(amount){

    return "€" + Number(amount).toLocaleString(
        "de-DE",
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    );

}

function formatGBP(amount){

    return "£" + Number(amount).toLocaleString(
        "en-GB",
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    );

}