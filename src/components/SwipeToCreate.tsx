import { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  PanInfo,
} from "framer-motion";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Floating swipe component anchored to the right-center of the screen.
 * Drag left to trigger "New Split" creation.
 * Has a playful pill shape with animated arrow hint.
 */
const SwipeToCreate = () => {
  const { toast } = useToast();
  const controls = useAnimation();
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Threshold (in px) the user must drag left to trigger
  const TRIGGER_THRESHOLD = -120;

  // Visual transforms based on drag distance
  const backgroundOpacity = useTransform(x, [0, -60, -140], [0, 0.3, 0.6]);
  const scale = useTransform(x, [0, -80, -140], [1, 1.05, 1.1]);
  const labelOpacity = useTransform(x, [0, -40, -80], [0, 0.5, 1]);
  const iconRotation = useTransform(x, [0, -140], [0, 180]);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    setIsDragging(false);

    if (info.offset.x < TRIGGER_THRESHOLD) {
      // Triggered! Show feedback
      setTriggered(true);
      toast({
        title: "🍕 New Split!",
        description: "Creating a new bill split...",
      });

      // Quick success pulse then snap back
      await controls.start({ x: -160, scale: 1.15, transition: { duration: 0.15 } });
      await controls.start({ x: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } });
      setTriggered(false);
    } else {
      // Snap back
      controls.start({ x: 0, transition: { type: "spring", stiffness: 500, damping: 30 } });
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
      <div ref={constraintsRef} className="fixed right-0 top-0 bottom-0 w-[250px] z-50 pointer-events-none" />

      {/* The draggable pill */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -180, right: 0 }}
        dragElastic={0.15}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, scale }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 touch-none cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center">
          {/* Extended handle strip for better grip area */}
          <div className="w-3 h-14 bg-primary/20 rounded-l-full" />

          {/* Main pill */}
          <motion.div
            className={`
              w-14 h-14 rounded-l-2xl rounded-r-none
              bg-primary text-primary-foreground
              shadow-elevated flex items-center justify-center
              relative overflow-hidden
            `}
          >
            {/* Shimmer hint animation */}
            {!isDragging && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              />
            )}

            <motion.div style={{ rotate: iconRotation }}>
              <Plus className="w-6 h-6" strokeWidth={2.5} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle bounce hint on mount */}
      {!isDragging && !triggered && (
        <motion.div
          className="fixed right-[68px] top-1/2 -translate-y-1/2 z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0], x: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
        </motion.div>
      )}
    </>
  );
};

export default SwipeToCreate;
