import Icon from "@/components/ui/icon";

const weekData = [
  { day: "Пн", calories: 1840, goal: 2000 },
  { day: "Вт", calories: 2150, goal: 2000 },
  { day: "Ср", calories: 1680, goal: 2000 },
  { day: "Чт", calories: 2300, goal: 2000 },
  { day: "Пт", calories: 1920, goal: 2000 },
  { day: "Сб", calories: 2450, goal: 2000 },
  { day: "Вс", calories: 910, goal: 2000, today: true },
];

const nutrients = [
  { name: "Витамин C", value: 82, unit: "%", color: "#fb923c", icon: "🍊" },
  { name: "Железо", value: 64, unit: "%", color: "#f472b6", icon: "💪" },
  { name: "Кальций", value: 71, unit: "%", color: "#60a5fa", icon: "🥛" },
  { name: "Клетчатка", value: 48, unit: "%", color: "#4ade80", icon: "🌿" },
  { name: "Омега-3", value: 35, unit: "%", color: "#a78bfa", icon: "🐟" },
  { name: "Цинк", value: 58, unit: "%", color: "#fbbf24", icon: "⚡" },
];

const weekMax = Math.max(...weekData.map((d) => d.calories));

export default function Stats() {
  const avgCalories = Math.round(weekData.reduce((s, d) => s + d.calories, 0) / weekData.length);

  return (
    <div className="flex flex-col gap-6 pb-4 animate-fade-up">
      <div className="pt-2">
        <p className="text-muted-foreground text-sm">Аналитика</p>
        <h1 className="font-display font-bold text-2xl text-foreground">Статистика питания</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Среднесуточно", value: avgCalories, unit: "ккал", icon: "TrendingUp", color: "#4ade80" },
          { label: "Цель", value: 2000, unit: "ккал", icon: "Target", color: "#60a5fa" },
          { label: "Норма белка", value: "87", unit: "из 120г", icon: "Dumbbell", color: "#f472b6" },
          { label: "Дней подряд", value: "7", unit: "дней", icon: "Flame", color: "#fb923c" },
        ].map((kpi, i) => (
          <div key={i} className="card-glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}20` }}>
                <Icon name={kpi.icon} size={14} style={{ color: kpi.color }} />
              </div>
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
            </div>
            <p className="font-display font-black text-2xl text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.unit}</p>
          </div>
        ))}
      </div>

      {/* Weekly Bar Chart */}
      <div className="card-glass rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-base text-foreground">Калории за неделю</h2>
          <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-white/5">7 дней</span>
        </div>

        {/* Goal line hint */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-0.5 border-t-2 border-dashed border-green-400/50" />
          <span className="text-xs text-muted-foreground">Цель: 2000 ккал</span>
        </div>

        <div className="flex items-end gap-2 h-36">
          {weekData.map((d, i) => {
            const height = (d.calories / weekMax) * 100;
            const overGoal = d.calories > d.goal;
            const isToday = d.today;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end" style={{ height: "112px" }}>
                  <div
                    className="w-full rounded-xl transition-all duration-700 relative overflow-hidden"
                    style={{
                      height: `${height}%`,
                      background: isToday
                        ? "linear-gradient(180deg, #4ade80, #22c55e)"
                        : overGoal
                        ? "linear-gradient(180deg, #fb923c, #f97316)"
                        : "rgba(255,255,255,0.08)",
                      minHeight: "8px",
                    }}
                  >
                    {isToday && (
                      <div className="absolute inset-0 animate-shimmer" />
                    )}
                  </div>
                </div>
                <span className={`text-xs font-semibold ${isToday ? "text-green-400" : "text-muted-foreground"}`}>{d.day}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(#4ade80, #22c55e)" }} />
            <span className="text-xs text-muted-foreground">Сегодня</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(#fb923c, #f97316)" }} />
            <span className="text-xs text-muted-foreground">Превышение</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-white/10" />
            <span className="text-xs text-muted-foreground">В норме</span>
          </div>
        </div>
      </div>

      {/* Macro pie (visual) */}
      <div className="card-glass rounded-3xl p-5">
        <h2 className="font-display font-semibold text-base text-foreground mb-4">Баланс КБЖУ (среднее)</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Protein 30% */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#60a5fa" strokeWidth="12"
                strokeDasharray={`${0.30 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`} strokeDashoffset="0" />
              {/* Fat 25% */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#f472b6" strokeWidth="12"
                strokeDasharray={`${0.25 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                strokeDashoffset={`-${0.30 * 2 * Math.PI * 38}`} />
              {/* Carbs 45% */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#fb923c" strokeWidth="12"
                strokeDasharray={`${0.45 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                strokeDashoffset={`-${0.55 * 2 * Math.PI * 38}`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-muted-foreground font-semibold">КБЖУ</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            {[
              { label: "Белки", pct: 30, g: 87, color: "#60a5fa" },
              { label: "Жиры", pct: 25, g: 52, color: "#f472b6" },
              { label: "Углеводы", pct: 45, g: 198, color: "#fb923c" },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m.color }} />
                <span className="text-sm text-muted-foreground flex-1">{m.label}</span>
                <span className="font-display font-bold text-sm text-foreground">{m.g}г</span>
                <span className="text-xs text-muted-foreground w-8 text-right">{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nutrients */}
      <div>
        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Микронутриенты</h2>
        <div className="grid grid-cols-2 gap-3">
          {nutrients.map((n, i) => (
            <div key={i} className="card-glass rounded-2xl p-4 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{n.icon}</span>
                <span className="text-sm font-semibold text-foreground">{n.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${n.value}%`, background: n.color }} />
                </div>
                <span className="text-xs font-bold shrink-0" style={{ color: n.color }}>{n.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
