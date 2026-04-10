"""
Возвращает историю приёмов пищи пользователя, сгруппированную по дням.
Поддерживает параметры: days (кол-во дней, по умолчанию 7), limit (макс. записей).
"""
import json
import os
import psycopg2
from datetime import datetime, timezone


SCHEMA = "t_p59084912_calorie_photo_calcul"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
    "Content-Type": "application/json",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    user_id = event.get("headers", {}).get("X-User-Id", "default")
    params = event.get("queryStringParameters") or {}
    days = int(params.get("days", 30))
    limit = int(params.get("limit", 200))

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute(
        f"""
        SELECT
          m.id, m.name, m.calories, m.protein, m.fat, m.carbs,
          m.portion, m.confidence, m.photo_url, m.eaten_at
        FROM {SCHEMA}.meals m
        WHERE m.user_id = %s
          AND m.eaten_at >= NOW() - INTERVAL '{days} days'
        ORDER BY m.eaten_at DESC
        LIMIT %s
        """,
        (user_id, limit),
    )
    meal_rows = cur.fetchall()

    if not meal_rows:
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"meals": [], "days": []})}

    meal_ids = [r[0] for r in meal_rows]
    id_list = ",".join(str(i) for i in meal_ids)

    cur.execute(
        f"""
        SELECT meal_id, name, weight, calories
        FROM {SCHEMA}.meal_ingredients
        WHERE meal_id IN ({id_list})
        ORDER BY meal_id, id
        """
    )
    ing_rows = cur.fetchall()
    cur.close()
    conn.close()

    ings_by_meal: dict = {}
    for ing in ing_rows:
        mid, iname, iweight, ical = ing
        ings_by_meal.setdefault(mid, []).append({
            "name": iname,
            "weight": float(iweight) if iweight else 0,
            "calories": ical or 0,
        })

    meals = []
    for row in meal_rows:
        mid, name, cal, prot, fat, carbs, portion, conf, photo_url, eaten_at = row
        meals.append({
            "id": mid,
            "name": name,
            "calories": cal,
            "macros": {
                "protein": float(prot),
                "fat": float(fat),
                "carbs": float(carbs),
            },
            "portion": portion or "",
            "confidence": conf,
            "photo_url": photo_url or "",
            "ingredients": ings_by_meal.get(mid, []),
            "eaten_at": eaten_at.isoformat(),
        })

    # Group by local date label
    from collections import OrderedDict
    days_map: OrderedDict = OrderedDict()
    today = datetime.now(timezone.utc).date()

    for meal in meals:
        eaten = datetime.fromisoformat(meal["eaten_at"])
        d = eaten.date()
        diff = (today - d).days
        if diff == 0:
            label = "Сегодня"
        elif diff == 1:
            label = "Вчера"
        else:
            label = f"{diff} дня назад" if diff < 5 else eaten.strftime("%d.%m.%Y")

        if label not in days_map:
            days_map[label] = {"date": label, "meals": [], "totalCalories": 0}
        days_map[label]["meals"].append(meal)
        days_map[label]["totalCalories"] += meal["calories"]

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({
            "meals": meals,
            "days": list(days_map.values()),
        }, ensure_ascii=False),
    }
