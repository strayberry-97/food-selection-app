import unittest
from recommendation_engine.score_meals import score_meal
from datetime import datetime, timedelta

class TestScoreMeal(unittest.TestCase):
    def test_latest_rating_takes_priority(self):
        meal = {
            'meal_id': 1,
            'rating': 4.5,
            'tags': []
        }

        preferences = {'favourite_tags': []}
        history = [
            {
                'meal_id' : 1,
                'eaten_at' : (datetime.now() - timedelta(days=2)).isoformat(),
                'user_rating' : 1
            },
            {
                'meal_id' : 1,
                'eaten_at' : datetime.now().isoformat(),
                'user_rating' : 5
            }
        ]
        declined = []

        self.assertEqual(
            score_meal(meal, preferences, history, declined),
            -61.0
        )
