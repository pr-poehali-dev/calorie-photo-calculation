import Icon from "@/components/ui/icon";

const historyData = [
  {
    date: "Сегодня",
    totalCalories: 910,
    meals: [
      { name: "Боул с овощами", calories: 420, time: "08:30", emoji: "🥗", protein: 18, fat: 12, carbs: 58 },
      { name: "Куриный суп", calories: 310, time: "13:00", emoji: "🍲", protein: 28, fat: 8, carbs: 22 },
      { name: "Йогурт с ягодами", calories: 180, time: "16:00", emoji: "🍓", protein: 8, fat: 4, carbs: 28 },
    ],
  },
  {
    date: "Вчера",
    totalCalories: 1840,
    meals: [
      { name: "Овсянка с бананом", calories: 380, time: "09:00", emoji: "🌾", protein: 12, fat: 6, carbs: 68 },
      { name: "Греческий салат", calories: 290, time: "13:30", emoji: "🥙", protein: 10, fat: 18, carbs: 14 },
      { name: "Паста карбонара", calories: 720, time: "19:00", emoji: "🍝", protein: 32, fat: 28, carbs: 74 },
      { name: "Яблоко", calories: 80, time: "21:00", emoji: "🍎", protein: 0, fat: 0, carbs: 20 },
    ],
  },
  {
    date: "2 дня назад",
    totalCalories: 2150,
    meals: [
      { name: "Яичница с тостом", calories: 420, time: "08:00", emoji: "🍳", protein: 22, fat: 24, carbs: 28 },
      { name: "Бургер", calories: 860, time: "14:00", emoji: "🍔", protein: 38, fat: 42, carbs: 68 },
      { name: "Сэндвич", calories: 480, time: "19:30", emoji: "🥪", protein: 24, fat: 18, carbs: 52 },
      { name: "Орехи", calories: 390, time: "22:00", emoji: "🥜", protein: 12, fat: 34, carbs: 16 },
    ],
  },
];

function CalorieBadge({ calories, goal = 2000 }: { calories: number; goal?: number }) {
  const pct = calories / goal;
  const color = pct < 0.8 ? "#4ade80" : pct < 1.0 ? "#fb923c" : "#f87171";
  return (
    <span className="font-display font-bold text-sm" style={{ color }}>
      {calories} ккал
    </span>
  );
}

export default function History() {
  return (
    <div className="flex flex-col gap-6 pb-4 animate-fade-up">
      <div className="pt-2">
        <p className="text-muted-foreground text-sm">Дневник</p>
        <h1 className="font-display font-bold text-2xl text-foreground">История приёмов пищи</h1>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Сред. ккал/день", value: "1633", icon: "Flame" },
          { label: "Приёмов пищи", value: "11", icon: "UtensilsCrossed" },
          { label: "Дней трекинга", value: "3", icon: "Calendar" },
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

      {/* History list */}
      {historyData.map((day, di) => (
        <div key={di} className="flex flex-col gap-3 animate-fade-up" style={{ animationDelay: `${di * 0.1}s` }}>
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-base text-foreground">{day.date}</h2>
            <CalorieBadge calories={day.totalCalories} />
          </div>

          <div className="flex flex-col gap-2">
            {day.meals.map((meal, mi) => (
              <div key={mi} className="card-glass rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl shrink-0">
                    {meal.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-foreground truncate">{meal.name}</p>
                      <span className="font-display font-bold text-green-400 text-sm shrink-0 ml-2">{meal.calories} ккал</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{meal.time}</p>
                    <div className="flex gap-3 mt-2">
                      {[
                        { label: "Б", value: meal.protein, color: "#60a5fa" },
                        { label: "Ж", value: meal.fat, color: "#f472b6" },
                        { label: "У", value: meal.carbs, color: "#fb923c" },
                      ].map((m) => (
                        <span key={m.label} className="text-xs font-semibold" style={{ color: m.color }}>
                          {m.label}: {m.value}г
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Day bar */}
          <div className="flex items-center gap-3 px-1">
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((day.totalCalories / 2000) * 100, 100)}%`,
                  background: day.totalCalories > 2000 ? "linear-gradient(90deg, #fb923c, #f87171)" : "linear-gradient(90deg, #4ade80, #22c55e)"
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{Math.round((day.totalCalories / 2000) * 100)}% от нормы</span>
          </div>

          {di < historyData.length - 1 && <div className="h-px bg-white/5 mt-2" />}
        </div>
      ))}
    </div>
  );
}
