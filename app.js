const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

let balance = 1000;

function updateBalance() {
    document.getElementById("balance").textContent = balance;
}

function playGame(game) {
    if (balance < 10) {
        tg.showAlert("Недостатньо ⭐");
        return;
    }

    balance -= 10;

    const win = Math.random() < 0.45;

    if (win) {
        const prize = Math.floor(Math.random() * 40) + 20;
        balance += prize;

        tg.showAlert(
            "🎉 " + game + "\n\nВи виграли " + prize + " ⭐"
        );
    } else {
        tg.showAlert(
            "😢 " + game + "\n\nВи програли 10 ⭐"
        );
    }

    updateBalance();
}

function deposit() {
    tg.showAlert(
        "💰 Поповнення\n\nФункцію поповнення підключимо пізніше."
    );
}

function withdraw() {
    tg.showAlert(
        "💸 Виведення\n\nФункцію виведення підключимо пізніше."
    );
}

updateBalance();