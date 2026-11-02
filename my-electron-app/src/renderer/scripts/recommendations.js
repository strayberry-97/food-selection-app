let recommendation;

async function getRecommendation(){
    
    recommendation = await window.recommendationAPI.getRecommendation();

    console.log(recommendation);

    if (recommendation === null){
        document.getElementById('meal-name').textContent = '';
        document.getElementById('from').textContent = 'Preferences too restrictive, nothing returned';
        document.getElementById('restaurant-name').textContent = '';
        document.getElementById('result-buttons').hidden = true;
        document.getElementById('error-buttons').hidden = false;
    }else{
        document.getElementById('meal-name').textContent = recommendation.name;
        document.getElementById('from').textContent = 'from';
        document.getElementById('restaurant-name').textContent = recommendation.restaurant_name;
        document.getElementById('result-buttons').hidden = false;
        document.getElementById('error-buttons').hidden = true;
    }

    
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
    const reason = document.getElementById('select').value;

    await window.historyAPI.decline(
        recommendation.meal_id,
        reason
    );

    window.location.href = 'index.html';

})

document.getElementById('go-to-preferences').addEventListener('click', () => {
    window.location.href = 'preferences.html';
})

document.getElementById('back-home').addEventListener('click', () => {
    window.location.href = 'index.html';
})