import { motion } from "framer-motion";
import { dummySplits } from "@/data/dummySplits";
import SplitCard from "@/components/SplitCard";

const Splits = () => (
  <div className="min-h-screen pb-24 bg-background px-5 pt-12">
    <motion.h1
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-display font-black text-2xl text-foreground mb-6"
    >
      All Splits
    </motion.h1>
    <div className="flex flex-col gap-3">
      {dummySplits.map((split, i) => (
        <SplitCard key={split.id} split={split} index={i} />
      ))}
    </div>
  </div>
);

export default Splits;
