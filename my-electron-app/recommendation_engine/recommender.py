from filter_meals import filter_meals
from score_meals import score_meal
import sys
import json

data = json.load(sys.stdin)

meals = data['meals']
history = data['history']
declined = data['declined']

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

def recommend_meal(meals, history = None, preferences = None, declined = None):
    filtered_meals = filter_meals(meals, preferences)

    for meal in filtered_meals:
        meal['score'] = score_meal(meal, preferences, history, declined)
    return max(
        filtered_meals,
        key = lambda meal: meal['score']
        )


recommendation = recommend_meal(meals, history = history, preferences=preferences, declined=declined)

print(json.dumps(recommendation))