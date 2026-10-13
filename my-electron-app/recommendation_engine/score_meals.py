from datetime import datetime

def score_meal(meal, preferences, history, declined):
    score = 0

    meal_history = [
        item for item in history
        if item['meal_id'] == meal['meal_id']
    ]

    if meal_history:

        latest_meal = max(
            meal_history,
            key = lambda item: datetime.fromisoformat(
                        item['eaten_at'].replace('Z', '+00:00')
                    )
        )
        eaten_date = datetime.fromisoformat(
                        latest_meal['eaten_at'].replace('Z', '+00:00')
                    ).date()
            
        day_diff = (datetime.now().date()-eaten_date).days

        match day_diff:
            case 0:
                score -= 100
            case 1:
                score -= 30
            case 2:
                score -= 20
            case 3: 
                score -= 10

        rated_history = [
            item for item in meal_history
            if item['user_rating'] is not None
        ]

        if rated_history:
            latest_rating = max(
                rated_history,
                key=lambda item: datetime.fromisoformat(
                    item['eaten_at'].replace('Z', '+00:00')
                )
            )['user_rating']

            match latest_rating:
                case 5:
                    score += 30
                case 4:
                    score += 20
                case 2:
                    score -= 15
                case 1:
                    score -= 30

    if any(tag in preferences['favourite_tags'] for tag in meal['tags']):
        score += 10

    if declined:
        only_declines_for_meal_x = [ declined_meal for declined_meal in declined if declined_meal['meal_id'] == meal['meal_id']]
        if only_declines_for_meal_x:
            latest_decline = max(only_declines_for_meal_x,
                                key=lambda item: datetime.fromisoformat(item['declined_at'].replace('Z', '+00:00')))
            declined_date = datetime.fromisoformat(latest_decline['declined_at'].replace('Z', '+00:00')).date()
            day_diff = (datetime.now().date()-declined_date).days
            if latest_decline['reason'] in ["Just don't want it", "Had similar option recently"]:
                match day_diff:
                    case 0: score -= 100
                    case 1: score -= 80
                    case 2: score -= 50
                    case 3: score -= 20


    score += meal['rating'] * 2

    return score