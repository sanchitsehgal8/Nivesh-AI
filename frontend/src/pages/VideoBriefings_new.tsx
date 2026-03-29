import { useState } from "react";
import { DashboardLayout } from "../components/dashboard/index";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Play, Download, Share2, Calendar, Clock, Zap } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";

const videos = [
  {
    id: 1,
    title: "Market Reversal Alert: NIFTY 50 Breaks Below Key Support",
    duration: "4:32",
    date: "Today",
    views: "2.4K",
    status: "Active Signal",
  },
  {
    id: 2,
    title: "Sector Rotation: Money Flowing into Energy & Metals",
    duration: "6:15",
    date: "Yesterday",
    views: "1.8K",
    status: "Update",
  },
  {
    id: 3,
    title: "Top 3 Breakout Stocks to Watch This Week",
    duration: "5:48",
    date: "2 days ago",
    views: "3.1K",
    status: "Alert",
  },
];

function ScriptPanel() {
  return (
    <div className="space-y-5">
      <Tabs defaultValue="script">
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-secondary p-1">
          <TabsTrigger value="script" className="rounded-lg text-xs">Script</TabsTrigger>
          <TabsTrigger value="notes" className="rounded-lg text-xs">Notes</TabsTrigger>
          <TabsTrigger value="export" className="rounded-lg text-xs">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="script" className="mt-5 max-h-[600px] space-y-3 overflow-y-auto">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold text-accent">00:00 -</span>
              <span className="ml-2 text-foreground">NIFTY has broken below 18,600 support...</span>
            </p>
            <p>
              <span className="font-semibold text-accent">01:15 -</span>
              <span className="ml-2 text-foreground">Bank Nifty shows weakness as well...</span>
            </p>
            <p>
              <span className="font-semibold text-accent">02:45 -</span>
              <span className="ml-2 text-foreground">Technical patterns suggest next support at 18,400...</span>
            </p>
            <p>
              <span className="font-semibold text-accent">04:00 -</span>
              <span className="ml-2 text-foreground">Recommend defensive positioning until clarity emerges</span>
            </p>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-5">
          <div className="rounded-xl bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">
              Mark important points from the analysis for future reference.
            </p>
            <textarea
              placeholder="Add your notes here..."
              className="mt-3 w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none"
              rows={5}
            />
          </div>
        </TabsContent>

        <TabsContent value="export" className="mt-5 space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="mr-2 h-4 w-4" />
            Download as PDF
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="mr-2 h-4 w-4" />
            Download Video
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Share2 className="mr-2 h-4 w-4" />
            Share Link
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function VideoBriefings() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);

  return (
    <DashboardLayout rightPanel={<ScriptPanel />}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Video Briefings</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              AI-generated market analysis videos
            </p>
          </div>
          <Button className="rounded-xl bg-accent px-6 text-background hover:bg-accent/90">
            <Zap className="mr-2 h-4 w-4" />
            Generate New
          </Button>
        </div>

        {/* Video Player */}
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-card card-shadow">
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary/50 to-secondary/25">
            <div className="text-center">
              <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
                <Play className="h-8 w-8 text-accent" fill="currentColor" />
              </div>
              <p className="font-semibold text-foreground">
                {selectedVideo.title}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{selectedVideo.duration}</p>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: Calendar, label: "Published", value: selectedVideo.date },
            { icon: Play, label: "Duration", value: selectedVideo.duration },
            { icon: Zap, label: "Views", value: selectedVideo.views },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-4">
              <item.icon className="h-5 w-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 font-semibold text-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 rounded-xl bg-accent text-background hover:bg-accent/90">
            <Play className="mr-2 h-4 w-4" />
            Play Video
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" className="rounded-xl px-4">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Video List */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-foreground">Other Briefings</h2>
          <div className="space-y-3">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className={cn(
                  "group cursor-pointer rounded-xl border p-4 transition-all",
                  selectedVideo.id === video.id
                    ? "border-accent bg-accent/5"
                    : "border-border bg-card hover:border-accent/50"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <div className="flex h-full items-center justify-center">
                      <Play className="h-6 w-6 text-muted-foreground" fill="currentColor" />
                    </div>
                    <span className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-1 text-xs font-medium text-foreground">
                      {video.duration}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{video.title}</h3>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {video.date}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Play className="h-3.5 w-3.5" />
                        {video.views} views
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-3 rounded-lg text-xs">
                      {video.status}
                    </Badge>
                  </div>

                  <div className="flex-shrink-0 pt-1">
                    <Play className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
