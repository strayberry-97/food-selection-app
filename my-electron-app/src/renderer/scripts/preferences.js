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

function getPreferences(){
    return {
        max_price : getMaxPrice(),
        allowed_cuisine: getAllowedCuisines(),
        banned_restaurants: getBannedRestaurants(),
        min_restaurant_rating: getMinRestaurantRating(),
        excluded_tags: getExcludedTags(),
        favourite_tags: getFavouriteTags()
    };
}

function getMaxPrice(){
    const maxPrice = document.getElementById('maxPrice').value;
    return maxPrice === '' ? null : Number(maxPrice);
}

function getAllowedCuisines(){
    const select = document.getElementById('allowedCuisines');
    const cuisines = Array.from(select.selectedOptions).map(option => option.value);
    return cuisines;
}

function getBannedRestaurants(){
    const select = document.getElementById('bannedRestaurants');
    const banned = Array.from(select.selectedOptions).map(option => option.value);
    return banned;
}

function getMinRestaurantRating(){
    const rating = document.getElementById('minRestaurantRating').value;
    return rating === '' ? null : Number(rating);
}

function getExcludedTags(){
    const select = document.getElementById('excludedTags');
    const excludedTags = Array.from(select.selectedOptions).map(option => option.value);
    return excludedTags;
}

function getFavouriteTags(){
    const select = document.getElementById('favouriteTags');
    const favourite = Array.from(select.selectedOptions).map(option => option.value);
    return favourite;
}

function applyPreferences(preferences){
    if (!preferences) return;
    document.getElementById('maxPrice').value = preferences.max_price ?? '';

    document.getElementById('minRestaurantRating').value =
        preferences.min_restaurant_rating ?? '';

    setSelectedOptions('allowedCuisines', preferences.allowed_cuisine);
    setSelectedOptions('bannedRestaurants', preferences.banned_restaurants);
    setSelectedOptions('excludedTags', preferences.excluded_tags);
    setSelectedOptions('favouriteTags', preferences.favourite_tags);
}

function setSelectedOptions(elementId, values) {
    const select = document.getElementById(elementId);

    Array.from(select.options).forEach(option => {
        if (values === null) {
            option.selected = true;
        } else {
            option.selected = values.includes(option.value);
        }
    });
}







async function initializePreferences(){
    await Promise.all([
        populateCuisineDropdown(),
        populateRestaurantDropdown(),
        populateExcludedTags(),
        populateFavouriteTags()
    ])

    const savedPreferences = await window.databaseAPI.loadPreferences();

    if (savedPreferences){
        applyPreferences(savedPreferences);
    }
    document.querySelectorAll('#preferences-main-content input, #preferences-main-content select')
    .forEach(element =>{
        element.addEventListener('change', async () =>{
            const preferences = getPreferences();
            
            await window.databaseAPI.savePreferences(preferences);

            console.log('Preferences saved');
        })
    })
}

initializePreferences();