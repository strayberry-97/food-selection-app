document.getElementById('minimize').addEventListener('click', () => {
    window.electronAPI.minimize();
});

document.getElementById('close').addEventListener('click', () => {
    window.electronAPI.close();
});


const content = document.getElementById("history-main-content");
const track = document.getElementById("scrollTrack");
const thumb = document.getElementById("scrollThumb");

if (!content || !track || !thumb) {
    console.warn("Custom scrollbar elements are missing.");
} else {
    function updateScrollbar() {
        const contentHeight = content.scrollHeight;
        const visibleHeight = content.clientHeight;
        const trackHeight = track.clientHeight;

        if (!trackHeight || contentHeight <= visibleHeight) {
            thumb.style.height = "0px";
            thumb.style.top = "2px";
            return;
        }

        const inset = 2;
        const usableTrackHeight = Math.max(trackHeight - inset * 2, 0);

        const thumbHeight = Math.min(
            Math.max(20, (visibleHeight / contentHeight) * usableTrackHeight),
            usableTrackHeight
        );

        thumb.style.height = `${thumbHeight}px`;

        const maxScroll = contentHeight - visibleHeight;
        const maxThumbPosition = Math.max(usableTrackHeight - thumbHeight, 0);
        const position = (content.scrollTop / maxScroll) * maxThumbPosition + inset;

        thumb.style.top = `${position}px`;
    }

    const scheduleUpdate = () => requestAnimationFrame(updateScrollbar);

    content.addEventListener("scroll", updateScrollbar);
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("load", scheduleUpdate);
    document.addEventListener("DOMContentLoaded", scheduleUpdate);
    scheduleUpdate();
}

const ratings = document.querySelectorAll('.rating');

ratings.forEach(rating =>{
    const stars = rating.querySelectorAll('.star');
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener("click", ()=> {
            currentRating = Number(star.dataset.rating);

            stars.forEach(s => {
                if (Number(s.dataset.rating) <= currentRating){
                    s.src = "../assets/svg/star-filled.svg";
                } else {
                    s.src = "../assets/svg/star-unfilled.svg";
                }
            })
        })

        star.addEventListener('mouseenter', () =>{
            const hoverRating = Number(star.dataset.rating);

            stars.forEach(s =>{
                if (Number(s.dataset.rating) <= hoverRating){
                    s.src = "../assets/svg/star-filled.svg";
                } else {
                    s.src = "../assets/svg/star-unfilled.svg";
                }
            })
        })
    })
    rating.addEventListener('mouseleave', () =>{
        stars.forEach(s =>{
            if (Number(s.dataset.rating) <= currentRating){
                s.src = "../assets/svg/star-filled.svg";
            }else{
                s.src = "../assets/svg/star-unfilled.svg";
            }
        })
    })
})

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