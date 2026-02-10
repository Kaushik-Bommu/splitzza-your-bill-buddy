import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Share2, CircleDollarSign } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { dummyFriends } from "@/data/dummyFriends";
import { toast } from "sonner";

interface FoodItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  sharedBy: string[];
}

interface PersonBreakdown {
  id: string;
  name: string;
  items: { name: string; emoji: string; share: number }[];
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
  const { items = [], selectedFriendIds = [], totalAmount = 0 } = (location.state as any) ?? {};

  const friends = dummyFriends.filter((f) => selectedFriendIds.includes(f.id));
  const allParticipants = [{ id: "me", name: "You" }, ...friends];

  const breakdowns = useMemo<PersonBreakdown[]>(() => {
    const map = new Map<string, PersonBreakdown>();
    allParticipants.forEach((p) => map.set(p.id, { id: p.id, name: p.name, items: [], total: 0 }));

    (items as FoodItem[]).forEach((item) => {
      const perPerson = item.price / item.sharedBy.length;
      item.sharedBy.forEach((pid) => {
        const entry = map.get(pid);
        if (entry) {
          entry.items.push({ name: item.name, emoji: item.emoji, share: perPerson });
          entry.total += perPerson;
        }
      });
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [items, allParticipants]);

  const grandTotal = breakdowns.reduce((s, b) => s + b.total, 0);

  const handleSettle = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    toast.success("Bill settled! 🎉", { description: "Everyone has been notified." });
  };

  const handleShare = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    const summary = breakdowns
      .map((b) => `${b.name}: $${b.total.toFixed(2)}`)
      .join("\n");
    const text = `🍕 Splitzza Summary\n\n${summary}\n\nTotal: $${grandTotal.toFixed(2)}`;

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
      className="min-h-screen pb-36 bg-background"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 shadow-card flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-display font-black text-xl text-foreground"
        >
          Split Summary
        </motion.h1>
      </div>

      {/* Total banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
        className="mx-5 mb-6 bg-accent/10 border border-accent/20 rounded-2xl p-5 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shrink-0">
          <CircleDollarSign className="w-6 h-6 text-accent-foreground" />
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Bill</p>
          <p className="font-display font-black text-2xl text-foreground">${grandTotal.toFixed(2)}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-accent/15 px-3 py-1.5 rounded-full">
          <Check className="w-3.5 h-3.5 text-accent" />
          <span className="text-[11px] font-bold text-accent">Matched</span>
        </div>
      </motion.div>

      {/* Per-person breakdown */}
      <div className="px-5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Per Person ({breakdowns.length})
        </h2>

        {breakdowns.map((person, i) => (
          <motion.div
            key={person.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-card border border-border/50 rounded-2xl p-4 mb-3 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center">
                  <span className="text-sm font-black text-accent">
                    {person.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-foreground">{person.name}</p>
                  <p className="text-[11px] text-muted-foreground">{person.items.length} item{person.items.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <p className="font-display font-black text-lg text-accent">${person.total.toFixed(2)}</p>
            </div>

            <div className="space-y-1.5">
              {person.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between py-1 px-2 rounded-xl bg-muted/40">
                  <span className="text-xs text-foreground flex items-center gap-1.5">
                    <span>{item.emoji}</span>
                    <span className="font-medium">{item.name}</span>
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">${item.share.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-md mx-auto flex gap-3">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 25 }}
            onClick={handleShare}
            className="flex-1 py-4 rounded-2xl font-display font-bold text-sm border border-border/50 bg-card text-foreground shadow-card flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Share2 className="w-4 h-4" /> Share
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 25 }}
            onClick={handleSettle}
            className="flex-[2] py-4 rounded-2xl font-display font-bold text-sm bg-accent text-accent-foreground shadow-elevated flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Check className="w-4 h-4" /> Settle Up
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SplitResult;
