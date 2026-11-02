import { useCallback, useEffect, useState } from "react";

export const THEME_STORAGE_KEY = "theme";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const setTheme = useCallback((dark: boolean) => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
    setIsDark(dark);
  }, []);

  return { isDark, setTheme };
}
