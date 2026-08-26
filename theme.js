/* =====================================================
   MELOSAV — THEME ENGINE
===================================================== */

const MELO_THEMES = {

    purple: {

        name: "Purple",

        accent: "#7B2CFF",

        dark: "#5D20D1",

        soft:
            "rgba(123,44,255,.10)",

        rgb:
            "123,44,255"

    },


    blue: {

        name: "Ocean Blue",

        accent: "#2878FF",

        dark: "#145BD0",

        soft:
            "rgba(40,120,255,.10)",

        rgb:
            "40,120,255"

    },


    green: {

        name: "Emerald",

        accent: "#16A36A",

        dark: "#08784B",

        soft:
            "rgba(22,163,106,.10)",

        rgb:
            "22,163,106"

    },


    pink: {

        name: "Pink",

        accent: "#E94D91",

        dark: "#C83272",

        soft:
            "rgba(233,77,145,.10)",

        rgb:
            "233,77,145"

    },


    orange: {

        name: "Orange",

        accent: "#F07824",

        dark: "#C6570E",

        soft:
            "rgba(240,120,36,.10)",

        rgb:
            "240,120,36"

    },


    red: {

        name: "Ruby",

        accent: "#D9415D",

        dark: "#B72A45",

        soft:
            "rgba(217,65,93,.10)",

        rgb:
            "217,65,93"

    },


    cyan: {

        name: "Cyan",

        accent: "#159EBD",

        dark: "#087B95",

        soft:
            "rgba(21,158,189,.10)",

        rgb:
            "21,158,189"

    },


    gold: {

        name: "Gold",

        accent: "#C49318",

        dark: "#98720C",

        soft:
            "rgba(196,147,24,.10)",

        rgb:
            "196,147,24"

    },


    espresso: {

        name: "Espresso",

        accent: "#754936",

        dark: "#573124",

        soft:
            "rgba(117,73,54,.10)",

        rgb:
            "117,73,54"

    },


    midnight: {

        name: "Midnight",

        accent: "#252A36",

        dark: "#151923",

        soft:
            "rgba(37,42,54,.10)",

        rgb:
            "37,42,54"

    }

};


/* =====================================================
   GET SAVED THEME
===================================================== */

function getMeloTheme() {

    return (
        localStorage.getItem(
            "meloTheme"
        ) ||
        "purple"
    );

}


/* =====================================================
   APPLY THEME
===================================================== */

function applyMeloTheme(
    themeName
) {

    const theme =
        MELO_THEMES[
            themeName
        ] ||
        MELO_THEMES.purple;


    const root =
        document.documentElement;


    root.style.setProperty(
        "--melo-accent",
        theme.accent
    );


    root.style.setProperty(
        "--melo-accent-dark",
        theme.dark
    );


    root.style.setProperty(
        "--melo-accent-soft",
        theme.soft
    );


    root.style.setProperty(
        "--melo-accent-rgb",
        theme.rgb
    );


    root.dataset.theme =
        themeName;

}


/* =====================================================
   LOAD THEME
===================================================== */

function loadTheme() {

    const theme =
        getMeloTheme();


    applyMeloTheme(
        theme
    );

}


/* =====================================================
   SAVE THEME
===================================================== */

function saveMeloTheme(
    themeName
) {

    if (
        !MELO_THEMES[
            themeName
        ]
    ) {

        themeName =
            "purple";

    }


    localStorage.setItem(

        "meloTheme",

        themeName

    );


    applyMeloTheme(
        themeName
    );


    const user =
        typeof getCurrentUser ===
        "function"
            ? getCurrentUser()
            : null;


    if (user) {

        user.themeColor =
            themeName;


        if (
            typeof saveUser ===
            "function"
        ) {

            saveUser(
                user
            );

        }

    }

}


/* =====================================================
   AUTO LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    loadTheme
);
