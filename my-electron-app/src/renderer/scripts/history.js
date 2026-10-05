

async function getMeals(){
    const meals = await window.databaseAPI.getMeals();

    console.log(meals);
}

getMeals();