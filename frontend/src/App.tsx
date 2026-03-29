import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ChartIntelligence from "./pages/ChartIntelligence";
import ChatAssistant from "./pages/ChatAssistant";
import Dashboard from "./pages/Dashboard";
import OpportunityRadar from "./pages/OpportunityRadar";
import PortfolioCopilot from "./pages/PortfolioCopilot";
import StockExplorer from "./pages/StockExplorer";
import VideoBriefings from "./pages/VideoBriefings";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/opportunity-radar", label: "Opportunity Radar" },
  { to: "/stock-explorer", label: "Stock Explorer" },
  { to: "/chart-intelligence", label: "Chart Intelligence" },
  { to: "/portfolio-copilot", label: "Portfolio Copilot" },
  { to: "/chat", label: "AI Chat" },
  { to: "/videos", label: "Video Briefings" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-800/70 bg-slate-950/80 p-3 md:block">
      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
        <p className="text-lg font-bold tracking-tight">NIVESH AI</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Sovereign Analyst</p>
      </div>

      <ul className="space-y-1 text-sm">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`block rounded-lg px-3 py-2 transition ${
                  active ? "bg-indigo-500/20 text-indigo-200" : "text-slate-300 hover:bg-slate-800/70"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        onClick={() =>
          navigate(
            `/chat?query=${encodeURIComponent("Analyze my portfolio risk and top actions")}&run=${Date.now()}`,
          )
        }
        className="mt-6 w-full rounded-xl bg-indigo-400/90 px-3 py-2 text-sm font-semibold text-slate-950"
      >
        + New Analysis
      </button>
      <div className="mt-8 space-y-2 text-xs text-slate-400">
        <p>● Market Live</p>
        <p>⚙ Settings</p>
      </div>
    </aside>
  );
}

function TopTicker() {
  return (
    <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-2 text-[11px] text-slate-400">
      <div className="flex flex-wrap items-center gap-4">
        <span>NIFTY 50 <span className="text-emerald-400">22,453.10 (+0.45%)</span></span>
        <span>SENSEX <span className="text-emerald-400">73,982.50 (+0.38%)</span></span>
        <span>BANK NIFTY <span className="text-rose-400">47,214.90 (-0.12%)</span></span>
        <span>INDIA VIX <span className="text-amber-300">14.22</span></span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#070b16] to-slate-950 text-slate-100">
      <TopTicker />
      <div className="flex min-h-[calc(100vh-36px)]">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/opportunity-radar" element={<OpportunityRadar />} />
            <Route path="/stock-explorer" element={<StockExplorer />} />
            <Route path="/chart-intelligence" element={<ChartIntelligence />} />
            <Route path="/portfolio-copilot" element={<PortfolioCopilot />} />
            <Route path="/chat" element={<ChatAssistant />} />
            <Route path="/videos" element={<VideoBriefings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
