import unittest
from recommendation_engine.score_meals import score_meal
from datetime import datetime, timedelta

class TestScoreMeal(unittest.TestCase):
    def test_latest_no_rating_key(self):
        meal = {
            'meal_id': 1,
            'rating': 4.5,
            'tags': []
        }

        preferences = None
        history = [
            {
                'meal_id' : 1,
                'eaten_at' : datetime.now().isoformat()
            }
        ]
        declined = []

        self.assertEqual(
            score_meal(meal, preferences, history, declined),
            -91.0
        )