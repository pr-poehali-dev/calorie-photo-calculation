import { useState } from "react";
import Icon from "@/components/ui/icon";

const FOOD_IMAGE = "https://cdn.poehali.dev/projects/c8379170-7687-4c17-9e48-b3d00f75517f/files/c36c7c22-c911-44aa-9aa0-6c419d855801.jpg";

const todayMeals = [
  { name: "Боул с овощами", calories: 420, time: "08:30", emoji: "🥗" },
  { name: "Куриный суп", calories: 310, time: "13:00", emoji: "🍲" },
  { name: "Йогурт с ягодами", calories: 180, time: "16:00", emoji: "🍓" },
];

const macros = [
  { label: "Белки", value: 87, max: 120, color: "#60a5fa", unit: "г" },
  { label: "Жиры", value: 52, max: 80, color: "#f472b6", unit: "г" },
  { label: "Углеводы", value: 198, max: 250, color: "#fb923c", unit: "г" },
];

export default function Home({ onNavigate }: { onNavigate: (page: string) => void }) {
  const totalCalories = todayMeals.reduce((s, m) => s + m.calories, 0);
  const calorieGoal = 2000;
  const progress = (totalCalories / calorieGoal) * 100;

  return (
    <div className="flex flex-col gap-6 pb-4 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-muted-foreground text-sm">Доброе утро 👋</p>
          <h1 className="font-display font-bold text-2xl text-foreground">Дашборд питания</h1>
        </div>
        <button
          onClick={() => onNavigate("profile")}
          className="w-11 h-11 rounded-2xl card-glass flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white">А</div>
        </button>
      </div>

      {/* Calorie Ring Card */}
      <div className="card-glass rounded-3xl p-5 gradient-border">
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="url(#grad)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-bold text-xl text-foreground">{totalCalories}</span>
              <span className="text-muted-foreground text-xs">ккал</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-muted-foreground text-sm mb-1">Сегодня</p>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="font-display font-bold text-3xl text-foreground">{totalCalories}</span>
              <span className="text-muted-foreground text-sm">/ {calorieGoal} ккал</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%`, background: "linear-gradient(90deg, #4ade80, #60a5fa)" }}
                />
              </div>
              <span className="text-xs text-green-400 font-semibold">{Math.round(progress)}%</span>
            </div>
            <p className="text-muted-foreground text-xs mt-2">Осталось: {calorieGoal - totalCalories} ккал</p>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div>
        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Макронутриенты</h2>
        <div className="grid grid-cols-3 gap-3">
          {macros.map((m) => (
            <div key={m.label} className="card-glass rounded-2xl p-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground">{m.label}</span>
                <span className="font-display font-bold text-xl" style={{ color: m.color }}>
                  {m.value}<span className="text-xs font-normal text-muted-foreground">{m.unit}</span>
                </span>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(m.value / m.max) * 100}%`, background: m.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Scan */}
      <button
        onClick={() => onNavigate("camera")}
        className="rounded-3xl p-5 flex items-center gap-4 text-left w-full glow-green"
        style={{ background: "linear-gradient(135deg, #166534, #15803d, #16a34a)" }}
      >
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 animate-float">
          <span className="text-3xl">📷</span>
        </div>
        <div>
          <p className="font-display font-bold text-white text-lg">Сфотографировать блюдо</p>
          <p className="text-green-200 text-sm">ИИ определит состав и калории</p>
        </div>
        <Icon name="ChevronRight" size={20} className="ml-auto text-green-200 shrink-0" />
      </button>

      {/* Today meals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider">Сегодня съедено</h2>
          <button onClick={() => onNavigate("history")} className="text-xs text-green-400 font-semibold">Вся история →</button>
        </div>
        <div className="flex flex-col gap-2">
          {todayMeals.map((meal, i) => (
            <div key={i} className="card-glass rounded-2xl p-4 flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0">
                {meal.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{meal.name}</p>
                <p className="text-xs text-muted-foreground">{meal.time}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-green-400 text-sm">{meal.calories}</p>
                <p className="text-xs text-muted-foreground">ккал</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero image */}
      <div className="rounded-3xl overflow-hidden relative h-40">
        <img src={FOOD_IMAGE} alt="Здоровое питание" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
          <p className="font-display font-bold text-white text-lg">Ешь осознанно 🌿</p>
        </div>
      </div>
    </div>
  );
}
