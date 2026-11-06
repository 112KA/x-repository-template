import { CameraDisplay } from "@112ka/x/features/camera";
import type { CameraDisplayType } from "@112ka/x/features/camera";
import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "live" | "confirm" | "done";

const CAMERA_ERROR_MESSAGE =
  "カメラを開始できませんでした。ブラウザのカメラ権限とデバイスを確認してください。";
const CANVAS_ERROR_MESSAGE = "撮影用のキャンバスを作成できませんでした。";

function captureFrame(video: HTMLVideoElement, isMirrored: boolean): string | null {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  if (isMirrored) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

export function useCamera(displayType: CameraDisplayType = "front") {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<CameraDisplay | null>(null);
  const [phase, setPhase] = useState<Phase>("live");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMirrored = displayType === "front";

  const startCamera = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!cameraRef.current) cameraRef.current = new CameraDisplay(video);
    await cameraRef.current.startByDisplayType(displayType);
  }, [displayType]);

  useEffect(() => {
    startCamera().catch(() => setError(CAMERA_ERROR_MESSAGE));
    return () => cameraRef.current?.stop();
  }, [startCamera]);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const dataUrl = captureFrame(video, isMirrored);
    if (!dataUrl) {
      setError(CANVAS_ERROR_MESSAGE);
      return;
    }
    cameraRef.current?.stop();
    setPhotoUrl(dataUrl);
    setPhase("confirm");
  };

  const retake = () => {
    setPhotoUrl(null);
    setPhase("live");
    startCamera().catch(() => setError(CAMERA_ERROR_MESSAGE));
  };

  const confirm = () => setPhase("done");

  return { videoRef, phase, photoUrl, error, isMirrored, capture, retake, confirm };
}
