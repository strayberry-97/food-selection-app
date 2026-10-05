const popupOverlay = document.getElementById('popupOverlay');
const openPopup = document.getElementById('openPopup');
const closePopup = document.getElementById('closePopup');

if (openPopup && popupOverlay) {
    openPopup.addEventListener('click', () => {
        popupOverlay.classList.add('visible');
    });
}

if (closePopup && popupOverlay) {
    closePopup.addEventListener('click', () => {
        popupOverlay.classList.remove('visible');
    });
}