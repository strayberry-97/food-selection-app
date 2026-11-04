import unittest
from recommendation_engine.score_meals import score_meal
from datetime import datetime, timedelta

class TestScoreMeal(unittest.TestCase):
    def test_favourite_tag_increases_score(self):
        meal = {
            'meal_id': 1,
            'rating': 4.5,
            'tags': ['italian', 'pasta']
        }

        preferences = {'favourite_tags': ['pasta']}
        history = []
        declined = []

        self.assertEqual(
            score_meal(meal, preferences, history, declined),
            19.0
        )