import { motion } from "framer-motion";
import { Check, ChevronRight, Users, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Split } from "@/data/dummySplits";
import { format, parseISO } from "date-fns";
import { normalizeItems } from "@/lib/utils";

interface SplitCardProps {
  split: Split;
  index: number;
  onDelete?: (id: string) => void;
}

const SplitCard = ({ split, index, onDelete }: SplitCardProps) => {
  const navigate = useNavigate();

  const normalizedItems = normalizeItems(split.items);
  const yourShare = normalizedItems.reduce((total, item) => {
    if (item.sharedBy.includes("me") || item.sharedBy.includes("You")) {
      const itemTotal = item.price * item.quantity
      return total + itemTotal / item.sharedBy.length
    }
    return total
  }, 0);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(split.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: -20 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className="glass-premium gradient-card-warm rounded-3xl p-5 shadow-card border border-border/30 backdrop-blur-md active:scale-[0.98] transition-transform cursor-pointer relative group shadow-elevated"

    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-base text-foreground truncate">
            {split.restaurantName}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {format(parseISO(split.date), "MMM d, yyyy")}
          </p>

          <div className="flex items-center gap-1.5 mt-3">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="flex gap-1.5 flex-wrap">
              {split.people.map((person) => (
                <span
                  key={person}
                  className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-coral-light dark:bg-muted text-primary dark:text-muted-foreground"

                >
                  {person}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 ml-4">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Your share</p>
            <p className="font-display font-extrabold text-xl text-foreground mt-0.5">
              ₹{yourShare.toFixed(2)}
            </p>
          </div>
          {split.settled ? (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-sage-light dark:bg-muted text-accent dark:text-muted-foreground">
              <Check className="w-3 h-3" /> Settled
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-light dark:bg-muted text-secondary-foreground dark:text-muted-foreground">
              Pending
            </span>
          )}

        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-border/30">
        <p className="text-xs text-muted-foreground">
          Total: <span className="font-semibold text-foreground">₹{split.totalAmount.toFixed(2)}</span>
          {" · "}{split.items.length} items
        </p>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-full bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Delete split"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronRight
            onClick={() => navigate("/split-result", { state: { split } })}
            className="w-4 h-4 text-muted-foreground/60 cursor-pointer"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SplitCard;
