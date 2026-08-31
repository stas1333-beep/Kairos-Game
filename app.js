const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
// ============================================
// TELEGRAM USER
// ============================================
const user = tg.initDataUnsafe?.user;
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
// BALANCE
// ============================================
let balance = 0;
// ============================================
// USER REGISTRATION
// ============================================
if (user) {
    const telegramId = user.id;
    const firstName =
        user.first_name || "";
    const lastName =
        user.last_name || "";
    const username =
        user.username || "";
    const photoUrl =
        user.photo_url || "";
    // Full name
    let fullName = firstName;
    if (lastName) {
        fullName += " " + lastName;
    }
    if (!fullName) {
        fullName = "Гравець";
    }
    // ========================================
    // MAIN USER
    // ========================================
    usernameElement.textContent =
        fullName;
    telegramIdElement.textContent =
        telegramId;
    // ========================================
    // HEADER AVATAR
    // ========================================
    if (photoUrl) {
        headerAvatar.src = photoUrl;
        headerAvatar.classList.add("visible");
        headerAvatarLetter.style.display =
            "none";
    } else {
        headerAvatarLetter.textContent =
            firstName
                ? firstName.charAt(0).toUpperCase()
                : "K";
    }
    // ========================================
    // PROFILE
    // ========================================
    profileName.textContent =
        fullName;
    profileTelegramId.textContent =
        telegramId;
    profileUsername.textContent =
        username
            ? "@" + username
            : "Username відсутній";
    if (photoUrl) {
        profileAvatar.src = photoUrl;
        profileAvatar.classList.add("visible");
        profileAvatarLetter.style.display =
            "none";
    } else {
        profileAvatarLetter.textContent =
            firstName
                ? firstName.charAt(0).toUpperCase()
                : "K";
    }
    // ========================================
    // LOAD BALANCE
    // ========================================
    const savedBalance =
        localStorage.getItem(
            "kairos_balance_" + telegramId
        );
    if (savedBalance !== null) {
        balance =
            Number(savedBalance);
    } else {
        balance = 0;
        localStorage.setItem(
            "kairos_balance_" + telegramId,
            "0"
        );
    }
    updateBalance();
    // ========================================
    // SAVE PLAYER
    // ========================================
    const player = {
        telegram_id: telegramId,
        first_name: firstName,
        last_name: lastName,
        username: username,
        photo_url: photoUrl,
        registered: true
    };
    localStorage.setItem(
        "kairos_player",
        JSON.stringify(player)
    );
    console.log(
        "KAIROS PLAYER:",
        player
    );
} else {
    usernameElement.textContent =
        "Відкрийте через Telegram";
    telegramIdElement.textContent =
        "Не визначено";
    console.log(
        "Telegram user не знайдений"
    );
}
// ============================================
// UPDATE BALANCE
// ============================================
function updateBalance() {
    balanceElement.textContent =
        balance.toFixed(2);
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
    document.querySelectorAll(".nav-item");
navItems.forEach(item => {
    item.addEventListener("click", () => {
        const pageId =
            item.dataset.page;
        pages.forEach(id => {
            const page =
                document.getElementById(id);
            if (page) {
                page.classList.add("hidden");
            }
        });
        const selectedPage =
            document.getElementById(pageId);
        if (selectedPage) {
            selectedPage.classList.remove("hidden");
        }
        navItems.forEach(nav => {
            nav.classList.remove("active");
        });
        item.classList.add("active");
        tg.HapticFeedback.impactOccurred(
            "light"
        );
    });
});
// ============================================
// MODAL
// ============================================
const modal =
    document.getElementById("modal");
const modalContent =
    document.getElementById("modalContent");
const closeModal =
    document.getElementById("closeModal");
const modalBg =
    document.getElementById("modalBg");
function openModal(content) {
    modalContent.innerHTML =
        content;
    modal.classList.remove("hidden");
    tg.HapticFeedback.impactOccurred(
        "light"
    );
}
function closeModalWindow() {
    modal.classList.add("hidden");
    modalContent.innerHTML = "";
}
closeModal.addEventListener(
    "click",
    closeModalWindow
);
modalBg.addEventListener(
    "click",
    closeModalWindow
);
// ============================================
// DEPOSIT
// ============================================
document
    .getElementById("depositButton")
    .addEventListener("click", () => {
        openModal(`
            <div class="page-title">
                <span>KAIROS</span>
                <h1>Поповнення</h1>
            </div>
            <p style="
                color:#777c87;
                font-size:12px;
                line-height:1.5;
            ">
                Тут буде підключено реальне
                поповнення балансу.
            </p>
        `);
    });
// ============================================
// WITHDRAW
// ============================================
document
    .getElementById("withdrawButton")
    .addEventListener("click", () => {
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
                Тут буде підключено систему
                виведення коштів.
            </p>
        `);
    });
// ============================================
// GAMES
// ============================================
document
    .querySelectorAll("[data-game]")
    .forEach(button => {
        button.addEventListener(
            "click",
            () => {
                const game =
                    button.dataset.game;
                tg.HapticFeedback
                    .impactOccurred("medium");
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
    });
// ============================================
// ALL GAMES
// ============================================
document
    .getElementById("allGamesButton")
    .addEventListener("click", () => {
        pages.forEach(id => {
            const page =
                document.getElementById(id);
            if (page) {
                page.classList.add("hidden");
            }
        });
        document
            .getElementById("gamesPage")
            .classList.remove("hidden");
        navItems.forEach(nav => {
            nav.classList.remove("active");
        });
        document
            .querySelector(
                '[data-page="gamesPage"]'
            )
            .classList.add("active");
    });
// ============================================
// PROFILE BUTTON
// ============================================
document
    .getElementById("headerProfile")
    .addEventListener("click", () => {
        pages.forEach(id => {
            const page =
                document.getElementById(id);
            if (page) {
                page.classList.add("hidden");
            }
        });
        document
            .getElementById("profilePage")
            .classList.remove("hidden");
        navItems.forEach(nav => {
            nav.classList.remove("active");
        });
        document
            .querySelector(
                '[data-page="profilePage"]'
            )
            .classList.add("active");
    });