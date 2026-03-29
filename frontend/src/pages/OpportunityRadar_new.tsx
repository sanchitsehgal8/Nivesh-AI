import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard/index";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Radar, TrendingUp, Sparkles, Star } from "lucide-react";
import { cn } from "../lib/utils";

const opportunities = [
  {
    symbol: "RELIANCE",
    score: 8.7,
    category: "Breakout",
    timeframe: "1D",
    description: "Strong breakout above resistance with elevated volume",
    confidence: 92,
    targetPrice: 3268,
    currentPrice: 3185,
  },
  {
    symbol: "BAJAJFINSV",
    score: 8.2,
    category: "Reversal",
    timeframe: "1W",
    description: "Oversold conditions with bullish divergence on RSI",
    confidence: 85,
    targetPrice: 1820,
    currentPrice: 1685,
  },
  {
    symbol: "ADANIGREEN",
    score: 7.9,
    category: "Momentum",
    timeframe: "1D",
    description: "Accelerating MACD above zero line with volume surge",
    confidence: 81,
    targetPrice: 1520,
    currentPrice: 1420,
  },
];

function OpportunityDetailPanel({ selectedSymbol }: { selectedSymbol: string }) {
  const selectedOpportunity = opportunities.find(o => o.symbol === selectedSymbol) || opportunities[0];

  return (
    <div className="space-y-5">
      <Tabs defaultValue="analysis">
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-secondary p-1">
          <TabsTrigger value="analysis" className="rounded-lg text-xs">Analysis</TabsTrigger>
          <TabsTrigger value="signals" className="rounded-lg text-xs">Signals</TabsTrigger>
          <TabsTrigger value="action" className="rounded-lg text-xs">Action</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="mt-5 space-y-4">
          <div className="rounded-xl bg-secondary/50 p-4">
            <p className="text-xs font-medium text-muted-foreground">Price Target</p>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-2xl font-bold text-accent">₹{selectedOpportunity.targetPrice}</p>
              <p className="text-sm text-success">+{(((selectedOpportunity.targetPrice - selectedOpportunity.currentPrice) / selectedOpportunity.currentPrice) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: "Current Price", value: `₹${selectedOpportunity.currentPrice}` },
              { label: "Stop Loss", value: "₹3120" },
              { label: "Risk/Reward", value: "1:3.2" },
              { label: "Confidence", value: `${selectedOpportunity.confidence}%` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between rounded-lg bg-secondary/30 px-3 py-2">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="signals" className="mt-5 space-y-3">
          {[
            { name: "Breakout Signal", status: "active" },
            { name: "Volume Surge", status: "active" },
            { name: "Bullish Divergence", status: "pending" },
          ].map((signal) => (
            <div key={signal.name} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <span className="text-sm text-foreground">{signal.name}</span>
              <Badge variant={signal.status === "active" ? "default" : "secondary"}>
                {signal.status}
              </Badge>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="action" className="mt-5 space-y-3">
          <Button className="w-full bg-accent text-background hover:bg-accent/90">
            Add to Watchlist
          </Button>
          <Button variant="outline" className="w-full">
            Set Alert
          </Button>
          <Button variant="outline" className="w-full">
            View Full Analysis
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function OpportunityRadar() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOppoId, setSelectedOppoId] = useState(opportunities[0].symbol);

  return (
    <DashboardLayout rightPanel={<OpportunityDetailPanel selectedSymbol={selectedOppoId} />}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-foreground">
            <Radar className="h-8 w-8 text-accent" />
            Opportunity Radar
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {opportunities.length} high-probability opportunities identified
          </p>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="rounded-xl bg-secondary p-1">
            <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
            <TabsTrigger value="breakout" className="rounded-lg">Breakouts</TabsTrigger>
            <TabsTrigger value="reversal" className="rounded-lg">Reversals</TabsTrigger>
            <TabsTrigger value="momentum" className="rounded-lg">Momentum</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
          {opportunities.map((opp) => (
            <div
              key={opp.symbol}
              onClick={() => setSelectedOppoId(opp.symbol)}
              className={cn(
                "group cursor-pointer rounded-2xl border bg-card p-6 card-shadow transition-all hover:border-accent hover:shadow-lg",
                selectedOppoId === opp.symbol ? "border-accent" : "border-border"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{opp.symbol}</h3>
                      <Badge variant="outline" className="mt-1.5 rounded-lg text-xs">
                        {opp.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{opp.description}</p>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-2">
                    <p className="text-3xl font-bold text-foreground">{opp.score}</p>
                    <p className="text-xs text-muted-foreground">/10</p>
                  </div>
                  <div className="mt-2 flex items-center justify-end gap-1">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="text-xs font-semibold text-accent">{opp.confidence}% Sure</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="mt-1 font-bold text-foreground">₹{opp.currentPrice}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Target</p>
                  <p className="mt-1 font-bold text-accent">₹{opp.targetPrice}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Potential</p>
                  <p className="mt-1 font-bold text-success">
                    +{(((opp.targetPrice - opp.currentPrice) / opp.currentPrice) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Action */}
              <Button
                onClick={() => {
                  setSelectedOppoId(opp.symbol);
                  navigate(`/charts?stock=${opp.symbol}`);
                }}
                variant="outline"
                className="mt-4 w-full rounded-xl bg-secondary/30 text-accent hover:bg-accent hover:text-background"
              >
                <Star className="mr-2 h-4 w-4" />
                View Opportunity
              </Button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {opportunities.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Radar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No opportunities found for this filter.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
