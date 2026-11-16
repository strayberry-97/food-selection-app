
from decimal import Decimal
from data_acquisition.sources.csv_source import read_csv, parse_restaurants

# Read the CSV
rows = read_csv(
    "data_acquisition/sources/test_restaurants.csv",
    {"name", "source"}
)

# Parse into RestaurantRecord objects
restaurants = parse_restaurants(rows)

# Test 1: Correct number of records
assert len(restaurants) == 3

# Test 2: Correct object type
assert all(type(r).__name__ == "RestaurantRecord" for r in restaurants)

# Test 3: Rating conversion
assert restaurants[0].rating == Decimal("4.5")


print("CSV rows:", rows)
print("Parsed rating:", repr(restaurants[1].rating))
print("Parsed rating type:", type(restaurants[1].rating))

# Test 4: Missing rating
assert restaurants[1].rating is None

# Test 5: Missing optional fields
assert restaurants[1].cuisine is None
assert restaurants[1].address is None

print("All CSV parser tests passed!")
