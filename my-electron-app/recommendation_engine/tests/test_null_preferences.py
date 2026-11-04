import unittest
from recommendation_engine.score_meals import score_meal
from datetime import datetime, timedelta

class TestScoreMeal(unittest.TestCase):
    def test_latest_null_rating(self):
        meal = {
            'meal_id': 1,
            'rating': 4.5,
            'tags': []
        }

        preferences = None
        history = []
        declined = []

        self.assertEqual(
            score_meal(meal, preferences, history, declined),
            9.0
        )