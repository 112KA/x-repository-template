import { CameraCapture } from "@/features/camera/ui/camera-capture";

export default function CameraExample() {
  return (
    <section className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">カメラ撮影</h1>
      <CameraCapture />
    </section>
  );
}
