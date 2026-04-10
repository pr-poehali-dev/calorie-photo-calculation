const SAVE_MEAL_URL = "https://functions.poehali.dev/45a24542-cc23-4dd4-b3e0-a3e38c22700d";
const GET_MEALS_URL = "https://functions.poehali.dev/a19f9128-3bf9-44e8-84e7-d05ed43b52a8";

const USER_ID = "default";

export interface FoodResult {
  name: string;
  confidence: number;
  calories: number;
  macros: { protein: number; fat: number; carbs: number };
  ingredients: { name: string; weight: number; calories: number }[];
  portion: string;
}

export interface Meal extends FoodResult {
  id: number;
  eaten_at: string;
  photo_url?: string;
}

export interface DayGroup {
  date: string;
  meals: Meal[];
  totalCalories: number;
}

export async function saveMeal(food: FoodResult, photoUrl?: string): Promise<{ id: number; eaten_at: string }> {
  const resp = await fetch(SAVE_MEAL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-User-Id": USER_ID },
    body: JSON.stringify({ ...food, photo_url: photoUrl || "" }),
  });
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error || "Ошибка сохранения");
  }
  return resp.json();
}

export async function getMeals(days = 30): Promise<{ meals: Meal[]; days: DayGroup[] }> {
  const resp = await fetch(`${GET_MEALS_URL}?days=${days}`, {
    headers: { "X-User-Id": USER_ID },
  });
  if (!resp.ok) throw new Error("Ошибка загрузки истории");
  return resp.json();
}
