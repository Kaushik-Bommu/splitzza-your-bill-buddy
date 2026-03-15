import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Switch } from "@/components/ui/switch";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-4 p-4 pt-3 border-t border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl -mx-6 mt-2">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Appearance</span>
      <div className="flex items-center gap-3 ml-auto">
        <Sun className={`w-4 h-4 transition-all duration-200 ${theme === 'dark' ? 'opacity-30 scale-90' : 'opacity-100 scale-100'}`} />
        <div 
          className="relative w-14 h-7 rounded-full backdrop-blur-md shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 select-none flex items-center px-1"
          onClick={toggleTheme}
        >
          <div 
            className="absolute w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ease-out flex items-center justify-center"
            style={{
              transform: `translateX(${theme === 'dark' ? 27 : 2}px)`
            }}
          >
            {theme === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-gray-700" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
          </div>
          <div 
            className="absolute inset-0 rounded-full transition-all duration-300"
            style={{
              backgroundColor: theme === 'dark' ? '#FF7A59' : '#E5E7EB'
            }}
          />
          {theme === 'dark' && (
            <div className="absolute inset-0 shadow-[0_0_14px_rgba(255,122,89,0.35)] rounded-full" />
          )}
        </div>
        <Moon className={`w-4 h-4 transition-all duration-200 ${theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-30 scale-90'}`} />
      </div>
    </div>
  );
}
