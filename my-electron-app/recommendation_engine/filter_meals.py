def filter_meals(meals, preferences = None):
    if preferences is None:
        return meals
    if preferences['max_price'] is not None:
        meals = [meal for meal in meals if meal['price'] <= preferences['max_price']]
    if preferences['min_restaurant_rating'] is not None:
        meals = [meal for meal in meals if meal['rating'] >= preferences['min_restaurant_rating']]
    if preferences['excluded_tags'] is not None:
        meals = [meal for meal in meals if not any(tag in preferences['excluded_tags'] for tag in meal['tags'])]
    if preferences['allowed_cuisine'] is not None:
        meals = [meal for meal in meals if meal['cuisine'] in preferences['allowed_cuisine']]
    if preferences['banned_restaurants'] is not None:
        meals = [meal for meal in meals if meal['restaurant_name'] not in preferences['banned_restaurants']]
    return meals
