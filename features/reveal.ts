/**
 * data-reveal / data-reveal-toggle 属性に基づき IntersectionObserver で
 * 要素の再生/停止クラス（.play）を制御する。
 * 再生用の閾値は指定可能（初期値 0.5）、停止用は 0。
 */
export function setupReveal(
  root: ParentNode = document,
  threshold = 0,
  rootMargin: string = "0px 0px -25% 0px",
): () => void {
  const playIntersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        const { isIntersecting, target } = entry;
        const hasPlayClass = target.classList.contains("play");

        if (target.hasAttribute("data-reveal")) {
          if (isIntersecting) {
            target.classList.add("play");
            playIntersectionObserver.unobserve(target);
          }
        } else if (target.hasAttribute("data-reveal-toggle")) {
          if (isIntersecting && !hasPlayClass) {
            target.classList.add("play");
          }
        }
      }
    },
    { root: null, threshold, rootMargin },
  );
  const stopIntersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        const { isIntersecting, target } = entry;
        const hasPlayClass = target.classList.contains("play");
        if (target.hasAttribute("data-reveal-toggle")) {
          if (!isIntersecting && hasPlayClass) {
            target.classList.remove("play");
          }
        }
      }
    },
    { threshold: 0 },
  );

  const elements = root.querySelectorAll("[data-reveal], [data-reveal-toggle]");
  for (const element of elements) {
    playIntersectionObserver.observe(element);
  }
  const toggleElements = root.querySelectorAll("[data-reveal-toggle]");
  for (const element of toggleElements) {
    stopIntersectionObserver.observe(element);
  }

  return () => {
    playIntersectionObserver.disconnect();
    stopIntersectionObserver.disconnect();
  };
}
