import { motion, AnimatePresence } from "framer-motion";
import { Hand } from "lucide-react";

interface HandCursorProps {
  x: number;
  y: number;
  visible: boolean;
  isHovering: boolean;
}

const HandCursor = ({ x, y, visible, isHovering }: HandCursorProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: isHovering ? 1.3 : 1,
            left: `${x * 100}%`,
            top: `${y * 100}%`,
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className={`rounded-full p-3 transition-colors duration-200 ${
              isHovering
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card/90 text-foreground shadow-md"
            }`}
          >
            <Hand className="w-6 h-6" />
          </div>
          {isHovering && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.8, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HandCursor;
