import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Switch } from "@/components/ui/switch";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Sun className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-medium text-muted-foreground">Light</span>
      </div>
      <Switch 
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-primary"
      />
      <div className="flex items-center gap-2">
        <Moon className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium text-muted-foreground">Dark</span>
      </div>
    </div>
  );
}
