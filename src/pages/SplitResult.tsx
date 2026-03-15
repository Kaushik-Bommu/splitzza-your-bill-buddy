import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Share2, CircleDollarSign } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { dummyFriends } from "@/data/dummyFriends";
import { toast } from "sonner";
import { saveSplit, createSplitObject } from "@/lib/splitStorage";
import { normalizeItems } from "@/lib/utils";

interface FoodItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
  sharedBy: string[];
}

interface PersonBreakdown {
  id: string;
  name: string;
  items: { name: string; emoji: string; share: number; quantity: number; price: number }[];
  total: number;
}

const pageVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, x: 60, transition: { duration: 0.25, ease: "easeIn" as const } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.15 + i * 0.08, type: "spring" as const, stiffness: 350, damping: 25 },
  }),
};

const SplitResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;
  const rawItems = state?.items ?? state?.split?.items ?? [];
  const normalizedItems = normalizeItems(rawItems);
  const totalAmount = state?.totalAmount ?? state?.split?.totalAmount ?? 0;
  const splitName = state?.splitName ?? state?.split?.restaurantName ?? "";
  const selectedFriendIds = state?.selectedFriendIds ?? [];

  const isViewingSavedSplit = Boolean(state?.split);
  const splitPeople = state?.split?.people ?? [];
  let allParticipants;
  if (state?.split) {
    allParticipants = splitPeople.map((name) => ({
      id: name,
      name
    }));
  } else {
    const friends = dummyFriends.filter((f) => selectedFriendIds.includes(f.id));
    allParticipants = [{ id: "me", name: "You" }, ...friends];
  }

  const breakdowns = useMemo<PersonBreakdown[]>(() => {
    const map = new Map<string, PersonBreakdown>();
    allParticipants.forEach((p) => map.set(p.id, { id: p.id, name: p.name, items: [], total: 0 }));

      normalizedItems.forEach((item) => {
        // Safety check: skip if no one is sharing this item
        if (!item.sharedBy.length) return;

        // Calculate total cost for this item (price × quantity)
        const itemTotal = item.price * item.quantity;
        
        // Calculate per-person share
        const perPerson = itemTotal / item.sharedBy.length;

        item.sharedBy.forEach((pid) => {
          let normalizedId = pid;
          if (pid === "me") {
            normalizedId = "You";
          } else {
            const friend = dummyFriends.find((f) => f.id === pid);
            if (friend) normalizedId = friend.name;
          }
          const entry = map.get(normalizedId);
          if (entry) {
            entry.items.push({
              name: item.name,
              emoji: item.emoji,
              share: perPerson,
              quantity: item.quantity,
              price: item.price
            });
            entry.total += perPerson;
          }
        });
      });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [normalizedItems, allParticipants]);

  // Calculate grand total directly from items (price × quantity)
  const grandTotal = normalizedItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  const handleSettle = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    
    // Create and save the split to localStorage
    const participants = allParticipants.map((p) => p.name);
    const finalSplitName = splitName || state?.split?.restaurantName || "Split";
    const split = createSplitObject(finalSplitName, grandTotal, normalizedItems, participants);
    saveSplit(split);
    
    toast.success("Split saved successfully", { description: "Your split has been saved." });
    navigate("/splits");
  };

  const handleShare = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    const summary = breakdowns
      .map((b) => `${b.name}: ₹${b.total.toFixed(2)}`)
      .join("\n");
    const text = `🍕 Splitzza Summary\n\n${summary}\n\nTotal: ₹${grandTotal.toFixed(2)}`;

    if (navigator.share) {
      navigator.share({ title: "Splitzza Split", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Summary copied to clipboard!");
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col bg-background"
    >
      {/* {Scrollable Content} */}
      <div className="flex-1 overflow-y-auto pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
        {/* Header */}
        <div className="gradient-hero px-6 pt-14 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-2xl glass-strong border border-border/30 shadow-card flex items-center justify-center"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </button>
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-display font-black text-xl text-foreground dark:text-black"
            >
              Split Summary
            </motion.h1>

          </div>
        </div>

        {/* Total banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
          className="mx-6 -mt-1 mb-6 gradient-card-sage border border-accent/15 rounded-3xl p-5 flex items-center gap-4 shadow-card"
        >
          <div className="w-13 h-13 rounded-2xl gradient-accent-btn flex items-center justify-center shrink-0 shadow-sm" style={{ width: '3.25rem', height: '3.25rem' }}>
            <CircleDollarSign className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Bill</p>
            <p className="font-display font-black text-2xl text-foreground">₹{grandTotal.toFixed(2)}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 bg-accent/15 px-3 py-1.5 rounded-full">
            <Check className="w-3.5 h-3.5 text-accent" />
            <span className="text-[11px] font-bold text-accent">Matched</span>
          </div>
        </motion.div>

        {/* Per-person breakdown */}
        <div className="px-6">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Per Person ({breakdowns.length})
          </h2>

          {breakdowns.map((person, i) => (
            <motion.div
              key={person.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="gradient-card-warm border border-border/30 rounded-3xl p-5 mb-3.5 shadow-card"
            >
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-accent/12 flex items-center justify-center">
                    <span className="text-sm font-black text-accent">
                      {person.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm text-foreground">{person.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{person.items.length} item{person.items.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <p className="font-display font-black text-xl text-accent">₹{person.total.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                {person.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-muted/30">
                    <span className="text-xs text-foreground flex items-center gap-2">
                      <span>{item.emoji}</span>
                      <span className="font-medium">{item.name}</span>
                      {item.quantity > 1 && (
                        <span className="text-muted-foreground">({item.quantity} × ₹{item.price.toFixed(0)})</span>
                      )}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">₹{item.share.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom buttons */}
        <div className="p-6 gradient-bottom-fade">
          <div className="max-w-md mx-auto flex gap-3">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 25 }}
              onClick={handleShare}
              className="flex-1 py-4 rounded-2xl font-display font-bold text-sm border border-border/30 glass-strong text-foreground shadow-card flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Share2 className="w-4 h-4" /> Share
            </motion.button>
            {!isViewingSavedSplit && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 25 }}
                onClick={handleSettle}
                className="flex-[2] py-4 rounded-2xl font-display font-bold text-sm gradient-accent-btn text-accent-foreground shadow-elevated flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <Check className="w-4 h-4" /> Settle Up
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};


export default SplitResult;
