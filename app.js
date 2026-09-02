const tg = window.Telegram?.WebApp;

console.log("KAIROS APP: START");
alert("НОВИЙ APP.JS ЗАПУСТИВСЯ");
if (!tg) {
    console.error("KAIROS ERROR: Telegram WebApp недоступний");
} else {
    tg.ready();
    tg.expand();
}

const SUPABASE_URL =
    "https://tstpkqufbqdaytysmacw.supabase.co";

const AUTH_FUNCTION_URL =
    "https://tstpkqufbqdaytysmacw.supabase.co/functions/v1/Kairos-user";

const DEPOSIT_FUNCTION_URL =
    "https://tstpkqufbqdaytysmacw.supabase.co/functions/v1/bright-handler";

console.log(
    "KAIROS DEPOSIT URL:",
    DEPOSIT_FUNCTION_URL
);

// =====================================
// TELEGRAM USER
// =====================================

let currentUser = null;

async function loadTelegramUser() {

    console.log("KAIROS AUTH: START");

    try {

        if (!tg) {
            throw new Error(
                "Telegram WebApp недоступний"
            );
        }

        console.log(
            "KAIROS INIT DATA:",
            tg.initData ? "Є" : "НЕМАЄ"
        );

        if (!tg.initData) {
            throw new Error(
                "Telegram initData відсутній. Відкрий Mini App через Telegram."
            );
        }

        const response = await fetch(
            AUTH_FUNCTION_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    initData: tg.initData
                })
            }
        );

        console.log(
            "KAIROS AUTH STATUS:",
            response.status
        );

        const result =
            await response.json();

        console.log(
            "KAIROS AUTH RESPONSE:",
            result
        );

        if (!response.ok || !result.success) {
            throw new Error(
                result.error ||
                "Помилка авторизації"
            );
        }

        currentUser =
            result.user;

        updateUserInterface();

        console.log(
            "KAIROS AUTH: SUCCESS"
        );

    } catch (error) {

        console.error(
            "KAIROS AUTH ERROR:",
            error
        );

        showError(
            "Помилка авторизації:\n" +
            error.message
        );
    }
}

// =====================================
// USER INTERFACE
// =====================================

function updateUserInterface() {

    if (!currentUser) {
        return;
    }

    console.log(
        "KAIROS USER:",
        currentUser
    );

    const username =
        document.getElementById(
            "username"
        );

    const telegramId =
        document.getElementById(
            "telegramId"
        );

    const balance =
        document.getElementById(
            "balance"
        );

    const avatar =
        document.getElementById(
            "avatar"
        );

    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );

    if (username) {

        username.textContent =
            currentUser.username
                ? "@" + currentUser.username
                : currentUser.first_name ||
                  "User";
    }

    if (telegramId) {

        telegramId.textContent =
            currentUser.telegram_id ||
            "";
    }

    if (balance) {

        const value =
            Number(
                currentUser.balance || 0
            );

        balance.textContent =
            value.toFixed(2) +
            " USDT";
    }

    if (currentUser.photo_url) {

        if (avatar) {
            avatar.src =
                currentUser.photo_url;
        }

        if (profileAvatar) {
            profileAvatar.src =
                currentUser.photo_url;
        }
    }
}

// =====================================
// DEPOSIT
// =====================================

async function createDeposit() {

    console.log(
        "================================="
    );

    console.log(
        "KAIROS DEPOSIT: BUTTON CLICKED"
    );

    console.log(
        "DEPOSIT URL:",
        DEPOSIT_FUNCTION_URL
    );

    try {

        if (!tg) {

            throw new Error(
                "Telegram WebApp недоступний"
            );
        }

        console.log(
            "INIT DATA:",
            tg.initData
                ? "Є"
                : "НЕМАЄ"
        );

        if (!tg.initData) {

            throw new Error(
                "Telegram initData відсутній"
            );
        }

        const input =
            prompt(
                "Введіть суму поповнення в USDT:"
            );

        console.log(
            "INPUT:",
            input
        );

        if (input === null) {

            console.log(
                "DEPOSIT CANCELLED"
            );

            return;
        }

        const amount =
            Number(
                input
                    .replace(",", ".")
                    .trim()
            );

        console.log(
            "AMOUNT:",
            amount
        );

        if (!Number.isFinite(amount)) {

            throw new Error(
                "Невірна сума"
            );
        }

        if (amount < 1) {

            throw new Error(
                "Мінімальна сума — 1 USDT"
            );
        }

        console.log(
            "KAIROS DEPOSIT: SENDING REQUEST"
        );

        console.log(
            "REQUEST URL:",
            DEPOSIT_FUNCTION_URL
        );

        const requestBody = {

            amount: amount,

            initData: tg.initData
        };

        console.log(
            "REQUEST BODY:",
            {
                amount: amount,
                hasInitData:
                    !!tg.initData
            }
        );

        const response =
            await fetch(
                DEPOSIT_FUNCTION_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            requestBody
                        )
                }
            );

        console.log(
            "KAIROS DEPOSIT HTTP STATUS:",
            response.status
        );

        console.log(
            "KAIROS DEPOSIT HTTP OK:",
            response.ok
        );

        const text =
            await response.text();

        console.log(
            "KAIROS DEPOSIT RAW RESPONSE:",
            text
        );

        let result;

        try {

            result =
                JSON.parse(text);

        } catch {

            throw new Error(
                "Сервер повернув не JSON:\n" +
                text
            );
        }

        console.log(
            "KAIROS DEPOSIT JSON:",
            result
        );

        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                "Помилка створення рахунку"
            );
        }

        console.log(
            "KAIROS DEPOSIT: SUCCESS"
        );

        const invoice =
            result.invoice;

        if (!invoice) {

            throw new Error(
                "Invoice відсутній у відповіді сервера"
            );
        }

        console.log(
            "KAIROS INVOICE:",
            invoice
        );

        const paymentUrl =
            invoice.mini_app_invoice_url ||
            invoice.bot_invoice_url ||
            invoice.web_app_invoice_url;

        console.log(
            "KAIROS PAYMENT URL:",
            paymentUrl
        );

        if (!paymentUrl) {

            throw new Error(
                "Посилання на оплату відсутнє"
            );
        }

        console.log(
            "KAIROS: OPENING PAYMENT"
        );

        tg.openTelegramLink(
            paymentUrl
        );

    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "KAIROS DEPOSIT ERROR:",
            error
        );

        console.error(
            "ERROR MESSAGE:",
            error.message
        );

        console.error(
            "================================="
        );

        showError(
            "Помилка поповнення:\n" +
            error.message
        );
    }
}

// =====================================
// ERROR
// =====================================

function showError(message) {

    console.error(
        "KAIROS SHOW ERROR:",
        message
    );

    alert(message);
}

// =====================================
// DEPOSIT BUTTON
// =====================================
document.addEventListener("click", function (event) {
    console.log("KAIROS CLICK:", event.target);

    if (
        event.target &&
        (
            event.target.id === "depositButton" ||
            event.target.closest("#depositButton")
        )
    ) {
        console.log(
            "KAIROS: DEPOSIT BUTTON CLICK DETECTED"
        );

        alert(
            "КНОПКА ПОПОВНЕННЯ НАТИСНУТА"
        );
    }
});

function setupDepositButton() {
    function setupDepositButton() {

    console.log(
        "KAIROS: SEARCHING DEPOSIT BUTTON"
    );

    const depositButton =
        document.getElementById(
            "depositButton"
        );

    if (!depositButton) {

        console.error(
            "KAIROS ERROR: depositButton НЕ ЗНАЙДЕНО"
        );

        return;
    }

    console.log(
        "KAIROS: depositButton FOUND"
    );

    depositButton.addEventListener(
        "click",
        createDeposit
    );

    console.log(
        "KAIROS: DEPOSIT LISTENER ADDED"
    );
}

// =====================================
// NAVIGATION
// =====================================

function setupNavigation() {

    const homeButton =
        document.getElementById(
            "homeButton"
        );

    const gamesButton =
        document.getElementById(
            "gamesButton"
        );

    const historyButton =
        document.getElementById(
            "historyButton"
        );

    const profileButton =
        document.getElementById(
            "profileButton"
        );

    const homePage =
        document.getElementById(
            "homePage"
        );

    const gamesPage =
        document.getElementById(
            "gamesPage"
        );

    const historyPage =
        document.getElementById(
            "historyPage"
        );

    const profilePage =
        document.getElementById(
            "profilePage"
        );

    function hidePages() {

        if (homePage)
            homePage.style.display =
                "none";

        if (gamesPage)
            gamesPage.style.display =
                "none";

        if (historyPage)
            historyPage.style.display =
                "none";

        if (profilePage)
            profilePage.style.display =
                "none";
    }

    function showPage(page) {

        hidePages();

        if (page) {
            page.style.display =
                "block";
        }
    }

    if (homeButton) {

        homeButton.addEventListener(
            "click",
            () => showPage(homePage)
        );
    }

    if (gamesButton) {

        gamesButton.addEventListener(
            "click",
            () => showPage(gamesPage)
        );
    }

    if (historyButton) {

        historyButton.addEventListener(
            "click",
            () => showPage(historyPage)
        );
    }

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            () => showPage(profilePage)
        );
    }

    showPage(homePage);
}

// =====================================
// START APP
// =====================================

function startApp() {

    console.log(
        "================================="
    );

    console.log(
        "KAIROS APP INITIALIZATION"
    );

    console.log(
        "================================="
    );

    setupDepositButton();

    setupNavigation();

    loadTelegramUser();
}

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startApp
    );

} else {

    startApp();
}
