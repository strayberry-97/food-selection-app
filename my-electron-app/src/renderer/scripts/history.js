

async function getHistory(){
    const history = await window.historyAPI.retrieve();

    const main = document.getElementById('history-main-content');

    for (const meal of history){
        const date = new Date(meal.eaten_at);
        main.insertAdjacentHTML('beforeend', `
        <div class="history-card" data-history-id = "${meal.history_id}">
            <p>DATE: <span class="order-date">${date.toLocaleDateString()}</span></p>
            <div class="history-card-meal">
                <span class="meal-name">${meal.meal_name} from ${meal.restaurant_name}</span>
                <span class="rating">
                    <img class='star' data-rating='1' src="../assets/svg/star-unfilled.svg">
                    <img class='star' data-rating='2' src="../assets/svg/star-unfilled.svg">
                    <img class='star' data-rating='3' src="../assets/svg/star-unfilled.svg">
                    <img class='star' data-rating='4' src="../assets/svg/star-unfilled.svg">
                    <img class='star' data-rating='5' src="../assets/svg/star-unfilled.svg">
                </span>
            </div>
        </div>
        `)
    }



    const ratings = document.querySelectorAll('.rating');

    ratings.forEach(rating =>{
        const stars = rating.querySelectorAll('.star');
        const historyId = rating.closest('.history-card').dataset.historyId;
        const meal = history.find(meal => meal.history_id == historyId);
        let currentRating = meal.user_rating || 0;

        stars.forEach(s => {
            if (Number(s.dataset.rating) <= currentRating){
                s.src = "../assets/svg/star-filled.svg";
            }
        })

        stars.forEach(star => {
            star.addEventListener("click", async ()=> {
                currentRating = Number(star.dataset.rating);

                await window.historyAPI.updateRating(
                    historyId, 
                    currentRating
                );

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
}

getHistory();




    
