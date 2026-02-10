import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, X, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { dummyFriends, type Friend } from "@/data/dummyFriends";

/** Keyword → emoji map for food preview */
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

interface FoodItem {
  id: string;
  name: string;
  price: number;
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

  // Pull selected friends & amount from navigation state
  const { selectedFriendIds = [], totalAmount = 0 } = (location.state as any) ?? {};
  const friends = dummyFriends.filter((f) => selectedFriendIds.includes(f.id));
  // Include "You" as a participant
  const allParticipants: Friend[] = [{ id: "me", name: "You" }, ...friends];

  const [items, setItems] = useState<FoodItem[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const liveEmoji = useMemo(() => getFoodEmoji(itemName), [itemName]);
  const canAdd = itemName.trim().length > 0 && parseFloat(itemPrice) > 0 && selectedPeople.length > 0;

  const totalAssigned = items.reduce((s, i) => s + i.price, 0);

  const addItem = () => {
    if (!canAdd) return;
    const newItem: FoodItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      price: parseFloat(itemPrice),
      emoji: liveEmoji,
      sharedBy: selectedPeople,
    };
    setItems((prev) => [newItem, ...prev]);
    setItemName("");
    setItemPrice("");
    setSelectedPeople([]);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const togglePerson = (id: string) =>
    setSelectedPeople((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

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
          Add Items
        </motion.h1>
      </div>

      {/* Input section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-5 space-y-4"
      >
        {/* Food name + emoji preview */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Food Item
          </label>
          <div className="relative flex items-center gap-3">
            <motion.div
              key={liveEmoji}
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-12 h-12 rounded-2xl bg-amber-light flex items-center justify-center text-2xl shadow-card shrink-0"
            >
              {liveEmoji}
            </motion.div>
            <input
              type="text"
              placeholder="e.g. Margherita Pizza"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="flex-1 bg-card border border-border/50 rounded-2xl py-3 px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/40 shadow-card focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-primary">$</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-full bg-card border border-border/50 rounded-2xl py-3 pl-9 pr-4 text-sm font-bold text-foreground placeholder:text-muted-foreground/40 shadow-card focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>
        </div>

        {/* Who ate this? */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Who ate this?
          </label>
          <div className="flex flex-wrap gap-2">
            {allParticipants.map((p) => {
              const active = selectedPeople.includes(p.id);
              return (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => togglePerson(p.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-foreground border-border/50 shadow-card"
                  }`}
                >
                  {p.name}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Add button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={addItem}
          disabled={!canAdd}
          className="w-full py-3 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-accent text-accent-foreground shadow-card active:shadow-none"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </motion.button>
      </motion.div>

      {/* Items list */}
      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Items ({items.length})
          </h2>
          {items.length > 0 && (
            <span className="text-xs font-bold text-primary">
              ${totalAssigned.toFixed(2)} added
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
              className="text-center py-10"
            >
              <p className="text-4xl mb-2">🍽️</p>
              <p className="text-sm text-muted-foreground">Add items to split the bill</p>
            </motion.div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: -60 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="bg-card border border-border/50 rounded-2xl p-4 shadow-card mb-3 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-light flex items-center justify-center text-xl shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-display font-bold text-sm text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="font-display font-black text-sm text-primary ml-2 shrink-0">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <Users className="w-3 h-3 text-muted-foreground shrink-0" />
                    {item.sharedBy.map((pid) => {
                      const person = allParticipants.find((p) => p.id === pid);
                      return (
                        <span
                          key={pid}
                          className="text-[10px] font-semibold bg-sage-light text-accent px-1.5 py-0.5 rounded-full"
                        >
                          {person?.name ?? pid}
                        </span>
                      );
                    })}
                    <span className="text-[10px] text-muted-foreground ml-1">
                      · ${(item.price / item.sharedBy.length).toFixed(2)} each
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="w-3 h-3 text-destructive" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-md mx-auto">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 25 }}
            disabled={items.length === 0}
            className="w-full py-4 rounded-2xl font-display font-bold text-base shadow-elevated transition-all duration-200 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed bg-primary text-primary-foreground active:scale-[0.98]"
          >
            Finish Split
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddFoodItems;
