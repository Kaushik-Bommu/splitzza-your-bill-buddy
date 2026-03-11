import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface LeaveConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LeaveConfirmationModal = ({ isOpen, onConfirm, onCancel }: LeaveConfirmationModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-sm gradient-card-warm border border-border/30 rounded-2xl p-6 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <AlertTriangle className="w-7 h-7 text-amber-600" />
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h2 className="font-display font-black text-xl text-foreground mb-2">
                Leave this page?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you leave now, the changes you made will be lost.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="flex-1 py-3.5 rounded-xl font-display font-bold text-sm border border-border/30 text-foreground shadow-card"
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="flex-1 py-3.5 rounded-xl font-display font-bold text-sm bg-red-500 text-white shadow-elevated hover:bg-red-600 transition-colors"
              >
                Leave
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeaveConfirmationModal;

