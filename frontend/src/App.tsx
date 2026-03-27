import { Link, Navigate, Route, Routes } from "react-router-dom";

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
  { to: "/chat", label: "Chat" },
  { to: "/videos", label: "Video Briefings" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <ul className="mx-auto flex max-w-7xl flex-wrap gap-2 p-3 text-sm">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="rounded-md px-3 py-2 hover:bg-slate-800">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
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
  );
}
