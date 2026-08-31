const tg = window.Telegram.WebApp;

// Запускаємо Telegram Mini App
tg.ready();
tg.expand();

// Отримуємо користувача Telegram
const user = tg.initDataUnsafe?.user;

// Елементи сторінки
const usernameElement = document.getElementById("username");
const avatarElement = document.getElementById("avatar");
const balanceElement = document.getElementById("balance");

// Початковий тестовий баланс
let balance = 0;

// Показуємо баланс
balanceElement.textContent = balance;

// Перевіряємо користувача
if (user) {

    // Username
    if (user.username) {
        usernameElement.textContent = "@" + user.username;
    } else {
        usernameElement.textContent = user.first_name || "Гравець";
    }

    // Перша літера імені замість стандартного аватара
    if (user.first_name) {
        avatarElement.textContent =
            user.first_name.charAt(0).toUpperCase();
    }

    // Інформація в консоль
    console.log("Telegram ID:", user.id);
    console.log("Telegram username:", user.username);
    console.log("Telegram first name:", user.first_name);
    console.log("Telegram data:", user);

} else {

    usernameElement.textContent = "Відкрийте через Telegram";

    console.log("Telegram user не знайдений");
}

// Кнопка гри
const playButton = document.querySelector(".play-button");

playButton.addEventListener("click", () => {

    tg.HapticFeedback.impactOccurred("medium");

    console.log("Користувач натиснув ГРАТИ");

}); 