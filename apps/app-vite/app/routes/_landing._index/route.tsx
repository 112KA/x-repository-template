import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { setupReveal } from "@112ka/x/features/reveal";
import { Button } from "@/components/ui/button";
import { YouTubeVideo } from "@/features/youtube/youtube-video";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

gsap.registerPlugin(ScrollToPlugin);

export default function Index() {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScrollToTop = () => {
    gsap.to(window, { duration: 0.8, ease: "power2.inOut", scrollTo: { y: 0 } });
  };

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    return setupReveal(content, 0);
  }, []);

  return (
    <main className="">
      <div
        ref={contentRef}
        className="landing-reveal container-px-4 stack-gap-8 py-8 xl:container-px-0"
      >
        <section data-reveal>
          <h1>トップページ</h1>
          <p>React Router framework modeのトップページです。</p>
          <p>BASE_HOST_URL: {import.meta.env.VITE_BASE_HOST_URL}</p>
          <p>
            あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。
            またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。
          </p>
        </section>

        <section data-reveal>
          <h2>Heading2</h2>
          <p>
            あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。
            またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。
          </p>
        </section>

        <section data-reveal>
          <h3>Heading3</h3>
          <p>
            あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。
            またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。
          </p>

          <div className="mt-4 stack-h-gap-2" data-reveal-toggle>
            <p>
              <Dialog>
                <DialogTrigger render={<Button />}>modal(youtube)</DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>YouTube動画</DialogTitle>
                  </DialogHeader>
                  <YouTubeVideo videoId="PqoX5T7f6-M" className="aspect-video w-180" />
                </DialogContent>
              </Dialog>
            </p>

            <p>
              <Dialog>
                <DialogTrigger render={<Button />}>modal(text)</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>テキストモーダル</DialogTitle>
                    <DialogDescription>
                      あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。
                      またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </p>
          </div>
        </section>

        <section data-reveal>
          <h4>Heading4</h4>
          <p>
            あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。
            またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。
          </p>
        </section>

        <section data-reveal>
          <h5>Heading5</h5>
          <p>
            あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。
            またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。
          </p>
        </section>

        <div>
          <Button onClick={handleScrollToTop}>Topへ</Button>
        </div>
      </div>
    </main>
  );
}
