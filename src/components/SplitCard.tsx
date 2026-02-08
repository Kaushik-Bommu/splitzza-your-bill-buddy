import { motion } from "framer-motion";
import { Check, ChevronRight, Users } from "lucide-react";
import type { Split } from "@/data/dummySplits";
import { format, parseISO } from "date-fns";

interface SplitCardProps {
  split: Split;
  index: number;
}

/** Animated card showing a bill split summary */
const SplitCard = ({ split, index }: SplitCardProps) => {
  const yourShare = split.items.reduce((total, item) => {
    if (item.sharedBy.includes("You")) {
      return total + item.amount / item.sharedBy.length;
    }
    return total;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className="bg-card rounded-2xl p-4 shadow-card border border-border/50 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Restaurant name & date */}
          <h3 className="font-display font-bold text-base text-foreground truncate">
            {split.restaurantName}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(parseISO(split.date), "MMM d, yyyy")}
          </p>

          {/* People badges */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="flex gap-1 flex-wrap">
              {split.people.map((person) => (
                <span
                  key={person}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-coral-light text-primary"
                >
                  {person}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right side — amount & status */}
        <div className="flex flex-col items-end gap-1.5 ml-3">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Your share</p>
            <p className="font-display font-extrabold text-lg text-foreground">
              ${yourShare.toFixed(2)}
            </p>
          </div>
          {split.settled ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sage-light text-accent">
              <Check className="w-3 h-3" /> Settled
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-light text-secondary-foreground">
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Total + chevron */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          Total: <span className="font-semibold text-foreground">${split.totalAmount.toFixed(2)}</span>
          {" · "}{split.items.length} items
        </p>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </motion.div>
  );
};

export default SplitCard;
