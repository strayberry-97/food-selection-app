from filter_meals import filter_meals
from score_meals import score_meal
import sys
import json

data = json.load(sys.stdin)

meals = data['meals']
history = data['history']

for meal in meals:
    meal['tags'] = meal['tags'].split(',')

preferences = {
    "max_price" : 500,
    "allowed_cuisine" : None,
    "banned_restaurants" : None,
    "min_restaurant_rating": 4,
    "excluded_tags": ['Pilaf'],
    "favourite_tags": ['Chicken']
}

def recommend_meal(meals, history = None, preferences = None):
    filtered_meals = filter_meals(meals, preferences)
    return max(
        filtered_meals,
        key = lambda meal: score_meal(meal, preferences, history)
        )


recommendation = recommend_meal(meals, history = history, preferences=preferences)

print(json.dumps(recommendation))