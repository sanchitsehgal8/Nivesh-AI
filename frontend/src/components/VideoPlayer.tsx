export function VideoPlayer({ src }: { src: string }) {
  return <video className="w-full rounded-xl" controls src={src} />;
}
