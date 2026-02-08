import { motion } from "framer-motion";
import { Calendar, DollarSign, Users } from "lucide-react";
import type { Split } from "@/data/dummySplits";
import { format, parseISO } from "date-fns";

interface SplitCardProps {
  split: Split;
  index: number;
}

/** Minimal, elegant event card — shows group name, date, and total */
const SplitCard = ({ split, index }: SplitCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileTap={{ scale: 0.97 }}
      className="bg-card rounded-2xl px-5 py-4 shadow-card border border-border/40 cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        {/* Emoji avatar */}
        <div className="w-12 h-12 rounded-xl bg-coral-light flex items-center justify-center text-2xl shrink-0">
          {split.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-[15px] text-foreground truncate leading-tight">
            {split.groupName}
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {format(parseISO(split.date), "MMM d")}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              {split.people.length}
            </span>
          </div>
        </div>

        {/* Total amount */}
        <div className="text-right shrink-0">
          <p className="font-display font-extrabold text-lg text-foreground leading-tight">
            ${split.totalAmount.toFixed(2)}
          </p>
          {!split.settled && (
            <span className="text-[10px] font-semibold text-primary">pending</span>
          )}
          {split.settled && (
            <span className="text-[10px] font-semibold text-accent">settled</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SplitCard;
