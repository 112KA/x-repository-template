import { createContext, useContext } from "react";
import { AssertionError } from "@112ka/x/errors/assertion-error";

export type Theme = "dark" | "light";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new AssertionError("useTheme は ThemeProvider 内で使用してください。");
  }

  return context;
}
