import { motion } from "framer-motion";
import { User, Bell, Palette, HelpCircle, LogOut } from "lucide-react";

const settingsItems = [
  { icon: User, label: "Profile", desc: "Edit your name & avatar" },
  { icon: Bell, label: "Notifications", desc: "Manage alerts" },
  { icon: Palette, label: "Appearance", desc: "Theme & display" },
  { icon: HelpCircle, label: "Help & Support", desc: "FAQs & contact" },
  { icon: LogOut, label: "Sign Out", desc: "See you soon!" },
];

const SettingsPage = () => (
  <div className="min-h-screen pb-24 bg-background px-5 pt-12">
    <motion.h1
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-display font-black text-2xl text-foreground mb-6"
    >
      Settings
    </motion.h1>
    <div className="flex flex-col gap-2">
      {settingsItems.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex items-center gap-3 bg-card rounded-2xl p-4 shadow-card border border-border/50 cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <item.icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default SettingsPage;
