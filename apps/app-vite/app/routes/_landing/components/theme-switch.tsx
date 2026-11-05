import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";

export function ThemeSwitch() {
  const { isDark, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">ダークモード</span>
      <Switch aria-label="ダークモード" checked={isDark} onCheckedChange={setTheme} />
    </div>
  );
}
