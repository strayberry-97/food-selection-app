import unittest
from recommendation_engine.score_meals import score_meal
from datetime import datetime

class TestScoreMeal(unittest.TestCase):
    def test_four_star_rating(self):
        meal = {
            'meal_id': 1,
            'rating': 4.5,
            'tags': []
        }

        preferences = {'favourite_tags': []}
        history = [
            {
                'meal_id' : 1,
                'eaten_at' : datetime.now().isoformat(),
                'user_rating' : 4
            }
        ]
        declined = []

        self.assertEqual(
            score_meal(meal, preferences, history, declined),
            -71.0
        )