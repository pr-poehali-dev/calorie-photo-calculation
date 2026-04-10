"""
Анализ фотографии блюда с помощью GPT-4 Vision.
Принимает base64-изображение, возвращает название блюда, калории, БЖУ и ингредиенты.
"""
import json
import os
import base64
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    if event.get("httpMethod") != "POST":
        return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}

    body = json.loads(event.get("body") or "{}")
    image_data = body.get("image")
    mime_type = body.get("mimeType", "image/jpeg")

    if not image_data:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "No image provided"})}

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return {"statusCode": 500, "headers": headers, "body": json.dumps({"error": "OpenAI API key not configured"})}

    prompt = """Ты — эксперт-диетолог. Проанализируй фотографию блюда и верни JSON строго в следующем формате (без markdown, только JSON):
{
  "name": "Название блюда на русском",
  "confidence": 92,
  "calories": 520,
  "macros": {
    "protein": 35,
    "fat": 22,
    "carbs": 48
  },
  "ingredients": [
    {"name": "Ингредиент", "weight": 100, "calories": 150}
  ],
  "portion": "примерный размер порции в граммах"
}

Правила:
- confidence: твоя уверенность в распознавании (0-100)
- calories: общая калорийность порции в ккал
- macros: белки/жиры/углеводы в граммах
- ingredients: список основных ингредиентов с весом и калориями
- Если блюдо не распознано — верни confidence < 30 и name "Неизвестное блюдо"
"""

    payload = {
        "model": "gpt-4o",
        "max_tokens": 1000,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime_type};base64,{image_data}",
                            "detail": "high",
                        },
                    },
                ],
            }
        ],
    }

    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            result = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        return {"statusCode": 502, "headers": headers, "body": json.dumps({"error": f"OpenAI error: {error_body}"})}

    content = result["choices"][0]["message"]["content"].strip()

    # Remove markdown code blocks if present
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()

    food_data = json.loads(content)

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps(food_data, ensure_ascii=False),
    }
