from datetime import datetime

def score_meal(meal, preferences, history):
    score = 0

    for history_item in history:
        if history_item['meal_id'] == meal['meal_id']:
            eaten_date = datetime.fromisoformat(
                            history_item['eaten_at'].replace('Z', '+00:00')
                        ).date()
            
            day_diff = datetime.now().date()-eaten_date
            match day_diff:
                case 1:
                    score -= 30
                case 2:
                    score -= 20
                case 3: 
                    score -= 10

            match history_item['user_rating']:
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

    score += meal['rating']*2

    return score