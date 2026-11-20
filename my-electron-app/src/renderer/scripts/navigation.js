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

const preferencesButton = document.getElementById('preferencesButton');
if (preferencesButton) {
    preferencesButton.addEventListener('click', () => {
        window.location.href = 'preferences.html';
    });
}

const importButton = document.getElementById('importButton');
if (importButton) {
    importButton.addEventListener('click', () => {
        window.location.href = 'import.html';
    });
}

const databaseButton = document.getElementById('databaseButton');
if (databaseButton) {
    databaseButton.addEventListener('click', () => {
        window.location.href = 'import.html';
    });
}

const previewButton = document.getElementById('previewButton');
if (previewButton) {
    previewButton.addEventListener('click', () => {
        window.location.href = 'import_preview.html';
    });
}