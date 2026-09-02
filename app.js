const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

// ============================================
// KAIROS CONFIG
// ============================================

const SUPABASE_URL =
    "https://tstpkqufbqdaytysmacw.supabase.co";

const KAIROS_FUNCTION_URL =
    SUPABASE_URL + "/functions/v1/Kairos-user";

const DEPOSIT_FUNCTION_URL =
    SUPABASE_URL + "/functions/v1/Kairos-deposit";

// ============================================
// TELEGRAM
// ============================================

const telegramUser =
    tg.initDataUnsafe?.user || null;

// ============================================
// ELEMENTS
// ============================================

const usernameElement =
    document.getElementById("username");

const telegramIdElement =
    document.getElementById("telegramId");

const balanceElement =
    document.getElementById("balance");

const headerAvatar =
    document.getElementById("headerAvatar");

const headerAvatarLetter =
    document.getElementById("headerAvatarLetter");

const profileAvatar =
    document.getElementById("profileAvatar");

const profileAvatarLetter =
    document.getElementById("profileAvatarLetter");

const profileName =
    document.getElementById("profileName");

const profileUsername =
    document.getElementById("profileUsername");

const profileTelegramId =
    document.getElementById("profileTelegramId");

// ============================================
// PLAYER
// ============================================

let player = null;
let balance = 0;

// ============================================
// FORMAT BALANCE
// ============================================

function updateBalance() {

    if (!balanceElement) return;

    balanceElement.textContent =
        Number(balance).toFixed(2);
}

// ============================================
// LOAD TELEGRAM USER
// ============================================

async function loadTelegramUser() {

    if (!telegramUser) {

        if (usernameElement) {
            usernameElement.textContent =
                "Відкрийте через Telegram";
        }

        if (telegramIdElement) {
            telegramIdElement.textContent =
                "Не визначено";
        }

        console.log(
            "Telegram user не знайдений"
        );

        return;
    }

    console.log(
        "Telegram user:",
        telegramUser
    );

    try {

        const response =
            await fetch(
                KAIROS_FUNCTION_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        initData:
                            tg.initData
                    })
                }
            );

        const result =
            await response.json();

        console.log(
            "KAIROS RESPONSE:",
            result
        );

        if (
            !response.ok ||
            !result.success
        ) {

            console.error(
                "KAIROS ERROR:",
                result
            );

            if (usernameElement) {
                usernameElement.textContent =
                    "Помилка авторизації";
            }

            return;
        }

        // ====================================
        // PLAYER
        // ====================================

        player = result.user;

        balance =
            Number(
                player.balance || 0
            );

        // ====================================
        // FULL NAME
        // ====================================

        let fullName =
            player.first_name || "";

        if (player.last_name) {

            fullName +=
                " " +
                player.last_name;
        }

        if (!fullName) {

            fullName =
                "Гравець";
        }

        // ====================================
        // MAIN
        // ====================================

        if (usernameElement) {

            usernameElement.textContent =
                fullName;
        }

        if (telegramIdElement) {

            telegramIdElement.textContent =
                player.telegram_id;
        }

        // ====================================
        // HEADER AVATAR
        // ====================================

        if (
            player.photo_url &&
            headerAvatar
        ) {

            headerAvatar.src =
                player.photo_url;

            headerAvatar.classList.add(
                "visible"
            );

            if (headerAvatarLetter) {

                headerAvatarLetter.style.display =
                    "none";
            }

        } else if (
            headerAvatarLetter
        ) {

            headerAvatarLetter.textContent =
                (
                    player.first_name ||
                    "K"
                )
                    .charAt(0)
                    .toUpperCase();

            headerAvatarLetter.style.display =
                "";
        }

        // ====================================
        // PROFILE
        // ====================================

        if (profileName) {

            profileName.textContent =
                fullName;
        }

        if (profileTelegramId) {

            profileTelegramId.textContent =
                player.telegram_id;
        }

        if (profileUsername) {

            profileUsername.textContent =
                player.username
                    ? "@" + player.username
                    : "Username відсутній";
        }

        // ====================================
        // PROFILE AVATAR
        // ====================================

        if (
            player.photo_url &&
            profileAvatar
        ) {

            profileAvatar.src =
                player.photo_url;

            profileAvatar.classList.add(
                "visible"
            );

            if (profileAvatarLetter) {

                profileAvatarLetter.style.display =
                    "none";
            }

        } else if (
            profileAvatarLetter
        ) {

            profileAvatarLetter.textContent =
                (
                    player.first_name ||
                    "K"
                )
                    .charAt(0)
                    .toUpperCase();

            profileAvatarLetter.style.display =
                "";
        }

        // ====================================
        // BALANCE
        // ====================================

        updateBalance();

        console.log(
            "KAIROS PLAYER:",
            player
        );

        console.log(
            "KAIROS BALANCE:",
            balance
        );

    } catch (error) {

        console.error(
            "Connection error:",
            error
        );

        if (usernameElement) {

            usernameElement.textContent =
                "Помилка підключення";
        }
    }
}

// ============================================
// NAVIGATION
// ============================================

const pages = [
    "homePage",
    "gamesPage",
    "historyPage",
    "profilePage"
];

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );

navItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function () {

                const pageId =
                    item.dataset.page;

                pages.forEach(
                    function (id) {

                        const page =
                            document.getElementById(
                                id
                            );

                        if (page) {

                            page.classList.add(
                                "hidden"
                            );
                        }
                    }
                );

                const selectedPage =
                    document.getElementById(
                        pageId
                    );

                if (selectedPage) {

                    selectedPage.classList.remove(
                        "hidden"
                    );
                }

                navItems.forEach(
                    function (nav) {

                        nav.classList.remove(
                            "active"
                        );
                    }
                );

                item.classList.add(
                    "active"
                );

                if (
                    tg.HapticFeedback
                ) {

                    tg.HapticFeedback
                        .impactOccurred(
                            "light"
                        );
                }
            }
        );
    }
);

// ============================================
// MODAL
// ============================================

const modal =
    document.getElementById("modal");

const modalContent =
    document.getElementById(
        "modalContent"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const modalBg =
    document.getElementById(
        "modalBg"
    );

function openModal(content) {

    if (
        !modal ||
        !modalContent
    ) {
        return;
    }

    modalContent.innerHTML =
        content;

    modal.classList.remove(
        "hidden"
    );

    if (
        tg.HapticFeedback
    ) {

        tg.HapticFeedback
            .impactOccurred(
                "light"
            );
    }
}

function closeModalWindow() {

    if (
        !modal ||
        !modalContent
    ) {
        return;
    }

    modal.classList.add(
        "hidden"
    );

    modalContent.innerHTML =
        "";
}

if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeModalWindow
    );
}

if (modalBg) {

    modalBg.addEventListener(
        "click",
        closeModalWindow
    );
}

// ============================================
// DEPOSIT BUTTON
// ============================================

const depositButton =
    document.getElementById(
        "depositButton"
    );

if (depositButton) {

    depositButton.addEventListener(
        "click",
        createDeposit
    );

    console.log(
        "KAIROS: Deposit button connected"
    );

} else {

    console.error(
        "KAIROS ERROR: depositButton НЕ ЗНАЙДЕНО"
    );
}

// ============================================
// CREATE DEPOSIT
// ============================================

async function createDeposit() {

    console.log(
        "🔥 KAIROS: CREATE DEPOSIT START"
    );

    try {

        const amount =
            prompt(
                "Введіть суму поповнення в USDT:"
            );

        console.log(
            "KAIROS: amount entered:",
            amount
        );

        if (!amount) {

            console.log(
                "KAIROS: user cancelled"
            );

            return;
        }

        const value =
            Number(amount);

        if (
            !Number.isFinite(value) ||
            value < 1
        ) {

            alert(
                "Мінімальна сума — 1 USDT"
            );

            return;
        }

        // ====================================
        // SHOW TEST MESSAGE
        // ====================================

        alert(
            "Запит на поповнення відправляється..."
        );

        console.log(
            "🔥 KAIROS: sending request to:",
            DEPOSIT_FUNCTION_URL
        );

        console.log(
            "KAIROS: initData exists:",
            !!tg.initData
        );

        // ====================================
        // REQUEST
        // ====================================

        const response =
            await fetch(
                DEPOSIT_FUNCTION_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        amount: value,
                        initData:
                            tg.initData
                    })
                }
            );

        console.log(
            "KAIROS: response status:",
            response.status
        );

        const data =
            await response.json();

        console.log(
            "KAIROS DEPOSIT RESPONSE:",
            data
        );

        // ====================================
        // ERROR
        // ====================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Не вдалося створити рахунок"
            );
        }

        // ====================================
        // INVOICE
        // ====================================

        const invoice =
            data.invoice;

        if (!invoice) {

            throw new Error(
                "Crypto Pay не повернув invoice"
            );
        }

        console.log(
            "KAIROS INVOICE:",
            invoice
        );

        // ====================================
        // PAYMENT URL
        // ====================================

        const payUrl =
            invoice.mini_app_invoice_url ||
            invoice.bot_invoice_url ||
            invoice.web_app_invoice_url;

        if (!payUrl) {

            console.error(
                "KAIROS INVOICE:",
                invoice
            );

            throw new Error(
                "Crypto Pay не повернув посилання на оплату"
            );
        }

        console.log(
            "KAIROS PAYMENT URL:",
            payUrl
        );

        // ====================================
        // OPEN TELEGRAM PAYMENT
        // ====================================

        if (
            tg.openTelegramLink
        ) {

            tg.openTelegramLink(
                payUrl
            );

        } else {

            window.open(
                payUrl,
                "_blank"
            );
        }

    } catch (error) {

        console.error(
            "🔥 KAIROS DEPOSIT ERROR:",
            error
        );

        alert(
            "Помилка поповнення:\n\n" +
            (
                error.message ||
                error
            )
        );
    }
}

// ============================================
// WITHDRAW
// ============================================

const withdrawButton =
    document.getElementById(
        "withdrawButton"
    );

if (withdrawButton) {

    withdrawButton.addEventListener(
        "click",
        function () {

            openModal(`
                <div class="page-title">
                    <span>KAIROS</span>
                    <h1>Виведення</h1>
                </div>

                <p style="
                    color:#777c87;
                    font-size:12px;
                    line-height:1.5;
                ">
                    Система виведення
                    буде підключена
                    на наступному етапі.
                </p>
            `);
        }
    );
}

// ============================================
// GAMES
// ============================================

document
    .querySelectorAll("[data-game]")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const game =
                        button.dataset.game;

                    if (
                        tg.HapticFeedback
                    ) {

                        tg.HapticFeedback
                            .impactOccurred(
                                "medium"
                            );
                    }

                    openModal(`
                        <div class="page-title">
                            <span>KAIROS</span>
                            <h1>${game}</h1>
                        </div>

                        <p style="
                            color:#777c87;
                            font-size:12px;
                            line-height:1.5;
                        ">
                            Гра буде підключена
                            на наступному етапі.
                        </p>
                    `);
                }
            );
        }
    );

// ============================================
// ALL GAMES
// ============================================

const allGamesButton =
    document.getElementById(
        "allGamesButton"
    );

if (allGamesButton) {

    allGamesButton.addEventListener(
        "click",
        function () {

            pages.forEach(
                function (id) {

                    const page =
                        document.getElementById(
                            id
                        );

                    if (page) {

                        page.classList.add(
                            "hidden"
                        );
                    }
                }
            );

            const gamesPage =
                document.getElementById(
                    "gamesPage"
                );

            if (gamesPage) {

                gamesPage.classList.remove(
                    "hidden"
                );
            }

            navItems.forEach(
                function (nav) {

                    nav.classList.remove(
                        "active"
                    );
                }
            );

            const gamesNav =
                document.querySelector(
                    '[data-page="gamesPage"]'
                );

            if (gamesNav) {

                gamesNav.classList.add(
                    "active"
                );
            }
        }
    );
}

// ============================================
// PROFILE BUTTON
// ============================================

const headerProfile =
    document.getElementById(
        "headerProfile"
    );

if (headerProfile) {

    headerProfile.addEventListener(
        "click",
        function () {

            pages.forEach(
                function (id) {

                    const page =
                        document.getElementById(
                            id
                        );

                    if (page) {

                        page.classList.add(
                            "hidden"
                        );
                    }
                }
            );

            const profilePage =
                document.getElementById(
                    "profilePage"
                );

            if (profilePage) {

                profilePage.classList.remove(
                    "hidden"
                );
            }

            navItems.forEach(
                function (nav) {

                    nav.classList.remove(
                        "active"
                    );
                }
            );

            const profileNav =
                document.querySelector(
                    '[data-page="profilePage"]'
                );

            if (profileNav) {

                profileNav.classList.add(
                    "active"
                );
            }
        }
    );
}

// ============================================
// START KAIROS
// ============================================

console.log(
    "🚀 KAIROS APP STARTED"
);

console.log(
    "KAIROS initData exists:",
    !!tg.initData
);

console.log(
    "KAIROS deposit URL:",
    DEPOSIT_FUNCTION_URL
);

loadTelegramUser();