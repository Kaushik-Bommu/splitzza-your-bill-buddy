import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SplitCard from "@/components/SplitCard";
import { getSplits, deleteSplit } from "@/lib/splitStorage";
import { toast } from "sonner";
import type { Split } from "@/data/dummySplits";

const Splits = () => {
  const [splits, setSplits] = useState<Split[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadedSplits = getSplits();
    setSplits(loadedSplits);
    setIsLoaded(true);
  }, []);

  const handleDelete = (id: string) => {
    deleteSplit(id);
    setSplits((prev) => prev.filter((s) => s.id !== id));
    toast.success("Split deleted");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen pb-28 bg-background">
        <div className="gradient-hero px-6 pt-14 pb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-2xl text-foreground dark:text-black"
          >
            All Splits
          </motion.h1>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-background">
      <div className="gradient-hero px-6 pt-14 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-black text-2xl text-foreground"
        >
          All Splits
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground mt-1"
        >
          Your bill-splitting history 📋
        </motion.p>
      </div>

      {splits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 text-center py-16"
        >
          <p className="text-5xl mb-4">📭</p>
          <p className="text-muted-foreground font-medium">No splits yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Create your first split to see it here
          </p>
        </motion.div>
      ) : (
        <div className="px-6 -mt-2 flex flex-col gap-3.5">
          <AnimatePresence mode="popLayout">
            {splits.map((split, i) => (
              <SplitCard 
                key={split.id} 
                split={split} 
                index={i} 
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Splits;
