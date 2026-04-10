"""
Сохраняет приём пищи (результат ИИ-анализа блюда) в базу данных.
"""
import json
import os
import psycopg2


SCHEMA = "t_p59084912_calorie_photo_calcul"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
    "Content-Type": "application/json",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    user_id = event.get("headers", {}).get("X-User-Id", "default")

    name = body.get("name")
    calories = body.get("calories")
    macros = body.get("macros", {})
    ingredients = body.get("ingredients", [])
    portion = body.get("portion", "")
    confidence = body.get("confidence")
    photo_url = body.get("photo_url", "")

    if not name or calories is None:
        return {
            "statusCode": 400,
            "headers": CORS,
            "body": json.dumps({"error": "name and calories are required"}),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute(
        f"""
        INSERT INTO {SCHEMA}.meals
          (user_id, name, calories, protein, fat, carbs, portion, confidence, photo_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id, eaten_at
        """,
        (
            user_id,
            name,
            int(calories),
            float(macros.get("protein", 0)),
            float(macros.get("fat", 0)),
            float(macros.get("carbs", 0)),
            portion,
            confidence,
            photo_url,
        ),
    )
    meal_id, eaten_at = cur.fetchone()

    for ing in ingredients:
        cur.execute(
            f"""
            INSERT INTO {SCHEMA}.meal_ingredients (meal_id, name, weight, calories)
            VALUES (%s, %s, %s, %s)
            """,
            (
                meal_id,
                ing.get("name", ""),
                float(ing.get("weight", 0)),
                int(ing.get("calories", 0)),
            ),
        )

    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({
            "id": meal_id,
            "eaten_at": eaten_at.isoformat(),
        }),
    }
