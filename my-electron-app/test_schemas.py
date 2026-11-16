
from decimal import Decimal
import data_acquisition.sources.csv_source as csv

rows = csv.read_csv(
    "data_acquisition/sources/test_meals.csv",
    {"name"}
)

meals = csv.parse_meals(rows)

for meal in meals:
    print(meal)