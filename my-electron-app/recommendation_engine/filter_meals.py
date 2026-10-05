def filter_meals(meals, preferences = None):
    if preferences is None:
        return meals
    filtered_by_price = [meal for meal in meals if meal['price'] <= preferences['max_price']]
    filtered_by_rating = [meal for meal in filtered_by_price if meal['restaurant']['rating'] >= preferences['min_restaurant_rating']]
    filtered_by_tags = [meal for meal in filtered_by_rating if not any(tag in preferences['excluded_tags'] for tag in meal['tags'])]
    return filtered_by_tags
