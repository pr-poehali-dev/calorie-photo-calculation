import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { getMeals, type DayGroup, type Meal } from "@/lib/api";

function CalorieBadge({ calories, goal = 2000 }: { calories: number; goal?: number }) {
  const pct = calories / goal;
  const color = pct < 0.8 ? "#4ade80" : pct < 1.0 ? "#fb923c" : "#f87171";
  return <span className="font-display font-bold text-sm" style={{ color }}>{calories} ккал</span>;
}

function timeLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function MealCard({ meal }: { meal: Meal }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <button className="w-full p-4 flex items-center gap-3 text-left" onClick={() => setOpen(!open)}>
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0">
          {meal.photo_url ? (
            <img src={meal.photo_url} alt={meal.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-foreground truncate pr-2">{meal.name}</p>
            <span className="font-display font-bold text-green-400 text-sm shrink-0">{meal.calories} ккал</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{timeLabel(meal.eaten_at)}</p>
          <div className="flex gap-3 mt-1.5">
            {[
              { label: "Б", value: meal.macros.protein, color: "#60a5fa" },
              { label: "Ж", value: meal.macros.fat, color: "#f472b6" },
              { label: "У", value: meal.macros.carbs, color: "#fb923c" },
            ].map((m) => (
              <span key={m.label} className="text-xs font-semibold" style={{ color: m.color }}>
                {m.label}: {Math.round(m.value)}г
              </span>
            ))}
          </div>
        </div>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground shrink-0 ml-1" />
      </button>

      {open && meal.ingredients.length > 0 && (
        <div className="px-4 pb-4 flex flex-col gap-1.5 border-t border-white/5 pt-3">
          {meal.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {ing.name} <span className="text-white/30">({ing.weight}г)</span>
              </span>
              <span className="text-green-400 font-semibold">{ing.calories} ккал</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function History() {
  const [days, setDays] = useState<DayGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMeals(30)
      .then((data) => setDays(data.days))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const allMeals = days.flatMap((d) => d.meals);
  const avgCalories = days.length
    ? Math.round(days.reduce((s, d) => s + d.totalCalories, 0) / days.length)
    : 0;

  return (
    <div className="flex flex-col gap-6 pb-4 animate-fade-up">
      <div className="pt-2">
        <p className="text-muted-foreground text-sm">Дневник</p>
        <h1 className="font-display font-bold text-2xl text-foreground">История приёмов пищи</h1>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Сред. ккал/день", value: loading ? "—" : String(avgCalories), icon: "Flame" },
          { label: "Приёмов пищи", value: loading ? "—" : String(allMeals.length), icon: "UtensilsCrossed" },
          { label: "Дней трекинга", value: loading ? "—" : String(days.length), icon: "Calendar" },
        ].map((s, i) => (
          <div key={i} className="card-glass rounded-2xl p-3 text-center">
            <div className="w-8 h-8 rounded-xl bg-green-400/10 flex items-center justify-center mx-auto mb-2">
              <Icon name={s.icon} size={16} className="text-green-400" />
            </div>
            <p className="font-display font-bold text-lg text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-glass rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="card-glass rounded-2xl p-4 text-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && days.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <span className="text-5xl">🍽️</span>
          <div className="text-center">
            <p className="font-display font-bold text-lg text-foreground">История пуста</p>
            <p className="text-muted-foreground text-sm mt-1">
              Сфотографируй первое блюдо,<br />чтобы начать дневник питания
            </p>
          </div>
        </div>
      )}

      {!loading && days.map((day, di) => (
        <div key={di} className="flex flex-col gap-3 animate-fade-up" style={{ animationDelay: `${di * 0.08}s` }}>
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-base text-foreground">{day.date}</h2>
            <CalorieBadge calories={day.totalCalories} />
          </div>

          <div className="flex flex-col gap-2">
            {day.meals.map((meal) => <MealCard key={meal.id} meal={meal} />)}
          </div>

          <div className="flex items-center gap-3 px-1">
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min((day.totalCalories / 2000) * 100, 100)}%`,
                  background: day.totalCalories > 2000
                    ? "linear-gradient(90deg, #fb923c, #f87171)"
                    : "linear-gradient(90deg, #4ade80, #22c55e)",
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {Math.round((day.totalCalories / 2000) * 100)}% от нормы
            </span>
          </div>

          {di < days.length - 1 && <div className="h-px bg-white/5 mt-2" />}
        </div>
      ))}
    </div>
  );
}
