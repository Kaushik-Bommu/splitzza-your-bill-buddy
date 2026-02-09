import { motion } from "framer-motion";
import { ArrowLeft, Plus, Users, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

/** Placeholder Create Bill screen — navigated to after swipe gesture */
const CreateBill = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-card border border-border/40 shadow-card flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display font-black text-xl text-foreground tracking-tight">
              New Split
            </h1>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Split the bill fairly
            </p>
          </div>
        </motion.div>
      </div>

      {/* Content area */}
      <div className="px-5 mt-4 flex flex-col gap-4">
        {/* Restaurant name input placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-card rounded-2xl p-4 shadow-card border border-border/40"
        >
          <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-2 block">
            Restaurant / Event
          </label>
          <input
            type="text"
            placeholder="e.g. Friday Pizza Night 🍕"
            className="w-full bg-transparent text-foreground font-display font-bold text-lg placeholder:text-muted-foreground/50 focus:outline-none"
          />
        </motion.div>

        {/* Quick action cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border/40 flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-coral-light flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-display font-bold text-foreground">
              Add People
            </span>
            <span className="text-[10px] text-muted-foreground">
              Who's splitting?
            </span>
          </div>

          <div className="bg-card rounded-2xl p-4 shadow-card border border-border/40 flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-light flex items-center justify-center">
              <Receipt className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-xs font-display font-bold text-foreground">
              Add Items
            </span>
            <span className="text-[10px] text-muted-foreground">
              What'd you order?
            </span>
          </div>
        </motion.div>

        {/* Empty state */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <motion.span
            className="text-5xl mb-4"
            animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🧾
          </motion.span>
          <p className="font-display font-bold text-foreground text-sm">
            Start adding items
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 max-w-[200px]">
            Add food items and assign them to people to split the bill fairly
          </p>
        </motion.div>
      </div>

      {/* Floating create button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 20 }}
        className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl shadow-elevated font-display font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform"
      >
        <Plus className="w-4 h-4" />
        Create Split
      </motion.button>
    </div>
  );
};

export default CreateBill;
