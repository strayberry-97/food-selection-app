

async function getRecommendation(){
    const meals = getMeals();
    const recommendation = await window.recommendationAPI.getRecommendation();
}