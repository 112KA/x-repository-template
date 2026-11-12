import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { setupReveal } from "./reveal.js";

const observers: TestObserver[] = [];

class TestObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    observers.push(this);
  }
}

describe("setupReveal", () => {
  beforeEach(() => {
    observers.length = 0;
    vi.stubGlobal("IntersectionObserver", TestObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("画面外の要素を監視し続け、画面内に入ったら一度だけ表示する", () => {
    const classes = new Set<string>();
    const target = {
      hasAttribute: (name: string) => name === "data-reveal",
      classList: {
        contains: (name: string) => classes.has(name),
        add: (name: string) => classes.add(name),
      },
    } as unknown as Element;
    const root = {
      querySelectorAll: (selector: string) =>
        selector === "[data-reveal], [data-reveal-toggle]" ? [target] : [],
    } as unknown as ParentNode;

    const cleanup = setupReveal(root, 0);
    const playObserver = observers[0];
    expect(playObserver.options?.threshold).toBe(0);
    expect(playObserver.observe).toHaveBeenCalledWith(target);

    playObserver.callback(
      [{ target, isIntersecting: false } as IntersectionObserverEntry],
      playObserver as unknown as IntersectionObserver,
    );
    expect(playObserver.unobserve).not.toHaveBeenCalled();
    expect(classes.has("play")).toBe(false);

    playObserver.callback(
      [{ target, isIntersecting: true } as IntersectionObserverEntry],
      playObserver as unknown as IntersectionObserver,
    );
    expect(classes.has("play")).toBe(true);
    expect(playObserver.unobserve).toHaveBeenCalledWith(target);

    cleanup();
    expect(observers[0].disconnect).toHaveBeenCalled();
    expect(observers[1].disconnect).toHaveBeenCalled();
  });

  it("繰り返し表示する要素は画面外に出ると再生クラスを外す", () => {
    const classes = new Set<string>();
    const target = {
      hasAttribute: (name: string) => name === "data-reveal-toggle",
      classList: {
        contains: (name: string) => classes.has(name),
        add: (name: string) => classes.add(name),
        remove: (name: string) => classes.delete(name),
      },
    } as unknown as Element;
    const root = { querySelectorAll: () => [target] } as unknown as ParentNode;

    const cleanup = setupReveal(root);
    expect(observers[0].options?.threshold).toBe(0.5);
    expect(observers[1].observe).toHaveBeenCalledWith(target);
    observers[0].callback(
      [{ target, isIntersecting: true } as IntersectionObserverEntry],
      observers[0] as unknown as IntersectionObserver,
    );
    expect(classes.has("play")).toBe(true);
    observers[1].callback(
      [{ target, isIntersecting: false } as IntersectionObserverEntry],
      observers[1] as unknown as IntersectionObserver,
    );
    expect(classes.has("play")).toBe(false);
    expect(observers[0].unobserve).not.toHaveBeenCalled();
    cleanup();
  });
});
