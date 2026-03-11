import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Minus, X, Users, Check, Pencil, UserCheck, Wallet, Copy, Trash2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { dummyFriends, type Friend } from "@/data/dummyFriends";
import { toast } from "sonner";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import LeaveConfirmationModal from "@/components/LeaveConfirmationModal";

const FOOD_EMOJI_MAP: Record<string, string> = {
  pizza: "🍕", burger: "🍔", fries: "🍟", biryani: "🍛", rice: "🍚",
  noodles: "🍜", sushi: "🍣", taco: "🌮", burrito: "🌯", salad: "🥗",
  soup: "🍲", sandwich: "🥪", hotdog: "🌭", chicken: "🍗", steak: "🥩",
  pasta: "🍝", bread: "🍞", cake: "🎂", ice: "🍦", donut: "🍩",
  cookie: "🍪", chocolate: "🍫", candy: "🍬", coffee: "☕", tea: "🍵",
  juice: "🧃", beer: "🍺", wine: "🍷", water: "💧", milk: "🥛",
  egg: "🥚", cheese: "🧀", corn: "🌽", carrot: "🥕", potato: "🥔",
  shrimp: "🍤", crab: "🦀", lobster: "🦞", fish: "🐟", pie: "🥧",
  waffle: "🧇", pancake: "🥞", ramen: "🍜", curry: "🍛", kebab: "🥙",
  dumpling: "🥟", momos: "🥟", wrap: "🌯", wings: "🍗", nachos: "🧀",
};

const getFoodEmoji = (name: string): string => {
  const lower = name.toLowerCase();
  for (const [keyword, emoji] of Object.entries(FOOD_EMOJI_MAP)) {
    if (lower.includes(keyword)) return emoji;
  }
  return "🍽️";
};

const haptic = (ms = 15) => { if (navigator.vibrate) navigator.vibrate(ms); };

interface FoodItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
  sharedBy: string[];
}

const pageVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, x: 60, transition: { duration: 0.25, ease: "easeIn" as const } },
};

const AddFoodItems = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedFriendIds = [], totalAmount = 0, splitName = "" } = (location.state as any) ?? {};
  const friends = dummyFriends.filter((f) => selectedFriendIds.includes(f.id));
  const allParticipants: Friend[] = [{ id: "me", name: "You" }, ...friends];

  const [items, setItems] = useState<FoodItem[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addFlash, setAddFlash] = useState(false);

  const liveEmoji = useMemo(() => getFoodEmoji(itemName), [itemName]);
  const canAdd = itemName.trim().length > 0 && parseFloat(itemPrice) > 0 && selectedPeople.length > 0;
  const totalAssigned = items.reduce((s, i) => s + (i.price * i.quantity), 0);
  const remainingBalance = totalAmount - totalAssigned;
  const allSelected = selectedPeople.length === allParticipants.length;
  const isTotalMatched = totalAssigned === totalAmount;

  const togglePerson = useCallback((id: string) => {
    haptic();
    setSelectedPeople((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const toggleAll = useCallback(() => {
    haptic(25);
    setSelectedPeople((prev) =>
      prev.length === allParticipants.length ? [] : allParticipants.map((p) => p.id)
    );
  }, [allParticipants]);

  const addItem = () => {
    if (!canAdd) return;
    
    const newItemPrice = parseFloat(itemPrice);
    const totalItemPrice = newItemPrice * quantity;
    
    // Check if adding this item would exceed the total bill amount
    if (totalAssigned + totalItemPrice > totalAmount) {
      haptic(30);
      toast.error("Total items exceed bill amount!", {
        description: `Remaining balance: ₹${remainingBalance.toFixed(2)}`,
      });
      return;
    }
    
    haptic(20);
    setAddFlash(true);
    setTimeout(() => setAddFlash(false), 400);

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, name: itemName.trim(), price: newItemPrice, quantity, emoji: liveEmoji, sharedBy: selectedPeople }
            : item
        )
      );
      setEditingId(null);
    } else {
      const newItem: FoodItem = {
        id: Date.now().toString(),
        name: itemName.trim(),
        price: newItemPrice,
        quantity,
        emoji: liveEmoji,
        sharedBy: selectedPeople,
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setItemName("");
    setItemPrice("");
    setSelectedPeople([]);
    setQuantity(1);
  };

  const removeItem = (id: string) => {
    haptic(10);
    if (editingId === id) cancelEdit();
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item removed");
  };

  const duplicateItem = (item: FoodItem) => {
    haptic(15);
    const copy: FoodItem = {
      ...item,
      id: Date.now().toString(),
    };
    setItems((prev) => [copy, ...prev]);
    toast.success("Item duplicated");
  };

  const startEdit = (item: FoodItem) => {
    haptic();
    setEditingId(item.id);
    setItemName(item.name);
    setItemPrice(item.price.toString());
    setQuantity(item.quantity || 1);
    setSelectedPeople(item.sharedBy);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setItemName("");
    setItemPrice("");
    setSelectedPeople([]);
    setQuantity(1);
  };

  // Balance card styling based on state
  const getBalanceStyles = () => {
    if (isTotalMatched) {
      return {
        bg: "bg-sage-light/50",
        border: "border-accent/20",
        iconBg: "bg-accent/15",
        iconColor: "text-accent",
        textColor: "text-accent",
        amountColor: "text-foreground",
        label: "Allocated",
      };
    } else if (remainingBalance < 0) {
      return {
        bg: "bg-red-50/60",
        border: "border-red-200/30",
        iconBg: "bg-red-100/60",
        iconColor: "text-red-500",
        textColor: "text-red-600",
        amountColor: "text-red-600",
        label: "Over budget",
      };
    } else {
      return {
        bg: "bg-amber-50/40",
        border: "border-amber-200/25",
        iconBg: "bg-amber-100/50",
        iconColor: "text-amber-600",
        textColor: "text-amber-700",
        amountColor: "text-foreground",
        label: "Remaining",
      };
    }
  };

  const balanceStyles = getBalanceStyles();

  // Calculate dirty state: items added OR itemName entered OR itemPrice entered OR quantity changed
  const isDirty = items.length > 0 || itemName.trim() !== "" || itemPrice.trim() !== "" || quantity !== 1;

  // Use the unsaved changes warning hook
  const { isModalOpen, confirmNavigation, cancelNavigation, navigateAway } = useUnsavedChangesWarning(isDirty);

  const handleGoBack = () => {
    if (isDirty) {
      navigateAway(-1);
    } else {
      navigate(-1);
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
      <div className="flex-1 overflow-y-auto pb-[4.5rem]">
        {/* Header */}
        <div className="gradient-hero px-6 pt-14 pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
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
              Add Items
            </motion.h1>
          </div>
        </div>

        {/* Remaining balance card - Premium financial status widget */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className={`mx-6 mt-4 mb-5 rounded-2xl px-4 py-3.5 flex items-center justify-between glass-strong border ${balanceStyles.border} ${balanceStyles.bg}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${balanceStyles.iconBg} flex items-center justify-center`}>
              {isTotalMatched ? (
                <Check className={`w-4 h-4 ${balanceStyles.iconColor}`} />
              ) : (
                <Wallet className={`w-4 h-4 ${balanceStyles.iconColor}`} />
              )}
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${balanceStyles.textColor}`}>
                {balanceStyles.label}
              </p>
              <p className={`text-xs font-medium text-muted-foreground`}>
                of ₹{totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-display font-black text-lg ${balanceStyles.amountColor}`}>
              ₹{Math.abs(remainingBalance).toFixed(2)}
            </p>
            {!isTotalMatched && remainingBalance < 0 && (
              <p className="text-[9px] font-medium text-red-500">over budget</p>
            )}
          </div>
        </motion.div>

        {/* Editing banner */}
        <AnimatePresence>
          {editingId && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mx-6 mb-3 bg-secondary/15 border border-secondary/20 rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-bold text-secondary">✏️ Editing item</span>
                <button onClick={cancelEdit} className="text-xs font-semibold text-muted-foreground">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`px-6 space-y-5 transition-all duration-300 ${addFlash ? "scale-[0.995]" : ""}`}
        >
          {/* Food name + emoji */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 block">
              Food Item
            </label>
            <div className="relative flex items-center gap-3">
              <motion.div
                key={liveEmoji}
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="w-14 h-14 rounded-2xl bg-amber-light flex items-center justify-center text-2xl shadow-card shrink-0 border border-border/20"
              >
                {liveEmoji}
              </motion.div>
              <input
                type="text"
                placeholder="e.g. Margherita Pizza"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="flex-1 bg-card border border-border/30 rounded-2xl py-3.5 px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/30 shadow-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 block">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-primary">₹</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className="w-full bg-card border border-border/30 rounded-2xl py-3.5 pl-9 pr-4 text-sm font-bold text-foreground placeholder:text-muted-foreground/30 shadow-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 block">
              Quantity
            </label>
            <div className="flex items-center justify-center gap-4 rounded-2xl px-4 py-3 gradient-card-warm border border-border/30 shadow-card">
              <motion.button
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => { if (quantity > 1) { haptic(); setQuantity(quantity - 1); } }}
                disabled={quantity === 1}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                  quantity === 1
                    ? "bg-muted/50 text-muted-foreground/30 cursor-not-allowed"
                    : "bg-primary/10 text-primary shadow-sm active:shadow-none"
                }`}
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <span className="font-display font-black text-lg text-foreground w-8 text-center">
                {quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => { haptic(); setQuantity(quantity + 1); }}
                className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-sm active:shadow-none transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            {itemPrice && parseFloat(itemPrice) > 0 && (
              <p className="text-center text-xs font-medium text-muted-foreground mt-2">
                Total: ₹{(parseFloat(itemPrice) * quantity).toFixed(2)}
              </p>
            )}
          </div>

          {/* Who ate this? */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Who ate this?
              </label>
              <button
                onClick={toggleAll}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all duration-200 ${
                  allSelected
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {allParticipants.map((p) => {
                const active = selectedPeople.includes(p.id);
                const initial = p.name.charAt(0).toUpperCase();
                return (
                  <motion.button
                    key={p.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => togglePerson(p.id)}
                    layout
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all duration-200 ${
                      active
                        ? "gradient-primary-btn text-primary-foreground border-primary/20 shadow-sm"
                        : "gradient-card-warm text-foreground border-border/30 shadow-card"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-200 ${
                        active ? "bg-primary-foreground/20" : "bg-muted"
                      }`}
                    >
                      {active ? <Check className="w-3 h-3" /> : initial}
                    </span>
                    {p.name}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {selectedPeople.length === 0 && (itemName.trim() || itemPrice) && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[11px] text-destructive/80 font-medium mt-2.5 flex items-center gap-1"
                >
                  <UserCheck className="w-3 h-3" /> Select at least one person
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Add / Update button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={addItem}
            disabled={!canAdd}
            className={`w-full py-3.5 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed shadow-card active:shadow-none ${
              editingId
                ? "bg-secondary text-secondary-foreground"
                : "gradient-accent-btn text-accent-foreground"
            }`}
          >
            {editingId ? (
              <>
                <Check className="w-4 h-4" /> Update Item
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add Item
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Items list */}
        <div className="px-6 mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Items ({items.length})
            </h2>
            {items.length > 0 && (
              <span className="text-xs font-bold text-primary">
                ₹{totalAssigned.toFixed(2)} added
              </span>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <motion.p
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="text-5xl mb-3"
                >
                  🍽️
                </motion.p>
                <p className="text-sm text-muted-foreground font-medium">Add items to split the bill</p>
              </motion.div>
            ) : (
              items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    boxShadow: editingId === item.id
                      ? "0 0 0 2px hsl(var(--secondary))"
                      : "var(--shadow-card)",
                  }}
                  exit={{ opacity: 0, scale: 0.85, x: -60 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className={`gradient-card-warm border rounded-3xl p-5 mb-3.5 flex items-start gap-3.5 ${
                    editingId === item.id ? "border-secondary/30" : "border-border/30"
                  }`}
                >
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="w-11 h-11 rounded-2xl bg-amber-light flex items-center justify-center text-xl shrink-0 border border-border/20"
                  >
                    {item.emoji}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold text-sm text-foreground truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 ml-2 shrink-0">
                        <span className="text-xs font-medium text-muted-foreground">
                          {item.quantity} × ₹{item.price.toFixed(2)}
                        </span>
                        <p className="font-display font-black text-sm text-primary">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <Users className="w-3 h-3 text-muted-foreground shrink-0" />
                      {item.sharedBy.map((pid) => {
                        const person = allParticipants.find((p) => p.id === pid);
                        return (
                          <span
                            key={pid}
                            className="text-[10px] font-semibold bg-sage-light text-accent px-2 py-0.5 rounded-full"
                          >
                            {person?.name ?? pid}
                          </span>
                        );
                      })}
                      <span className="text-[10px] text-muted-foreground ml-1">
                        · ₹{((item.price * item.quantity) / item.sharedBy.length).toFixed(2)} each
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 mt-0.5">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => startEdit(item)}
                      className="w-7 h-7 rounded-xl bg-secondary/10 flex items-center justify-center"
                      aria-label={`Edit ${item.name}`}
                    >
                      <Pencil className="w-3 h-3 text-secondary" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => duplicateItem(item)}
                      className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center"
                      aria-label={`Duplicate ${item.name}`}
                    >
                      <Copy className="w-3 h-3 text-primary" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 rounded-xl bg-destructive/10 flex items-center justify-center"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Bottom bar */}
        <div className="p-6 gradient-bottom-fade">
          <div className="max-w-md mx-auto">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 25 }}
              disabled={items.length === 0 || !isTotalMatched}
              onClick={() => navigate("/split-result", { state: { items, selectedFriendIds, totalAmount, splitName } })}
              className="w-full py-4 rounded-2xl font-display font-bold text-base shadow-elevated transition-all duration-200 disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed gradient-primary-btn text-primary-foreground active:scale-[0.98]"
            >
              Finish Split
            </motion.button>
          </div>
        </div>
      </div>

      {/* Unsaved changes confirmation modal */}
      <LeaveConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </motion.div>
  );
};

export default AddFoodItems;
