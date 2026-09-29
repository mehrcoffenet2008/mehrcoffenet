import { motion } from "framer-motion";

export default function NeonText({ children, className = "", delay = 0 }) {
  return (
    <motion.span
      className={`neon-text ${className}`}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.span>
  );
}
