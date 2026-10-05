from filter_meals import filter_meals
import sys
import json

data = json.load(sys.stdin)
for meal in data:
    meal['tags'] = meal['tags'].split(',')

preferences = {
    "max_price" : 500,
    "allowed_cuisine" : None,
    "banned_restaurants" : None,
    "min_restaurant_rating": 4,
    "excluded_tags": ['Chicken']
}

def recommend_meal(meals, history = None, preferences = None):
    return filter_meals(meals, preferences)[0]




print(recommend_meal(data, preferences=preferences))