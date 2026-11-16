from dataclasses import dataclass, field
from decimal import Decimal
from typing import Optional, List
from datetime import datetime


@dataclass
class RestaurantRecord:
    name: str
    source: str

    source_id: Optional[str] = None
    cuisine: Optional[str] = None
    rating: Optional[Decimal] = None
    address: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    phone: Optional[str] = None
    website: Optional[str] = None

    def __post_init__(self):
        if not self.name.strip():
            raise ValueError('Restaurant name cannot be empty')

        if not self.source.strip():
            raise ValueError('Source cannot be empty')

        if self.rating is not None:
            if type(self.rating) is not Decimal:
                raise TypeError('Rating must be a Decimal')
            
            if not 0 <= self.rating <= 5:
                raise ValueError('Rating must be between 0 and 5')

        if self.latitude is not None:
            if not -90 <= self.latitude <= 90:
                raise ValueError('Latitude must be between -90 and 90')

        if self.longitude is not None:
            if not -180 <= self.longitude <= 180:
                raise ValueError('Longitude must be between -180 and 180')

        

@dataclass
class MealRecord:
    name: str
    restaurant_source_id: str
    source: str

    source_id: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    currency: str = "TRY"
    category: Optional[str] = None
    is_available: Optional[bool] = None

    def __post_init__(self):
        if not self.name.strip():
            raise ValueError('Name cannot be empty')

        if not self.restaurant_source_id.strip():
            raise ValueError('Restaurant source cannot be empty')

        if self.price is not None:
            if type(self.price) is not Decimal:
                        raise TypeError('Price must be a Decimal')
            
            if self.price < 0:
                raise ValueError('Price cannot be negative')

        
@dataclass
class DataImportBatch:
    source: str
    restaurants: List[RestaurantRecord] = field(default_factory=list)
    meals: List[MealRecord] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)
    status: str = 'pending'

    def __post_init__(self):
        if not self.source.strip():
            raise ValueError('Source cannot be empty')
        
        if self.status not in {'pending', 'approved', 'rejected'}:
            raise ValueError("Invalid batch status")

        for item in self.restaurants:
            if not isinstance(item, RestaurantRecord):
                raise ValueError('Invalid restaurants content type')

        for item in self.meals:
            if not isinstance(item, MealRecord):
                raise ValueError('Invalid meals content type')


def validate_restaurant_meal_relationships(restaurants, meals):
    errors = []
    restaurant_ids = {(restaurant.source, restaurant.source_id) for restaurant in restaurants}

    for meal in meals:
        if (meal.source, meal.restaurant_source_id) not in restaurant_ids:
            errors.append(f'{meal.source}, {meal.restaurant_source_id} isn\'t a valid combination')
    
    return errors