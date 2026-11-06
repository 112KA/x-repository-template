import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AssertionError } from "@112ka/x/errors/assertion-error";
import { ThemeProviderContext } from "./use-theme";
import type { Theme } from "./use-theme";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme | "system";
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme === "system" ? "light" : defaultTheme);

  useEffect(() => {
    // サーバーと hydration の初期値を揃え、ブラウザーでのみ保存済み設定を読み込む。
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    } else if (storedTheme === null || storedTheme === "system") {
      const initialTheme = storedTheme === "system" ? "system" : defaultTheme;
      setTheme(
        initialTheme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : initialTheme,
      );
    } else {
      throw new AssertionError("保存されたテーマが不正です。");
    }
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    root.classList.add(theme);
  }, [theme]);

  const updateTheme = useCallback(
    (nextTheme: Theme) => {
      localStorage.setItem(storageKey, nextTheme);
      setTheme(nextTheme);
    },
    [storageKey],
  );
  const value = useMemo(() => ({ theme, setTheme: updateTheme }), [theme, updateTheme]);

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}
