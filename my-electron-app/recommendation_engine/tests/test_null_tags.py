import unittest
from recommendation_engine.score_meals import score_meal
from datetime import datetime, timedelta

class TestScoreMeal(unittest.TestCase):
    def test_null_tags(self):
        meal = {
            'meal_id': 1,
            'rating': 4.5,
            'tags': None
        }

        preferences = {'favourite_tags': []}
        history = []
        declined = []

        self.assertEqual(
            score_meal(meal, preferences, history, declined),
            9.0
        )