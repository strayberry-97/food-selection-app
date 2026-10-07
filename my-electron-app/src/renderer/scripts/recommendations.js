let recommendation;

async function getRecommendation(){
    
    recommendation = await window.recommendationAPI.getRecommendation();

    document.getElementById('meal-name').textContent = recommendation.name;
    document.getElementById('restaurant-name').textContent = recommendation.restaurant_name;

}

getRecommendation();

document.getElementById('closePopup').addEventListener('click', async () => {
    const popup = document.getElementById('popupOverlay');
    const reason = document.getElementById('select').value;

    console.log(recommendation.meal_id, typeof recommendation.meal_id);
    console.log(reason, typeof reason);

    await window.historyAPI.decline(
        recommendation.meal_id,
        reason
    );
})
