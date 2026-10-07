
async function getRecommendation(){
    
    const recommendation = await window.recommendationAPI.getRecommendation();

    document.getElementById('meal-name').textContent = recommendation.name;
    document.getElementById('restaurant-name').textContent = recommendation.restaurant_name;

}

getRecommendation();