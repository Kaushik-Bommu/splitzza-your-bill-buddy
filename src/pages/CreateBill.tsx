import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, DollarSign, UserPlus, Link2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dummyFriends, type Friend } from "@/data/dummyFriends";

const pageVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, x: 60, transition: { duration: 0.25, ease: "easeIn" as const } },
};

const CreateBill = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [showInviteHint, setShowInviteHint] = useState(false);

  const isValid = parseFloat(amount) > 0 && selectedFriends.length > 0;

  const toggleFriend = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    navigate("/add-items", {
      state: { selectedFriendIds: selectedFriends, totalAmount: parseFloat(amount) },
    });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pb-32 bg-background"
    >
      {/* Top bar */}
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
            className="font-display font-black text-xl text-foreground"
          >
            New Split
          </motion.h1>
        </div>
      </div>

      {/* Bill amount */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-6 mt-2"
      >
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 block">
          Total Bill Amount
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl gradient-primary-btn flex items-center justify-center shadow-sm">
            <DollarSign className="w-4 h-4 text-primary-foreground" />
          </div>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-card border border-border/30 rounded-2xl py-4 pl-[4.5rem] pr-6 text-2xl font-display font-bold text-foreground placeholder:text-muted-foreground/30 shadow-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
        </div>
      </motion.div>

      {/* Friends selection */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 mt-8"
      >
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3.5 block">
          Split with
        </label>

        <div className="flex flex-wrap gap-3">
          {dummyFriends.map((friend) => (
            <FriendChip
              key={friend.id}
              friend={friend}
              selected={selectedFriends.includes(friend.id)}
              onToggle={() => toggleFriend(friend.id)}
            />
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          onClick={() => setShowInviteHint(true)}
          className="mt-5 flex items-center gap-2.5 text-sm font-bold text-primary active:scale-95 transition-transform"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-primary" />
          </div>
          Invite via link
        </motion.button>

        <AnimatePresence>
          {showInviteHint && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-3 gradient-card-warm border border-border/30 rounded-2xl p-4 shadow-card"
            >
              <p className="text-xs text-muted-foreground">
                🔗 Share link copied! Your friend can join this split from the link.{" "}
                <span className="text-primary/60">(UI preview only)</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Selected count */}
      <AnimatePresence>
        {selectedFriends.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="px-6 mt-7"
          >
            <div className="gradient-card-sage border border-accent/15 rounded-2xl p-4 flex items-center gap-2.5">
              <UserPlus className="w-4 h-4 text-accent" />
              <p className="text-xs font-semibold text-accent">
                {selectedFriends.length} friend{selectedFriends.length > 1 ? "s" : ""} selected
                {amount && parseFloat(amount) > 0 && (
                  <span className="text-muted-foreground">
                    {" "}· ~${(parseFloat(amount) / (selectedFriends.length + 1)).toFixed(2)} each
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 gradient-bottom-fade">
        <div className="max-w-md mx-auto">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 25 }}
            onClick={handleContinue}
            disabled={!isValid}
            className="w-full py-4 rounded-2xl font-display font-bold text-base shadow-elevated transition-all duration-200 disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed gradient-primary-btn text-primary-foreground active:scale-[0.98]"
          >
            Continue
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const FriendChip = ({
  friend,
  selected,
  onToggle,
}: {
  friend: Friend;
  selected: boolean;
  onToggle: () => void;
}) => {
  const initial = friend.name.charAt(0).toUpperCase();

  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onToggle}
      className={`
        flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-200
        ${
          selected
            ? "bg-primary/10 border-primary/25 shadow-sm"
            : "gradient-card-warm border-border/30 shadow-card"
        }
      `}
    >
      <div
        className={`
          w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-200
          ${selected ? "gradient-primary-btn text-primary-foreground shadow-sm" : "bg-coral-light text-primary"}
        `}
      >
        {selected ? <Check className="w-4 h-4" /> : initial}
      </div>
      <span
        className={`text-sm font-bold transition-colors duration-200 ${
          selected ? "text-primary" : "text-foreground"
        }`}
      >
        {friend.name}
      </span>
    </motion.button>
  );
};

export default CreateBill;
