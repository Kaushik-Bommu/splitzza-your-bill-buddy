import { motion } from "framer-motion";
import { Pizza, Sparkles } from "lucide-react";
import { dummySplits } from "@/data/dummySplits";
import SplitCard from "@/components/SplitCard";
import SwipeToCreate from "@/components/SwipeToCreate";
import heroImage from "@/assets/splitzza-hero.png";

const Index = () => {
  const pendingCount = dummySplits.filter((s) => !s.settled).length;

  return (
    <div className="min-h-screen pb-28 bg-background">
      {/* Hero header with warm gradient */}
      <div className="relative overflow-hidden gradient-hero px-6 pt-14 pb-8">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/8 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 mb-2 relative z-10"
        >
          <div className="w-9 h-9 rounded-2xl gradient-primary-btn flex items-center justify-center shadow-glow">
            <Pizza className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display font-black text-2xl text-foreground dark:text-black tracking-tight">
            Splitzza
          </h1>

        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-sm text-muted-foreground relative z-10"
        >
          Split bills fairly, stay friends forever 🍕
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-5 flex justify-center relative z-10"
        >
          <img
            src={heroImage}
            alt="Friends sharing pizza"
            className="w-44 h-44 object-contain rounded-3xl drop-shadow-lg"
          />
        </motion.div>
      </div>

      {/* Quick stats */}
      <div className="px-6 -mt-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex gap-3"
        >
          {[
            { value: pendingCount, label: "Pending", className: "text-primary" },
            { value: dummySplits.length, label: "Total Splits", className: "text-foreground" },
            { value: 3, label: "Friends", className: "text-accent" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex-1 glass-strong rounded-2xl p-4 shadow-card border border-border/30 text-center"
            >
              <p className={`text-2xl font-display font-black ${stat.className}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Recent splits */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-lg text-foreground">Recent Splits</h2>
            <Sparkles className="w-4 h-4 text-secondary" />
          </div>
          <span className="text-xs font-semibold text-primary">View all</span>
        </div>
        <div className="flex flex-col gap-3.5">
          {dummySplits.map((split, i) => (
            <SplitCard key={split.id} split={split} index={i} />
          ))}
        </div>
      </div>

      <SwipeToCreate />
    </div>
  );
};

export default Index;
