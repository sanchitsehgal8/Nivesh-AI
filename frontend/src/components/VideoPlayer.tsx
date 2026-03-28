import { useState } from "react";

type Props = {
  src: string;
};

export function VideoPlayer({ src }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full min-h-56 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-center text-sm text-slate-300">
        Video stream unavailable right now. Please regenerate briefing.
      </div>
    );
  }

  return (
    <video
      key={src}
      className="h-full w-full rounded-xl"
      controls
      preload="metadata"
      src={src}
      onError={() => setFailed(true)}
    />
  );
}
