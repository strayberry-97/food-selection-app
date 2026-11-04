import unittest
from recommendation_engine.score_meals import score_meal
from datetime import datetime

class TestScoreMeal(unittest.TestCase):
    def test_declined_today(self):
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
                'reason' : 'Just don\'t want it'
            }
        ]

        self.assertEqual(
            score_meal(meal, preferences, history, declined),
            -91.0
        )