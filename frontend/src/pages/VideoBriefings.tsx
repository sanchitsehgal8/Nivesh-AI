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
      const { data } = await apiClient.post<VideoResponse>("/video/generate", {
        date: new Date().toISOString().slice(0, 10),
        topics: ["top_movers", "fii_dii", "breakouts"],
      });
      setVideo(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="space-y-4 p-6 text-slate-100">
      <h1 className="text-2xl font-semibold">AI Market Video Briefings</h1>
      <button
        onClick={generate}
        disabled={loading}
        className="rounded bg-cyan-600 px-4 py-2 font-medium disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Daily Briefing"}
      </button>
      <VideoPlayer src={video?.video_url ?? "https://example.com/videos/daily-briefing.mp4"} />
      {video && (
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
          <p>Duration: {video.duration_seconds}s</p>
          <p className="mt-2">Script: {video.script}</p>
        </section>
      )}
    </main>
  );
}
