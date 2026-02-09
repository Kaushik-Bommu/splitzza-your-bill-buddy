import { motion } from "framer-motion";
import { Plus, Pizza } from "lucide-react";
import { dummySplits } from "@/data/dummySplits";
import SplitCard from "@/components/SplitCard";
import heroImage from "@/assets/splitzza-hero.png";

/** Home screen — shows recent splits and a CTA to create new ones */
const Index = () => {
  const pendingCount = dummySplits.filter((s) => !s.settled).length;

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header area with hero illustration */}
      <div className="relative overflow-hidden bg-gradient-to-b from-coral-light to-background px-5 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-1"
        >
          <Pizza className="w-7 h-7 text-primary" />
          <h1 className="font-display font-black text-2xl text-foreground tracking-tight">
            Splitzza
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          Split bills fairly, stay friends forever 🍕
        </motion.p>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 flex justify-center"
        >
          <img
            src={heroImage}
            alt="Friends sharing pizza"
            className="w-40 h-40 object-contain rounded-3xl"
          />
        </motion.div>
      </div>

      {/* Quick stats bar */}
      <div className="px-5 -mt-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex gap-3"
        >
          <div className="flex-1 bg-card rounded-2xl p-3.5 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-display font-black text-primary">{pendingCount}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Pending</p>
          </div>
          <div className="flex-1 bg-card rounded-2xl p-3.5 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-display font-black text-foreground">{dummySplits.length}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Total Splits</p>
          </div>
          <div className="flex-1 bg-card rounded-2xl p-3.5 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-display font-black text-accent">3</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Friends</p>
          </div>
        </motion.div>
      </div>

      {/* Recent splits section */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg text-foreground">Recent Splits</h2>
          <span className="text-xs text-muted-foreground">View all</span>
        </div>
        <div className="flex flex-col gap-3">
          {dummySplits.map((split, i) => (
            <SplitCard key={split.id} split={split} index={i} />
          ))}
        </div>
      </div>

      {/* Floating action button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 20 }}
        className="fixed bottom-20 right-5 w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-elevated flex items-center justify-center active:scale-95 transition-transform"
        aria-label="New split"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
};

export default Index;
