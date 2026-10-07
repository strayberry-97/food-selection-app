let recommendation;

async function getRecommendation(){
    
    recommendation = await window.recommendationAPI.getRecommendation();

    document.getElementById('meal-name').textContent = recommendation.name;
    document.getElementById('restaurant-name').textContent = recommendation.restaurant_name;

}

getRecommendation();

document.getElementById("accept").addEventListener('click', async () => {
    await window.historyAPI.add(
        recommendation.meal_id,
        null
    );
    
    window.location.href = 'index.html';

})

document.getElementById('closePopup').addEventListener('click', async () => {
    const popup = document.getElementById('popupOverlay');
    const reason = document.getElementById('select').value;

    await window.historyAPI.decline(
        recommendation.meal_id,
        reason
    );
})
