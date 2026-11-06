import type {} from "@112ka/x/features/youtube-iframe-api";
import { useEffect, useId, useRef, useState } from "react";
import { setupYoutube, YoutubePlayer } from "@112ka/x/features/youtube";
import { cn } from "cn";

let iframeApiPromise: Promise<void> | undefined;

// setupYoutube は呼び出しごとにスクリプトを挿入するため、読み込みは一度だけに限定する
function loadYouTubeIframeApi(): Promise<void> {
  if (window.YT?.Player) {
    return Promise.resolve();
  }
  iframeApiPromise ??= setupYoutube();
  return iframeApiPromise;
}

type YouTubeVideoProps = {
  videoId: string;
  className?: string;
};

export function YouTubeVideo({ videoId, className }: YouTubeVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerId = useId();
  const [errorCode, setErrorCode] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    // StrictMode の再実行で id が重複すると YT.Player が古い要素を掴むため、実行ごとに一意な id にする
    const targetId = `${playerId}-${crypto.randomUUID()}`;
    const target = document.createElement("div");
    target.id = targetId;
    container.appendChild(target);

    const player = new YoutubePlayer();
    const playerReady = loadYouTubeIframeApi().then(() =>
      player.create(targetId, videoId, undefined, undefined, setErrorCode),
    );

    return () => {
      void playerReady.then(() => {
        player.body?.destroy();
        target.remove();
      });
    };
  }, [playerId, videoId]);

  return (
    <div className={cn(className, "relative")}>
      <div ref={containerRef} className="absolute inset-0 [&_iframe]:size-full" />
      {errorCode !== null && (
        <p className="p-2 text-sm text-destructive">再生エラー（コード: {errorCode}）</p>
      )}
    </div>
  );
}
