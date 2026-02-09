import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";

/** Pool of food emojis — one is picked randomly on mount */
const FOOD_EMOJIS = ["🍕", "🍔", "🍟", "🌯", "🍛"];

/** Swipe threshold (px) to trigger navigation */
const SWIPE_THRESHOLD = -100;

/**
 * Floating food emoji that the user can swipe left to create a new split.
 * Includes a pulsing hint animation + directional arrow trail.
 */
const SwipeToCreate = () => {
  const navigate = useNavigate();
  const [emoji] = useState(() => FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]);
  const [showHint, setShowHint] = useState(true);
  const [triggered, setTriggered] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);

  // Background bar opacity increases as user drags left
  const trailOpacity = useTransform(x, [0, -60, -120], [0, 0.5, 1]);
  const trailWidth = useTransform(x, [0, -60, -120], ["0%", "40%", "80%"]);

  // Hint text fades out once user starts dragging
  const hintOpacity = useTransform(x, [0, -30], [1, 0]);

  // Hide the initial hint after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleDragEnd = () => {
    if (x.get() <= SWIPE_THRESHOLD && !triggered) {
      setTriggered(true);
      // Navigate after a brief animation
      setTimeout(() => navigate("/splits"), 300);
    } else {
      // Snap back
      animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 flex items-center">
      {/* Swipe trail / track hint */}
      <motion.div
        className="absolute right-0 h-12 rounded-full bg-primary/10 backdrop-blur-sm flex items-center pl-4 pr-14 pointer-events-none"
        style={{ opacity: trailOpacity, width: trailWidth }}
      >
        <span className="text-[10px] font-semibold text-primary whitespace-nowrap">
          New Split
        </span>
      </motion.div>

      {/* Constraint area for drag bounds */}
      <div ref={constraintsRef} className="absolute -left-48 right-0 h-14" />

      {/* The draggable food emoji */}
      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.15}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className="relative cursor-grab active:cursor-grabbing touch-none select-none z-10"
        whileTap={{ scale: 1.1 }}
      >
        {/* Breathing / pulsing glow behind emoji */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* The emoji itself */}
        <motion.span
          className="relative text-4xl block"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {emoji}
        </motion.span>
      </motion.div>

      {/* Hint label — shows on first load, then fades */}
      {showHint && (
        <motion.div
          className="absolute -left-36 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5"
          style={{ opacity: hintOpacity }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {/* Animated arrow hints */}
          <motion.span
            className="text-primary/60 text-sm"
            animate={{ x: [0, -6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            ‹‹
          </motion.span>
          <span className="text-xs font-semibold text-primary/70 whitespace-nowrap">
            Swipe to split
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default SwipeToCreate;
