import { motion } from "framer-motion";
import { User, UserPlus } from "lucide-react";

const friends = ["Alex", "Sam", "Jordan", "Taylor", "Casey", "Morgan"];

const Friends = () => (
  <div className="min-h-screen pb-28 bg-background">
    <div className="gradient-hero px-6 pt-14 pb-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-black text-2xl text-foreground dark:text-black"
      >
        Friends
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground mt-1"
      >
        Your crew for splitting bills ✌️
      </motion.p>
    </div>

    <div className="px-6 -mt-2 flex flex-col gap-3">
      {friends.map((name, i) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.06 }}
          className="flex items-center gap-4 gradient-card-warm rounded-2xl p-4 shadow-card border border-border/30"
        >
          <div className="w-11 h-11 rounded-2xl bg-coral-light flex items-center justify-center">
            <span className="text-sm font-black text-primary">{name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-sm text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">No pending splits</p>
          </div>
        </motion.div>
      ))}

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-border/50 text-sm font-semibold text-muted-foreground mt-1"
      >
        <UserPlus className="w-4 h-4" /> Add Friend
      </motion.button>
    </div>
  </div>
);

export default Friends;
