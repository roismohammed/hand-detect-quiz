import { motion } from "framer-motion";

interface OptionCardProps {
  label: string;
  text: string;
  index: number;
  isHovered: boolean;
  state: "default" | "correct" | "wrong";
  onSelect: () => void;
}

const colorClasses = [
  "bg-option-a",
  "bg-option-b",
  "bg-option-c",
  "bg-option-d",
];

const labels = ["A", "B", "C", "D"];

const OptionCard = ({
  text,
  index,
  isHovered,
  state,
  onSelect,
}: OptionCardProps) => {
  const bgClass =
    state === "correct"
      ? "bg-correct"
      : state === "wrong"
      ? "bg-wrong"
      : colorClasses[index];

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      animate={
        state === "correct"
          ? { scale: [1, 1.05, 1] }
          : isHovered
          ? { scale: 1.05, boxShadow: "0 0 30px rgba(0,0,0,0.2)" }
          : { scale: 1 }
      }
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${bgClass} relative rounded-2xl p-6 text-left cursor-pointer option-hover w-full border ${
        state === "default" ? "border-border shadow-sm" : "border-transparent"
      } ${isHovered ? "ring-4 ring-primary/30" : ""}`}
    >
      <div className="flex items-center gap-4">
        <span className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-display font-bold ${
          state === "default" ? "bg-primary/10 text-primary" : "bg-background/20 text-primary-foreground"
        }`}>
          {labels[index]}
        </span>
        <span className={`text-lg font-semibold font-body ${
          state === "default" ? "text-foreground" : "text-primary-foreground"
        }`}>
          {text}
        </span>
      </div>

      {state === "correct" && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/30 flex items-center justify-center text-primary-foreground font-bold"
        >
          ✓
        </motion.div>
      )}
      {state === "wrong" && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/30 flex items-center justify-center text-primary-foreground font-bold"
        >
          ✗
        </motion.div>
      )}
    </motion.button>
  );
};

export default OptionCard;
