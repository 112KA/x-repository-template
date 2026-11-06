import { Switch } from "@/components/ui/switch";

export function ThemeSwitch({
  isDark,
  setTheme,
}: {
  isDark: boolean;
  setTheme: (dark: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">ダークモード</span>
      <Switch aria-label="ダークモード" checked={isDark} onCheckedChange={setTheme} />
    </div>
  );
}
