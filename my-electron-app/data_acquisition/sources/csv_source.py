import csv
from ..schemas import RestaurantRecord, MealRecord
from decimal import Decimal

class EmptyFileError(Exception):
    pass

def optional_value(row, field):
        value = row.get(field)
        if value is None:
            return None

        value = value.strip()
        return value if value else None

def optional_decimal(row, field):
    value = optional_value(row, field)
    return Decimal(value) if value is not None else None

def boolean(value):
    if value is None or not value.strip():
        return None
    if value.lower().strip() in ['false', 'no', '0']:
        return False
    if value.lower().strip() in ['true', 'yes', '1']:
        return True
    raise ValueError(f"Invalid boolean value: {value}")

def parse_meals(rows):
    meals = []
    for row in rows:
        meals.append(MealRecord(
            name=row['name'],
            restaurant_source_id=row['restaurant_source_id'],
            source= row['source'],
            source_id=optional_value(row, 'source_id'),
            description=optional_value(row, 'description'),
            price=optional_decimal(row, 'price'),
            currency=optional_value(row, 'currency') or 'TRY',
            category=optional_value(row, 'category'),
            is_available=boolean(optional_value(row, 'is_available'))
        ))
    return meals

def parse_restaurants(rows):
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
            reader = csv.DictReader(file, strict=True)
            if reader.fieldnames is None:
                raise EmptyFileError()
            reader.fieldnames = [x.strip() for x in reader.fieldnames]
            headers = set(reader.fieldnames)
            if any (not header for header in reader.fieldnames):
                raise ValueError('CSV contains empty column names')
            if not required.issubset(headers):
                missing = required - headers
                print(f"List doesn't contain required fields: {missing}")
                return []
            return list(reader)
    except FileNotFoundError:
        print("The specified file doesn't exist")
        return []
    except UnicodeDecodeError:
        print("The file cannot be decoded as UTF-8")
        return []
    except EmptyFileError:
        print('The file is empty')
        return []
    except csv.Error as e:
        print(f"Malformed CSV file: {e}")
        return []
    except ValueError:
        return []
