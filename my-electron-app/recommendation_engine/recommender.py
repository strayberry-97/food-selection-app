from filter_meals import filter_meals

def recommend_meal(meals, history = None, preference = None):
    choice = meals[0]
    for meal in meals:
        if meal['price'] < choice['price']:
            choice = meal
    return choice

import sys
import json

data = json.load(sys.stdin)

print(f"Received {len(data)} meals", flush=True)
print(data[0], flush=True)

meals = [
    {"name": "Sporcu Pilavı", "price": 632},
    {"name": "Something Else", "price": 350},
    {"name": "Another Meal", "price": 280}
]

preferences = {
    "max_price" : 500
}

meals = filter_meals(meals, preferences)

print(meals)