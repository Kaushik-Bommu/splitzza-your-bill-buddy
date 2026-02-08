import { motion } from "framer-motion";
import { User } from "lucide-react";

const friends = ["Alex", "Sam", "Jordan", "Taylor", "Casey", "Morgan"];

const Friends = () => (
  <div className="min-h-screen pb-24 bg-background px-5 pt-12">
    <motion.h1
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-display font-black text-2xl text-foreground mb-6"
    >
      Friends
    </motion.h1>
    <div className="flex flex-col gap-2.5">
      {friends.map((name, i) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex items-center gap-3 bg-card rounded-2xl p-4 shadow-card border border-border/50"
        >
          <div className="w-10 h-10 rounded-full bg-coral-light flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">No pending splits</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Friends;
