import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

type Stage = "idle" | "scanning" | "result";

const mockResult = {
  name: "Боул с лососем и авокадо",
  calories: 520,
  confidence: 94,
  ingredients: [
    { name: "Лосось", weight: 120, calories: 248 },
    { name: "Авокадо", weight: 80, calories: 128 },
    { name: "Рис", weight: 100, calories: 130 },
    { name: "Огурец", weight: 50, calories: 8 },
    { name: "Кунжут", weight: 5, calories: 30 },
  ],
  macros: { protein: 42, fat: 28, carbs: 35 },
};

export default function Camera({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStage("scanning");
    setTimeout(() => setStage("result"), 3000);
  };

  const handleCapture = () => {
    setStage("scanning");
    setTimeout(() => setStage("result"), 3000);
  };

  const handleReset = () => {
    setStage("idle");
    setPreviewUrl(null);
  };

  if (stage === "result") {
    return (
      <div className="flex flex-col gap-5 pb-4 animate-fade-up">
        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleReset} className="w-10 h-10 rounded-2xl card-glass flex items-center justify-center">
            <Icon name="ArrowLeft" size={18} className="text-foreground" />
          </button>
          <h1 className="font-display font-bold text-xl text-foreground">Результат анализа</h1>
        </div>

        {/* Food image */}
        <div className="relative rounded-3xl overflow-hidden h-52">
          {previewUrl ? (
            <img src={previewUrl} alt="Блюдо" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-900/40 to-blue-900/40 flex items-center justify-center">
              <span className="text-6xl">🍱</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="px-2 py-0.5 rounded-full bg-green-400/20 border border-green-400/30">
                <span className="text-green-400 text-xs font-semibold">ИИ уверен на {mockResult.confidence}%</span>
              </div>
            </div>
            <h2 className="font-display font-bold text-white text-xl">{mockResult.name}</h2>
          </div>
        </div>

        {/* Calories big */}
        <div className="card-glass rounded-3xl p-5 gradient-border text-center">
          <p className="text-muted-foreground text-sm mb-1">Калорийность</p>
          <p className="font-display font-black text-5xl gradient-text">{mockResult.calories}</p>
          <p className="text-muted-foreground text-sm">ккал на порцию</p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Белки", value: mockResult.macros.protein, color: "#60a5fa" },
              { label: "Жиры", value: mockResult.macros.fat, color: "#f472b6" },
              { label: "Углеводы", value: mockResult.macros.carbs, color: "#fb923c" },
            ].map((m) => (
              <div key={m.label} className="bg-white/5 rounded-2xl p-3">
                <p className="font-bold text-lg" style={{ color: m.color }}>{m.value}г</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Ингредиенты</h3>
          <div className="flex flex-col gap-2">
            {mockResult.ingredients.map((ing, i) => (
              <div key={i} className="card-glass rounded-2xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{ing.name}</p>
                  <p className="text-xs text-muted-foreground">{ing.weight} г</p>
                </div>
                <p className="font-display font-bold text-green-400">{ing.calories} ккал</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="flex-1 py-4 rounded-2xl font-display font-semibold text-base"
            style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)", color: "#0a0e1a" }}
            onClick={() => onNavigate("history")}
          >
            Добавить в дневник
          </button>
          <button onClick={handleReset} className="w-14 h-14 rounded-2xl card-glass flex items-center justify-center shrink-0">
            <Icon name="RotateCcw" size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  if (stage === "scanning") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-fade-up">
        <div className="relative">
          {/* Rings */}
          <div className="w-48 h-48 rounded-full border-2 border-green-400/20 absolute inset-0 animate-ping" style={{ animationDuration: "1.5s" }} />
          <div className="w-48 h-48 rounded-full border-2 border-green-400/10 absolute inset-0 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="w-48 h-48 rounded-full card-glass flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-6xl animate-float">🍽️</span>
            )}
          </div>
          {/* Scan line */}
          <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan-line" style={{ position: "absolute" }} />
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-xl text-foreground mb-2">Анализирую блюдо...</p>
          <p className="text-muted-foreground text-sm">ИИ определяет ингредиенты и КБЖУ</p>
        </div>
        <div className="flex gap-2">
          {["Распознавание", "Ингредиенты", "Калории"].map((step, i) => (
            <div key={i} className="px-3 py-1.5 rounded-full text-xs font-semibold border" style={{
              borderColor: "rgba(74,222,128,0.3)",
              background: "rgba(74,222,128,0.08)",
              color: "#4ade80",
              animationDelay: `${i * 0.3}s`
            }}>
              {step}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-4 animate-fade-up">
      <div className="pt-2">
        <p className="text-muted-foreground text-sm">ИИ-анализ</p>
        <h1 className="font-display font-bold text-2xl text-foreground">Сфотографируй блюдо</h1>
      </div>

      {/* Camera view */}
      <div
        className="relative rounded-3xl overflow-hidden gradient-border"
        style={{ height: "320px", background: "linear-gradient(135deg, rgba(74,222,128,0.05), rgba(96,165,250,0.05))" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-24 h-24 rounded-3xl card-glass flex items-center justify-center animate-float">
            <span className="text-5xl">📷</span>
          </div>
          <p className="text-muted-foreground text-center text-sm px-8">
            Расположи блюдо в кадре<br />и нажми кнопку съёмки
          </p>
        </div>

        {/* Corner guides */}
        {[
          "top-4 left-4 border-t-2 border-l-2 rounded-tl-xl",
          "top-4 right-4 border-t-2 border-r-2 rounded-tr-xl",
          "bottom-4 left-4 border-b-2 border-l-2 rounded-bl-xl",
          "bottom-4 right-4 border-b-2 border-r-2 rounded-br-xl",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-8 h-8 border-green-400/60 ${cls}`} />
        ))}
      </div>

      {/* Shoot button */}
      <div className="flex items-center justify-center gap-6">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-14 h-14 rounded-2xl card-glass flex items-center justify-center"
        >
          <Icon name="Image" size={22} className="text-muted-foreground" />
        </button>
        <button
          onClick={handleCapture}
          className="w-20 h-20 rounded-full glow-green flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)" }}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Icon name="Scan" size={28} className="text-green-900" />
          </div>
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="w-14 h-14 rounded-2xl card-glass flex items-center justify-center"
        >
          <Icon name="Upload" size={22} className="text-muted-foreground" />
        </button>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "Sun", text: "Хорошее освещение" },
          { icon: "Focus", text: "Блюдо в центре" },
          { icon: "Maximize2", text: "Крупный план" },
          { icon: "Eye", text: "Вид сверху" },
        ].map((tip, i) => (
          <div key={i} className="card-glass rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-400/10 flex items-center justify-center shrink-0">
              <Icon name={tip.icon} size={16} className="text-green-400" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}