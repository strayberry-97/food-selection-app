from .sources.csv_source import read_csv, parse_meals, parse_restaurants
from .schemas import validate_restaurant_meal_relationships, DataImportBatch
from pathlib import Path



def batch_import():
    meals_path = Path("data_acquisition/sources/test_meals.csv")
    restaurants_path = Path("data_acquisition/sources/test_restaurants.csv")

    meals_unparsed = read_csv(meals_path, {'name', 'restaurant_source_id', 'source'})
    restaurants_unparsed = read_csv(restaurants_path, {'name', 'source'})

    meals = parse_meals(meals_unparsed)
    restaurants = parse_restaurants(restaurants_unparsed)

    errors = validate_restaurant_meal_relationships(restaurants, meals)


    result = DataImportBatch(source='test_source',
                             restaurants=restaurants,
                             meals=meals,
                             status= "invalid" if errors else "pending",
                             errors=errors)

    return result

if __name__ == '__main__':
    result = batch_import()
    print(result)