import unittest
from recommendation_engine.score_meals import score_meal
from datetime import datetime

class TestScoreMeal(unittest.TestCase):
    def test_declined_two_days_ago(self):
        meal = {
            'meal_id': 1,
            'rating': 4.5,
            'tags': []
        }

        preferences = {'favourite_tags': []}
        history = []
        declined = [
            {
                'meal_id' : 1,
                'declined_at' : datetime.now().isoformat(),
                'reason' : 'Too costly'
            }
        ]

        self.assertEqual(
            score_meal(meal, preferences, history, declined),
            9.0
        )