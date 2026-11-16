import csv
from ..schemas import RestaurantRecord
from decimal import Decimal

def parse_restaurants(rows):
    def optional_value(row, field):
        value = row.get(field)
        if value is None:
            return None

        value = value.strip()
        return value if value else None

    def optional_decimal(row, field):
        value = optional_value(row, field)
        return Decimal(value) if value is not None else None
    
    restaurants = []
    for row in rows:
        restaurants.append(RestaurantRecord(name=row['name'],
                                            source=row['source'],
                                            rating=optional_decimal(row, 'rating'),
                                            source_id=optional_value(row, 'source_id'),
                                            cuisine=optional_value(row, 'cuisine'),
                                            address=optional_value(row, 'address'),
                                            latitude=optional_decimal(row, 'latitude'),
                                            longitude=optional_decimal(row, 'longitude'),
                                            phone=optional_value(row, 'phone'),
                                            website=optional_value(row, 'website'),
                                            ))

    return restaurants


def read_csv(file_path, required = None):
    try:
        with open(file_path, encoding="utf-8") as file:
            if required is None:
                required = set()
            reader = csv.DictReader(file)
            headers = set(reader.fieldnames or [])
            if not required.issubset(headers):
                print("List doesn't contain required fields")
                return []
            return list(reader)
    except FileNotFoundError:
        print("The specified file doesn't exist")
        return []
    except UnicodeDecodeError:
        print("The file cannot be decoded as UTF-8")
        return []
