import { useState } from "react";

import { apiClient } from "../api/client";
import { VideoPlayer } from "../components/VideoPlayer";

type VideoResponse = {
  video_url: string;
  script: string;
  duration_seconds: number;
};

export default function VideoBriefings() {
  const [video, setVideo] = useState<VideoResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      try {
        const { data } = await apiClient.post<VideoResponse>("/video/generate", {
          date: new Date().toISOString().slice(0, 10),
          topics: ["top_movers", "fii_dii", "breakouts"],
        });
        setVideo(data);
      } catch {
        setVideo({
          video_url: "https://example.com/videos/daily-briefing.mp4",
          script:
            "Fallback video script generated locally. Market breadth is mixed, focus on high-conviction breakouts with strict risk controls.",
          duration_seconds: 60,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-64px)] gap-4 p-4 xl:grid-cols-[1fr_320px]">
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-5xl font-black tracking-tight">AI MARKET VIDEO BRIEFINGS</h1>
            <p className="text-sm text-slate-400">Synthetic visual intelligence for rapid market synthesis.</p>
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-xl bg-indigo-400/90 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Today's Briefing"}
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
          <div className="aspect-video bg-[radial-gradient(circle_at_top,#374151,#020617)] p-4">
            <VideoPlayer src={video?.video_url ?? "https://example.com/videos/daily-briefing.mp4"} />
          </div>
          <div className="border-t border-slate-800 p-4">
            <p className="text-3xl font-bold">Daily Market Wrap — March 27, 2025</p>
            <div className="mt-2 flex gap-2 text-xs">
              <span className="rounded bg-slate-800 px-2 py-1">TOP MOVERS</span>
              <span className="rounded bg-slate-800 px-2 py-1">FII/DII FLOWS</span>
              <span className="rounded bg-slate-800 px-2 py-1">BREAKOUTS</span>
            </div>
            {video && (
              <div className="mt-3 rounded border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-300">
                <p>Duration: {video.duration_seconds}s</p>
                <p className="mt-1">Script: {video.script}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <aside className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-2xl font-bold">AI Copilot</h2>
        <p className="mb-4 text-xs uppercase tracking-widest text-slate-400">Contextual Intelligence Script</p>
        <div className="space-y-3 text-sm text-slate-300">
          <p><span className="text-xs text-indigo-300">00:08</span> Opening Hook: Nifty shows strong mean-reversion at 22,000.</p>
          <p><span className="text-xs text-indigo-300">00:15</span> The Driver: FII flows turned net buyers in banking majors.</p>
          <p><span className="text-xs text-indigo-300">00:32</span> Alpha Signal: Reliance breakout near VWAP suggests continuation.</p>
          <p><span className="text-xs text-indigo-300">00:45</span> Strategy Bias: Maintain long-on-dip stance for 48h.</p>
        </div>
      </aside>
    </main>
  );
}
