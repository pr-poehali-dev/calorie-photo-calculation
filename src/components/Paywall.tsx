import { useState } from "react";
import Icon from "@/components/ui/icon";

const CARD_NUMBER = "2204 1201 2696 5561";

interface PaywallProps {
  onGrantAccess: () => void;
  daysLeft?: number;
}

export default function Paywall({ onGrantAccess, daysLeft = 0 }: PaywallProps) {
  const [selected, setSelected] = useState<"once" | "sub">("sub");
  const [copied, setCopied] = useState(false);
  const [sentRequest, setSentRequest] = useState(false);

  const price = selected === "once" ? "10 ₽" : "100 ₽/мес";
  const label = selected === "once" ? "Навсегда" : "В месяц";

  const copyCard = () => {
    navigator.clipboard.writeText("2204120126965561");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (sentRequest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-fade-up px-4">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)" }}>
          <Icon name="Clock" size={40} className="text-green-900" />
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-2xl text-foreground mb-2">Заявка отправлена!</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Как только мы подтвердим оплату — доступ откроется автоматически.
            Обычно это занимает до 15 минут.
          </p>
        </div>
        <button
          onClick={onGrantAccess}
          className="w-full py-4 rounded-2xl font-display font-semibold card-glass text-muted-foreground text-sm"
        >
          Уже оплатил — открыть доступ
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-6 animate-fade-up">
      {/* Header */}
      <div className="text-center pt-4">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)" }}>
          <Icon name="Camera" size={30} className="text-green-900" />
        </div>
        {daysLeft === 0 ? (
          <>
            <p className="text-red-400 text-sm font-semibold mb-1">Пробный период завершён</p>
            <h1 className="font-display font-bold text-2xl text-foreground">Продолжить использование</h1>
          </>
        ) : (
          <>
            <p className="text-green-400 text-sm font-semibold mb-1">Осталось {daysLeft} {daysLeft === 1 ? "день" : "дня"} бесплатно</p>
            <h1 className="font-display font-bold text-2xl text-foreground">Оформить доступ</h1>
          </>
        )}
        <p className="text-muted-foreground text-sm mt-2 px-4">
          Анализ блюд по фото с помощью ИИ
        </p>
      </div>

      {/* Features */}
      <div className="card-glass rounded-3xl p-5 flex flex-col gap-3">
        {[
          { icon: "Camera", text: "Анализ блюд по фото — мгновенно" },
          { icon: "Zap", text: "Точный подсчёт КБЖУ по ИИ" },
          { icon: "BookOpen", text: "Дневник питания и история" },
          { icon: "TrendingUp", text: "Статистика по дням и неделям" },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-400/10 flex items-center justify-center shrink-0">
              <Icon name={f.icon} size={16} className="text-green-400" />
            </div>
            <p className="text-sm text-foreground">{f.text}</p>
          </div>
        ))}
      </div>

      {/* Plan selector */}
      <div className="grid grid-cols-2 gap-3">
        {(["sub", "once"] as const).map((plan) => (
          <button
            key={plan}
            onClick={() => setSelected(plan)}
            className={`rounded-2xl p-4 text-left border-2 transition-all ${
              selected === plan
                ? "border-green-400 bg-green-400/10"
                : "border-white/10 card-glass"
            }`}
          >
            <p className="font-display font-bold text-lg text-foreground">
              {plan === "once" ? "10 ₽" : "100 ₽"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {plan === "once" ? "Разовый доступ" : "В месяц"}
            </p>
            {plan === "sub" && (
              <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-400/20 text-green-400">
                ВЫГОДНЕЕ
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="card-glass rounded-3xl p-5 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">Переведи <span className="font-bold text-foreground">{price}</span> на карту:</p>
        <button
          onClick={copyCard}
          className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 active:scale-[0.98] transition-transform"
        >
          <span className="font-display font-bold text-xl text-foreground tracking-widest">{CARD_NUMBER}</span>
          <div className="w-9 h-9 rounded-xl bg-green-400/10 flex items-center justify-center shrink-0 ml-3">
            <Icon name={copied ? "Check" : "Copy"} size={16} className="text-green-400" />
          </div>
        </button>
        {copied && <p className="text-green-400 text-xs text-center -mt-2">Номер скопирован!</p>}
        <p className="text-xs text-muted-foreground text-center">
          В комментарии к переводу укажи: <span className="text-foreground font-semibold">«{label}»</span>
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => setSentRequest(true)}
        className="w-full py-4 rounded-2xl font-display font-bold text-base"
        style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)", color: "#0a0e1a" }}
      >
        Я оплатил — открыть доступ
      </button>

      <p className="text-xs text-muted-foreground text-center px-6">
        После нажатия кнопки мы проверим оплату и откроем доступ вручную. Обычно до 15 минут.
      </p>
    </div>
  );
}
