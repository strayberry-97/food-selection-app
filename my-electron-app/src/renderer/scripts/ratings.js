

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