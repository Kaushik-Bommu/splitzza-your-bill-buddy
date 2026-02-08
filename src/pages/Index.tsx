import { motion } from "framer-motion";
import { Pizza } from "lucide-react";
import { dummySplits } from "@/data/dummySplits";
import SplitCard from "@/components/SplitCard";
import SwipeToCreate from "@/components/SwipeToCreate";

/** Home screen — list of previous split events with swipe-to-create */
const Index = () => {
  const pendingCount = dummySplits.filter((s) => !s.settled).length;

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Swipe-to-create floating component */}
      <SwipeToCreate />

      {/* Header */}
      <div className="px-5 pt-14 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Pizza className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-black text-xl text-foreground tracking-tight leading-tight">
                Splitzza
              </h1>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Split fair, eat happy
              </p>
            </div>
          </div>

          {/* Pending indicator */}
          {pendingCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
              className="flex items-center gap-1.5 bg-coral-light px-3 py-1.5 rounded-full"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-display font-bold text-primary">
                {pendingCount} pending
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Quick stats */}
      <div className="px-5 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="grid grid-cols-3 gap-2.5"
        >
          <div className="bg-card rounded-2xl p-3 shadow-card border border-border/40 text-center">
            <p className="text-xl font-display font-black text-primary">{pendingCount}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Pending</p>
          </div>
          <div className="bg-card rounded-2xl p-3 shadow-card border border-border/40 text-center">
            <p className="text-xl font-display font-black text-foreground">{dummySplits.length}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Splits</p>
          </div>
          <div className="bg-card rounded-2xl p-3 shadow-card border border-border/40 text-center">
            <p className="text-xl font-display font-black text-accent">6</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Friends</p>
          </div>
        </motion.div>
      </div>

      {/* Swipe hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-5 mt-5 mb-1"
      >
        <p className="text-[11px] text-muted-foreground text-right italic">
          ← swipe the tab to create a new split
        </p>
      </motion.div>

      {/* Event list */}
      <div className="px-5 mt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-base text-foreground">Recent Events</h2>
        </div>
        <div className="flex flex-col gap-2.5">
          {dummySplits.map((split, i) => (
            <SplitCard key={split.id} split={split} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
