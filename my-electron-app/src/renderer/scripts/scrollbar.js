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