import type { CameraDisplayType } from "@112ka/x/features/camera";
import { Button } from "@/components/ui/button";
import { useCamera } from "../use-camera";

type CameraCaptureProps = {
  displayType?: CameraDisplayType;
};

export function CameraCapture({ displayType }: CameraCaptureProps) {
  const { videoRef, phase, photoUrl, error, isMirrored, capture, retake, confirm } =
    useCamera(displayType);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-md bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`h-full w-full object-cover ${phase === "live" ? "" : "hidden"} ${isMirrored ? "-scale-x-100" : ""}`}
        />
        {phase !== "live" && photoUrl && (
          <img src={photoUrl} alt="撮影した静止画" className="h-full w-full object-cover" />
        )}
      </div>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        {phase === "live" && (
          <Button onClick={capture} disabled={error !== null}>
            撮影
          </Button>
        )}
        {phase === "confirm" && (
          <>
            <Button variant="outline" onClick={retake}>
              取り直す
            </Button>
            <Button onClick={confirm}>OK</Button>
          </>
        )}
        {phase === "done" && (
          <Button variant="outline" onClick={retake}>
            もう一度撮影
          </Button>
        )}
      </div>
    </div>
  );
}
