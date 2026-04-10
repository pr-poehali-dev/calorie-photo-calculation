import { useState } from "react";
import Icon from "@/components/ui/icon";

const goals = [
  { id: "lose", label: "Похудение", emoji: "🔥", desc: "Дефицит калорий" },
  { id: "maintain", label: "Поддержание", emoji: "⚖️", desc: "Текущий вес" },
  { id: "gain", label: "Набор массы", emoji: "💪", desc: "Профицит калорий" },
];

const diets = [
  { id: "balanced", label: "Сбалансированное", emoji: "🥗" },
  { id: "keto", label: "Кето", emoji: "🥩" },
  { id: "vegan", label: "Веганское", emoji: "🌱" },
  { id: "paleo", label: "Палео", emoji: "🍖" },
];

export default function Profile() {
  const [activeGoal, setActiveGoal] = useState("lose");
  const [activeDiet, setActiveDiet] = useState("balanced");
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);

  return (
    <div className="flex flex-col gap-6 pb-4 animate-fade-up">
      {/* Header */}
      <div className="pt-2">
        <p className="text-muted-foreground text-sm">Настройки</p>
        <h1 className="font-display font-bold text-2xl text-foreground">Профиль</h1>
      </div>

      {/* Avatar + name */}
      <div className="card-glass rounded-3xl p-5 gradient-border flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center font-display font-black text-3xl text-green-900"
            style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)" }}>
            А
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center glow-green">
            <Icon name="Check" size={12} className="text-green-900" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-xl text-foreground">Алексей Смирнов</h2>
          <p className="text-muted-foreground text-sm">alexey@email.com</p>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-400/10 text-green-400 border border-green-400/20">
              Pro план
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/5 text-muted-foreground">
              7 дней трекинга
            </span>
          </div>
        </div>
      </div>

      {/* Body params */}
      <div>
        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Параметры тела</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Возраст", value: "28", unit: "лет", color: "#60a5fa" },
            { label: "Вес", value: "78", unit: "кг", color: "#4ade80" },
            { label: "Рост", value: "182", unit: "см", color: "#fb923c" },
          ].map((p, i) => (
            <div key={i} className="card-glass rounded-2xl p-4 text-center">
              <p className="font-display font-black text-2xl" style={{ color: p.color }}>{p.value}</p>
              <p className="text-xs text-muted-foreground">{p.unit}</p>
              <p className="text-xs text-foreground/60 mt-1">{p.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div>
        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Цель</h2>
        <div className="flex flex-col gap-2">
          {goals.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGoal(g.id)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200"
              style={{
                background: activeGoal === g.id ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeGoal === g.id ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <span className="text-2xl">{g.emoji}</span>
              <div className="flex-1 text-left">
                <p className={`font-semibold text-sm ${activeGoal === g.id ? "text-green-400" : "text-foreground"}`}>{g.label}</p>
                <p className="text-xs text-muted-foreground">{g.desc}</p>
              </div>
              {activeGoal === g.id && (
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center shrink-0">
                  <Icon name="Check" size={12} className="text-green-900" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Diet type */}
      <div>
        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Тип питания</h2>
        <div className="grid grid-cols-2 gap-2">
          {diets.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDiet(d.id)}
              className="flex items-center gap-3 p-3 rounded-2xl transition-all duration-200"
              style={{
                background: activeDiet === d.id ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeDiet === d.id ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <span className="text-xl">{d.emoji}</span>
              <span className={`text-sm font-semibold ${activeDiet === d.id ? "text-green-400" : "text-muted-foreground"}`}>{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Calorie goal */}
      <div className="card-glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-sm text-foreground">Дневная норма калорий</p>
            <p className="text-xs text-muted-foreground">Рассчитано по формуле Миффлина</p>
          </div>
          <span className="font-display font-black text-2xl text-green-400">2000</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-2/3 rounded-full" style={{ background: "linear-gradient(90deg, #4ade80, #22c55e)" }} />
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Уведомления</h2>
        <div className="flex flex-col gap-2">
          {[
            { label: "Push-уведомления", desc: "Напоминания о приёмах пищи", state: notifications, toggle: setNotifications },
            { label: "Напоминания", desc: "Время для записи блюда", state: reminders, toggle: setReminders },
          ].map((n, i) => (
            <div key={i} className="card-glass rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-foreground">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <button
                onClick={() => n.toggle(!n.state)}
                className="w-12 h-6 rounded-full transition-all duration-300 relative shrink-0"
                style={{ background: n.state ? "linear-gradient(90deg, #4ade80, #22c55e)" : "rgba(255,255,255,0.1)" }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300"
                  style={{ left: n.state ? "calc(100% - 1.375rem)" : "0.125rem" }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2">
        {[
          { icon: "Shield", label: "Конфиденциальность" },
          { icon: "HelpCircle", label: "Помощь и поддержка" },
          { icon: "Star", label: "Оценить приложение" },
        ].map((item, i) => (
          <button key={i} className="card-glass rounded-2xl p-4 flex items-center gap-3 w-full">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <Icon name={item.icon} size={18} className="text-muted-foreground" />
            </div>
            <span className="flex-1 text-left text-sm font-semibold text-foreground">{item.label}</span>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>

      <button className="w-full py-4 rounded-2xl font-display font-semibold text-sm text-red-400 border border-red-400/20 bg-red-400/5 transition-all">
        Выйти из аккаунта
      </button>
    </div>
  );
}
