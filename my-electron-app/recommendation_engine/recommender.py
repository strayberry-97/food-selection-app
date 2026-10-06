from filter_meals import filter_meals
import sys
import json

data = json.load(sys.stdin)
for meal in data:
    meal['tags'] = meal['tags'].split(',')

history = [
    {
        "meal_id": 12,
        "date": "2026-10-05",
        "rating": 5
    },
    {
        "meal_id": 7,
        "date": "2026-10-03",
        "rating": 3
    }
]

preferences = {
    "max_price" : 500,
    "allowed_cuisine" : None,
    "banned_restaurants" : None,
    "min_restaurant_rating": 4,
    "excluded_tags": ['Chicken', 'Pilaf']
}

def recommend_meal(meals, history = None, preferences = None):
    filtered_meals = filter_meals(meals, preferences)
    return filtered_meals[0] if filtered_meals else None




print(recommend_meal(data, preferences=preferences))