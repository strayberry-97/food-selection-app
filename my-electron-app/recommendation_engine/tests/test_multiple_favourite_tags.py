import unittest
from recommendation_engine.score_meals import score_meal
from datetime import datetime, timedelta

class TestScoreMeal(unittest.TestCase):
    def test_multiple_favourite_tags(self):
        meal = {
            'meal_id': 1,
            'rating': 4.5,
            'tags': ['italian', 'pasta', 'vegetarian']
        }

        preferences = {'favourite_tags': ['pasta', 'vegetarian']}
        history = []
        declined = []

        self.assertEqual(
            score_meal(meal, preferences, history, declined),
            19.0
        )