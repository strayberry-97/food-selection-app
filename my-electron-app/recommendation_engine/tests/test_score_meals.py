import unittest
from recommendation_engine.score_meals import score_meal

class TestScoreMeal(unittest.TestCase):
    def test_base_score(self):
        meal = {
            'meal_id': 1,
            'rating': 4.5,
            'tags': []
        }

        preferences = {'favourite_tags': []}
        history = []
        declined = []

        self.assertEqual(
            score_meal(meal, preferences, history, declined),
            9.0
        )

