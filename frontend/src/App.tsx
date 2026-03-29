import { Navigate, Route, Routes } from "react-router-dom";
import ChartIntelligence from "./pages/ChartIntelligence";
import ChatAssistant from "./pages/ChatAssistant";
import Dashboard from "./pages/Dashboard_new";
import OpportunityRadar from "./pages/OpportunityRadar_new";
import PortfolioCopilot from "./pages/PortfolioCopilot_new";
import StockExplorer from "./pages/StockExplorer_new";
import VideoBriefings from "./pages/VideoBriefings_new";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/radar" element={<OpportunityRadar />} />
        <Route path="/explorer" element={<StockExplorer />} />
        <Route path="/charts" element={<ChartIntelligence />} />
        <Route path="/portfolio" element={<PortfolioCopilot />} />
        <Route path="/chat" element={<ChatAssistant />} />
        <Route path="/videos" element={<VideoBriefings />} />
      </Routes>
    </div>
  );
}
