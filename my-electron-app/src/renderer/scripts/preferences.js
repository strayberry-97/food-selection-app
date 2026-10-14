async function populateCuisineDropdown(){
    const select = document.getElementById('allowedCuisines');
    const cuisines = await window.databaseAPI.getCuisines();

    cuisines.forEach (cuisine => {
        const option = document.createElement('option');
        option.value = cuisine.cuisine;
        option.textContent = cuisine.cuisine;
        option.selected = true;
        select.appendChild(option);
    })
}

async function populateRestaurantDropdown(){
    const select = document.getElementById('bannedRestaurants');
    const restaurants = await window.databaseAPI.getRestaurants();

    restaurants.forEach(restaurant => {
        const option = document.createElement('option');
        option.value = restaurant.name;
        option.textContent = restaurant.name;
        select.appendChild(option);
    })
}

async function populateExcludedTags(){
    const select = document.getElementById('excludedTags');
    const tags = await window.databaseAPI.getTags();

    tags.forEach(tag =>{
        const option = document.createElement('option');
        option.value = tag.name;
        option.textContent = tag.name;
        select.appendChild(option);
    })
}

async function populateFavouriteTags(){
    const select = document.getElementById('favouriteTags');
    const tags = await window.databaseAPI.getTags();

    tags.forEach(tag =>{
        const option = document.createElement('option');
        option.value = tag.name;
        option.textContent = tag.name;
        select.appendChild(option);
    })
}

populateCuisineDropdown();

populateRestaurantDropdown();

populateExcludedTags();

populateFavouriteTags();