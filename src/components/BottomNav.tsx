import { Home, Receipt, Users, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/splits", icon: Receipt, label: "Splits" },
  { to: "/friends", icon: Users, label: "Friends" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong glass-nav border-t border-border/40 safe-area-bottom bg-card/80 backdrop-blur-xl shadow-elevated">

      <div className="flex items-center justify-around max-w-md mx-auto h-[4.5rem] px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 relative",
                isActive 
                  ? "text-primary dark:text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-2xl bg-primary/10 dark:bg-primary/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 relative z-10" strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-display font-bold relative z-10 tracking-wide">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
