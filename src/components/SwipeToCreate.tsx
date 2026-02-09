import { useState, useRef, useMemo } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  PanInfo,
} from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/** Random food items shown on the swipe pill */
const FOOD_ITEMS = [
  { emoji: "🍕", label: "Pizza" },
  { emoji: "🍔", label: "Burger" },
  { emoji: "🍛", label: "Biryani" },
  { emoji: "🌯", label: "Shawarma" },
  { emoji: "🍟", label: "Fries" },
];

/**
 * Floating swipe component anchored to the right-center of the screen.
 * Drag left to navigate to "Create Bill" screen.
 * Shows a random food emoji with a playful breathing animation.
 */
const SwipeToCreate = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Pick a random food item once per mount
  const food = useMemo(
    () => FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)],
    []
  );

  // Threshold (in px) the user must drag left to trigger
  const TRIGGER_THRESHOLD = -120;

  // Visual transforms based on drag distance
  const backgroundOpacity = useTransform(x, [0, -60, -140], [0, 0.3, 0.6]);
  const labelOpacity = useTransform(x, [0, -40, -80], [0, 0.5, 1]);
  const pillScale = useTransform(x, [0, -80, -140], [1, 1.05, 1.12]);
  const emojiRotation = useTransform(x, [0, -140], [0, -20]);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    setIsDragging(false);

    if (info.offset.x < TRIGGER_THRESHOLD) {
      setTriggered(true);

      // Success burst — scale up, then navigate
      await controls.start({
        x: -180,
        scale: 1.2,
        transition: { duration: 0.2, ease: "easeOut" },
      });

      navigate("/create");
    } else {
      // Snap back with spring
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 500, damping: 30 },
      });
    }
  };

  return (
    <>
      {/* Backdrop overlay that fades in as user drags */}
      <motion.div
        className="fixed inset-0 bg-foreground/5 pointer-events-none z-40"
        style={{ opacity: backgroundOpacity }}
      />

      {/* Trail label revealed during drag */}
      <motion.div
        className="fixed right-20 top-1/2 -translate-y-1/2 z-40 pointer-events-none flex items-center gap-2"
        style={{ opacity: labelOpacity }}
      >
        <ArrowLeft className="w-4 h-4 text-primary" />
        <span className="text-sm font-display font-bold text-primary whitespace-nowrap">
          New Split
        </span>
      </motion.div>

      {/* Drag constraints container */}
      <div
        ref={constraintsRef}
        className="fixed right-0 top-0 bottom-0 w-[250px] z-50 pointer-events-none"
      />

      {/* The draggable pill with breathing animation */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -180, right: 0 }}
        dragElastic={0.15}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, scale: pillScale }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 touch-none cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center">
          {/* Extended handle strip */}
          <div className="w-3 h-14 bg-primary/20 rounded-l-full" />

          {/* Main pill with breathing animation */}
          <motion.div
            className="w-14 h-14 rounded-l-2xl rounded-r-none bg-primary shadow-elevated flex items-center justify-center relative overflow-hidden"
            animate={
              !isDragging && !triggered
                ? {
                    boxShadow: [
                      "0 8px 32px -8px hsl(12 76% 61% / 0.15)",
                      "0 12px 40px -4px hsl(12 76% 61% / 0.35)",
                      "0 8px 32px -8px hsl(12 76% 61% / 0.15)",
                    ],
                  }
                : {}
            }
            transition={
              !isDragging && !triggered
                ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                : {}
            }
          >
            {/* Shimmer hint */}
            {!isDragging && !triggered && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Food emoji with gentle rotation */}
            <motion.span
              className="text-2xl select-none relative z-10"
              style={{ rotate: emojiRotation }}
              animate={
                !isDragging && !triggered
                  ? {
                      y: [0, -3, 0],
                      scale: [1, 1.08, 1],
                    }
                  : {}
              }
              transition={
                !isDragging && !triggered
                  ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : {}
              }
            >
              {food.emoji}
            </motion.span>
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle arrow bounce hint on mount */}
      {!isDragging && !triggered && (
        <motion.div
          className="fixed right-[68px] top-1/2 -translate-y-1/2 z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0], x: [0, -8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
        </motion.div>
      )}
    </>
  );
};

export default SwipeToCreate;
