import { motion } from "framer-motion";
import { dummySplits } from "@/data/dummySplits";
import SplitCard from "@/components/SplitCard";

const Splits = () => (
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

    <div className="px-6 -mt-2 flex flex-col gap-3.5">
      {dummySplits.map((split, i) => (
        <SplitCard key={split.id} split={split} index={i} />
      ))}
    </div>
  </div>
);

export default Splits;
