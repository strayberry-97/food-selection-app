const homeButton = document.getElementById('homeButton');
if (homeButton) {
    homeButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

const historyButton = document.getElementById('historyButton');
if (historyButton) {
    historyButton.addEventListener('click', () => {
        window.location.href = 'history.html';
    });
}

const pickButton = document.getElementById('pickButton');
if (pickButton) {
    pickButton.addEventListener('click', () => {
        window.location.href = 'thinking.html';
    });
}