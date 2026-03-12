import { motion } from "framer-motion";
import { User, Bell, Palette, HelpCircle, LogOut, ChevronRight, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import ThemeToggle from "@/components/ThemeToggle"

const settingsItems = [
  { icon: User, label: "Profile", desc: "Edit your name & avatar", color: "bg-coral-light text-primary" },
  { icon: Bell, label: "Notifications", desc: "Manage alerts", color: "bg-amber-light text-secondary" },
  { icon: HelpCircle, label: "Help & Support", desc: "FAQs & contact", color: "bg-muted text-muted-foreground" },
  { icon: LogOut, label: "Sign Out", desc: "See you soon!", color: "bg-destructive/10 text-destructive" },
];

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTheme();
  };

  return (
    <div className="min-h-screen pb-28 bg-background">
      <div className="gradient-hero px-6 pt-14 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-black text-2xl text-foreground"
        >
          Settings
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground mt-1"
        >
          Make Splitzza yours ⚙️
        </motion.p>
      </div>

      <div className="px-6 -mt-2 flex flex-col gap-2.5">
        {settingsItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className="flex items-center gap-4 gradient-card-warm rounded-2xl p-4 shadow-card border border-border/30 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
          </motion.div>
        ))}
        
        <ThemeToggle />
      </div>
    </div>
  );
};

export default SettingsPage;
