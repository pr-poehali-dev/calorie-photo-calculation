import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Icon from "@/components/ui/icon";
import Home from "@/pages/Home";
import Camera from "@/pages/Camera";
import History from "@/pages/History";
import Stats from "@/pages/Stats";
import Profile from "@/pages/Profile";

type Page = "home" | "camera" | "history" | "stats" | "profile";

const navItems: { id: Page; icon: string; label: string }[] = [
  { id: "home", icon: "Home", label: "Главная" },
  { id: "history", icon: "BookOpen", label: "История" },
  { id: "camera", icon: "ScanLine", label: "" },
  { id: "stats", icon: "BarChart3", label: "Аналитика" },
  { id: "profile", icon: "User", label: "Профиль" },
];

const queryClient = new QueryClient();

function NutriApp() {
  const [page, setPage] = useState<Page>("home");

  const renderPage = () => {
    switch (page) {
      case "home": return <Home onNavigate={(p) => setPage(p as Page)} />;
      case "camera": return <Camera onNavigate={(p) => setPage(p as Page)} />;
      case "history": return <History />;
      case "stats": return <Stats />;
      case "profile": return <Profile />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #4ade80, transparent)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-3"
          style={{ background: "radial-gradient(circle, #f472b6, transparent)" }} />
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-md mx-auto px-4 pt-4 pb-28">
        {renderPage()}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-md mx-auto px-4 pb-4">
          <div className="card-glass rounded-3xl px-2 py-2 flex items-center justify-between"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            {navItems.map((item) => {
              if (item.id === "camera") {
                return (
                  <button
                    key={item.id}
                    onClick={() => setPage("camera")}
                    className="relative flex items-center justify-center -mt-6"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl glow-green"
                      style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)" }}
                    >
                      <Icon name="ScanLine" size={28} className="text-green-900" />
                    </div>
                  </button>
                );
              }
              const isActive = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`nav-pill ${isActive ? "active" : ""}`}
                >
                  <Icon name={item.icon} size={22} />
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <NutriApp />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
