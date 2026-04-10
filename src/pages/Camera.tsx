import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const ANALYZE_URL = "https://functions.poehali.dev/08f164e2-0672-409b-af45-791051261249";

type Stage = "idle" | "scanning" | "result" | "error";

interface FoodResult {
  name: string;
  confidence: number;
  calories: number;
  macros: { protein: number; fat: number; carbs: number };
  ingredients: { name: string; weight: number; calories: number }[];
  portion: string;
}

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [meta, base64] = result.split(",");
      const mimeType = meta.match(/:(.*?);/)?.[1] || "image/jpeg";
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Camera({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const analyzeFile = async (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStage("scanning");

    try {
      const { base64, mimeType } = await fileToBase64(file);
      const resp = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Ошибка сервера");
      }

      const data: FoodResult = await resp.json();
      setResult(data);
      setStage("result");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Не удалось проанализировать фото");
      setStage("error");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyzeFile(file);
  };

  const handleReset = () => {
    setStage("idle");
    setPreviewUrl(null);
    setResult(null);
    setErrorMsg("");
    if (fileRef.current) fileRef.current.value = "";
  };

  if (stage === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-fade-up">
        <div className="w-20 h-20 rounded-3xl bg-red-400/10 flex items-center justify-center">
          <span className="text-4xl">😕</span>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-xl text-foreground mb-2">Не удалось распознать</p>
          <p className="text-muted-foreground text-sm px-8">{errorMsg}</p>
        </div>
        <button
          onClick={handleReset}
          className="px-8 py-3 rounded-2xl font-display font-semibold"
          style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)", color: "#0a0e1a" }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (stage === "result" && result) {
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
                <span className="text-green-400 text-xs font-semibold">ИИ уверен на {result.confidence}%</span>
              </div>
              {result.portion && (
                <div className="px-2 py-0.5 rounded-full bg-white/10">
                  <span className="text-white/70 text-xs">{result.portion}</span>
                </div>
              )}
            </div>
            <h2 className="font-display font-bold text-white text-xl">{result.name}</h2>
          </div>
        </div>

        {/* Calories */}
        <div className="card-glass rounded-3xl p-5 gradient-border text-center">
          <p className="text-muted-foreground text-sm mb-1">Калорийность</p>
          <p className="font-display font-black text-5xl gradient-text">{result.calories}</p>
          <p className="text-muted-foreground text-sm">ккал на порцию</p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Белки", value: result.macros.protein, color: "#60a5fa" },
              { label: "Жиры", value: result.macros.fat, color: "#f472b6" },
              { label: "Углеводы", value: result.macros.carbs, color: "#fb923c" },
            ].map((m) => (
              <div key={m.label} className="bg-white/5 rounded-2xl p-3">
                <p className="font-bold text-lg" style={{ color: m.color }}>{m.value}г</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        {result.ingredients.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Ингредиенты</h3>
            <div className="flex flex-col gap-2">
              {result.ingredients.map((ing, i) => (
                <div key={i} className="card-glass rounded-2xl px-4 py-3 flex items-center justify-between animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{ing.name}</p>
                    <p className="text-xs text-muted-foreground">{ing.weight} г</p>
                  </div>
                  <p className="font-display font-bold text-green-400">{ing.calories} ккал</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
        <div className="relative w-48 h-48">
          <div className="w-48 h-48 rounded-full border-2 border-green-400/20 absolute inset-0 animate-ping" style={{ animationDuration: "1.5s" }} />
          <div className="w-48 h-48 rounded-full border-2 border-green-400/10 absolute inset-0 animate-ping" style={{ animationDuration: "2.2s" }} />
          <div className="w-48 h-48 rounded-full card-glass flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-6xl animate-float">🍽️</span>
            )}
          </div>
          <div
            className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan-line"
            style={{ position: "absolute" }}
          />
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-xl text-foreground mb-2">Анализирую блюдо...</p>
          <p className="text-muted-foreground text-sm">ИИ определяет ингредиенты и КБЖУ</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {["Распознавание", "Ингредиенты", "Калории"].map((step, i) => (
            <div
              key={i}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border animate-fade-up"
              style={{
                borderColor: "rgba(74,222,128,0.3)",
                background: "rgba(74,222,128,0.08)",
                color: "#4ade80",
                animationDelay: `${i * 0.3}s`,
              }}
            >
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

      {/* Camera placeholder */}
      <div
        className="relative rounded-3xl overflow-hidden gradient-border"
        style={{ height: "320px", background: "linear-gradient(135deg, rgba(74,222,128,0.05), rgba(96,165,250,0.05))" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-24 h-24 rounded-3xl card-glass flex items-center justify-center animate-float">
            <span className="text-5xl">📷</span>
          </div>
          <p className="text-muted-foreground text-center text-sm px-8">
            Загрузи фото блюда<br />ИИ определит состав и калории
          </p>
        </div>
        {[
          "top-4 left-4 border-t-2 border-l-2 rounded-tl-xl",
          "top-4 right-4 border-t-2 border-r-2 rounded-tr-xl",
          "bottom-4 left-4 border-b-2 border-l-2 rounded-bl-xl",
          "bottom-4 right-4 border-b-2 border-r-2 rounded-br-xl",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-8 h-8 border-green-400/60 ${cls}`} />
        ))}
      </div>

      {/* Buttons */}
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => {
            if (fileRef.current) {
              fileRef.current.removeAttribute("capture");
              fileRef.current.click();
            }
          }}
          className="w-14 h-14 rounded-2xl card-glass flex items-center justify-center"
        >
          <Icon name="Image" size={22} className="text-muted-foreground" />
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="w-20 h-20 rounded-full glow-green flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)" }}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Icon name="Scan" size={28} className="text-green-900" />
          </div>
        </button>
        <button
          onClick={() => {
            if (fileRef.current) {
              fileRef.current.removeAttribute("capture");
              fileRef.current.click();
            }
          }}
          className="w-14 h-14 rounded-2xl card-glass flex items-center justify-center"
        >
          <Icon name="Upload" size={22} className="text-muted-foreground" />
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground">Нажми большую кнопку для съёмки или боковые для загрузки из галереи</p>

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
