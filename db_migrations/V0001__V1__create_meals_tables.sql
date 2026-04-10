CREATE TABLE IF NOT EXISTS t_p59084912_calorie_photo_calcul.meals (
  id          SERIAL PRIMARY KEY,
  user_id     TEXT NOT NULL DEFAULT 'default',
  name        TEXT NOT NULL,
  calories    INTEGER NOT NULL,
  protein     NUMERIC(6,1) NOT NULL DEFAULT 0,
  fat         NUMERIC(6,1) NOT NULL DEFAULT 0,
  carbs       NUMERIC(6,1) NOT NULL DEFAULT 0,
  portion     TEXT,
  confidence  INTEGER,
  photo_url   TEXT,
  eaten_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p59084912_calorie_photo_calcul.meal_ingredients (
  id        SERIAL PRIMARY KEY,
  meal_id   INTEGER NOT NULL REFERENCES t_p59084912_calorie_photo_calcul.meals(id),
  name      TEXT NOT NULL,
  weight    NUMERIC(7,1),
  calories  INTEGER
);

CREATE INDEX IF NOT EXISTS idx_meals_user_eaten ON t_p59084912_calorie_photo_calcul.meals(user_id, eaten_at DESC);
CREATE INDEX IF NOT EXISTS idx_meal_ingredients_meal ON t_p59084912_calorie_photo_calcul.meal_ingredients(meal_id);
