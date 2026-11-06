import { Moon, Sun } from "lucide-react";
import { useTheme } from "../use-theme";
import { Button } from "@/components/ui/button";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      role="switch"
      aria-label="ダークモード"
      aria-checked={theme === "dark"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
    </Button>
  );
}
