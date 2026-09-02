const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const SUPABASE_URL =
    "https://tstpkqufbqdaytysmacw.supabase.co";

const KAIROS_FUNCTION_URL =
    SUPABASE_URL + "/functions/v1/Kairos-user";

const DEPOSIT_FUNCTION_URL =
    SUPABASE_URL + "/functions/v1/bright-handler";

let currentUser = null;

// =========================
// DOM
// =========================

const usernameEl = document.getElementById("username");
const telegramIdEl = document.getElementById("telegramId");
const balanceEl = document.getElementById("balance");

const avatarEl = document.getElementById("avatar");
const profileAvatarEl = document.getElementById("profileAvatar");

const homePage = document.getElementById("homePage");
const gamesPage = document.getElementById("gamesPage");
const historyPage = document.getElementById("historyPage");
const profilePage = document.getElementById("profilePage");

const depositButton = document.getElementById("depositButton");

// =========================
// HELPERS
// =========================

function setBalance(balance) {
    if (!balanceEl) return;

    const value = Number(balance || 0);

    balanceEl.textContent =
        value.toFixed(2) + " USDT";
}

function setUserData(user) {
    if (!user) return;

    currentUser = user;

    if (usernameEl) {
        usernameEl.textContent =
            user.username
                ? "@" + user.username
                : user.first_name || "User";
    }

    if (telegramIdEl) {
        telegramIdEl.textContent =
            user.telegram_id || "";
    }

    setBalance(user.balance);

    if (user.photo_url) {
        if (avatarEl) {
            avatarEl.src = user.photo_url;
        }

        if (profileAvatarEl) {
            profileAvatarEl.src = user.photo_url;
        }
    }
}

// =========================
// TELEGRAM AUTH
// =========================

async function loadTelegramUser() {
    try {
        console.log("KAIROS: loading Telegram user");

        if (!tg.initData) {
            throw new Error(
                "Telegram initData відсутній. Відкрий Mini App саме через Telegram."
            );
        }

        console.log(
            "KAIROS: initData exists"
        );

        const response = await fetch(
            KAIROS_FUNCTION_URL,
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
            "KAIROS USER STATUS:",
            response.status
        );

        const result = await response.json();

        console.log(
            "KAIROS USER RESPONSE:",
            result
        );

        if (!response.ok || !result.success) {
            throw new Error(
                result.error ||
                "Помилка авторизації"
            );
        }

        setUserData(result.user);

        console.log(
            "KAIROS: авторизація успішна"
        );

    } catch (error) {

        console.error(
            "KAIROS AUTH ERROR:",
            error
        );

        alert(
            "Помилка авторизації:\n" +
            error.message
        );
    }
}

// =========================
// NAVIGATION
// =========================

function hideAllPages() {
    if (homePage) homePage.style.display = "none";
    if (gamesPage) gamesPage.style.display = "none";
    if (historyPage) historyPage.style.display = "none";
    if (profilePage) profilePage.style.display = "none";
}

function showPage(page) {
    hideAllPages();

    if (page) {
        page.style.display = "block";
    }
}

const homeButton =
    document.getElementById("homeButton");

const gamesButton =
    document.getElementById("gamesButton");

const historyButton =
    document.getElementById("historyButton");

const profileButton =
    document.getElementById("profileButton");

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

// =========================
// DEPOSIT
// =========================

async function createDeposit() {

    try {

        if (!tg.initData) {
            throw new Error(
                "Telegram initData відсутній."
            );
        }

        const input =
            prompt(
                "Введіть суму поповнення в USDT:"
            );

        if (input === null) {
            return;
        }

        const amount =
            Number(
                input.replace(",", ".")
            );

        if (!Number.isFinite(amount)) {
            throw new Error(
                "Введіть правильну суму."
            );
        }

        if (amount < 1) {
            throw new Error(
                "Мінімальна сума — 1 USDT."
            );
        }

        console.log(
            "KAIROS DEPOSIT URL:",
            DEPOSIT_FUNCTION_URL
        );

        alert(
            "Запит на поповнення обробляється..."
        );

        const response = await fetch(
            DEPOSIT_FUNCTION_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    amount: amount,
                    initData: tg.initData
                })
            }
        );

        console.log(
            "KAIROS DEPOSIT STATUS:",
            response.status
        );

        const result =
            await response.json();

        console.log(
            "KAIROS DEPOSIT RESPONSE:",
            result
        );

        if (!response.ok || !result.success) {

            throw new Error(
                result.error ||
                "Не вдалося створити рахунок."
            );
        }

        const invoice =
            result.invoice;

        if (!invoice) {
            throw new Error(
                "Сервер не повернув invoice."
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

        if (!paymentUrl) {
            throw new Error(
                "Посилання на оплату не отримано."
            );
        }

        console.log(
            "KAIROS PAYMENT URL:",
            paymentUrl
        );

        tg.openTelegramLink(
            paymentUrl
        );

    } catch (error) {

        console.error(
            "KAIROS DEPOSIT ERROR:",
            error
        );

        alert(
            "Помилка поповнення:\n" +
            error.message
        );
    }
}

// =========================
// DEPOSIT BUTTON
// =========================

if (depositButton) {

    depositButton.addEventListener(
        "click",
        createDeposit
    );

}

// =========================
// START
// =========================

console.log(
    "KAIROS APP STARTED"
);

loadTelegramUser();
